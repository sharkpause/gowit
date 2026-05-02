package handlers

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/models"
)

type CheckRequest struct {
	Text string `json:"text"`
}

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
			Content  string  `json:"content" binding:"required,min=1,max=300"`
		}
		if err:=context.ShouldBindJSON(&userInput); err!=nil{
			fmt.Println(err)
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
		comment := models.Comment{
			FilmID:   filmID,
			UserID:   &userID,
			ParentID: userInput.ParentID,
			Content:  userInput.Content,
		}
		result, err := database.Exec(
			`INSERT INTO comments (film_id,user_id,parent_id,content) VALUES (?,?,?,?)`,
			comment.FilmID, comment.UserID, comment.ParentID, comment.Content)
		if err != nil {
			fmt.Println(err)
			
			context.JSON(500,gin.H{
				"message": "Internal server error",
			})
			return
		}
		id, _ := result.LastInsertId()
		context.JSON(http.StatusOK, gin.H{
			"comment_id": id,
		})
	}
}

func LikeComment(database *sql.DB) gin.HandlerFunc { //https://music.apple.com/id/album/likey/1555405141?i=1555405145
	return func(context *gin.Context) {
		userID, exists := context.Get("user_id")
		if !exists {
			context.JSON(401, gin.H{"message": "Unauthorized"})
			return
		}
		var vote models.CommentVote
		if err := context.ShouldBindJSON(&vote); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid request body",
			})
			return
		}

		vote.UserID = userID.(uint64)
		if vote.Score == 0 {
			_, err := database.Exec(`
			DELETE FROM comments_vote WHERE comment_id = ? AND user_id = ?
			`, vote.CommentID, vote.UserID)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{
					"message": "Database deletion failure",
				})
				return
			}
			context.JSON(http.StatusOK, gin.H{
				"message": "Unvoted",
			})
			return
		}
		if vote.Score != -1 && vote.Score != 1 {
			context.JSON(http.StatusBadRequest, gin.H{
				"message": "invalid score: must be the water -1 or 1",
			})
			return
		}
		_, err := database.Exec(`
		INSERT INTO comments_vote (comment_id,user_id,score)
		VALUES (
			?,?,?
		)
		ON DUPLICATE KEY UPDATE score = VALUES(score)
		`,
			vote.CommentID, vote.UserID, vote.Score)

		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"message": "Database update failed",
			})
			fmt.Println(err)
			return
		}
		context.JSON(200, gin.H{
			"message": "Added successfullly",
		})
	}
}

