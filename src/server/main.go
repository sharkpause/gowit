package main

import (
	"fmt"
	"log"
	"os"
	// "context"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/sharkpause/gowit/db"
	"github.com/sharkpause/gowit/routes"

	// "google.golang.org/genai"
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

	if err != nil {
		log.Fatal(err)
	}

	// ctx := context.Background()

	// geminiClient, err := genai.NewClient(
	// 	ctx,
	// 	&genai.ClientConfig{
	// 		APIKey: os.Getenv("GEMINI_API_KEY"),
	// 		Backend: genai.BackendGeminiAPI,
	// 	},
	// )

	if err != nil {
		log.Fatal(err)
	}

	restrictedWordsSet, err := db.LoadRestrictedWords(database)
	if err != nil {
		fmt.Println("Could ont load restricted words set from the database")
	}

	// routes.SetupAPIRoutes(router, database, restrictedWordsSet, geminiClient)
	routes.SetupAPIRoutes(router, database, restrictedWordsSet)
	
	router.Run(os.Getenv("SERVER_PORT"))
}
