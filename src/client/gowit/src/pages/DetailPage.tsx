import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { MovieType, UserType } from "../type";
import { serverApi } from "../api";
import { errorAlert } from "../helper/errorAlert";
import Swal from "sweetalert2";
import axios from "axios";
import { capitalizeEachWord } from "../helper/helper";
import Navbar from "../components/Navbar";

type CommentType = {
  username: string;
  comment: string;
  date: string;
  likes: number;
  dislikes: number;
  userVote?: "like" | "dislike" | null;
};

export default function DetailPage() {
  const [detailMovie, setDetailMovie] = useState<MovieType>();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [username, setUsername] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLogin, setIsLogin] = useState<UserType>();

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

  const checkFavoriteMovie = async () => {
    try {
      const response = await serverApi.get("/api/favorites/" + id);
      setIsFavorited(response.data.isFavorite);
    } catch (error) {
      console.log("Error at CheckFavoriteMovie function:", error);
    }
  };

  const checkUser = async () => {
    try {
      const response = await serverApi.get("/api/me");
      setIsLogin(response.data);
    } catch (error) {
      console.log("Error at checkUser function:", error);
    }
  };

  const addMovieToFavorites = async () => {
    try {
      await serverApi.post("/api/favorites", {
        film_id: Number(id),
      });

      Swal.fire({
        title: `${detailMovie?.title} Added Successful!"`,
        icon: "success",
        background: "#0F1115",
        color: "#F5F2F2",
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
    <>
      <Navbar />
      <div className="bg-[#0F1115] min-h-screen">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
          <div className="bg-[#0B0C0D] border border-gray-800 rounded-lg p-4 sm:p-6 md:p-8 shadow-xl mt-8 sm:mt-10 md:mt-12">
            <h2 className="text-white mb-4 sm:mb-6 font-bold text-2xl sm:text-3xl md:text-4xl break-words">
              {detailMovie?.title}
            </h2>

            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-black">
              <iframe
                className="w-full h-full"
                src={detailMovie?.trailer_url}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>

            <div className="mt-6 bg-black rounded-md p-4 sm:p-6 md:p-8">
              {/* Movie Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="flex flex-col">
                  <img
                    src={detailMovie?.poster_image_url}
                    className="rounded-lg shadow-lg w-full md:w-auto md:max-w-xs"
                    alt="Poster"
                    onError={(e) => (e.currentTarget.src = "/profilicon.png")}
                  />
                  <div className="flex gap-3 w-full mt-4">
                    <button
                      onClick={addMovieToFavorites}
                      className={`flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg transition flex justify-center items-center gap-2 font-bold text-sm sm:text-base ${
                        isFavorited
                          ? "bg-[#E8630A]/60 hover:bg-[#E8630A]/50 text-white/60 cursor-not-allowed"
                          : "bg-[#E8630A] hover:bg-[#C75409] text-white cursor-pointer"
                      }`}
                      disabled={isFavorited}
                    >
                      <img
                        src="/watchlisticon.png"
                        alt="Watchlist"
                        className="w-4 h-4"
                      />
                      <span>
                        {isFavorited
                          ? "Added to Watchlist"
                          : "Add to Watchlist"}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {detailMovie?.title}
                  </h1>
                  <div className="flex items-center gap-2 text-lg sm:text-xl py-2">
                    <span className="text-yellow-400 text-lg sm:text-2xl">
                      ⭐
                    </span>
                    <span className="text-white font-semibold">
                      {detailMovie?.average_rating}
                    </span>
                    <span className="text-gray-400 text-sm">/5</span>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base text-justify leading-relaxed">
                    {detailMovie?.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 pt-4">
                    <p>
                      <span className="text-white font-semibold">
                        Released:
                      </span>{" "}
                      <span className="text-gray-300">
                        {detailMovie?.release_year}
                      </span>
                    </p>
                    <p>
                      <span className="text-white font-semibold">
                        Duration:
                      </span>{" "}
                      <span className="text-gray-300">
                        {detailMovie?.runtime} min
                      </span>
                    </p>
                    <p>
                      <span className="text-white font-semibold">Genre:</span>{" "}
                      <span className="text-gray-300">
                        {detailMovie?.genres.join(", ")}
                      </span>
                    </p>
                    <p>
                      <span className="text-white font-semibold">Country:</span>{" "}
                      <span className="text-gray-300">
                        {detailMovie?.production_countries.join(", ")}
                      </span>
                    </p>
                    <p className="sm:col-span-2">
                      <span className="text-white font-semibold">
                        Production:
                      </span>{" "}
                      <span className="text-gray-300">
                        {detailMovie?.production_companies.join(", ")}
                      </span>
                    </p>
                    <p className="sm:col-span-2">
                      <span className="text-white font-semibold">Casts:</span>{" "}
                      <span className="text-gray-300">
                        {detailMovie?.casts.join(", ")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
