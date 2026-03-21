package handlers

import (
    "database/sql"
    "fmt"
    "math"
    "net/http"
    "os"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

type RatingRequest struct {
    Rating uint8 `json:"rating" binding:"required,min=0,max=5"`
}

type RatingResponse struct {
    UserID        uint64   `json:"user_id"`
    FilmID        uint64   `json:"film_id"`
    AverageRating float64 `json:"average_rating"`
    RatingCount   uint64   `json:"rating_count"`
}

func Rate(database *sql.DB) func(*gin.Context) {
    return func(context *gin.Context) {
        var req RatingRequest
        if err := context.ShouldBindJSON(&req); err != nil {
            context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

		userID, userExists := context.Get("user_id")
		if !userExists {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
			return
		}

		filmIDParam := context.Param("id")
        var filmID int64
        if _, err := fmt.Sscan(filmIDParam, &filmID); err != nil {
            context.JSON(http.StatusBadRequest, gin.H{"error": "invalid film_id in URL"})
			fmt.Println(err)
            return
        }

        transaction, err := database.Begin()
        if err != nil {
            context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start transaction"})
			fmt.Println(err)
            return
        }
		
        defer func() {
            if p := recover(); p != nil {
                transaction.Rollback()
                panic(p)
            }
        }()

       	_, err = transaction.Exec(
			`INSERT INTO ratings (user_id, film_id, rating)
			VALUES (?, ?, ?)
			ON DUPLICATE KEY UPDATE rating = VALUES(rating), created_at = CURRENT_TIMESTAMP`,
			userID, filmID, req.Rating,
		)
		if err != nil {
			transaction.Rollback()
			context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to insert or update rating"})
			fmt.Println(err)
            fmt.Println(userID, filmID, req.Rating)
			return
		}

        var ratingCount int64
        var averageRating float64
        err = transaction.QueryRow("SELECT COUNT(*), AVG(rating) FROM ratings WHERE film_id = ?", filmID).Scan(&ratingCount, &averageRating)
        if err != nil {
            transaction.Rollback()
            context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to calculate average rating"})
			fmt.Println(err)
			return
        }

        averageRating = math.Round(averageRating*10) / 10

        _, err = transaction.Exec("UPDATE films SET rating_count = ?, average_rating = ? WHERE id = ?", ratingCount, averageRating, filmID)
        if err != nil {
            transaction.Rollback()
            context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update film stats"})
			fmt.Println(err)
            return
        }

        if err := transaction.Commit(); err != nil {
            transaction.Rollback()
            context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to commit transaction"})
			fmt.Println(err)
            return
        }

        context.JSON(http.StatusOK, RatingResponse{
            UserID:        userID.(uint64),
            FilmID:        uint64(filmID),
            AverageRating: averageRating,
            RatingCount:   uint64(ratingCount),
        })
    }
}

type GetFilmRatingResponse struct {
    FilmID        uint64  `json:"film_id"`
    AverageRating float64 `json:"average_rating"`
    RatingCount   uint64  `json:"rating_count"`
}

type FilmRatingResponse struct {
    FilmID        uint64   `json:"film_id"`
    AverageRating *float64 `json:"average_rating"`
    RatingCount   *uint64  `json:"rating_count"`
    UserRating    *uint8   `json:"user_rating"`
}

func GetRating(database *sql.DB) func(*gin.Context) {
    return func(context *gin.Context) {
        filmIDParam := context.Param("id")
        var filmID int64
        if _, err := fmt.Sscan(filmIDParam, &filmID); err != nil {
            context.JSON(http.StatusBadRequest, gin.H{"error": "invalid film_id in URL"})
			fmt.Println(err)
            return
        }

        var averageRating *float64
        var ratingCount *uint64

        var avg sql.NullFloat64
        var count sql.NullInt64

        err := database.QueryRow(
            "SELECT average_rating, rating_count FROM films WHERE id = ?",
            filmID,
        ).Scan(&avg, &count)

        if err == sql.ErrNoRows {
            context.JSON(http.StatusNotFound, gin.H{"error": "film not found"})
			fmt.Println(err)
            return
        } else if err != nil {
            context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query film rating"})
            fmt.Println(err)
            return
        }

        if avg.Valid {
            averageRating = &avg.Float64
        }
        if count.Valid {
            temp := uint64(count.Int64)
            ratingCount = &temp
        }

        var userRating *uint8
        tokenString, err := context.Cookie("token")
        if err == nil && tokenString != "" {
            // decode token
            token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
                return []byte(os.Getenv("JWT_SECRET")), nil
            })
            if err == nil && token.Valid {
                if claims, ok := token.Claims.(jwt.MapClaims); ok {
                    if uid, ok := claims["user_id"].(float64); ok {
                        userID := uint64(uid)
                        var rating sql.NullInt64
                        err := database.QueryRow(
                            "SELECT rating FROM ratings WHERE film_id = ? AND user_id = ?",
                            filmID, userID,
                        ).Scan(&rating)
                        if err != nil && err != sql.ErrNoRows {
                            fmt.Println("error querying user rating:", err)
                        }
                        if rating.Valid {
                            temp := uint8(rating.Int64)
                            userRating = &temp
                        }
                    }
                }
            }
        }

        context.JSON(http.StatusOK, FilmRatingResponse{
            FilmID:        uint64(filmID),
            AverageRating: averageRating,
            RatingCount:   ratingCount,
            UserRating:    userRating,
        })
    }
}

