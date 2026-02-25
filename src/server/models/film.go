package models

// pointers are needed for fields that are nullable
// nil, null
// &"foo", a value
// &"", empty

// type Film struct {
// 	ID				uint64		`json:"id"`
// 	Title 			string		`json:"title"`
// 	Description		*string 	`json:"description"`
// 	ReleaseYear 	*int64		`json:"release_year"`
// 	PosterImageURL 	*string		`json:"profile_image_url"`
// 	TrailerURL 		*string		`json:"trailer_url"`
// 	AverageRating	*float64	`json:"average_rating"`
// 	Popularity		uint8		`json:"popularity"`
// }

type Film struct {
	ID                    uint64     	`json:"id"`
	Title                 string     	`json:"title"`
	Description           *string    	`json:"description"`
	ReleaseYear           *int64     	`json:"release_year"`
	PosterImageURL        *string    	`json:"poster_image_url"`
	TrailerURL            *string    	`json:"trailer_url"`
	AverageRating         *float64   	`json:"average_rating"`
	Popularity            uint8   		`json:"popularity"`
	Runtime               *int64     	`json:"runtime"`
	Tagline               *string    	`json:"tagline"`
	Genres                []string   	`json:"genres"`
	ProductionCompanies   []string   	`json:"production_companies"`
	ProductionCountries   []string   	`json:"production_countries"`
	Casts                 []string   	`json:"casts"`
}