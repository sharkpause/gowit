# API documentation /api

All APIs start with `/api` right after the root URL (e.g., `localhost:8080/api`).

## /api/films

### GET

* ### `/api/films`

Gets all films from the database with full details.

#### Success response example (200)

```json
{
  "films": [
    {
      "id": 11,
      "title": "The Godfather",
      "description": "Spanning the years 1945 to 1955...",
      "release_year": 1972,
      "poster_image_url": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "trailer_url": "https://www.youtube.com/watch?v=tlFyyzXVEMk",
      "average_rating": 8.7,
      "popularity": 39,
      "runtime": 175,
      "tagline": "An offer you can't refuse.",
      "genres": ["Drama", "Crime"],
      "production_companies": ["Paramount Pictures", "Alfran Productions"],
      "production_countries": ["United States of America"],
      "casts": [
        "Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall",
        "Richard S. Castellano", "Diane Keaton", "Talia Shire",
        "Gianni Russo", "Sterling Hayden", "John Marley"
      ]
    }
  ],
  "metadata": {
    "amount": 1
  }
}
```

#### Error response example (400)

```json
{
  "error": "invalid page parameter"
}
```

### Query parameters

#### Pagination

| Name  | Type | Default | Rules                     |
| ----- | ---- | ------- | ------------------------- |
| page  | int  | 1       | Must be ≥ 1               |
| limit | int  | 10      | Must be between 1 and 100 |

#### Examples:

```
/api/films?page=2  
/api/films?limit=10  
```

#### Sorting

| Name  | Type | Default | Description              |
| ----- | ---- | ------- | ------------------------ |
| sort  | enum | id      | Field to sort by         |
| order | enum | ASC     | Sort order (ASC or DESC) |

Available for `sort`: id, title, description, release_year, average_rating, popularity, runtime  
Available for `order`: asc, desc

#### Examples:

```
/api/films?sort=title  
/api/films?order=desc  
```

#### Filtering

| Name       | Type   | Description                                     |
| ---------- | ------ | ----------------------------------------------- |
| year       | int    | Filters films by exact release year             |
| min_rating | float  | Filters films with average_rating ≥ value       |
| search     | string | Case-insensitive search on title OR description |

#### Examples:

```
/api/films?year=2014  
/api/films?min_rating=8.5  
/api/films?search=space  
```

---

### `/api/films/:id`

Gets a single film by ID, with full details.

#### Success response example (200)

```json
{
  "id": 11,
  "title": "The Godfather",
  "description": "Spanning the years 1945 to 1955...",
  "release_year": 1972,
  "poster_image_url": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  "trailer_url": "https://www.youtube.com/watch?v=tlFyyzXVEMk",
  "average_rating": 8.7,
  "popularity": 39,
  "runtime": 175,
  "tagline": "An offer you can't refuse.",
  "genres": ["Drama", "Crime"],
  "production_companies": ["Paramount Pictures", "Alfran Productions"],
  "production_countries": ["United States of America"],
  "casts": [
    "Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall",
    "Richard S. Castellano", "Diane Keaton", "Talia Shire",
    "Gianni Russo", "Sterling Hayden", "John Marley"
  ]
}
```

#### Error response example (400)

```json
{
  "error": "invalid film id"
}
```