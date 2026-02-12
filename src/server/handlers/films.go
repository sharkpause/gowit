package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/models"
)

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
			case "id", "title", "description", "release_year":
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
				conditions = append(conditions, "release_year = ?")
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
			conditions = append(conditions, "(title LIKE ? OR description LIKE ?)")
			likePattern := "%" + searchParam + "%"
			args = append(args, likePattern, likePattern)
		}

		where := ""
		if len(conditions) > 0 {
			where = "WHERE " + strings.Join(conditions, " AND ")
		}

		offset := (page - 1) * limit

		query_string := fmt.Sprintf(
			`SELECT id, title, description, release_year, poster_image_url, trailer_url, average_rating FROM films
			%s
			ORDER BY %s %s
			LIMIT ? OFFSET ?`,
			where, sort, order,
		)
		args = append(args, limit, offset)

		rows, err := database.Query(query_string, args...)

		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("db error:\n%s", err),
			})
			return
		}
		
		defer rows.Close()
		
		films := make([]models.Film, 0)
		
		for rows.Next() {
			var id uint64
			var title string
			var description *string
			var releaseYear *int64
			var posterImageURL *string
			var trailerURL *string
			var average_rating *float64

			err := rows.Scan(&id, &title, &description, &releaseYear, &posterImageURL, &trailerURL, &average_rating)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{
					"error": fmt.Sprintf("db error:\n%s", err),
				})
				return
			}
			
			films = append(films, models.Film{
				ID: id,
				Title: title,
				Description: description,
				ReleaseYear: releaseYear,
				PosterImageURL: posterImageURL,
				TrailerURL: trailerURL,
				AverageRating: average_rating,
			})
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
		IDParam := context.Param("id")

		filmID, err := strconv.ParseUint(IDParam, 10, 64)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid film id",
			})
			return
		}
		
		row := database.QueryRow(
			`SELECT id, title, description, release_year, poster_image_url, trailer_url, average_rating FROM films
			WHERE id = ?`,
			filmID,
		)
		
		var id uint64
		var title string
		var description *string
		var release_year *int64
		var posterImageURL *string
		var trailerURL *string
		var average_rating *float64

		err = row.Scan(&id, &title, &description, &release_year, &posterImageURL, &trailerURL, &average_rating)
		if err == sql.ErrNoRows {
			context.JSON(http.StatusNotFound, gin.H{
				"error": "film not found",
			})
			return
		}
		fmt.Println(err)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal database error",
			})
			return
		}

		context.JSON(
			http.StatusOK,
			models.Film {
				ID: id,
				Title: title,
				Description: description,
				ReleaseYear: release_year,
				PosterImageURL: posterImageURL,
				TrailerURL: trailerURL,
				AverageRating: average_rating,
			},
		)
	}
}