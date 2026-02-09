package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/models"
)

func GetMovies(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		page := 1
		limit := 2

		if pageStr := context.Query("page"); pageStr != "" {
			query_page, err := strconv.Atoi(pageStr)
			
			if err != nil {
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid page parameter",
				})
				return
			}
			
			page = query_page
		}
		
		if limitStr := context.Query("limit"); limitStr != "" {
			query_limit, err := strconv.Atoi(limitStr)

			if err != nil {
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid limit parameter",
				})
				return
			}
			
			limit = query_limit
		}

		offset := (page - 1) * limit

		rows, err := database.Query(
			`SELECT id, title, description, release_year FROM films
			LIMIT ? OFFSET ?`,
			limit, offset,
		)

		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("db error:\n%s", err),
			})
			return
		}
		
		defer rows.Close()
		
		movies := make([]models.Film, 0)
		
		for rows.Next() {
			var id uint64
			var title string
			var description *string
			var release_year *int64
			
			err := rows.Scan(&id, &title, &description, &release_year)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{
					"error": fmt.Sprintf("db error:\n%s", err),
				})
				return
			}
			
			movies = append(movies, models.Film{
				ID: id,
				Title: title,
				Description: description,
				ReleaseYear: release_year,
			})
		}

		context.JSON(http.StatusOK, movies)
	}
}