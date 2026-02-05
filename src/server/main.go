package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/config"
)



func main() {
	fmt.Println("Starting server, please wait...")

	router := gin.Default()

	router.GET("/ping", func(context *gin.Context) {
		context.JSON(config.OK, gin.H{
			"message": "pong",
		})
	})

	router.Run(config.LISTENING_PORT)
}
