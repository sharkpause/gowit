import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { CommentType, MovieType, RatingType, UserType } from "../type";
import { serverApi } from "../api";
import { errorAlert } from "../helper/errorAlert";
import Swal from "sweetalert2";
import axios from "axios";
import { capitalizeEachWord } from "../helper/helper";
import Navbar from "../components/Navbar";
import { MoreVertical, Star, Users } from "lucide-react";
import Comment from "../components/Comment";

export default function DetailPage() {
  const [detailMovie, setDetailMovie] = useState<MovieType>();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLogin, setIsLogin] = useState<UserType>();
  const [rating, setRating] = useState(0);
  const [dataRating, setDataRating] = useState<RatingType>();
  const [dataComment, setDataComment] = useState<CommentType[]>([]);
  const [open, setOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [active, setActive] = useState(false);
  const [isEditRating, setIsEditRating] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

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

  const fetchRating = async () => {
    try {
      const response = await serverApi.get(`/api/films/${id}/rating`);

      const hasUserRating = response.data.user_rating != null;
      setIsEditRating(!hasUserRating);

      setDataRating(response.data);
      setRating(response.data.user_rating);
    } catch (error) {
      console.log("Error at Fetch Rating", error);
    }
  };

  const postRating = async () => {
    try {
      if (rating < 1) {
        throw new Error("Please select a rating first!");
      }

      await serverApi.post(`/api/films/${id}/rating`, {
        rating: rating,
      });

      fetchRating();
      setOpen(false);
      Swal.fire({
        title: "Rating saved!",
        icon: "success",
        buttonsStyling: false,
        background: "#0F1115",
        color: "#F5F2F2",
        customClass: {
          title: "text-white",
          confirmButton:
            "px-4 py-2 rounded-lg bg-[#E8630A] text-white hover:bg-[#C75409] focus:outline-none",
        },
      });
    } catch (error: unknown) {
      let errorMessage = "Something went wrong!";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorAlert(errorMessage);

      console.log("Error at Post Rating", error);
    }
  };

  const deleteRating = async () => {
    try {
      await serverApi.delete(`/api/films/${id}/rating`);
      fetchRating();
      Swal.fire({
        title: "Rating removed!",
        icon: "success",
        buttonsStyling: false,
        background: "#0F1115",
        color: "#F5F2F2",
        customClass: {
          title: "text-white",
          confirmButton:
            "px-4 py-2 rounded-lg bg-[#E8630A] text-white hover:bg-[#C75409] focus:outline-none",
        },
      });
    } catch (error) {
      console.log("Error at Delete Rating", error);
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
        buttonsStyling: false,
        customClass: {
          title: "text-white",
          confirmButton:
            "px-4 py-2 rounded-lg bg-[#E8630A] text-white hover:bg-[#C75409] focus:outline-none",
        },
      });
      checkFavoriteMovie();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        errorAlert(capitalizeEachWord(error.response?.data.error));
      } else {
        console.log("Error at Detail Page: ", error);
      }
    }
  };

  const onCancel = () => {
    setCommentText("");
    setActive(false);
  };

  const fetchComment = async () => {
    try {
      const response = await serverApi.get(
        `/api/films/${id}/comments?sort=created_at&order=DESC`,
      );
      setCommentCount(response.data.comment_count);
      setDataComment(response.data.comments);
    } catch (error) {
      console.log("Error at Fetch Comment", error);
    }
  };

  const postComment = async () => {
    try {
      if (!commentText.trim()) return;
      // TODO: POST comment to API

      const response = await serverApi.post(`/api/films/${id}/comments`, {
        content: commentText,
      });
      fetchComment();
      setCommentText("");
      setActive(false);
    } catch (error) {
      console.log("Error at Post Comment", error);
    }
  };

  const likeDislikeComment = async (comment_id: number, score: number) => {
    try {
      const response = await serverApi.post("/api/comments/like", {
        comment_id: comment_id,
        score: score,
      });
      fetchComment();
    } catch (error) {
      console.log("Error at likeDislikeComment Function", error);
    }
  };

  const editComment = async (comment_id: number, content: string) => {
    try {
      const response = await serverApi.post(
        `/api/comments/${comment_id}/edits`,
        {
          content: content,
        },
      );
      fetchComment();
    } catch (error) {
      console.log("Error at editComment Function", error);
    }
  };

  const deleteComment = async (comment_id: number) => {
    try {
      const response = await serverApi.delete(
        `/api/comments/${comment_id}/delete`,
      );

      fetchComment();
    } catch (error) {
      console.log("Error at deleteComment function", error);
    }
  };

  useEffect(() => {
    checkUser();
    fetchMovie();
    checkFavoriteMovie();
    fetchRating();
    fetchComment();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

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
                    {isLogin ? (
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
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {detailMovie?.title}
                  </h1>
                  {isLogin ? (
                    <div className="flex gap-3 items-center">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((el, idx) => {
                          const isStarDisabled =
                            !isEditRating && dataRating?.user_rating != null;

                          return (
                            <Star
                              key={idx}
                              onClick={() => {
                                if (isStarDisabled) return;
                                setRating(el);
                              }}
                              className={`w-7 h-7 ${
                                el <= rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              } ${
                                isStarDisabled
                                  ? "cursor-not-allowed opacity-60"
                                  : "cursor-pointer"
                              }`}
                            />
                          );
                        })}
                      </div>
                      {!isEditRating ? (
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setOpen(!open)}
                            className="p-2 rounded-full hover:bg-gray-700"
                          >
                            <MoreVertical className="w-5 h-5 text-white" />
                          </button>

                          {open && (
                            <div className="absolute text-white right-0 mt-2 w-40 bg-[#0F1115] border border-gray-700 rounded-lg shadow-lg z-50">
                              <button
                                onClick={() => setIsEditRating(true)}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                              >
                                Edit Rating
                              </button>
                              <button
                                onClick={deleteRating}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                              >
                                Delete Rating
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={postRating}
                            className="bg-[#E8630A] text-base text-white font-bold rounded-lg px-3 py-1 hover:bg-[#C75409] transition-all shadow-md shadow-[#E8630A]/40 hover:shadow-2xl hover:shadow-[#E8630A]/50 hover:scale-105"
                          >
                            {dataRating?.user_rating != null
                              ? "Update Rating"
                              : "Rate"}
                          </button>
                          {isEditRating && dataRating?.user_rating != null && (
                            <button
                              onClick={() => {
                                setIsEditRating(false);
                                setRating(dataRating.user_rating);
                                setOpen(false);
                              }}
                              className="border border-gray-600 text-base text-white font-bold rounded-lg px-3 py-1 hover:bg-gray-700 transition-all"
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="flex items-center gap-3 text-lg sm:text-xl py-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-lg sm:text-2xl">
                        <Star />
                      </span>
                      <span className="text-white font-semibold">
                        {dataRating?.average_rating || 0}
                      </span>
                      <span className="text-gray-400 text-sm">/5</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Users className="text-gray-400" />
                      <span className="text-gray-400 text-sm">
                        {dataRating?.rating_count}
                      </span>
                    </div>
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
              {/* Comment Section */}
              <div className="mt-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8">
                  Comments ({commentCount})
                </h3>

                {isLogin ? (
                  <div className="flex gap-4">
                    <img
                      src={isLogin.profile_picture_url}
                      className="w-10 h-10 rounded-full"
                      alt="Profile"
                    />

                    <div className="flex-1">
                      <input
                        className="w-full text-white bg-transparent border-b border-gray-700 focus:outline-none focus:border-white pb-2"
                        placeholder="Add a Comment..."
                        value={commentText}
                        onClick={() => setActive(true)}
                        onChange={(e) => setCommentText(e.target.value)}
                      />

                      {active && (
                        <div className="flex justify-end gap-4 mt-3">
                          <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm transition"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={postComment}
                            className={`px-4 py-2 rounded-full text-sm ${
                              commentText
                                ? "bg-[#E8630A] text-white font-bold text-lg rounded-full hover:bg-[#C75409] transition-all shadow-xl shadow-[#E8630A]/40 hover:shadow-2xl hover:shadow-[#E8630A]/50 hover:scale-105"
                                : "bg-[#C75409] text-gray-400"
                            }`}
                          >
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* Comments List */}
              <div className="mt-8 space-y-6">
                {dataComment.length > 0 ? (
                  dataComment.map((el) => {
                    return (
                      <Comment
                        key={el.id}
                        comment={el}
                        fetchComment={fetchComment}
                        likeDislikeComment={likeDislikeComment}
                        editComment={editComment}
                        deleteComment={deleteComment}
                      />
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-sm">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
