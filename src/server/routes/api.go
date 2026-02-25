package routes

import (
	"database/sql"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/sharkpause/gowit/auth"
	"github.com/sharkpause/gowit/handlers"
)

func SetupAPIRoutes(router *gin.Engine, database *sql.DB) {
	router.Use(cors.New(cors.Config{
		// Ganti origin sesuai frontend kamu
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://localhost:5173",
			"http://localhost:8080",
			// "https://domain-frontend-kamu.com",
		},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders: []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge: 12 * time.Hour,
	}))

	api := router.Group("/api")

	{
		api.GET("/ping", handlers.PingHandler)

		api.GET("/films", handlers.GetFilms(database))
		api.GET("/films/trending", handlers.GetTrendingFilms(database))
		api.GET("/films/:id", handlers.GetFilmByID(database))

		api.POST("/register", handlers.RegisterUser(database))
		api.POST("/login", handlers.LoginUser(database))

		// TODO: Later change so that protected APIs are still accessed through {URL}/api and not {URL}/
		// to keep API consistency

		protected := api.Group("/") // 我tmd有点儿醉，修改了，请查看是否有没有问题 pllease check, saya rase sudah okehyyyhhhhhhhhh。 i 婷 it was router.group('/'); idk if its wrong or not, but it works with /api/test…… no idea. but the correct way of doing it maybe looks like deez
		protected.Use(auth.Middleware())
		{
			protected.GET("/favorites", handlers.GetFavorites(database))
			// protected.GET("/test", auth.Test) //auffth.Test just ignore, will delete later, forgot to put into .gitignore. mb.
			protected.POST("/favorites", handlers.AddFilmToFavorite(database)) // dear @gilbert-sunbaenim, 我不知道要放什么route，只好先这样咯，
			protected.DELETE("/favorites/:film_id", handlers.DeleteFilmFromFavorite(database))
		}
		
		api.Use(auth.Middleware())

		// auth.Test undefined, will ask Carvin for details later
		// api.GET("/test", auth.Test)
	}
}