func GetCommentByFilmID(database *sql.DB) gin.HandlerFunc { // this will only list parent and not child
	return func(context *gin.Context) {
		film_id, err := strconv.ParseUint(context.Param("id"), 10, 64)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid film id",
			})
			return
		}
		sort := "created_at"
		order := "ASC"
		if sortParam := context.Query("sort"); sortParam != "" {
			sortParam = strings.ToLower(sortParam)
			switch sortParam {
			case "created_at", "vote_count", "reply_count":
				sort = sortParam
			default:
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid sort parameter",
				})
				return
			}
		}
		if orderParam := context.Query("order"); orderParam != "" {
			orderParam = strings.ToUpper(orderParam)
			switch orderParam {
			case "ASC", "DESC":
				order = orderParam
			default:
				context.JSON(http.StatusBadRequest, gin.H{
					"errro": "invalid order parameter",
				})
				return
			}
		}
		userIDVal, exists := context.Get("user_id")
		var userID uint64
		if exists {
			userID = userIDVal.(uint64)
		}
		var rows *sql.Rows
		if !exists {
			query := fmt.Sprintf(
				`
			SELECT c.id, 
			c.film_id, 
			CASE WHEN c.is_deleted = TRUE THEN NULL ELSE c.user_id END AS user_id, 
			CASE WHEN c.is_deleted = TRUE THEN '[deleted]' ELSE u.name END AS username, 
			CASE WHEN c.is_deleted = TRUE THEN 'https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg' ELSE u.profile_picture_url END AS profile_picture_url, 
			c.parent_id, 
			CASE WHEN c.is_deleted = TRUE THEN '[User deleted the comment]' ELSE c.content END AS content,
			c.created_at, 
			(SELECT COUNT(*) FROM comments WHERE parent_id = c.id) AS reply_count, 
			COALESCE(SUM(cv.score),0) AS vote_count,
			c.is_updated,
			c.is_deleted
			FROM comments c 
			JOIN users u ON u.id = c.user_id
			LEFT JOIN comments_vote cv ON cv.comment_id = c.id
			WHERE film_id = ? AND parent_id IS NULL 
			GROUP BY c.id, c.film_id, c.user_id, u.name,u.profile_picture_url, c.parent_id, c.content, c.created_at,c.is_updated,c.is_deleted
			ORDER BY %s %s`, sort, order)
			rows, err = database.Query(query, film_id)
		} else {
			query := fmt.Sprintf(
				`
			SELECT c.id, 
			c.film_id, 
			CASE WHEN c.is_deleted = TRUE THEN NULL ELSE c.user_id END AS user_id, 
			CASE WHEN c.is_deleted = TRUE THEN '[deleted]' ELSE u.name END AS username, 
			CASE WHEN c.is_deleted = TRUE THEN 'https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg' ELSE u.profile_picture_url END AS profile_picture_url, 
			c.parent_id, 
			CASE WHEN c.is_deleted = TRUE THEN '[User deleted the comment]' ELSE c.content END AS content,
			c.created_at, 
			(SELECT COUNT(*) FROM comments WHERE parent_id = c.id) AS reply_count, 
			COALESCE(SUM(cv.score),0) AS vote_count, 
			COALESCE(MAX(CASE WHEN cv.user_id = ? THEN cv.score END),0) AS vote_state, 
			(CASE WHEN c.user_id = ? THEN 1 ELSE 0 END) AS is_owner,
			c.is_updated,
			c.is_deleted
			FROM comments c 
			JOIN users u ON u.id = c.user_id
			LEFT JOIN comments_vote cv ON cv.comment_id = c.id
			WHERE film_id = ? AND parent_id IS NULL 
			GROUP BY c.id, c.film_id, c.user_id, u.name,u.profile_picture_url, c.parent_id, c.content, c.created_at,c.is_updated,c.is_deleted
			ORDER BY %s %s
				`, sort, order)
			rows, err = database.Query(query, userID, userID, film_id)
		}

		
		if err != nil {
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{
				"message": "Internal server error",
			})
			return
		}

		defer rows.Close()
		var comments []models.Comment
		for rows.Next() {
			var c models.Comment
			if !exists {
				err = rows.Scan(&c.ID, &c.FilmID, &c.UserID, &c.UserName, &c.ProfilePict, &c.ParentID, &c.Content, &c.CreatedAt, &c.ReplyCount, &c.VoteCount, &c.IsUpdated, &c.IsDeleted)
			} else {
				err = rows.Scan(&c.ID, &c.FilmID, &c.UserID, &c.UserName, &c.ProfilePict, &c.ParentID, &c.Content, &c.CreatedAt, &c.ReplyCount, &c.VoteCount, &c.VoteState, &c.IsOwner, &c.IsUpdated, &c.IsDeleted)
			}
			if err != nil {
				fmt.Println(err)
				context.JSON(http.StatusInternalServerError, gin.H{
					"message": "Internal server error",
				})
				return
			}
			comments = append(comments, c)
		}
		if err := rows.Err(); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"message": "Error reading comments"})
			return
		}
		var commentCount int
		if err =database.QueryRow("SELECT COUNT(*) FROM comments WHERE film_id = ? AND is_deleted = 0",film_id).Scan(&commentCount); err != nil{
			fmt.Println(err)
		}
		if comments == nil {
			comments = []models.Comment{}
		}
		context.JSON(http.StatusOK ,gin.H{
			"comments": comments,
			"comment_count": commentCount,
		})
	}

}

