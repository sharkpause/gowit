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

export type MovieWatchlistType = {
  id: number;
  title: string;
  description: string;
  poster_image_url: string;
  release_year: number;
  average_rating: number;
  runtime: number;
};

export type WatchListType = {
  favorite_id: number;
  notes: string;
  film: MovieWatchlistType;
};
