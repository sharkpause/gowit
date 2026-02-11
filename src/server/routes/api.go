package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/handlers"
)

func SetupAPIRoutes(router *gin.Engine, database *sql.DB) {
	api := router.Group("/api")

	{
		api.GET("/ping", handlers.PingHandler)

		api.GET("/films", handlers.GetFilms(database))
		api.GET("/films/:id", handlers.GetFilmByID(database))

		api.POST("/register", handlers.RegisterUser(database))
	}
}