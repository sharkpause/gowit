package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/models"
)

func GetFilms(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		page := 1
		limit := 2

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
		
		films := make([]models.Film, 0)
		
		for rows.Next() {
			var id uint64
			var title string
			var description *string
			var releaseYear *int64
			
			err := rows.Scan(&id, &title, &description, &releaseYear)
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
			})
		}

		context.JSON(http.StatusOK, films)
	}
}

func GetFilmById(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		
	}
}