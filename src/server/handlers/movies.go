package handlers

import (
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

func GetMovies(context *gin.Context) {
	context.JSON(http.StatusOK, movies)
}