# API Documentation

All endpoints are prefixed with:

```
/api
```

Example:

```
http://localhost:8080/api/films
```

---

# Films

## GET `/api/films`

Returns a paginated list of films with full details.

### Success Response (200)

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
        "Marlon Brando",
        "Al Pacino",
        "James Caan",
        "Robert Duvall"
      ]
    }
  ],
  "metadata": {
    "amount": 1
  }
}
```

### Error Response (400)

```json
{
  "error": "invalid page parameter"
}
```

---

## Query Parameters

### Pagination

| Name  | Type | Default | Rules                     |
| ----- | ---- | ------- | ------------------------- |
| page  | int  | 1       | Must be ≥ 1               |
| limit | int  | 10      | Must be between 1 and 100 |

**Examples**

```
/api/films?page=2
/api/films?limit=20
```

---

### Sorting

| Name  | Type | Default | Description              |
| ----- | ---- | ------- | ------------------------ |
| sort  | enum | id      | Field to sort by         |
| order | enum | asc     | Sort order (asc or desc) |

Available `sort` values:

```
id, title, description, release_year, average_rating, popularity, runtime
```

**Examples**

```
/api/films?sort=title
/api/films?sort=average_rating&order=desc
```

---

### Filtering

| Name       | Type   | Description                                     |
| ---------- | ------ | ----------------------------------------------- |
| year       | int    | Filter by exact release year                    |
| min_rating | float  | Filter films with average_rating ≥ value        |
| search     | string | Case-insensitive search on title or description |

**Examples**

```
/api/films?year=2014
/api/films?min_rating=8.5
/api/films?search=space
```

---

## GET `/api/films/:id`

Returns a single film by ID with full details.

### Success Response (200)

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
  "production_companies": ["Paramount Pictures"],
  "production_countries": ["United States of America"],
  "casts": ["Marlon Brando", "Al Pacino"]
}
```

### Error Response (400)

```json
{
  "error": "invalid film id"
}
```

---

# Favorites
⚠️ All favorites endpoints require authentication via valid JWT cookie.

## POST `/api/favorites`

Adds a film to the authenticated user's favorites.

### Request Body

```json
{
  "film_id": 11,
  "notes": "One of my all-time favorites."
}
```

| Field   | Type   | Required | Description            |
| ------- | ------ | -------- | ---------------------- |
| film_id | int    | Yes      | ID of the film to add  |
| notes   | string | No       | Optional personal note |

---

### Success Response (201)

```json
{
  "message": "successfully add film to favorite",
  "film_id": 11,
  "user_id": 5
}
```

---

### Error Responses

#### 400

```json
{
  "error": "invalid request body"
}
```

#### 401

```json
{
  "error": "user unauthorized"
}
```

#### 500

```json
{
  "error": "internal database error"
}
```

---

## GET `/api/favorites`

Returns all favorite films of the authenticated user.

Each favorite includes display-ready film data for frontend rendering.

### Success Response (200)

```json
{
  "favorites": [
    {
      "favorite_id": 1,
      "notes": "Classic mafia masterpiece.",
      "film": {
        "id": 11,
        "title": "The Godfather",
        "description": "Spanning the years 1945 to 1955...",
        "release_year": 1972,
        "runtime": 175,
        "poster_image_url": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
      }
    }
  ],
  "metadata": {
    "amount": 1
  }
}
```

---

### Error Responses

#### 401

```json
{
  "error": "user unauthorized"
}
```

#### 500

```json
{
  "error": "db error: ..."
}
```

---

## DELETE `/api/favorites/:film_id`

Removes a film from the authenticated user's favorites.

### Path Parameter

| Name    | Type | Description              |
| ------- | ---- | ------------------------ |
| film_id | int  | ID of the film to remove |

**Example**

```
/api/favorites/11
```

---

### Success Response (200)

```json
{
  "message": "successfully deleted film from favorite"
}
```

---

### Error Responses

#### 401

```json
{
  "error": "user unauthorized"
}
```

#### 404

```json
{
  "error": "favorite film not found"
}
```

#### 500

```json
{
  "error": "db error: ..."
}
```