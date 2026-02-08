package models

type Movie struct {
	ID				int		`json:"id"`
	Title 			string	`json:"title"`
	Description		*string 	`json:"description"`
	ReleaseYear 	*int		`json:"release_year"`
}