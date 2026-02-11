from dotenv import load_dotenv

import os, requests

load_dotenv()

omdb_api_key = os.getenv("OMDB_API_KEY")
imdb_id = 'tt6751668'
url_string = f'http://www.omdbapi.com/?apikey={omdb_api_key}&i={imdb_id}'
print(url_string)

response = requests.get(url_string)
print(response.json()['Poster'])