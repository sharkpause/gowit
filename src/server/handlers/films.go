package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sharkpause/gowit/models"
)

type Scanner interface {
	Scan(dest ...any) error
}

type favoriteRequest struct {
	FilmID		uint64		`json:"film_id"`
	Notes		string		`json:"notes"`
}

func scanFilm(database *sql.DB, row Scanner) (*models.Film, error) {
	var film models.Film

	var description, posterURL, trailerURL, tagline *string
	var releaseYear, runtime *int64
	var averageRating *float64
	var popularity uint8

	err := row.Scan(
		&film.ID,
		&film.Title,
		&description,
		&releaseYear,
		&posterURL,
		&trailerURL,
		&averageRating,
		&popularity,
		&runtime,
		&tagline,
	)
	if err != nil {
		return nil, err
	}

	film.Description = description
	film.ReleaseYear = releaseYear
	film.PosterImageURL = posterURL
	film.TrailerURL = trailerURL
	film.AverageRating = averageRating
	film.Popularity = popularity
	film.Runtime = runtime
	film.Tagline = tagline

	genres := []string{}
	rows, err := database.Query(`
		SELECT g.name
		FROM film_genres fg
		JOIN genres g ON fg.genre_id = g.id
		WHERE fg.film_id = ?`, film.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var name string
			rows.Scan(&name)
			genres = append(genres, name)
		}
	}
	fmt.Println(genres)
	film.Genres = genres

	companies := []string{}
	rows, err = database.Query(`
		SELECT pc.name
		FROM film_production_companies fpc
		JOIN production_companies pc ON fpc.company_id = pc.id
		WHERE fpc.film_id = ?`, film.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var name string
			rows.Scan(&name)
			companies = append(companies, name)
		}
	}
	film.ProductionCompanies = companies

	countries := []string{}
	rows, err = database.Query(`
		SELECT pc.name
		FROM film_production_countries fpc
		JOIN production_countries pc ON fpc.country_code = pc.iso_code
		WHERE fpc.film_id = ?`, film.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var name string
			rows.Scan(&name)
			countries = append(countries, name)
		}
	}
	film.ProductionCountries = countries

	casts := []string{}
	rows, err = database.Query(`
		SELECT actor_name
		FROM film_casts
		WHERE film_id = ?
		ORDER BY cast_order ASC
		LIMIT 10`, film.ID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var name string
			rows.Scan(&name)
			casts = append(casts, name)
		}
	}
	film.Casts = casts

	return &film, nil
}

func GetFilms(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		page := 1
		limit := 10
		sort := "id"
		order := "ASC"

		if pageParam := context.Query("page"); pageParam != "" {
			pageQueryValue, err := strconv.Atoi(pageParam)
			
			if err != nil {
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid page parameter",
				})
				return
			}
			
			if pageQueryValue < 1 {
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "page must be >= 1",
				})
				return
			}

			page = pageQueryValue
		}
		
		if limitParam := context.Query("limit"); limitParam != "" {
			limitQueryValue, err := strconv.Atoi(limitParam)

			if err != nil {
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid limit parameter",
				})
				return
			}
			if limitQueryValue < 1 || limitQueryValue > 100 {
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "limit must be between 1 and 100",
				})
				return
			}

			limit = limitQueryValue
		}
		
		if sortParam := context.Query("sort"); sortParam != "" {
			sortParam = strings.ToLower(sortParam)
			
			switch sortParam {
			case "id", "title", "description", "release_year", "average_rating", "popularity":
				sort = sortParam
			default:
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid sort parameter",
				})
				return
			}
		}
		
		if orderParam := context.Query("order"); orderParam != "" {
			orderParam = strings.ToUpper(orderParam)

			switch orderParam {
			case "ASC", "DESC":
				order = orderParam
			default:
				context.JSON(http.StatusBadRequest, gin.H{
					"error": "invalid order parameter",
				})
				return
			}
		}

		conditions := []string{}
		args := []any{}

		if yearParam := context.Query("year"); yearParam != "" {
			year, err := strconv.Atoi(yearParam)
			if err == nil {
				conditions = append(conditions, "release_year = ?")
				args = append(args, year)
			}
		}

		if minRatingParam := context.Query("min_rating"); minRatingParam != "" {
			rating, err := strconv.ParseFloat(minRatingParam, 64)
			if err == nil {
				conditions = append(conditions, "average_rating >= ?")
				args = append(args, rating)
			}
		}

		if searchParam := context.Query("search"); searchParam != "" {
			conditions = append(conditions, "(title LIKE ? OR description LIKE ?)")
			likePattern := "%" + searchParam + "%"
			args = append(args, likePattern, likePattern)
		}

		where := ""
		if len(conditions) > 0 {
			where = "WHERE " + strings.Join(conditions, " AND ")
		}

		offset := (page - 1) * limit

		queryString := fmt.Sprintf(
			`SELECT id, title, description, release_year, poster_image_url, trailer_url, average_rating, popularity, runtime, tagline FROM films
			%s
			ORDER BY %s %s
			LIMIT ? OFFSET ?`,
			where, sort, order,
		)
		args = append(args, limit, offset)

		rows, err := database.Query(queryString, args...)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		films := []models.Film{}
		for rows.Next() {
			film, err := scanFilm(database, rows)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			films = append(films, *film)
		}

		context.JSON(http.StatusOK, gin.H{
			"films":    films,
			"metadata": gin.H{
				"amount": len(films),
			},
		})
	}
}

