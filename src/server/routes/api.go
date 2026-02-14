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

		protected := api.Group("/") // 我tmd有点儿醉，修改了，请查看是否有没有问题 pllease check, saya rase sudah okehyyyhhhhhhhhh。 i 婷 it was router.group('/'); idk if its wrong or not, but it works with /api/test…… no idea. but the correct way of doing it maybe looks like deez
		protected.Use(auth.Middleware())
		{
			// protected.GET("/test", auth.Test) //auffth.Test just ignore, will delete later, forgot to put into .gitignore. mb.
		}
		
		api.Use(auth.Middleware())

		// auth.Test undefined, will ask Carvin for details later
		// api.GET("/test", auth.Test)
	}
}