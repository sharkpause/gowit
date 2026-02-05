package models

type Movie struct {
	ID				int		`json:"id"`
	Title 			string	`json:"title"`
	ReleaseYear 	int		`json:"release_year"`
}