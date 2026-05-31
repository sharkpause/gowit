import pandas as pd
import requests

API_KEY = '882d288921f536a9af57c8cf3d5bd020'

BASE_URL = 'https://api.themoviedb.org/3/discover/movie'

MAX_PAGES = 5

movies_data = []

for page in range(1, MAX_PAGES + 1):

    print(f'Fetching page {page}...')

    response = requests.get(
        BASE_URL,
        params={
            'api_key': API_KEY,
            'with_original_language': 'id',
            'sort_by': 'popularity.desc',
            'include_adult': 'false',
            'vote_count.gte': 5,
            'page': page,
        },
        timeout=10,
    )

    response.raise_for_status()

    data = response.json()

    movies = data.get('results', [])

    if not movies:
        print('No more movies found.')
        break

    for movie in movies:

        movies_data.append({
            'id': movie.get('id'),
            'title': movie.get('title'),
            'overview': movie.get('overview'),
            'release_date': movie.get('release_date'),
            'popularity': movie.get('popularity'),
            'vote_average': movie.get('vote_average'),
            'vote_count': movie.get('vote_count'),
        })

        print(f"Saved: {movie.get('title')}")

df = pd.DataFrame(movies_data)

df.to_csv(
    'indonesian_movies.csv',
    index=True,
    encoding='utf8',
)

print('\nDone.')