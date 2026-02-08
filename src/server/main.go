package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/sharkpause/gowit/db"
	"github.com/sharkpause/gowit/routes"
)

func main() {
	fmt.Println("Starting server, please wait...")

	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	router := gin.Default()

	database, err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}
	if err := database.Ping(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected successfully to database")

	routes.SetupAPIRoutes(router, database)

	router.Run(os.Getenv("SERVER_PORT"))
}
