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

	restrictedWordsSet, err := db.LoadRestrictedWords(database)
	if err != nil {
		fmt.Println("Could ont load restricted words set from the database")
	}

	routes.SetupAPIRoutes(router, database, restrictedWordsSet)

	router.Run(os.Getenv("SERVER_PORT"))
}
