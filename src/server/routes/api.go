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

		// TODO: Later change so that protected APIs are still accessed through {URL}/api and not {URL}/
		// to keep API consistency

		protected := router.Group("/")
		protected.Use(auth.Middleware())
		
		{
		
		}
		
		api.Use(auth.Middleware())

		// auth.Test undefined, will ask Carvin for details later
		// api.GET("/test", auth.Test)
	}
}