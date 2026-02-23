package models

type Favorite struct {
	ID			uint64     	`json:"id"`
	FilmID		uint64		`json:"film_id"`
	// UserID		uint64		`json:"user_id"`
	Notes		string		`json:"notes"`
}