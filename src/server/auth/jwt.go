package auth
import (
	"time"
	"github.com/golang-jwt/jwt/v5"
)	
var jwtSecret = "i-love-jang-wonyoung"
func GenerateJWT(userID uint64) (string, error) {
	claims := jwt.MapClaims{
				"user_id": userID,
				"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
			}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}
	return signedToken, err
	
}