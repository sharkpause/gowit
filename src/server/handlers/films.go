package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/models"
)

type Scanner interface {
	Scan(dest ...any) error
}

type postFavoriteRequest struct {
	FilmID uint64 `json:"film_id"`
	Notes  string `json:"notes"`
}

type patchFavoriteRequest struct {
	Notes string `json:"notes" binding:"required"`
}

type importMovieRequest struct {
	Titles []string `json:"titles" binding:"required,min=1"`
}

func scanFilm(database *sql.DB, row Scanner) (*models.Film, error) {
	var film models.Film

	var description, posterURL, trailerURL, tagline *string
	var trailerDuration *uint16
	var releaseDate *time.Time
	var runtime *int64
	var averageRating *float64
	var popularity uint64

	err := row.Scan(
		&film.ID,
		&film.Title,
		&description,
		&releaseDate,
		&posterURL,
		&trailerURL,
		&trailerDuration,
		&averageRating,
		&popularity,
		&runtime,
		&tagline,
	)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	film.Description = description

	var releaseDateYear *int64
	if releaseDate != nil {
    	year := int64(releaseDate.Year())
    	releaseDateYear = &year
	}
	film.ReleaseYear = releaseDateYear
	
	film.PosterImageURL = posterURL
	film.TrailerURL = trailerURL
	film.AverageRating = averageRating
	film.Popularity = popularity
	film.Runtime = runtime
	film.Tagline = tagline
	film.TrailerDuration = trailerDuration

	genres := []string{}
	rows, err := database.Query(`
		SELECT g.name
		FROM film_genres fg
		JOIN genres g ON fg.genre_id = g.id
		WHERE fg.film_id = ?`, film.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var name string
			rows.Scan(&name)
			genres = append(genres, name)
		}
	}
	fmt.Println(genres)
	film.Genres = genres

	companies := []string{}
	rows, err = database.Query(`
		SELECT pc.name
		FROM film_production_companies fpc
		JOIN production_companies pc ON fpc.company_id = pc.id
		WHERE fpc.film_id = ?`, film.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var name string
			rows.Scan(&name)
			companies = append(companies, name)
		}
	}
	film.ProductionCompanies = companies

	countries := []string{}
	rows, err = database.Query(`
		SELECT pc.name
		FROM film_production_countries fpc
		JOIN production_countries pc ON fpc.country_code = pc.iso_code
		WHERE fpc.film_id = ?`, film.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var name string
			rows.Scan(&name)
			countries = append(countries, name)
		}
	}
	film.ProductionCountries = countries

	casts := []string{}
	rows, err = database.Query(`
		SELECT actor_name
		FROM film_casts
		WHERE film_id = ?
		ORDER BY cast_order ASC
		LIMIT 10`, film.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var name string
			rows.Scan(&name)
			casts = append(casts, name)
		}
	}
	film.Casts = casts

	return &film, nil
}

