import csv, mysql.connector, os, requests, json
from dotenv import load_dotenv

load_dotenv()

def seed_films(connection=None, movie_csv_path="movies.csv", limit=20):
    # own_connection here is needed incase seed_films is ran as a standalone script
    
    own_connection = False
    if connection is None:
        own_connection = True
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
        )

    cursor = connection.cursor(buffered=True)

    insert_film_query = """
    INSERT INTO films
    (title, description, release_year, popularity, average_rating, rating_count, poster_image_url, trailer_url, runtime, tagline)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    apikey = os.getenv("TMDB_API_KEY")
    if not apikey:
        raise RuntimeError("TMDB_API_KEY not set in environment")

    processed = 0

    with open(movie_csv_path, newline="", encoding="utf8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            if processed >= limit:
                break

            movie_id = row.get("id")
            if not movie_id:
                print("Skipping row without id")
                continue

            try:
                details_url = f"https://api.themoviedb.org/3/movie/{movie_id}"
                details_params = {"api_key": apikey}
                details_resp = requests.get(details_url, params=details_params, timeout=10)
                details_resp.raise_for_status()
                details = details_resp.json()

                videos_url = f"https://api.themoviedb.org/3/movie/{movie_id}/videos"
                videos_resp = requests.get(videos_url, params=details_params, timeout=10)
                videos_resp.raise_for_status()
                videos = videos_resp.json().get("results", [])

                trailer_url = None
                for video in videos:
                    if video.get("site") == "YouTube" and video.get("type") == "Trailer":
                        trailer_url = f"https://www.youtube.com/watch?v={video.get('key')}"
                        break

                credits_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits"
                credits_resp = requests.get(credits_url, params=details_params, timeout=10)
                credits_resp.raise_for_status()
                credits = credits_resp.json()
                cast_list = credits.get("cast", [])

                title = details.get("title")
                overview = details.get("overview")
                release_date = details.get("release_date")
                release_year = None
                if release_date:
                    try:
                        release_year = int(release_date[:4])
                    except ValueError:
                        release_year = None

                tagline = details.get('tagline') if details.get('tagline') is not None else None

                popularity = round(details.get("popularity", 0))
                vote_avg = details.get("vote_average") if details.get("vote_average") is not None else None
                vote_count = details.get("vote_count") if details.get("vote_count") is not None else None
                poster_url = f"https://image.tmdb.org/t/p/w500{details.get('poster_path')}" if details.get("poster_path") else None
                runtime = details.get("runtime")

                existing_film_id = None
                try:
                    cursor.execute(
                        "SELECT id FROM films WHERE title = %s AND (release_year = %s OR release_year IS NULL AND %s IS NULL)",
                        (title, release_year, release_year),
                    )
                    row_id = cursor.fetchone()
                    if row_id:
                        existing_film_id = row_id[0]
                except Exception as e:
                    print(f"Warning: error checking existing film: {e}")

                film_id = existing_film_id
                if not film_id:
                    try:
                        cursor.execute(
                            insert_film_query,
                            (
                                title,
                                overview,
                                release_year,
                                popularity,
                                vote_avg,
                                vote_count,
                                poster_url,
                                trailer_url,
                                runtime,
                                tagline
                            ),
                        )
                        connection.commit()
                        film_id = cursor.lastrowid
                    except mysql.connector.Error as e:
                        print(f"Ignored insert error for film {title!r}: {e}")
                        try:
                            # Try again, film might already be in there
                            cursor.execute("SELECT id FROM films WHERE title=%s AND release_year=%s", (title, release_year))
                            res = cursor.fetchone()
                            if res:
                                film_id = res[0]
                        except Exception:
                            film_id = None

                if not film_id:
                    print(f"Skipping metadata for movie_id={movie_id} because film insert/find failed.")
                    processed += 1
                    continue

                genres = details.get("genres", [])
                for genre in genres:
                    genre_name = genre.get("name")
                    if not genre_name:
                        continue
                    try:
                        cursor.execute("INSERT IGNORE INTO genres (name) VALUES (%s)", (genre_name,))
                        connection.commit()
                        cursor.execute("SELECT id FROM genres WHERE name=%s", (genre_name,))
                        gid = cursor.fetchone()[0]
                        cursor.execute(
                            "INSERT IGNORE INTO film_genres (film_id, genre_id) VALUES (%s, %s)",
                            (film_id, gid),
                        )
                        connection.commit()
                    except Exception as e:
                        print(f"Warning: genre handling failed for {genre_name}: {e}")

                companies = details.get("production_companies", [])
                for company in companies:
                    company_name = company.get("name")
                    if not company_name:
                        continue
                    try:
                        cursor.execute("INSERT IGNORE INTO production_companies (name) VALUES (%s)", (company_name,))
                        connection.commit()
                        cursor.execute("SELECT id FROM production_companies WHERE name=%s", (company_name,))
                        cid = cursor.fetchone()[0]
                        cursor.execute(
                            "INSERT IGNORE INTO film_production_companies (film_id, company_id) VALUES (%s, %s)",
                            (film_id, cid),
                        )
                        connection.commit()
                    except Exception as e:
                        print(f"Warning: production company handling failed for {company_name}: {e}")

                countries = details.get("production_countries", [])
                for country in countries:
                    country_name = country.get("name")
                    country_code = country.get('iso_3166_1')
                    if not country_name:
                        continue
                    try:
                        cursor.execute("INSERT IGNORE INTO production_countries (iso_code, name) VALUES (%s, %s)",
                            (country_code, country_name)
                        )
                        connection.commit()
                        cursor.execute(
                            "INSERT IGNORE INTO film_production_countries (film_id, country_code) VALUES (%s, %s)",
                            (film_id, country_code),
                        )
                        connection.commit()
                    except Exception as e:
                        print(f"Warning: production country handling failed for {country_name}: {e}")

                for actor in cast_list[:10]:
                    actor_name = actor.get("name")
                    cast_order = actor.get("order") if actor.get("order") is not None else None
                    if not actor_name:
                        continue
                    try:
                        cursor.execute(
                            "INSERT IGNORE INTO film_casts (film_id, actor_name, cast_order) VALUES (%s, %s, %s)",
                            (film_id, actor_name, cast_order),
                        )
                        connection.commit()
                    except Exception as e:
                        print(f"Warning: cast insert failed for {actor_name}: {e}")

                print(f"Seeded movie: {title!r} (film_id={film_id})")
                processed += 1

            except requests.exceptions.RequestException as re:
                print(f"HTTP error for movie_id={movie_id}: {re}")
                processed += 1
                continue
            except Exception as ex:
                print(f"Unexpected error for movie_id={movie_id}: {ex}")
                processed += 1
                continue

    cursor.close()
    if own_connection:
        connection.close()
    print(f"Seeding complete. Processed {processed} movies.")

if __name__ == "__main__":
    seed_films()

