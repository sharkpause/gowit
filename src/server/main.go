package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/config"
	"github.com/sharkpause/gowit/routes"
)

func main() {
	fmt.Println("Starting server, please wait...")

	router := gin.Default()

	routes.SetupAPIRoutes(router)

	router.Run(config.LISTENING_PORT)
}
