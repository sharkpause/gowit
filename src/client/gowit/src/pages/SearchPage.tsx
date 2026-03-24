import { Link, useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { serverApi } from "../api";
import type { MovieType } from "../type";
import Navbar from "../components/Navbar";

export default function SearchPage() {
  let [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query) return;
      setLoading(true);

      const response = await serverApi.get("/api/films?search=" + query);
      setMovies(response.data.films);

      setLoading(false);
    };

    fetchMovies();
  }, [query]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white px-4 md:px-8 lg:px-32 h-full pt-24 pb-16 ">
        <h2 className="text-3xl font-bold mb-8">
          Results for "<span className="text-[#E8630A]">{query}</span>"
        </h2>

        {loading && <p className="text-gray-400">Loading...</p>}

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <Link to={`/movies/${movie.id}`} key={movie.id}>
              <div className="group relative cursor-pointer transform transition duration-300 hover:scale-105">
                <img
                  src={movie.poster_image_url}
                  alt={movie.title}
                  className="rounded-xl"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl flex flex-col justify-end p-4">
                  <h3 className="text-sm font-semibold">{movie.title}</h3>

                  <p className="text-xs text-gray-300">{movie.release_year}</p>

                  <span
                    className={`text-sm font-bold mt-1 ${
                      movie.average_rating >= 7
                        ? "text-green-400"
                        : movie.average_rating >= 5
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    ⭐ {movie.average_rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
