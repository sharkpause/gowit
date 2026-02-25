package handlers

import (
	"database/sql"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type UserResponse struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

func MeHandler(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
	tokenStr, err := context.Cookie("token")
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil || !token.Valid {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID := int(userIDFloat)

	var user UserResponse

	err = database.QueryRow(`
		SELECT id, email, name
		FROM users
		WHERE id = ?
	`, userID).Scan(&user.ID, &user.Email, &user.Name)

	if err != nil {
		if err == sql.ErrNoRows {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		context.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
		return
	}

	context.JSON(http.StatusOK, user)
}
}