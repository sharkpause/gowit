USE gowit;

-- Users
INSERT INTO users (name, email, password_hash, profile_picture_url)
VALUES
  ('Alice Tan', 'alice@example.com', 'hashed_password_1', NULL),
  ('Budi Santoso', 'budi@example.com', 'hashed_password_2', NULL),
  ('Charlie Lim', 'charlie@example.com', 'hashed_password_3', NULL);

-- Films
INSERT INTO films (title, description, release_year, popularity, poster_image_url, trailer_url)
VALUES
  (
    'Inception',
    'A thief who steals corporate secrets through dream-sharing technology.',
    2010,
    95,
    'https://example.com/posters/inception.jpg',
    'https://youtube.com/watch?v=YoHD9XEInc0'
  ),
  (
    'Interstellar',
    'A team of explorers travel through a wormhole in space.',
    2014,
    92,
    'https://example.com/posters/interstellar.jpg',
    'https://youtube.com/watch?v=zSWdZVtXT7E'
  ),
  (
    'Parasite',
    'A poor family schemes to become employed by a wealthy household.',
    2019,
    90,
    'https://example.com/posters/parasite.jpg',
    'https://youtube.com/watch?v=5xH0HfJHsaY'
  ),
  (
    'Unknown Indie Film',
    NULL,
    NULL,
    10,
    NULL,
    NULL
  );

-- Favorites
INSERT INTO favorites (user_id, film_id, notes)
VALUES
  (1, 1, 'Mind-bending, watched twice'),
  (1, 2, 'Great soundtrack'),
  (2, 3, 'Very uncomfortable but brilliant'),
  (3, 1, NULL);

