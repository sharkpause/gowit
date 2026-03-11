package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/models"
)

func CreateComment(database *sql.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		filmID, err := strconv.ParseUint(context.Param("id"), 10, 64)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": "invalid film id"})
			return
		}
		userIDVal, exists := context.Get("user_id")
		if !exists {
			context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized user"})
			return
		}
		userID := userIDVal.(uint64)
		var userInput struct {
			ParentID *uint64 `json:"parent_id,omitempty"`
			Content  string  `json:"content"`
		}
		if err:=context.ShouldBindJSON(&userInput); err!=nil{
			context.JSON(http.StatusBadRequest,gin.H{
				"message": "Invalid user input",
			})
			return
		}
		if userInput.Content == "" {
			context.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid user input, content cannot be empty",
			})
			return
		}
		comment:=models.Comment{
			FilmID: filmID,
			UserID: userID,
			ParentID: userInput.ParentID,
			Content: userInput.Content,
		}
		result,err:=database.Exec(
		`INSERT INTO comments (film_id,user_id,parent_id,content) VALUES (?,?,?,?)`,
		comment.FilmID,comment.UserID,comment.ParentID,comment.Content,)
		if err != nil {
			context.JSON(500,gin.H{
				"message": "Internal server error",
			})
		return
		}
		id,_:=result.LastInsertId()
		context.JSON(http.StatusOK, gin.H{
			"comment_id":id,
		})
	}
}
