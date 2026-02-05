package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/handlers"
)

func SetupAPIRoutes(router *gin.Engine) {
	api := router.Group("/api")

	{
		api.GET("/ping", handlers.PingHandler)
	}
}