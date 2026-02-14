CREATE DATABASE gowit;

USE gowit;

CREATE TABLE users (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	profile_picture_url VARCHAR(512) DEFAULT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE films (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description TEXT DEFAULT NULL,
	release_year YEAR DEFAULT NULL,
	popularity INT UNSIGNED DEFAULT 0, 
	average_rating DECIMAL(3,1) UNSIGNED DEFAULT NULL,
	rating_count INT UNSIGNED DEFAULT NULL,
	poster_image_url VARCHAR(512) DEFAULT NULL,
	trailer_url VARCHAR(512) DEFAULT NULL,
	runtime UNSIGNED INT DEFAULT NULL,
	tagline VARCHAR(255) DEFAULT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE genres (
	id BIGINT UNSIGNED PRIMARY KEY,
	name VARCHAR(40) NOT NULL,
);

CREATE TABLE film_genres (
	film_id BIGINT UNSIGNED,
	genre_id BIGINT UNSIGNED,
	
	PRIMARY KEY(film_id, genre_id),

	FOREIGN KEY(film_id) REFERENCES films(id),
	FOREIGN KEY(genre_id) REFERENCES genres(id)
);

CREATE TABLE production_companies (
	id BIGINT UNSIGNED PRIMARY KEY,
	name VARCHAR(255) NOT NULL
);

CREATE TABLE film_production_companies (
	film_id BIGINT UNSIGNED
	company_id BIGINT UNSIGNED

	PRIMARY KEY(film_id, company_id)

	FOREIGN KEY(film_id) REFERENCES films(id),
	FOREIGN KEY(company_id) REFERENCES production_companies(id)
);

CREATE TABLE production_countries (
    iso_code CHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE film_production_countries (
    film_id BIGINT UNSIGNED,
    country_code CHAR(2),
    PRIMARY KEY(film_id, country_code),
    FOREIGN KEY(film_id) REFERENCES films(id),
    FOREIGN KEY(country_code) REFERENCES production_countries(iso_code)
);

CREATE TABLE film_casts (
    film_id BIGINT UNSIGNED NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    cast_order INT DEFAULT NULL,
    PRIMARY KEY(film_id, actor_name),
    FOREIGN KEY(film_id) REFERENCES films(id)
);

CREATE TABLE ratings (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	user_id BIGINT UNSIGNED NOT NULL,
	film_id BIGINT UNsiGNED NOT NULL,
	rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 10),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_rating_user
		FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE,

	CONSTRAINT fk_rating_film
		FOREIGN KEY (film_id)
		REFERENCES films(id)
		ON DELETE CASCADE,

	UNIQUE(user_id, film_id)
);

CREATE TABLE favorites (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	notes TEXT DEFAULT NULL,
	user_id BIGINT UNSIGNED NOT NULL,
	film_id BIGINT UNSIGNED NOT NULL,

	CONSTRAINT fkey_favorites_user
		FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE,

	CONSTRAINT fkey_favorites_film
		FOREIGN KEY (film_id)
		REFERENCES films(id)
		ON DELETE CASCADE,

	UNIQUE KEY unique_user_film (user_id, film_id)
);