func GetReplies(database *sql.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		// 我不知道要如何implement这个，是否要在URL上还是通过body。
		// 而且，i dont know if we want to making The “plearse roggin to your account to see the replies or no. ready my ahhsss to be asked for revision
		parent_id, err := strconv.ParseUint(context.Param("id"), 10, 64)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid comment_id",
			})
			return
		}
		userIDVal, exists := context.Get("user_id")
		var userID uint64
		if exists {
			userID = userIDVal.(uint64)
		}
		var rows *sql.Rows
		// just realised, is returning film_id in this case will benefit have anything good?
		if !exists {
			rows, err = database.Query(
				`
				SELECT c.id, 
			c.film_id, 
			CASE WHEN c.is_deleted = TRUE THEN NULL ELSE c.user_id END AS user_id, 
			CASE WHEN c.is_deleted = TRUE THEN '[deleted]' ELSE u.name END AS username, 
			CASE WHEN c.is_deleted = TRUE THEN 'https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg' ELSE u.profile_picture_url END AS profile_picture_url, 
			c.parent_id, 
			CASE WHEN c.is_deleted = TRUE THEN '[User deleted the comment]' ELSE c.content END AS content,
			c.created_at, 
			COALESCE(SUM(cv.score),0) AS vote_count,
			c.is_updated,
			c.is_deleted
			FROM comments c 
			JOIN users u ON u.id = c.user_id
			LEFT JOIN comments_vote cv ON cv.comment_id = c.id
			WHERE c.parent_id = ? 
			GROUP BY c.id, c.film_id, c.user_id, u.name,u.profile_picture_url, c.parent_id, c.content, c.created_at,c.is_updated,c.is_deleted
			ORDER BY created_at ASC`, parent_id) // given the parent_id IS nullable, please on models.comment.parentid, please. make it a pointer
		} else {
			rows, err = database.Query(
				`
				SELECT c.id, 
			c.film_id, 
			CASE WHEN c.is_deleted = TRUE THEN NULL ELSE c.user_id END AS user_id, 
			CASE WHEN c.is_deleted = TRUE THEN '[deleted]' ELSE u.name END AS username, 
			CASE WHEN c.is_deleted = TRUE THEN 'https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg' ELSE u.profile_picture_url END AS profile_picture_url, 
			c.parent_id, 
			CASE WHEN c.is_deleted = TRUE THEN '[User deleted the comment]' ELSE c.content END AS content,
			c.created_at, 
			COALESCE(SUM(cv.score),0) AS vote_count, 
			COALESCE(MAX(CASE WHEN cv.user_id = ? THEN cv.score END),0) AS vote_state, 
			(CASE WHEN c.user_id = ? THEN 1 ELSE 0 END) AS is_owner,
			c.is_updated,
			c.is_deleted
			FROM comments c 
			JOIN users u ON u.id = c.user_id
			LEFT JOIN comments_vote cv ON cv.comment_id = c.id
			WHERE c.parent_id = ? 
			GROUP BY c.id, c.film_id, c.user_id, u.name,u.profile_picture_url, c.parent_id, c.content, c.created_at,c.is_updated,c.is_deleted
			ORDER BY created_at ASC`, userID, userID, parent_id)

		}
		if err != nil {
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{
				"message": "Internal server error",
			})
			return
		}

		defer rows.Close()
		var comments []models.Comment
		for rows.Next() {
			var c models.Comment
			if !exists {
				err = rows.Scan(&c.ID, &c.FilmID, &c.UserID, &c.UserName, &c.ProfilePict, &c.ParentID, &c.Content, &c.CreatedAt, &c.VoteCount,&c.IsUpdated,&c.IsDeleted)
			} else {
				err = rows.Scan(&c.ID, &c.FilmID, &c.UserID, &c.UserName, &c.ProfilePict, &c.ParentID, &c.Content, &c.CreatedAt, &c.VoteCount, &c.VoteState, &c.IsOwner,&c.IsUpdated,&c.IsDeleted)
			}
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{
					"message": "Internal server error",
				})
				return
			}
			comments = append(comments, c)
		}
		if err := rows.Err(); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"message": "Error reading comments"})
			return
		}
		if comments == nil {
			comments = []models.Comment{}
		}
		context.JSON(http.StatusOK, comments)
	}
}