func GetFilmByID(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		filmID, err := strconv.ParseUint(context.Param("id"), 10, 64)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": "invalid film id"})
			return
		}

		row := database.QueryRow(`
			SELECT id, title, description, release_year, poster_image_url, trailer_url,
			       average_rating, popularity, runtime, tagline
			FROM films
			WHERE id = ?`, filmID)

		film, err := scanFilm(database, row)
		if err == sql.ErrNoRows {
			context.JSON(http.StatusNotFound, gin.H{"error": "film not found"})
			return
		}
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		context.JSON(http.StatusOK, film)
	}
}

func GetTrendingFilms(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		const defaultLimit = 10
		limit := defaultLimit

		if limitParam := context.Query("limit"); limitParam != "" {
			limitQuery, err := strconv.Atoi(limitParam)
			if err == nil && limitQuery > 0 && limitQuery <= 100 {
				limit = limitQuery
			}
		}

		currentYear := time.Now().Year()

		query := `
			SELECT id, title, description, release_year, poster_image_url, trailer_url,
				   average_rating, popularity, runtime, tagline
			FROM films
			ORDER BY (? - release_year * 2.0 + popularity * 0.5 + COALESCE(average_rating,0) * 1.0) ASC
			LIMIT ?`

		rows, err := database.Query(query, currentYear, limit)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("db error: %s", err)})
			return
		}
		defer rows.Close()

		var films []models.Film

		for rows.Next() {
			var film models.Film
			err := rows.Scan(
				&film.ID,
				&film.Title,
				&film.Description,
				&film.ReleaseYear,
				&film.PosterImageURL,
				&film.TrailerURL,
				&film.AverageRating,
				&film.Popularity,
				&film.Runtime,
				&film.Tagline,
			)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			films = append(films, film)
		}

		context.JSON(http.StatusOK, gin.H{
			"films":    films,
			"metadata": gin.H{
				"amount": len(films),
			},
		})
	}
}

func AddFilmToFavorite(database *sql.DB) func(*gin.Context){ // protected
	return func(context *gin.Context){
		var request favoriteRequest
		if err := context.ShouldBindJSON(&request); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid request body",
			})
			return
		}
		
		userID, exists := context.Get("user_id")
		if !exists{
			context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"}) // will revised error code later
			return
		}

		fmt.Println(userID, request.Notes, request.FilmID)
		_, err := database.Exec(
			"INSERT INTO favorites (user_id, notes, film_id) VALUES (?, ?, ?)",
			userID, request.Notes, request.FilmID,
		)

		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "internal database error"}) // idk the code, will fix this later
			fmt.Println(err)
			return
		}

		context.JSON(
			http.StatusCreated,
			gin.H{
				"message": "successfully add film to favorite",
				"film_id" : request.FilmID,
				"user_id": userID,
			},
		)
	}
}

func DeleteFilmFromFavorite(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		filmID, err := strconv.Atoi(context.Param("film_id"))
		if err != nil {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "error while reading film id"})
			return
		}

		userID, exists := context.Get("user_id")
		if !exists {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"})
			return
		}

		query := `
			DELETE FROM favorites WHERE user_id=? and film_id=?
		`

		result, err := database.Exec(query, userID, filmID)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("db error: %s", err)})
			return
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal db error",
			})
			fmt.Println(err)
			return
		}

		if rowsAffected == 0 {
			context.JSON(http.StatusNotFound, gin.H{
				"error": "favorite film not found",
			})
			return
		}

		context.JSON(http.StatusOK, gin.H{
			"message": "successfully deleted film from favorite",
		})
	}
}

func GetFavorites(database *sql.DB) func(*gin.Context) {
	return func(context *gin.Context) {
		userID, exists := context.Get("user_id")
		if !exists{
			context.JSON(http.StatusUnauthorized, gin.H{"error": "user unauthorized"}) // will revised error code later
			return
		}

		query := `
			SELECT
				favorite.id,
				favorite.notes,
				film.id,
				film.title,
				film.description,
				film.poster_image_url,
				film.average_rating,
				film.release_year,
				film.runtime
			FROM favorites favorite
			JOIN films film
			ON favorite.film_id = film.id
			WHERE favorite.user_id = ?
		`

		rows, err := database.Query(query, userID)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("db error: %s", err)})
			return
		}

		defer rows.Close()

		var favorites []models.Favorite

		for rows.Next() {
			var favorite models.Favorite
			err := rows.Scan(
				&favorite.ID,
				&favorite.Notes,
				&favorite.FilmID,
				&favorite.Title,
				&favorite.Description,
				&favorite.PosterImageURL,
				&favorite.AverageRating,
				&favorite.ReleaseYear,
				&favorite.Runtime,
			)

			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			favorites = append(favorites, favorite)
		}

		context.JSON(http.StatusOK, gin.H{
			"favorites": favorites,
			"metadata":	gin.H{
				"amount": len(favorites),
			},
		})
	}
}

// TODO: Make random route
