package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/config"
)

func PingHandler(context *gin.Context) {
	context.JSON(config.OK, gin.H{
		"message": "pong",
	})
}