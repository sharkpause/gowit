export type MovieType = {
  id: number;
  title: string;
  description: string;
  release_year: number;
  poster_image_url: string;
  trailer_url: string;
  average_rating: number;
  popularity: number;
  runtime: number;
  tagline: string;
  genres: string[];
  production_companies: string[];
  production_countries: string[];
  casts: string[];
};

export type WatchListType = {
  id: number;
  notes: string;
  film_id: number;
  title: string;
  description: string;
  poster_image_url: string;
  release_year: number;
  average_rating: number;
  runtime: number;
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  profile_picture_url: string;
};

export type ImportType = {
  title: string;
};

export type ProfileType = {
  name: string;
  email: string;
  profile: string;
  created: string;
  favorite_count: number;
};

export type ComingMovie = {
  title: string;
  thumbnail_url: string;
  runtime: number;
  release_date: string;
  trailer_url: string;
  trailer_duration: number;
};

export type CommentType = {
  id: number;
  film_id: number;
  user_id: number;
  username: string;
  profile_picture_url: string;
  parent_id: number;
  content: string;
  created_at: string;
  reply_count: number;
  vote_state: number;
  vote_count: number;
  is_owner: boolean;
};

export type RatingType = {
  film_id: number;
  average_rating: number;
  rating_count: number;
  user_rating: number;
};