func GetFilms(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		page := 1
		limit := 10
		sort := "id"
		order := "ASC"

		if pageParam := context.Query("page"); pageParam != "" {
			pageQueryValue, err := strconv.Atoi(pageParam)

			if err != nil {
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid page parameter",
				})
				return
			}

			if pageQueryValue < 1 {
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "page must be >= 1",
				})
				return
			}

			page = pageQueryValue
		}

		if limitParam := context.Query("limit"); limitParam != "" {
			limitQueryValue, err := strconv.Atoi(limitParam)

			if err != nil {
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid limit parameter",
				})
				return
			}
			if limitQueryValue < 1 || limitQueryValue > 100 {
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "limit must be between 1 and 100",
				})
				return
			}

			limit = limitQueryValue
		}

		if sortParam := context.Query("sort"); sortParam != "" {
			sortParam = strings.ToLower(sortParam)

			switch sortParam {
			case "id", "title", "description", "release_year", "average_rating", "popularity":
				sort = sortParam
			default:
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid sort parameter",
				})
				return
			}
		}

		if orderParam := context.Query("order"); orderParam != "" {
			orderParam = strings.ToUpper(orderParam)

			switch orderParam {
			case "ASC", "DESC":
				order = orderParam
			default:
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid order parameter",
				})
				return
			}
		}

		conditions := []string{}
		args := []any{}

		if yearParam := context.Query("year"); yearParam != "" {
			year, err := strconv.Atoi(yearParam)
			if err == nil {
				conditions = append(conditions, "YEAR(release_date) = ?")
				args = append(args, year)
			}
		}

		if minRatingParam := context.Query("min_rating"); minRatingParam != "" {
			rating, err := strconv.ParseFloat(minRatingParam, 64)
			if err == nil {
				conditions = append(conditions, "average_rating >= ?")
				args = append(args, rating)
			}
		}

		if searchParam := context.Query("search"); searchParam != "" {
			conditions = append(conditions, "(title LIKE ?)")
			likePattern := "%" + searchParam + "%"
			args = append(args, likePattern)
		}

		where := ""
		if len(conditions) > 0 {
			where = "WHERE " + strings.Join(conditions, " AND ")
		}

		offset := (page - 1) * limit

		queryString := fmt.Sprintf(
			`SELECT
				f.id, f.title, f.description,
				f.release_date, f.poster_image_url, t.trailer_url, t.trailer_duration,
				f.average_rating, f.popularity, f.runtime, f.tagline
			FROM films AS f
			LEFT JOIN trailers AS t
				ON f.trailer_id = t.id
			%s
			ORDER BY %s %s
			LIMIT ? OFFSET ?`,
			where, sort, order,
		)
		args = append(args, limit, offset)

		rows, err := database.Query(queryString, args...)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		films := []models.Film{}
		for rows.Next() {
			film, err := scanFilm(database, rows)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			films = append(films, *film)
		}

		context.JSON(http.StatusOK, gin.H{
			"films": films,
			"metadata": gin.H{
				"amount": len(films),
			},
		})
	}
}

func GetFilmByID(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		filmID, err := strconv.ParseUint(context.Param("id"), 10, 64)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": "invalid film id"})
			return
		}

		row := database.QueryRow(
			`SELECT
				f.id, f.title, f.description,
				f.release_date, f.poster_image_url, t.trailer_url, t.trailer_duration,
				f.average_rating, f.popularity, f.runtime, f.tagline
			FROM films AS f
			LEFT JOIN trailers AS t
				ON f.trailer_id = t.id
			WHERE f.id = ?`,

			filmID)

		film, err := scanFilm(database, row)
		if err == sql.ErrNoRows {
			context.JSON(http.StatusNotFound, gin.H{"error": "film not found"})
			return
		}
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		context.JSON(http.StatusOK, film)
	}
}

func GetTrendingFilms(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		const defaultLimit = 10
		limit := defaultLimit

		if limitParam := context.Query("limit"); limitParam != "" {
			limitQuery, err := strconv.Atoi(limitParam)
			if err == nil && limitQuery > 0 && limitQuery <= 100 {
				limit = limitQuery
			}
		}

		currentYear := time.Now().Year()

		query := `
			SELECT id, title, description, release_year, poster_image_url, trailer_url,
				   average_rating, popularity, runtime, tagline
			FROM films
			ORDER BY (? - release_year * 2.0 + popularity * 0.5 + COALESCE(average_rating,0) * 1.0) ASC
			LIMIT ?`

		rows, err := database.Query(query, currentYear, limit)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("db error: %s", err)})
			return
		}
		defer rows.Close()

		var films []models.Film

		for rows.Next() {
			var film models.Film
			err := rows.Scan(
				&film.ID,
				&film.Title,
				&film.Description,
				&film.ReleaseYear,
				&film.PosterImageURL,
				&film.TrailerURL,
				&film.AverageRating,
				&film.Popularity,
				&film.Runtime,
				&film.Tagline,
			)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			films = append(films, film)
		}

		context.JSON(http.StatusOK, gin.H{
			"films": films,
			"metadata": gin.H{
				"amount": len(films),
			},
		})
	}
}

