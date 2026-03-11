package models

import "time"

type Comment struct {
	ID        uint64    `json:"id"`
	FilmID    uint64    `json:"film_id"`
	UserID    uint64    `json:"user_id"`
	ParentID  *uint64   `json:"parent_id,omitempty"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}
type CommentVote struct {
	CommentID uint64 `json:"comment_id"`
	UserID    uint64 `json:"user_id"`
	Score     int8   `json:"score"`
}
