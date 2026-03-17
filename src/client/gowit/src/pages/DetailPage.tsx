import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { MovieType } from "../type";
import { serverApi } from "../api";
import { errorAlert } from "../helper/errorAlert";
import Swal from "sweetalert2";
import axios from "axios";
import { capitalizeEachWord } from "../helper/helper";
import Navbar from "../components/Navbar";

type ReplyType = {
  user: string;
  text: string;
  likes: number;
  dislikes: number;
  userVote: "like" | "dislike" | null;
};

type CommentType = {
  id: number;
  user: string;
  text: string;
  likes: number;
  dislikes: number;
  userVote: "like" | "dislike" | null;
  replies: ReplyType[];
};

const currentUser = "Kpinn"; //for example, nanti bisa diganti dengan data user yang login
const Reply = ({ reply, likeReply, dislikeReply, commentId, index }: {
  reply: ReplyType;
  likeReply: (commentId: number, index: number) => void;
  dislikeReply: (commentId: number, index: number) => void;
  commentId: number;
  index: number;
}) => {
  return (
    <div className="flex gap-3">
      <img src="../images/profilicon.png" className="w-8 h-8 rounded-full" alt="Profile" /> // Bisa diganti dengan avatar user yang reply
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">@{reply.user}</span>
          <span className="text-gray-400 text-xs">1 tahun lalu</span>
        </div>
        <p className="text-gray-300 text-sm">{reply.text}</p>
        <div className="flex gap-5 text-xs text-gray-400 mt-1">
          <button
            onClick={() => likeReply(commentId, index)}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition ${
              reply.userVote === "like"
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <i className="fa fa-thumbs-up"></i>
            <span>{reply.likes}</span>
          </button>
          <button
            onClick={() => dislikeReply(commentId, index)}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition ${
              reply.userVote === "dislike"
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <i className="fa fa-thumbs-down"></i>
            <span>{reply.dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Comment = ({ comment, onReply, likeComment, dislikeComment, likeReply, dislikeReply }: {
  comment: CommentType;
  onReply: (commentId: number, text: string) => void;
  likeComment: (id: number) => void;
  dislikeComment: (id: number) => void;
  likeReply: (commentId: number, index: number) => void;
  dislikeReply: (commentId: number, index: number) => void;
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [active, setActive] = useState(false);
  const [text, setText] = useState("");

  const handleReply = () => {
    if (!text.trim()) return;
    onReply(comment.id, text);
    setText("");
    setActive(false);
  };

  const cancelReply = () => {
    setText("");
    setActive(false);
  };

  return (
    <div className="flex gap-4">
      <img src="../images/profilicon.png" className="w-10 h-10 rounded-full" alt="Profile" /> // Bisa diganti dengan avatar user yang komentar
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">@{comment.user}</span>
          <span className="text-gray-400 text-xs">1 tahun lalu</span>
        </div>
        <p className="text-gray-300 text-sm">{comment.text}</p>
        <div className="flex gap-6 text-sm text-gray-400 mt-1">
          <button
            onClick={() => likeComment(comment.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition ${
              comment.userVote === "like"
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <i className="fa fa-thumbs-up"></i>
            <span>{comment.likes}</span>
          </button>
          <button
            onClick={() => dislikeComment(comment.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition ${
              comment.userVote === "dislike"
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <i className="fa fa-thumbs-down"></i>
            <span>{comment.dislikes}</span>
          </button>
          <button
            onClick={() => setActive(!active)}
            className="text-white font-bold hover:text-white hover:bg-white/20 px-3 py-2 rounded-full text-sm transition"
          >
            Reply
          </button>
        </div>

        {active && (
          <div className="mt-2">
            <input
              className="w-full bg-transparent border-b border-gray-600 text-sm focus:border-white focus:outline-none pb-2"
              placeholder="Reply to Comments..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={cancelReply}
                className="text-gray-400 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                className={`px-4 py-2 rounded-full text-xs ${
                  text
                    ? "bg-[#E8630A] text-white text-sm font-bold rounded-full hover:bg-[#C75409] transition-all shadow-xl shadow-[#E8630A]/40 hover:shadow-2xl hover:shadow-[#E8630A]/50 hover:scale-105"
                    : "bg-[#C75409] text-gray-400 text-sm"
                }`}
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {/* SHOW REPLIES */}
        {comment.replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-white font-bold text-sm mt-2"
          >
            <div className="flex items-center gap-2 hover:bg-white/20 px-4 py-3 rounded-full transition w-max">
              {showReplies ? "Hide Replies" : `${comment.replies.length} Replies`}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className={`w-3 h-3 transition-transform ${showReplies ? "rotate-180" : ""}`}
              >
                <path
                  fill="rgb(255, 255, 255)"
                  d="M297.4 566.6C309.9 579.1 330.2 579.1 342.7 566.6L502.7 406.6C515.2 394.1 515.2 373.8 502.7 361.3C490.2 348.8 469.9 348.8 457.4 361.3L352 466.7L352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 466.7L182.6 361.3C170.1 348.8 149.8 348.8 137.3 361.3C124.8 373.8 124.8 394.1 137.3 406.6L297.3 566.6z"
                />
              </svg>
            </div>
          </button>
        )}

        {showReplies && (
          <div className="mt-3 ml-3 border-l border-gray-700 pl-4 space-y-4">
            {comment.replies.map((r, i) => (
              <Reply
                key={i}
                reply={r}
                commentId={comment.id}
                index={i}
                likeReply={likeReply}
                dislikeReply={dislikeReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentSection = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [text, setText] = useState("");
  const [active, setActive] = useState(false);

  const addComment = () => {
    if (!text.trim()) return;
    setComments([
      {
        id: Date.now(),
        user: currentUser,
        text: text,
        likes: 0,
        dislikes: 0,
        userVote: null,
        replies: [],
      },
      ...comments,
    ]);
    setText("");
    setActive(false);
  };

  const cancelComment = () => {
    setText("");
    setActive(false);
  };

  const addReply = (commentId: number, text: string) => {
    setComments(comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              user: currentUser,
              text: text,
              likes: 0,
              dislikes: 0,
              userVote: null,
            },
          ],
        };
      }
      return c;
    }));
  };

  const likeComment = (id: number) => {
    setComments(comments.map((c) => {
      if (c.id === id) {
        if (c.userVote === "like") {
          return { ...c, likes: c.likes - 1, userVote: null };
        }
        if (c.userVote === "dislike") {
          return { ...c, likes: c.likes + 1, dislikes: c.dislikes - 1, userVote: "like" };
        }
        return { ...c, likes: c.likes + 1, userVote: "like" };
      }
      return c;
    }));
  };

  const dislikeComment = (id: number) => {
    setComments(comments.map((c) => {
      if (c.id === id) {
        if (c.userVote === "dislike") {
          return { ...c, dislikes: c.dislikes - 1, userVote: null };
        }
        if (c.userVote === "like") {
          return { ...c, likes: c.likes - 1, dislikes: c.dislikes + 1, userVote: "dislike" };
        }
        return { ...c, dislikes: c.dislikes + 1, userVote: "dislike" };
      }
      return c;
    }));
  };

  const likeReply = (commentId: number, index: number) => {
    setComments(comments.map((c) => {
      if (c.id === commentId) {
        const replies = [...c.replies];
        const r = { ...replies[index] };
        if (r.userVote === "like") {
          r.likes--;
          r.userVote = null;
        } else if (r.userVote === "dislike") {
          r.dislikes--;
          r.likes++;
          r.userVote = "like";
        } else {
          r.likes++;
          r.userVote = "like";
        }
        replies[index] = r;
        return { ...c, replies };
      }
      return c;
    }));
  };

  const dislikeReply = (commentId: number, index: number) => {
    setComments(comments.map((c) => {
      if (c.id === commentId) {
        const replies = [...c.replies];
        const r = { ...replies[index] };
        if (r.userVote === "dislike") {
          r.dislikes--;
          r.userVote = null;
        } else if (r.userVote === "like") {
          r.likes--;
          r.dislikes++;
          r.userVote = "dislike";
        } else {
          r.dislikes++;
          r.userVote = "dislike";
        }
        replies[index] = r;
        return { ...c, replies };
      }
      return c;
    }));
  };

  return (
    <div className="text-white">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold">{comments.length} Comments</h3>
      </div>

      {/* INPUT KOMENTAR */}
      <div className="flex gap-4">
        <img src="../images/profilicon.png" className="w-10 h-10 rounded-full" alt="Profile" /> // Bisa diganti dengan avatar user yang login
        <div className="flex-1">
          <input
            className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white pb-2"
            placeholder="Add a Comment..."
            value={text}
            onClick={() => setActive(true)}
            onChange={(e) => setText(e.target.value)}
          />
          {active && (
            <div className="flex justify-end gap-4 mt-3">
              <button
                onClick={cancelComment}
                className="text-gray-400 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={addComment}
                className={`px-4 py-2 rounded-full text-sm ${
                  text
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

      {/* LIST KOMENTAR */}
      <div className="mt-8 space-y-6">
        {comments.map((c) => (
          <Comment
            key={c.id}
            comment={c}
            onReply={addReply}
            likeComment={likeComment}
            dislikeComment={dislikeComment}
            likeReply={likeReply}
            dislikeReply={dislikeReply}
          />
        ))}
      </div>
    </div>
  );
};

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

                  <p className="text-gray-300">
                    {detailMovie?.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={addMovieToFavorites}
                  className="bg-[#E50914] hover:bg-red-800 text-white px-5 py-3 rounded-lg font-bold"
                >
                  Add to Watchlist
                </button>
              </div>

              <div className="mt-10 border-t border-gray-700 pt-6">
                <CommentSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
