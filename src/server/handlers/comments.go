package handlers

import (
	"database/sql"
	"fmt"
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
			Content  string  `json:"content" binding:"required,min=2,max=300"`
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

func LikeComment(database *sql.DB) gin.HandlerFunc{ //https://music.apple.com/id/album/likey/1555405141?i=1555405145
	return func(context *gin.Context){
		userID,exists:=context.Get("user_id")
		if !exists {
			context.JSON(401, gin.H{"message": "Unauthorized",})
			return
		}

		var vote models.CommentVote
		if err:= context.ShouldBindJSON(&vote); err != nil{
			context.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid request body",
			})
			return
		}

		if vote.Score != -1 && vote.Score != 1{
			context.JSON(http.StatusBadRequest, gin.H{
				"message": "invalid score: must be the water -1 or 1",
			})
			return
		}

		vote.UserID = userID.(uint64)
		_,err := database.Exec(`
		INSERT INTO comments_vote (comment_id,user_id,score)
		VALUES (
			?,?,?
		)
		ON DUPLICATE KEY UPDATE score = VALUES(score)
		`,
		vote.CommentID,vote.UserID,vote.Score)

		if err != nil {
			context.JSON(http.StatusInternalServerError,gin.H{
				"message": "Database update failed",
			})
			return
		}
		context.JSON(200, gin.H{
			"message": "Added successfullly",
		})
	}
}


func GetCommentByFilmID(database *sql.DB) gin.HandlerFunc{ // this will only list parent and not child
	return func(context *gin.Context) {
		film_id,err := strconv.ParseUint(context.Param("id"),10,64)
		if err != nil{
			context.JSON(http.StatusBadRequest, gin.H{
				"message":"Invalid film id",
			})
			return
		}

		rows,err := database.Query( // 																		reply count
		`SELECT c.id, c.film_id, c.user_id, u.name, c.parent_id, c.content, c.created_at, (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) AS reply_count, COALESCE(SUM(cv.score),0) AS vote_count
		FROM comments c 
		JOIN users u ON u.id = c.user_id
		LEFT JOIN comments_vote cv ON cv.comment_id = c.id
		WHERE film_id = ? AND parent_id IS NULL 
		GROUP BY c.id, c.film_id, c.user_id, u.name, c.parent_id, c.content, c.created_at
		ORDER BY created_at ASC`, film_id)

		if err != nil {
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{
				"message":"Internal server error",
			})
			return 
		}

		defer rows.Close()
		var comments []models.Comment
		for rows.Next() {
			var c models.Comment
			err := rows.Scan(&c.ID,&c.FilmID,&c.UserID,&c.UserName,&c.ParentID,&c.Content,&c.CreatedAt,&c.ReplyCount,&c.VoteCount)
			if err != nil{
				context.JSON(http.StatusInternalServerError, gin.H{
					"message": "Internal server error",
				})
				return 
			}
			comments = append(comments,c)
		}
		if err := rows.Err(); err != nil {
    		context.JSON(http.StatusInternalServerError, gin.H{"message": "Error reading comments"})
    		return
		}

		if comments == nil{
			comments = []models.Comment{}
		}
		context.JSON(http.StatusOK, comments)
	}

}

func GetReplies(database *sql.DB) gin.HandlerFunc{
	return func(context *gin.Context){
		// 我不知道要如何implement这个，是否要在URL上还是通过body。
		// 而且，i dont know if we want to making The “plearse roggin to your account to see the replies or no. ready my ahhsss to be asked for revision
		parent_id,err := strconv.ParseUint(context.Param("id"),10,64)
		if err != nil{
			context.JSON(http.StatusBadRequest, gin.H{
				"message":"Invalid comment_id",
			})
			return
		}
		// just realised, is returning film_id in this case will benefit have anything good?
		rows,err := database.Query(
		`SELECT c.id, c.film_id, c.user_id, u.name, c.parent_id, c.content, c.created_at, COALESCE(SUM(cv.score),0) AS vote_count
		FROM comments c 
		JOIN users u ON u.id = c.user_id
		LEFT JOIN comments_vote cv ON cv.comment_id = c.id
		WHERE c.parent_id = ? 
		GROUP BY c.id, c.film_id, c.user_id, u.name, c.parent_id, c.content, c.created_at
		ORDER BY created_at ASC`, parent_id) // given the parent_id IS nullable, please on models.comment.parentid, please. make it a pointer
		if err != nil {
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{
				"message":"Internal server error",
			})
			return 
		}

		defer rows.Close()
		var comments []models.Comment
		for rows.Next() {
			var c models.Comment
			err := rows.Scan(&c.ID,&c.FilmID,&c.UserID,&c.UserName,&c.ParentID,&c.Content,&c.CreatedAt,&c.VoteCount)
			if err != nil{
				context.JSON(http.StatusInternalServerError, gin.H{
					"message": "Internal server error",
				})
				return 
			}
			comments = append(comments,c)
		}
		if err := rows.Err(); err != nil {
    		context.JSON(http.StatusInternalServerError, gin.H{"message": "Error reading comments"})
    		return
		}
		if comments == nil{
			comments = []models.Comment{}
		}
		context.JSON(http.StatusOK, comments)
	}
}