USE gowit;

-- Users
-- INSERT INTO users (name, email, password_hash, profile_picture_url)
-- VALUES
--   ('Alice Tan', 'alice@example.com', 'hashed_password_1', NULL),
--   ('Budi Santoso', 'budi@example.com', 'hashed_password_2', NULL),
--   ('Charlie Lim', 'charlie@example.com', 'hashed_password_3', NULL);

-- Films
INSERT INTO films (title, description, release_year, popularity, poster_image_url, trailer_url, average_rating)
VALUES
  ('Inception', 'A thief who steals corporate secrets through dream-sharing technology.', 2010, 95, 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'https://youtube.com/watch?v=YoHD9XEInc0', 8.8),
  ('Interstellar', 'A team of explorers travel through a wormhole in space.', 2014, 92, 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg', 'https://youtube.com/watch?v=zSWdZVtXT7E', 8.7),
  ('Parasite', 'A poor family schemes to become employed by a wealthy household.', 2019, 90, 'https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_SX300.jpg', 'https://youtube.com/watch?v=5xH0HfJHsaY', 8.5),
  ('The Dark Knight', 'Batman faces the Joker, a criminal mastermind.', 2008, 98, 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg', 'https://youtube.com/watch?v=EXeTwQWrcwY', 9.0),
  ('The Matrix', 'A hacker discovers reality is a simulation.', 1999, 94, 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3NjAtNDMzZi00ZjQxLWI1ZjEtYjNkZjU1YjIxYWRkXkEyXkFqcGc@._V1_SX300.jpg', 'https://youtube.com/watch?v=vKQi3bBA1y8', 8.7),
  ('Fight Club', 'An insomniac office worker forms an underground fight club.', 1999, 91, 'https://m.media-amazon.com/images/M/MV5BMmEzNWE1NDctODNhZi00NmY2LWI0ZTYtODc1Y2Q3NmU4ZDJmXkEyXkFqcGc@._V1_SX300.jpg', 'https://youtube.com/watch?v=SUXWAEX2jlg', 8.8),
  ('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control to his son.', 1972, 99, 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwYy00ZjQxLWIwNTEtYjY2ZjA2NDY0ZjU3XkEyXkFqcGc@._V1_SX300.jpg', 'https://youtube.com/watch?v=sY1S34973zA', 9.2),
  ('The Shawshank Redemption', 'Two imprisoned men bond over a number of years.', 1994, 100, 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZGE5LWJmNWItODM1ZTA1ZTAxMjQ0XkEyXkFqcGc@._V1_SX300.jpg', 'https://youtube.com/watch?v=6hB3S9bIaco', 9.3),
  ('Unknown Indie Film', NULL, NULL, 10, NULL, NULL, 0),
  ('Avengers: Endgame', "The Avengers assemble to reverse Thanos' actions.", 2019, 97, 'https://m.media-amazon.com/images/M/MV5BMTc5OTg0NjUxMl5BMl5BanBnXkFtZTgwMzU1NjIzNzM@._V1_SX300.jpg', 'https://youtube.com/watch?v=TcMBFSGVi1c', 8.4),
  ('Joker', 'A mentally troubled comedian descends into madness in Gotham City.', 2019, 93, 'https://m.media-amazon.com/images/M/MV5BMTk5MjQ3NjM0OV5BMl5BanBnXkFtZTgwNjY3NzM0NzM@._V1_SX300.jpg', 'https://youtube.com/watch?v=zAGVQLHvwOY', 8.5),
  ('Coco', 'A young boy enters the Land of the Dead to discover his family history.', 2017, 89, 'https://m.media-amazon.com/images/M/MV5BMjEwNTY5OTQxOV5BMl5BanBnXkFtZTgwNzE5ODMyMjM@._V1_SX300.jpg', 'https://youtube.com/watch?v=Rvr68u6k5sI', 8.4),
  ('Soul', 'A musician has an out-of-body experience and explores the afterlife.', 2020, 88, 'https://m.media-amazon.com/images/M/MV5BMjM0MjY1MzE0NF5BMl5BanBnXkFtZTgwOTQyMTU2MjM@._V1_SX300.jpg', 'https://youtube.com/watch?v=xOsLIiBStEs', 8.2),
  ('The Lion King', 'A young lion prince flees his kingdom only to learn responsibility and bravery.', 1994, 95, 'https://m.media-amazon.com/images/M/MV5BMjE2OTc2NDc1OF5BMl5BanBnXkFtZTgwNjU5ODQzMjM@._V1_SX300.jpg', 'https://youtube.com/watch?v=4sj1MT05lAA', 8.5);


-- Favorites
-- INSERT INTO favorites (user_id, film_id, notes)
-- VALUES
--   (1, 1, 'Mind-bending, watched twice'),
--   (1, 2, 'Great soundtrack'),
--   (2, 3, 'Very uncomfortable but brilliant'),
--   (3, 1, NULL);

