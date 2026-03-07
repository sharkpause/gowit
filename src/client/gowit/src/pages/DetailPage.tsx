import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { MovieType } from "../type";
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
      console.log(response.data.isFavorite);
    } catch (error) {
      console.log("Error at CheckFavoriteMovie function:", error);
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

      navigate("/watchlist");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        errorAlert(capitalizeEachWord(error.response?.data.error));
      }
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !commentText) return;

    const newComment: CommentType = {
      username,
      comment: commentText,
      date: new Date().toLocaleDateString(),
      likes: 0,
      dislikes: 0,
      userVote: null,
    };

    setComments([newComment, ...comments]);
    setUsername("");
    setCommentText("");
  };

  const handleVote = (index: number, type: "like" | "dislike") => {
    const updatedComments = [...comments];

    const comment = updatedComments[index];

    if (comment.userVote) return; // anti double vote

    if (type === "like") {
      comment.likes += 1;
      comment.userVote = "like";
    } else {
      comment.dislikes += 1;
      comment.userVote = "dislike";
    }

    setComments(updatedComments);
  };

  useEffect(() => {
    fetchMovie();
    checkFavoriteMovie();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="bg-[#0F1115] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-10 ">
          <div className="bg-[#0B0C0D] border border-gray-800 rounded-lg p-8 shadow-xl mt-12">
            <h2 className="text-white mb-6 font-bold text-3xl">
              {detailMovie?.title}
            </h2>

            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-black">
              <iframe
                className="w-full h-full"
                src={detailMovie?.trailer_url}
              ></iframe>
            </div>

            <div className="mt-6 bg-black rounded-md p-6">
              {/* Movie Info */}
              <div className="grid md:grid-cols-3 gap-6">
                <img
                  src={detailMovie?.poster_image_url}
                  className="rounded-lg shadow-lg"
                  alt="Poster"
                />

                <div className="md:col-span-2 space-y-4">
                  <h1 className="text-3xl font-bold text-white">
                    {detailMovie?.title}
                  </h1>

                  <p className="text-gray-300">{detailMovie?.description}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={addMovieToFavorites}
                  className={` ${isFavorited ? "bg-[#E8630A]/60 hover:bg-[#E8630A]/50 text-white/60 cursor-not-allowed" : "bg-[#E8630A] hover:bg-[#C75409] text-white cursor-pointer"} text-white px-5 py-3 rounded-lg transition flex items-center gap-2 font-bold`}
                  disabled={isFavorited}
                >
                  {isFavorited ? "Added to Watchlist" : "Add to Watchlist"}
                </button>
              </div>

              {/* ================= COMMENT SECTION ================= */}

              <div className="mt-10 border-t border-gray-700 pt-6">
                <h3 className="text-2xl text-white mb-4 font-semibold">
                  Comments ({comments.length})
                </h3>

                <form onSubmit={handleAddComment} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800 text-white"
                  />

                  <textarea
                    placeholder="Write your comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800 text-white"
                  />

                  <button className="bg-[#E8630A] hover:bg-[#C75409] px-6 py-2 rounded text-white font-semibold transition">
                    Post Comment
                  </button>
                </form>

                <div className="mt-6 space-y-4">
                  {comments.map((c, index) => (
                    <div
                      key={index}
                      className="bg-gray-900 p-4 rounded border border-gray-700"
                    >
                      <div className="flex justify-between">
                        <h4 className="text-orange-400 font-semibold">
                          {c.username}
                        </h4>
                        <span className="text-gray-400 text-sm">{c.date}</span>
                      </div>

                      <p className="text-gray-300 mt-2">{c.comment}</p>

                      <div className="flex gap-6 mt-3 text-gray-400">
                        <button
                          onClick={() => handleVote(index, "like")}
                          className="hover:text-white"
                        >
                          👍 {c.likes}
                        </button>

                        <button
                          onClick={() => handleVote(index, "dislike")}
                          className="hover:text-white"
                        >
                          👎 {c.dislikes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
