package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type registerRequest struct {
	Name		string `json:name`
	Email		string `json:email`
	Password	string `json:password`
}

func RegisterUser(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		var request registerRequest
		if err := context.ShouldBindJSON(&request); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid request body",
			})
			return
		}

		context.JSON(http.StatusOK, gin.H{"message": "OK"})
	}
}