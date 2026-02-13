import csv, mysql.connector, os, requests, json
from dotenv import load_dotenv

load_dotenv()

movies = []

connection = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
)

cursor = connection.cursor()

insert_query = """
INSERT INTO films
(title, description, release_year, popularity, average_rating, rating_count, poster_image_url, trailer_url)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
"""

apikey = os.getenv("TMDB_API_KEY")

with open("movies.csv", newline="", encoding="utf8") as file:
    render = csv.DictReader(file)
    count_limit = 0

    for row in render:
        if count_limit == 100:
            break

        title = row.get('title')
        print(title)

        request_url = f'https://api.themoviedb.org/3/search/movie?api_key={apikey}&query={title}&limit=1'
        print(request_url)

        result = requests.get(request_url).json()['results'][0]
        print(json.dumps(result, indent=4))

        movie_id = result['id']
        
        trailer_request_url = f'https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={apikey}'
        print(trailer_request_url)

        trailer_results = requests.get(trailer_request_url).json()['results']
        print(json.dumps(trailer_results, indent=4))
        
        trailer_url = None
        for video in trailer_results:
            if video['site'] == "YouTube" and video['type'] == "Trailer":
                trailer_url = f'https://www.youtube.com/watch?v={video['key']}'

        poster_url = f'https://image.tmdb.org/t/p/w500/{result['poster_path']}'

        release_year = result['release_date'][:4] if result.get('release_date') else None

        try:
            cursor.execute(
                insert_query,
                (
                    title, row.get('overview'),
                    release_year,
                    round(result['popularity']),
                    result['vote_average'],
                    result['vote_count'],
                    poster_url,
                    trailer_url
                )
            )
        except mysql.connector.Error as e:
            print(f"Ignored insert error: {e}")

        count_limit += 1
    connection.commit()
        
# This file is under work in progress, for now we don't need to fill the db yet