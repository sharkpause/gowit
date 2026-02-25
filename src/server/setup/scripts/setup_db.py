import os
import mysql.connector
from dotenv import load_dotenv
from seed_films import seed_films

load_dotenv()


def run_sql_file(cursor, filepath):
    with open(filepath, "r", encoding="utf8") as file:
        sql = file.read()

    for statement in sql.split(";"):
        statement = statement.strip()
        if statement:
            cursor.execute(statement)


def main():
    connection = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )

    cursor = connection.cursor()

    print("Dropping database...")
    run_sql_file(cursor, "../db/drop_db.sql")

    print("Creating database...")
    run_sql_file(cursor, "../db/create_db.sql")

    connection.commit()
    cursor.close()
    connection.close()

    connection = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
    )

    print("Seeding movies...")
    seed_films(connection)

    connection.close()

    print("Setup complete.")


if __name__ == "__main__":
    main()
