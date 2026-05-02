package db

import (
	"database/sql"
	"fmt"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func Connect() (*sql.DB, error) {
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	return sql.Open("mysql", dsn)
}

func LoadRestrictedWords(database *sql.DB) (map[string]struct{}, error) {
	rows, err := database.Query("SELECT word FROM restricted_words")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	restrictedWordSet := make(map[string]struct{})

	for rows.Next() {
		var word string

		if err := rows.Scan(&word); err != nil {
			return nil, err
		}

		cleanedWord := strings.ToLower(strings.TrimSpace(word))

		if cleanedWord != "" {
			restrictedWordSet[cleanedWord] = struct{}{}
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return restrictedWordSet, nil
}