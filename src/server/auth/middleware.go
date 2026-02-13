package auth

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	// "time"
	"github.com/golang-jwt/jwt/v5"
)

// var jwtSecret = "i-love-jang-wonyoung"
func Middleware() gin.HandlerFunc {
	return func(c *gin.Context){
		tokenString, err := c.Cookie("token")
		if err != nil {
			c.AbortWithStatusJSON(400, gin.H{"error": "no token"})
			return
		}
		
		fmt.Println(tokenString)

		if tokenString == "" {
			c.AbortWithStatusJSON(401, gin.H{"error": "no token"})
			return
		}

		token, err := jwt.Parse(
			tokenString, 
			func(t *jwt.Token) (interface{}, error) {
				return []byte(os.Getenv("JWT_SECRET")), nil
			},
		)

		if err != nil {
			c.AbortWithStatusJSON(401, "Error")
			return
		}
		
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			userID := uint64(claims["user_id"].(float64))
			c.Set("user_id", userID)
			c.Next()
		}

		c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
	}
}