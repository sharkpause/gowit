package models

import (
	"time"
)

type Favorite struct {
	ID				uint64     	`json:"id"`
	FilmID			uint64		`json:"film_id"`
	// UserID		uint64		`json:"user_id"`
	Notes			string		`json:"notes"`
	Title			string		`json:"title"`
	Description		string		`json:"description"`
	PosterImageURL	*string		`json:"poster_image_url"`
	AverageRating	*float64	`json:"average_rating"`
	ReleaseYear		*int64		`json:"release_year"`
	ReleaseDate		*time.Time	`json:"release_date"`
	Runtime			*int64		`json:"runtime"`
}