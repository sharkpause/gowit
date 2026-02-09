import csv

movies = []

with open("movies.csv", newline="", encoding="utf8") as file:
    render = csv.DictReader(file)

    for row in render:
        title = row.get("title")
        release_year = row.get("release_date")
        description = row.get("overview")
        
        movies.append({
            'title': title,
            'release_year': release_year,
            'description': description
        })
        
print(movies)