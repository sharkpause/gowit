import { useParams } from "react-router";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export default function SearchPage() {
  const { query } = useParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchMovies = async () => {
      setLoading(true);

      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=${query}`
      );

      const data = await res.json();
      setMovies(data.results);
      setLoading(false);
    };

    fetchMovies();
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <h2 className="text-3xl font-bold mb-8">
        Results for "<span className="text-red-500">{query}</span>"
      </h2>

      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group relative cursor-pointer transform transition duration-300 hover:scale-105"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={movie.title}
              className="rounded-xl"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl flex flex-col justify-end p-4">
              <h3 className="text-sm font-semibold">
                {movie.title}
              </h3>

              <p className="text-xs text-gray-300">
                {movie.release_date}
              </p>

              <span
                className={`text-sm font-bold mt-1 ${
                  movie.vote_average >= 7
                    ? "text-green-400"
                    : movie.vote_average >= 5
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                ⭐ {movie.vote_average}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}