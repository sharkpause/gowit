package auth
<<<<<<< HEAD
import (
	"time"
	"github.com/golang-jwt/jwt/v5"
)	
var jwtSecret = "i-love-jang-wonyoung"
=======

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// var jwtSecret = "i-love-jang-wonyoung"
>>>>>>> d8dc3cf66488facdeaa47641f82abf3aacaf5d0d
func GenerateJWT(userID uint64) (string, error) {
	claims := jwt.MapClaims{
				"user_id": userID,
				"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
			}
<<<<<<< HEAD
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
=======

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", fmt.Errorf("JWT_SECRET is not set")
	}

>>>>>>> d8dc3cf66488facdeaa47641f82abf3aacaf5d0d
	signedToken, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}
<<<<<<< HEAD
	return signedToken, err
	
=======

	return signedToken, err
>>>>>>> d8dc3cf66488facdeaa47641f82abf3aacaf5d0d
}