package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"net/mail"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/auth"
	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
	Name		string `json:"name"`
	Email		string `json:"email"`
	Password	string `json:"password"`
}

type loginRequest struct {
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

		err := database.
			QueryRow(
				"SELECT id, password_hash FROM users WHERE email = ?",
				request.Email,
			).Scan(&userID, &passwordHash)
		
		if err == sql.ErrNoRows {
			context.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal db error",
			})

			return
		}
		
		if err != nil {
			context.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid email or password",
			})

			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(request.Password))
		
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

		context.SetCookie("token", token, 3600*24*30, "/", "", true, true)
		context.JSON(http.StatusOK, gin.H{
			"message": "login successful",
		})
	}
}
func LogoutUser(context *gin.Context){
	context.SetCookie("token", "", -1, "/","",true,true)
	context.JSON(200, gin.H{
		"message":"Logged Out",
	})
}

func GetUserDetail(database *sql.DB) gin.HandlerFunc{
	return func(context *gin.Context) {
		userID,exists := context.Get("user_id")
			if !exists {
				context.JSON(401, gin.H{"message": "Unauthorized",})
				return
			}
		userID=userID.(uint64)
		
		var name,email,profile_picture_url string
		var created_at time.Time
		var favoritecount int
		query := "select users.name, users.email,users.profile_picture_url,users.created_at, COUNT(favorites.film_id) AS total_favorites FROM users JOIN favorites ON users.id = favorites.user_id WHERE users.id = ? GROUP BY users.id, users.name, users.email, users.created_at, users.profile_picture_url;"
		err:=database.QueryRow(query,userID).Scan(
			&name,
			&email,
			&profile_picture_url,
			&created_at,
			&favoritecount,
		)
		
		if err != nil{
			context.JSON(500, gin.H{"message": "Internal Database Error"})
			return
		}
		context.JSON(200, gin.H{
			"name": name,
			"email": email,
			"profile": profile_picture_url,
			"created": created_at.Format(time.RFC3339), // chatgpt told me its uhhh some 2026-02-14T23:49:22Z, didnt understand shit, but okay. let the frontend do their magic
			"favorite_count": favoritecount,
			// 			
			//     "created": "2026-02-14T23:49:22Z",
			//     "email": "john@example.com",
			//     "name": "John Doe",
			//     "profile": "nulnot"
			// 		"uhh": "uhh"
			//  	also returning like this, map. im too rude you know what he said to me, he was like 'you are so rude' and i was like boy does it look like i could care i couldnt even care less rude
		})
	}
	
}