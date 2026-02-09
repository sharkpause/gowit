from pathlib import Path
from dotenv import load_dotenv

import os, requests

load_dotenv()

API_KEY = os.getenv("OMDB_API_KEY")
base = "https://www.omdbapi.com/"

params = {
    "apikey": API_KEY,
    "i": "tt0111161",
    "plot": "full"
}

response = requests.get(base, params=params)
data = response.json()

print(data)