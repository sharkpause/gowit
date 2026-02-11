# API documentation
All APIs start with /api right after the root link (localhost:8080/api for example)
So to get films/ you go to {URL}/api/films

## /films

### GET

- ### /
Gets all films from the database

#### Success response example (200)
```json
{
    "metadata": {
        "amount": 2,
    },
    "films":[
        {
            "id": 1,
            "title": "Inception",
            "description": "A thief who steals corporate secrets through dream-sharing technology.",
            "release_year": 2010
        },
        {
            "id": 2,
            "title": "Interstellar",
            "description": "A team of explorers travel through a wormhole in space.",
            "release_year": 2014
        }
    ]
}
```

#### Query parameters

| Name  | Type | Default | Description                        |
| -------| ------| ---------| ------------------------------------|
| page  | int  | 1       | Page number (1-based)              |
| limit | int  | 10      | Number of items per page (max 100) |
| sort  | enum | id      | Field to sort by                   |
| order | enum | ASC     | Sort order (ASC or DESC)           |

Available for `sort`: id, title, description, release_year  
Available for `order`: asc, desc

Example: localhost:8080/api/films?sort=title

---

- ### /:id
Gets one film based on an id

#### Success response example (200)
```json
{
    "id": 2,
    "title": "Interstellar",
    "description": "A team of explorers travel through a wormhole in space.",
    "release_year": 2014
}
```
