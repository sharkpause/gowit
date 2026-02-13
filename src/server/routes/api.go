package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/handlers"
	"github.com/sharkpause/gowit/auth"
	
)

func SetupAPIRoutes(router *gin.Engine, database *sql.DB) {
	api := router.Group("/api")

	{
		api.GET("/ping", handlers.PingHandler)

		api.GET("/films", handlers.GetFilms(database))
		api.GET("/films/:id", handlers.GetFilmByID(database))

		api.POST("/register", handlers.RegisterUser(database))
		api.POST("/login", handlers.LoginUser(database))
		protected:= router.Group("/")
		protected.Use(auth.Middleware())
		
		{
		
		}
		
		api.Use(auth.Middleware())
		api.GET("/test", auth.Test)
	}
}