func AddFilmToFavorite(database *sql.DB) func(*gin.Context) { // protected
	return func(context *gin.Context) {
		var request postFavoriteRequest
		if err := context.ShouldBindJSON(&request); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid request body",
			})
			return
		}

		userIDVal, exists := context.Get("user_id")
		if !exists {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
			return
		}
		userID, ok := userIDVal.(uint64)
		if !ok {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user_id"})
			return
		}

		// --- check if film exists ---
		var filmExists bool
		err := database.QueryRow(
			"SELECT EXISTS(SELECT 1 FROM films WHERE id = ?)",
			request.FilmID,
		).Scan(&filmExists)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check film"})
			fmt.Println(err)
			return
		}
		if !filmExists {
			context.JSON(http.StatusNotFound, gin.H{"error": "film not found"})
			return
		}

		// --- insert favorite ---
		_, err = database.Exec(
			"INSERT INTO favorites (user_id, notes, film_id) VALUES (?, ?, ?)",
			userID, request.Notes, request.FilmID,
		)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "internal database error"})
			fmt.Println(err)
			return
		}

		context.JSON(
			http.StatusCreated,
			gin.H{
				"message": "successfully added film to favorite",
				"film_id": request.FilmID,
				"user_id": userID,
			},
		)
	}
}

// type AddMultileFilmsToFavoriteRequest struct {
//     Films []struct {
//         Title string  `json:"title"` // movie title
//         Notes *string `json:"notes"` // optional
//     } `json:"films" binding:"required,min=1"`
// }

// func AddMultipleFilmsToFavorite(database *sql.DB) func(*gin.Context) {
//     return func(context *gin.Context) {
//         var request AddMultileFilmsToFavoriteRequest
//         if err := context.ShouldBindJSON(&request); err != nil {
//             context.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
//             return
//         }

//         userID, exists := context.Get("user_id")
//         if !exists {
//             context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
//             return
//         }

//         transaction, err := database.Begin()
//         if err != nil {
//             context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start transaction"})
//             fmt.Println(err)
//             return
//         }
//         defer func() {
//             if p := recover(); p != nil {
//                 transaction.Rollback()
//                 panic(p)
//             }
//         }()

//         insertStmt, err := transaction.Prepare("INSERT IGNORE INTO favorites (user_id, film_id, notes) VALUES (?, ?, ?)")
//         if err != nil {
//             transaction.Rollback()
//             context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to prepare statement"})
//             fmt.Println(err)
//             return
//         }
//         defer insertStmt.Close()

//         var skipped []string

//         for _, film := range request.Films {
//             // Lookup film id by title (case-insensitive)
//             var filmID uint64
//             err := transaction.QueryRow("SELECT id FROM films WHERE LOWER(title) = LOWER(?)", film.Title).Scan(&filmID)
//             if err == sql.ErrNoRows {
//                 skipped = append(skipped, film.Title) // title not found
//                 continue
//             } else if err != nil {
//                 transaction.Rollback()
//                 context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query film"})
//                 fmt.Println(err)
//                 return
//             }

//             // Insert favorite, skip duplicates
//             res, err := insertStmt.Exec(userID, filmID, film.Notes)
//             if err != nil {
//                 transaction.Rollback()
//                 context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to insert favorite"})
//                 fmt.Println(err)
//                 return
//             }

//             rowsAffected, _ := res.RowsAffected()
//             if rowsAffected == 0 {
//                 skipped = append(skipped, film.Title) // duplicate favorite
//             }
//         }

//         if err := transaction.Commit(); err != nil {
//             transaction.Rollback()
//             context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to commit transaction"})
//             fmt.Println(err)
//             return
//         }

//         context.JSON(http.StatusCreated, gin.H{
//             "message":            "successfully added films to favorite",
//             "user_id":            userID,
//             "films":              request.Films,
//             "skipped_duplicates": skipped,
//         })
//     }
// }

