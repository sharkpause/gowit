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

export type MovieWatchlist = {
  title: string;
  description: string;
  poster_url: string;
  rating: number;
  year: number;
  minute: number;
};
