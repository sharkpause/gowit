import csv, mysql.connector, os
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

insert_sql = """
INSERT INTO films
(title, description, release_year)
VALUES (%s, %s, %s, %s, %s, %s)
"""

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
        
# This file is under work in progress, for now we don't need to fill the db yet