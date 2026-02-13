# API documentation /api
All APIs start with /api right after the root link (localhost:8080/api for example)
So to get films/ you go to **{URL}/api**/films

## /api/films

### GET

- ### /api/films
Gets all films from the database

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
        "popularity": 39
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

### Pagination
| Name  | Type | Default | Rules                     |
| ----- | ---- | ------- | ------------------------- |
| page  | int  | 1       | Must be ≥ 1               |
| limit | int  | 10      | Must be between 1 and 100 |

#### Examples:
```
/api/films?page=2  
/api/films?limit=10  
```

### Sorting

| Name  | Type | Default | Description                        |
| -------| ------| ---------| ------------------------------------|
| sort  | enum | id      | Field to sort by                   |
| order | enum | ASC     | Sort order (ASC or DESC)           |

Available for `sort`: id, title, description, release_year  
Available for `order`: asc, desc

#### Examples:
```
/api/films?sort=title  
/api/films?order=desc  
```

### Filtering
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

- ### /api/films/:id
Gets a single film based on id

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
    "popularity": 39
}
```

#### Error response example (400)
```json
{
    "error": "invalid film id"
}
```
