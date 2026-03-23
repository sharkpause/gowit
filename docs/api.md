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
            "id": 4,
            "film_id": 1,
            "notes": "this film was aight",
            "title": "The Godfather",
            "description": "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
            "poster_image_url": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            "average_rating": 8.7,
            "release_year": 1972,
            "runtime": 175
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

---

## **📌 `/api/films/coming-soon`**

### **GET**

Returns a list of upcoming films — i.e., films with a release date after today — up to 20 results sorted by release date in ascending order (soonest first).

---

### **Description**

Retrieves films from the database whose release date is in the future. Useful for displaying “Coming Soon” or “Upcoming Releases” sections in your frontend app.

---

### **URL**

```
GET /api/films/coming-soon
```

---

### **Success Response**

**Status:** `200 OK`
**Content type:** `application/json`

```json
{
  "coming_soon": [
    {
      "title": "Example Film",
      "thumbnail_url": "https://image.tmdb.org/t/p/w500/abc123.jpg",
      "runtime": 120,
      "release_year": 2027
    }
  ],
  "metadata": {
    "amount": 1
  }
}
```

**Fields:**

| Field             | Type   | Description                                   |
| ----------------- | ------ | --------------------------------------------- |
| `title`           | string | The film title                                |
| `thumbnail_url`   | string | URL to the film’s poster/thumbnail image      |
| `runtime`         | int    | Film duration in minutes                      |
| `release_date`    | int    | The year the film is scheduled to be released |
| `metadata.amount` | int    | The number of coming soon films returned      |

---

### **Error Responses**

#### **500 – Internal Server Error**

Returned if the database query fails.

Response example:

```json
{
  "error": "internal db error"
}
```

---

### **Notes**

* No query parameters are supported currently — this endpoint always returns *the next up to 20 upcoming films*.
* It helps frontend quickly populate an upcoming movies section without having to filter and sort on the client.
* Recommended for use wherever you want users to browse titles that haven’t released yet.([Devzery Latest][1])

---

# Comments
## POST /api/films/{id}/comments
create a comment, by parsing parameter of film_id, taking the body of 
```
  ParentID *uint64 `json:"parent_id,omitempty"`

  Content   string `json:"content"`
```

If the comment will be at the top or root of the comment, dont need to send parent_id. parent_id itself is nullable


if you are replying, yes, the parent_id is needed
it will return 200 and the comment_id


## POST /api/comments/like
will vote the comment. taking the body of models.CommentVote, 

```
  `json:"comment_id"`

	`json:"score"`
```

if you look closely on the struct, you may notice it has user_id, userid will be overwritten by the middleware, so dont car about it

score can be 1 or -1 or 0

0 will unvote


it will return 200
## GET /api/films/{id}/comments
ID as in film_id, will return all parent comment. Replies will be loaded by the next endpoint. 

It will return the models/comment.go. status code 200
```
  `json:"id"`

	`json:"film_id"`

	`json:"user_id"`

	`json:"username"`

	`json:"parent_id,omitempty"`

	`json:"content" binding:"required,min=2	,max=300"`

	`json:"created_at"`

  `json:"reply_count,omitempty"`

  `json:"vote_count"`

  `json:"vote_state"`

  `json:"is_owner"`

  `json:"is_updated"`

  `json:"is_deleted"`
```
  this is owner is for checking whether the comment is made by the logged in user, thus can add edit or delete button onto the comment. if user is not logged in, the is_owner and vote_state will likely be zero

comment content must be constrained to 2 min, and 300 max

when a comment is deleted, `is_deleted = 1`, then it wont be permitted to make any edit or deletion. thus returning http status gone (410)

## GET /api/comments/{id}/replies
ID as in parent id of the comment. It will return the same struct as the previous endpoint. no replies counts tho

## POST /comments/{id}/edits

very self explanatory, will return 401 if not logged in, 403 if they try to edit the comment yangg bukan orangnya. 200 if successful

taking only `content` from json

i have `handlers.userAuthorizedToMakeChangesThisNamingIsFuck`, might think of a better naming, i will reuse this function for  delete comment. the name itself is also self explanatory

edit will mark the tag `is_deleted` to `true`. an already deleted comments, cant be edited. sounds very intuitive to me.

## DELETE /comments/{id}/delete

tbh, just keeping up with the naming convention. also its not permitted to delete an already deleted comments, thus will return http status gone (410) as well 