func DeleteFilmFromFavorite(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		filmID, err := strconv.Atoi(context.Param("film_id"))
		if err != nil {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "error while reading film id"})
			return
		}

		userID, exists := context.Get("user_id")
		if !exists {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
			return
		}

		query := `
			DELETE FROM favorites WHERE user_id=? and film_id=?
		`

		result, err := database.Exec(query, userID, filmID)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("db error: %s", err)})
			return
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal db error",
			})
			fmt.Println(err)
			return
		}

		if rowsAffected == 0 {
			context.JSON(http.StatusNotFound, gin.H{
				"error": "favorite film not found",
			})
			return
		}

		context.JSON(http.StatusOK, gin.H{
			"message": "successfully deleted film from favorite",
		})
	}
}

func UpdateFavoriteFilm(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		filmID, err := strconv.Atoi(context.Param("film_id"))
		if err != nil {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "error while reading film id"})
			fmt.Println(err)
			return
		}

		userID, exists := context.Get("user_id")
		if !exists {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
			return
		}

		var request patchFavoriteRequest
		if err := context.ShouldBindJSON(&request); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid request body",
			})
			fmt.Println(err)
			return
		}

		query := `
			UPDATE favorites SET notes = ? WHERE film_id = ? AND user_id = ?
		`

		_, err = database.Exec(query, request.Notes, filmID, userID)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("db error: %s", err)})
			return
		}

		context.JSON(http.StatusOK, gin.H{
			"message": "successfully updated favorite film",
		})
	}
}

func GetFavorites(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		userIDVal, exists := context.Get("user_id")
		if !exists {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
			return
		}
		userID, ok := userIDVal.(uint64)
		if !ok {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user_id"})
			return
		}

		// --- params ---
		page := 1
		limit := 10
		sort := "title"
		order := "ASC"

		if pageParam := context.Query("page"); pageParam != "" {
			pageQueryValue, err := strconv.Atoi(pageParam)
			if err != nil || pageQueryValue < 1 {
				context.JSON(http.StatusBadRequest, gin.H{"error": "invalid page parameter"})
				return
			}
			page = pageQueryValue
		}

		if limitParam := context.Query("limit"); limitParam != "" {
			limitQueryValue, err := strconv.Atoi(limitParam)
			if err != nil || limitQueryValue < 1 || limitQueryValue > 100 {
				context.JSON(http.StatusBadRequest, gin.H{"error": "limit must be between 1 and 100"})
				return
			}
			limit = limitQueryValue
		}

		if sortParam := context.Query("sort"); sortParam != "" {
			sortParam = strings.ToLower(sortParam)
			switch sortParam {
			case "title", "release_date", "average_rating", "popularity", "runtime":
				sort = sortParam
			default:
				context.JSON(http.StatusBadRequest, gin.H{"error": "invalid sort parameter"})
				return
			}
		}

		if orderParam := context.Query("order"); orderParam != "" {
			orderParam = strings.ToUpper(orderParam)
			switch orderParam {
			case "ASC", "DESC":
				order = orderParam
			default:
				context.JSON(http.StatusBadRequest, gin.H{"error": "invalid order parameter"})
				return
			}
		}

		conditions := []string{"favorite.user_id = ?"}
		args := []any{userID}

		if searchParam := context.Query("search"); searchParam != "" {
			conditions = append(conditions, "film.title LIKE ?")
			args = append(args, "%"+searchParam+"%")
		}

		where := ""
		if len(conditions) > 0 {
			where = "WHERE " + strings.Join(conditions, " AND ")
		}

		offset := (page - 1) * limit

		query := fmt.Sprintf(
			`SELECT
				favorite.id, favorite.notes,
				film.id, film.title, film.description, film.poster_image_url,
				film.average_rating, film.release_date, film.runtime
			FROM favorites favorite
			JOIN films film ON favorite.film_id = film.id
			%s
			ORDER BY film.%s %s
			LIMIT ? OFFSET ?`,
			where, sort, order,
		)
		args = append(args, limit, offset)

		rows, err := database.Query(query, args...)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("db error: %s", err)})
			return
		}
		defer rows.Close()

		var favorites []models.Favorite
		var releaseDate sql.NullTime

		for rows.Next() {
			var favorite models.Favorite
			err := rows.Scan(
				&favorite.ID,
				&favorite.Notes,
				&favorite.FilmID,
				&favorite.Title,
				&favorite.Description,
				&favorite.PosterImageURL,
				&favorite.AverageRating,
				&releaseDate,
				&favorite.Runtime,
			)
			if releaseDate.Valid {
				ry := int64(releaseDate.Time.Year())
				favorite.ReleaseYear = &ry
			} else {
				favorite.ReleaseYear = nil
			}

			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				fmt.Println(err)
				return
			}

			favorites = append(favorites, favorite)
		}

		context.JSON(http.StatusOK, gin.H{
			"favorites": favorites,
			"metadata": gin.H{
				"amount": len(favorites),
			},
		})
	}
}

