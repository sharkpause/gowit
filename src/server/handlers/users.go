package handlers

import (
	"database/sql"
	"net/http"
	"net/mail"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"github.com/sharkpause/gowit/auth"
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

		// TODO: Add proper email validation because ParseAddress is very lenient
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

type loginRequest struct {
	Email		string `json:"email"`
	Password	string `json:"password"`
}
func LoginUser(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		var request loginRequest
		if err := context.ShouldBindJSON(&request); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid request body",
			})
			return
		}
		var userID uint64
		var passwordHash string
		err := database.QueryRow("SELECT id, password_hash FROM users WHERE email = ?", request.Email).Scan(&userID, &passwordHash)
		if err != nil {
			context.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid email or password",
			})
			return
		} else if err == sql.ErrNoRows {
				context.JSON(http.StatusInternalServerError, gin.H{
					"error": "internal db error",
				})
				return
			} 
		err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(request.Password))
		// request.Password = "jangwonyoung" // Placeholder to simulate password check
		// err := bcrypt.CompareHashAndPassword([]byte("$2a$10$GhZ5qKSmVckBI9Y4mfcBVO.kwf1Xmt09RPnQ6/cMF1oRK9Dvlho/O"), []byte(request.Password)) also an api tester
		if err != nil {
			context.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid email or password",
			})
			return
		}
		token, err := auth.GenerateJWT(userID)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "token error"})
			return
		}
		context.SetCookie("token",token, 3600*24*30, "/", "", false, true)
		context.JSON(http.StatusOK, gin.H{
			"message": "login successful",
			"token": token,
			"user_ID": userID,
		})
		
	}}