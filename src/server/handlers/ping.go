package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func PingHandler(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}