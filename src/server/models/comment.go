package models

import "time"

type Comment struct {
	ID          uint64    `json:"id"`
	FilmID      uint64    `json:"film_id"`
	UserID      *uint64    `json:"user_id"`
	UserName    string    `json:"username"`
	ProfilePict string    `json:"profile_picture_url"`
	ParentID    *uint64   `json:"parent_id,omitempty"`
	Content     string    `json:"content" binding:"required,min=2	,max=300"`
	CreatedAt   time.Time `json:"created_at"`
	ReplyCount  int       `json:"reply_count,omitempty"`
	VoteCount   int       `json:"vote_count"`
	VoteState   int8      `json:"vote_state"`
	IsOwner     bool      `json:"is_owner"` // the struct is getting bigger, might refactor it LATER although its not going to happen anyway
	IsDeleted   bool      `json:"is_deleted"`
	IsUpdated   bool      `json:"is_updated"`
}
type CommentVote struct {
	CommentID uint64 `json:"comment_id"`
	UserID    uint64 `json:"-"`
	Score     int8   `json:"score"`
}
