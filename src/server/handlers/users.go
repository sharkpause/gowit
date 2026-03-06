package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/mail"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sharkpause/gowit/auth"
	"golang.org/x/crypto/bcrypt"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
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

		var hashedPassword []byte
		if request.Password != "" {
			hashedPassword, err = bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{
					"error": "failed to hash password",
				})
				fmt.Println(err)
				return
			}
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
			fmt.Println(err)
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
		
		var name,email string
		var profile_picture_url *string
		var created_at time.Time
		var favoritecount int
		query := `SELECT
			users.name,
			users.email,
			users.profile_picture_url,
			users.created_at,
			COUNT(favorites.film_id) AS total_favorites
		FROM users
		LEFT JOIN favorites ON users.id = favorites.user_id
		WHERE users.id = ?
		GROUP BY users.id, users.name, users.email, users.created_at, users.profile_picture_url;`

		err:=database.QueryRow(query,userID).Scan(
			&name,
			&email,
			&profile_picture_url,
			&created_at,
			&favoritecount,
		)
		
		if err != nil{
			context.JSON(500, gin.H{"message": "Internal Database Error"})
			fmt.Println(err);

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

func UpdateUserDetail(database *sql.DB) gin.HandlerFunc{
	return func(context *gin.Context){
	type users struct{
		Name *string `json:"name"`
		Profile_picture_url *string `json:"profile_picture_url"`
		}
	userId,exists := context.Get("user_id")
	if !exists {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized User",})
	}
	userId=userId.(uint64)
	var user users
	if err := context.ShouldBindJSON(&user); err != nil{
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Request Body",
			})
		return
	}
	args := []interface{}{}
	field := []string{}
	query := "UPDATE users SET "
	if user.Name != nil {
		args = append(args, *user.Name)
		field = append(field, " name = ?")
	}
	if user.Profile_picture_url != nil{
		args = append(args, *user.Profile_picture_url)
		field = append(field, " profile_picture_url = ?")
	}
	if len(args) == 0 {
		context.JSON(http.StatusBadRequest, gin.H{"message": "No provided field, so no update occured",})
		return
	}
	query += strings.Join(field, ", ") + " WHERE id = ?"
	args = append(args, userId)
	_,err := database.Exec(query,args...)
	if err != nil{
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update",})
		return
	}
	context.JSON(200, gin.H{"message": "Successfulll"},)
	}
}

func NewGoogleOAuthConfig() *oauth2.Config {
    return &oauth2.Config{
        ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
        ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
        RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
        Scopes:       []string{"openid", "profile", "email"},
        Endpoint:     google.Endpoint,
    }
}

func GoogleLoginHandler(context *gin.Context) {
	state := uuid.New().String()
	url := NewGoogleOAuthConfig().AuthCodeURL(state)

	context.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallbackHandler(database *sql.DB) func(*gin.Context) {
    return func(requestContext *gin.Context) {
        code := requestContext.Query("code")

        if code == "" {
            requestContext.JSON(http.StatusBadRequest, gin.H{"error": "no code in request"})
            return
        }

		googleOAuthConfig := NewGoogleOAuthConfig()

        token, err := googleOAuthConfig.Exchange(context.Background(), code)
        if err != nil {
            requestContext.JSON(http.StatusInternalServerError, gin.H{"error": "token exchange failed"})
            return
        }

        client := googleOAuthConfig.Client(context.Background(), token)
        resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
        if err != nil {
            requestContext.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user info"})
            return
        }
        defer resp.Body.Close()

        var userInfo struct {
            ID            string `json:"id"`
            Email         string `json:"email"`
            VerifiedEmail bool   `json:"verified_email"`
            Name          string `json:"name"`
            Picture       string `json:"picture"`
        }

        if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
            requestContext.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse user info"})
            return
        }

		var userID uint64
		err = database.QueryRow(
			"SELECT id FROM users WHERE google_id = ?",
			userInfo.ID,
		).Scan(&userID)

		res, err := database.Exec(
			`
			INSERT INTO users (name, email, google_id, profile_picture_url)
			VALUES (?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE
				google_id = VALUES(google_id),
				name = VALUES(name),
				profile_picture_url = VALUES(profile_picture_url)
			`, 
			userInfo.Name,
			userInfo.Email,
			userInfo.ID,
			userInfo.Picture,
		)
		if err != nil {
			requestContext.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
			fmt.Println(err)
			return
		}
		id, _ := res.LastInsertId()
		userID = uint64(id)

        // 5. Generate your JWT or session token
        sessionToken, tokenErr := auth.GenerateJWT(userID) // YOU implement this
        if tokenErr != nil {
            requestContext.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate JWT"})
            return
        }

        // 6. Set HttpOnly cookie
        requestContext.SetCookie(
            "token",
            sessionToken,
            3600*24,      // expiration
            "/",
            "localhost",  // change for production domain
            false,        // Set to true if HTTPS
            true,         // HttpOnly
        )

        // 7. Redirect to frontend home
        requestContext.Redirect(http.StatusTemporaryRedirect, "http://localhost:5173/")
    }
}