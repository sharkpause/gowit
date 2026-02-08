package models

// pointers are needed for fields that are nullable
// nil, null
// &"foo", a value
// &"", empty

type Movie struct {
	ID				int			`json:"id"`
	Title 			string		`json:"title"`
	Description		*string 	`json:"description"`
	ReleaseYear 	*int		`json:"release_year"`
}