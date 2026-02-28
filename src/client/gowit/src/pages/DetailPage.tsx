import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { MovieType } from "../type";
import { serverApi } from "../api";
import { errorAlert } from "../helper/errorAlert";
import Swal from "sweetalert2";

import axios from "axios";
import { capitalizeEachWord } from "../helper/helper";

export default function DetailPage() {
  const [detailMovie, setDetailMovie] = useState<MovieType>();
  let { id } = useParams();
  const navigate = useNavigate();

  const fetchMovie = async () => {
    try {
      const response = await serverApi.get("/api/films/" + id);
      setDetailMovie(response.data);
    } catch (error) {
      console.log("Error at Detail Page ", error);
    }
  };

  const addMovieToFavorites = async () => {
    try {
      const response = await serverApi.post("/api/favorites", {
        film_id: Number(id),
      });

      Swal.fire({
        title: `${detailMovie?.title} Added Successful!"`,

        icon: "success",
        buttonsStyling: false,
        background: "#0F1115",
        color: "#F5F2F2",
        customClass: {
          title: "text-white",
          confirmButton:
            "px-4 py-2 rounded-lg bg-[#E50914] text-white hover:bg-[#b20710] focus:outline-none",
        },
      });

      navigate("/watchlist");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        errorAlert(capitalizeEachWord(error.response?.data.error));
      } else {
        console.log("Error at Detail Page: ", error);
      }
    }
  };

  useEffect(() => {
    fetchMovie();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="bg-[#0F1115]">
      <div className="max-w-6xl mx-auto px-6 py-10 ">
        <div className="bg-[#0B0C0D] border border-gray-800 rounded-lg p-8 shadow-xl mt-12">
          <h2 className="text-white mb-6 font-bold text-3xl">
            {detailMovie?.title}
          </h2>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-black">
            <iframe
              className="w-full h-full"
              src={detailMovie?.trailer_url}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
          <div className="mt-6 bg-black rounded-md p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="max-w-5xl mx-auto grid md:grid-cols-[280px_1fr] gap-5">
                <img
                  src={detailMovie?.poster_image_url}
                  className="rounded-lg shadow-lg"
                  alt="Poster"
                />
              </div>
              <div className="md:col-span-2 space-y-4 .md:-ml-3">
                <h1 className="text-3xl font-bold text-white">
                  {" "}
                  {detailMovie?.title}
                </h1>
                <div className="mt-4 items-center text-xl py-1 rounded-md shadow-sm">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-white font-semibold ml-1">
                    {detailMovie?.average_rating}
                  </span>
                  <span className="text-gray-400 text-sm">/10</span>
                </div>
                <p className="text-gray-300 text-justify">
                  {detailMovie?.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 pt-4">
                  <p>
                    <span className="text-white font-semibold">Released:</span>{" "}
                    {detailMovie?.release_year}
                  </p>
                  <p>
                    <span className="text-white font-semibold">Duration:</span>{" "}
                    {detailMovie?.runtime} min
                  </p>
                  <p>
                    <span className="text-white font-semibold">Genre:</span>{" "}
                    {detailMovie?.genres.join(" ")}
                  </p>
                  <p>
                    <span className="text-white font-semibold">Country:</span>{" "}
                    {detailMovie?.production_countries.join(" ")}
                  </p>
                  <p>
                    <span className="text-white font-semibold">
                      Production:
                    </span>{" "}
                    {detailMovie?.production_companies.join(" ")}
                  </p>
                  <p>
                    <span className="text-white font-semibold">Casts:</span>{" "}
                    {detailMovie?.casts.join(" ")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 ml-2 mt-2">
              <button
                onClick={addMovieToFavorites}
                className="bg-[#E50914] hover:bg-red-800 text-white px-5 py-3 rounded-lg transition flex items-center gap-2 font-bold"
              >
                <img
                  src="../watchlisticon.png"
                  alt="Watchlist"
                  className="w-4 h-4"
                />
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
