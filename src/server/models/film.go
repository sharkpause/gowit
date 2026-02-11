package models

// pointers are needed for fields that are nullable
// nil, null
// &"foo", a value
// &"", empty

type Film struct {
	ID				uint64		`json:"id"`
	Title 			string		`json:"title"`
	Description		*string 	`json:"description"`
	ReleaseYear 	*int64		`json:"release_year"`
}