func DeleteRating(database *sql.DB) func(*gin.Context) {
    return func(context *gin.Context) {
        userID, ok := context.Get("user_id")
        if !ok {
            context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
            return
        }

        filmIDParam := context.Param("id")
        var filmID int64
        if _, err := fmt.Sscan(filmIDParam, &filmID); err != nil {
            context.JSON(http.StatusBadRequest, gin.H{"error": "invalid film_id in URL"})
			fmt.Println(err)
            return
        }

        transaction, err := database.Begin()
        if err != nil {
            context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start transaction"})
			fmt.Println(err)
            return
        }

        defer func() {
            if p := recover(); p != nil {
                transaction.Rollback()
                panic(p)
            }
        }()

        result, err := transaction.Exec("DELETE FROM ratings WHERE user_id = ? AND film_id = ?", userID, filmID)
        if err != nil {
            transaction.Rollback()
            context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete rating"})
            fmt.Println(err)
            return
        }

        affected, _ := result.RowsAffected()
        if affected == 0 {
            transaction.Rollback()
            context.JSON(http.StatusNotFound, gin.H{"error": "rating not found"})
            return
        }

        var averageField *float64
		var countField *int64

		err = transaction.QueryRow(
			"SELECT AVG(rating), COUNT(*) FROM ratings WHERE film_id = ?",
			filmID,
		).Scan(&averageField, &countField)

		if err != nil {
			transaction.Rollback()
			context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to recalculate ratings"})
			fmt.Println(err)
			return
		}

		var averageRating *float64
		if averageField != nil {
			rounded := math.Round(*averageField*10) / 10
			averageRating = &rounded
		}

		var ratingCount *uint64
		if countField != nil {
			temp := uint64(*countField)
			ratingCount = &temp
		}

        _, err = transaction.Exec("UPDATE films SET average_rating = ?, rating_count = ? WHERE id = ?", averageRating, ratingCount, filmID)
        if err != nil {
            transaction.Rollback()
            context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update film stats"})
            fmt.Println(err)
            return
        }

        if err := transaction.Commit(); err != nil {
            transaction.Rollback()
            context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to commit transaction"})
            fmt.Println(err)
            return
        }

        context.JSON(http.StatusOK, FilmRatingResponse{
            FilmID:        uint64(filmID),
            AverageRating: averageRating,
            RatingCount:   ratingCount,
        })
    }
}