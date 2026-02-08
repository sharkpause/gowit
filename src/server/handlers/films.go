package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/models"
)

// Temporary hardcoded list of movies
var movies = []models.Movie{
	{
		ID: 0,
		Title: "Interstellar",
		ReleaseYear: 2014,
	},
	{
		ID: 1,
		Title: "The Matrix",
		ReleaseYear: 1999,
	},
}

func GetMovies(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		rows, error := database.Query("SELECT id, title, release_year FROM films")

		context.JSON(http.StatusOK, movies)
	}
}