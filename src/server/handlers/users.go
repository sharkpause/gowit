package handlers

import (
	"database/sql"
	"net/http"
	"net/mail"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
	Name		string `json:"name"`
	Email		string `json:"email"`
	Password	string `json:"password"`
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

		if request.Name == "" {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "name is required",
			})
			return
		}
		if request.Email == "" {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "email is required",
			})
			return
		}
		if request.Password == "" {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "password is required",
			})
			return
		}

		if len(request.Name) > 255 {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "name can not be over 255 characters long",
			})
			return
		}
		if len(request.Email) > 255 {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "name can not be over 255 characters long",
			})
			return
		}

		// TODO: Add password requirements

		_, err := mail.ParseAddress(request.Email)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid email format",
			})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to hash password",
			})
			return
		}

		var existingID uint64
		err = database.QueryRow(
			`SELECT id FROM users where email = ?`,
			request.Email,
		).Scan(&existingID)

		if err != sql.ErrNoRows {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "email already in use",
			})
			return
		}

		result, err := database.Exec(
			`INSERT INTO users (name, email, password_hash)
			VALUES (
				?, ?, ?
			)`,
			request.Name, request.Email, hashedPassword,
		)

		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal db error",
			})
			return
		}

		userID, err := result.LastInsertId()
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"error": "could not retrieve user ID",
			})
			return
		}

		context.JSON(http.StatusOK, gin.H{
			"message": "user registered successfully",
			"user_id": userID,
		})
	}
}