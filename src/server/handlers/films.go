package handlers

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/models"
)

// Temporary hardcoded list of movies
// var movies = []models.Movie{
// 	{
// 		ID: 0,
// 		Title: "Interstellar",
// 		ReleaseYear: 2014,
// 	},
// 	{
// 		ID: 1,
// 		Title: "The Matrix",
// 		ReleaseYear: 1999,
// 	},
// }

func GetMovies(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		rows, err := database.Query("SELECT id, title, description, release_year FROM films")
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