var ErrCommentDeleted = errors.New("Deleted") // this is to return the error used in userAuthorizedToMakechangesThisNamingISFuck. comment was deleted and the action wont be proceed.

func allowedToEdit(database *sql.DB, userID uint64, commentID uint64) (bool, error) {
	var ownerID uint64
	var isDeleted bool

	err := database.QueryRow(`SELECT user_id,is_deleted FROM comments WHERE id =?`, commentID).Scan(&ownerID, &isDeleted)
	if err != nil {
		return false, err
	}
	if ownerID != userID {
		return false, nil
	}
	if isDeleted == true {
		return false, ErrCommentDeleted
	}
	return true, nil

}
func EditComment(database *sql.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		// i dont know how to parse the commentid, lets just assume
		commentID, err := strconv.ParseUint(context.Param("id"), 10, 64)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"message": "invalid comment id"})
			return
		}
		var input struct {
			Content string `json:"content" binding:"required,min=1,max=300"`
		}
		userIDVal, exists := context.Get("user_id")
		if !exists {
			context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized user"})
			return
		}
		userID := userIDVal.(uint64)
		if err := context.ShouldBindJSON(&input); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid user input",
			})
			return
		}
		if isOwner, err := allowedToEdit(database, userID, commentID); !isOwner && err == nil {
			context.JSON(http.StatusForbidden, gin.H{
				"message": "Forbidden to edit comment, kamu bukan orangnya",
			})
			return
		} else if err == ErrCommentDeleted {
			context.JSON(http.StatusGone, gin.H{
				"message": "content was unavailable",
			})
			return
		} else if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"message": "Internal Status Error",
			})
			return
		}
		if _, err := database.Exec(`UPDATE comments SET content = ?,is_updated = TRUE WHERE id = ?`, input.Content, commentID); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"message": "Database update failed"})
			return
		}

		context.JSON(http.StatusOK, gin.H{
			"message": "Comment has been updated",
		})
	}

}

func DeleteComment(database *sql.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		commentID, err := strconv.ParseUint(context.Param("id"), 10, 64)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"message": "invalid comment id"})
			return
		}
		userIDVal, exists := context.Get("user_id")
		if !exists {
			context.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized user"})
			return
		}
		userID := userIDVal.(uint64)
		if isOwner, err := allowedToEdit(database, userID, commentID); !isOwner && err == nil {
			context.JSON(http.StatusForbidden, gin.H{
				"message": "Forbidden to edit comment, kamu bukan orangnya",
			})
			return
		} else if err == ErrCommentDeleted {
			context.JSON(http.StatusGone, gin.H{
				"message": "content was unavailable",
			})
			return
		} else if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"message": "Internal Status Error",
			})
			return
		}
		if _, err := database.Exec(`UPDATE comments SET is_deleted = TRUE WHERE id = ?`, commentID); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"message": "Database update failed"})
			return
		}

		context.JSON(http.StatusOK, gin.H{
			"message": "Comment has been deleted",
		})

	}

}

func normalizeText(input string) string {
	var builder strings.Builder

	for _, char := range input {
		if unicode.IsLetter(char) || unicode.IsSpace(char) {
			builder.WriteRune(unicode.ToLower(char))
		} else {
			// replace everything else with space
			builder.WriteRune(' ')
		}
	}

	return builder.String()
}

func tokenize(input string) []string {
	return strings.Fields(input)
}

func containsRestrictedWords(input string, restrictedWordSet map[string]struct{}) bool {
	normalized := normalizeText(input)
	tokens := tokenize(normalized)

	for _, token := range tokens {
		if _, exists := restrictedWordSet[token]; exists {
			return true
		}
	}

	return false
}

func CheckWord(restrictedWordSet map[string]struct{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		var requestBody struct {
			Text string `json:"text"`
		}

		if err := c.ShouldBindJSON(&requestBody); err != nil {
			c.JSON(400, gin.H{"error": "invalid request"})
			return
		}

		blocked := containsRestrictedWords(requestBody.Text, restrictedWordSet)

		c.JSON(200, gin.H{
			"blocked": blocked,
		})
	}
}