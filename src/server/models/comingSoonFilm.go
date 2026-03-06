package models

import "time"

type ComingSoonFilm struct {
	Title			string			`json:"title"`
	ThumbnailURL	*string			`json:"thumbnail_url"`
	Runtime			*int64			`json:"runtime"`
	ReleaseDate		*time.Time		`json:"release_date"`
	TrailerURL		*string			`json:"trailer_url"`
	TrailerDuration *uint16			`json:"trailer_duration"`
}