func GetComingSoon(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		query := `
			SELECT f.title, f.thumbnail_url, f.runtime, f.release_date, t.trailer_url, t.trailer_duration
			FROM films AS f
			LEFT JOIN trailers AS t
				ON f.trailer_id = t.id
			WHERE f.release_date > CURDATE()
			ORDER BY f.release_date DESC
			LIMIT 20;
		`

		rows, err := database.Query(query)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "internal db error"})
			fmt.Println(err)
			return
		}

		var comingSoons []models.ComingSoonFilm
		for rows.Next() {
			var film models.ComingSoonFilm
			err := rows.Scan(
				&film.Title,
				&film.ThumbnailURL,
				&film.Runtime,
				&film.ReleaseDate,
				&film.TrailerURL,
				&film.TrailerDuration,
			)

			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": "internal db error"})
				fmt.Println(err)
				return
			}

			comingSoons = append(comingSoons, film)
		}

		context.JSON(http.StatusOK, gin.H{
			"coming_soon": comingSoons,
			"metadata": gin.H{
				"amount": len(comingSoons),
			},
		})
	}
}

func FavoriteListCheck(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		filmID, err := strconv.ParseUint(context.Param("id"), 10, 64)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": "invalid film id"})
			return
		}
		var isFavorite bool
		userId, exists := context.Get("user_id")
		if !exists {
			context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized User",})
		}
		query := "SELECT IF(EXISTS(SELECT 1 FROM favorites WHERE user_id= ? AND film_id = ?), TRUE,FALSE) AS is_favorite"
		err = database.QueryRow(query, userId, filmID).Scan(&isFavorite)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
			return
		}
		fmt.Println(isFavorite)
		context.JSON(http.StatusOK, gin.H{"isFavorite": isFavorite}) // hardcode front end kalau belum log in otomatis false please
	}
}

func ImportMovie(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		var request importMovieRequest
		if err := context.ShouldBindJSON(&request); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
			return
		}

		userIDVal, exists := context.Get("user_id")
		if !exists {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
			return
		}
		userID := userIDVal.(uint64)

		var errorsList []string

		for _, title := range request.Titles {
			title = strings.TrimSpace(title)
			if title == "" {
				continue
			}

			var filmID int64
			err := database.QueryRow(
				"SELECT id FROM films WHERE LOWER(title) = LOWER(?)",
				title,
			).Scan(&filmID)

			if err != nil {
				if err == sql.ErrNoRows {
					errorsList = append(errorsList, title)
					continue
				} else {
					context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("db error: %s", err)})
					fmt.Println(err)
					return
				}
			}

			_, err = database.Exec(
				"INSERT IGNORE INTO favorites (user_id, film_id) VALUES (?, ?)",
				userID, filmID,
			)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to insert favorite for '%s'", title)})
				fmt.Println(err)
				return
			}
		}

		context.JSON(http.StatusOK, gin.H{
			"message":       "movies processed",
			"missing_titles": errorsList,
		})
	}
}
