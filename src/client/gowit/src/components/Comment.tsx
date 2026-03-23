import { useEffect, useState } from "react";
import {
  ArrowBigDown,
  ArrowBigUp,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

import { commentDate } from "../helper/helper";
import { serverApi } from "../api";
import { Link } from "react-router";
import type { CommentType } from "../type";

export default function Comment({
  comment,
  likeDislikeComment,
  editComment,
}: {
  comment: CommentType;
  likeDislikeComment: (comment_id: number, score: number) => Promise<void>;
  editComment: (comment_id: number, content: string) => Promise<void>;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [active, setActive] = useState(false);
  const [text, setText] = useState("");
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [dataReply, setDataReply] = useState<CommentType[]>([]);
  const [userId, setUserId] = useState(0);
  const [ownReply, setOwnReply] = useState(true);

  const cancelReply = () => {
    setText("");
    setActive(false);
  };

  const fetchReply = async () => {
    try {
      const response = await serverApi.get(
        `/api/comments/${comment.id}/replies?sort=created_at&order=DESC`,
      );
      setDataReply(response.data);
    } catch (error) {
      console.log("Error at fetchReply function", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await serverApi.get("/api/me");

      setUserId(response.data.id);
    } catch (error) {
      console.log("Error at Layout:", error);
    }
  };

  const postReply = async () => {
    try {
      if (!text.trim()) return;
      const response = await serverApi.post(
        `/api/films/${comment.film_id}/comments`,
        {
          content: text,
          parent_id: comment.id,
        },
      );
      fetchReply();
      setText("");
      setActive(false);
    } catch (error) {
      console.log("Error at postReply function", error);
    }
  };

  const getVoteValue = (voteState: number, type: "like" | "dislike") => {
    if (type === "like") {
      return voteState === 1 ? 0 : 1;
    }

    return voteState === -1 ? 0 : -1;
  };

  const handleEditStart = (id: number, currentContent: string) => {
    setEditingId(id);
    setEditText(currentContent);
    setOpenMenuKey(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  // const handleEditSubmit = async (id: number) => {
  //   try {
  //     if (!editText.trim()) return;
  //     await serverApi.patch(`/api/comments/${id}`, {
  //       content: editText,
  //     });
  //     setEditingId(null);
  //     setEditText("");
  //     fetchReply();
  //   } catch (error) {
  //     console.log("Error at handleEditSubmit function", error);
  //   }
  // };

  useEffect(() => {
    fetchUser();
    fetchReply();
  }, []);

  return (
    <div className="flex gap-4">
      <Link
        to={`/profile${userId === comment.user_id ? "" : "/" + comment.user_id}`}
      >
        <img
          src={
            comment.profile_picture_url ||
            "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
          }
          className="w-10 h-10 rounded-full mt-0.5"
          alt="Profile"
        />
      </Link>

      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 text-sm text-white mt-0">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${comment.user_id}`}>
              <span className="font-semibold">{comment.username}</span>
            </Link>
            <span className="text-gray-400 text-xs">
              {commentDate(comment.created_at)}
            </span>
          </div>
          {comment.is_owner ? (
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenuKey((prev) =>
                    prev === `comment-${comment.id}`
                      ? null
                      : `comment-${comment.id}`,
                  )
                }
                className="p-1 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {openMenuKey === `comment-${comment.id}` && (
                <div className="absolute right-0 mt-1 w-40 bg-[#1C1E22] border border-gray-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleEditStart(comment.id, comment.content)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition rounded-t-lg"
                  >
                    Edit
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition border-t border-gray-700">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        {editingId === comment.id ? (
          <div className="mt-2">
            <textarea
              className="w-full text-white bg-transparent border border-gray-600 text-sm focus:border-[#E8630A] focus:outline-none pb-2 px-2 py-2 rounded-lg"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={handleEditCancel}
                className="text-gray-400 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await editComment(comment.id, editText);

                  await fetchReply();
                  setEditingId(null);
                  setEditText("");
                }}
                className={`px-4 py-2 rounded-full text-xs ${
                  editText
                    ? "bg-[#E8630A] text-white text-sm font-bold hover:bg-[#C75409] transition-all shadow-xl shadow-[#E8630A]/40"
                    : "bg-[#C75409] text-gray-400 text-sm"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
        )}
        <div className="flex items-center gap-6 text-sm text-gray-400 mt-1">
          <button
            onClick={() =>
              likeDislikeComment(
                comment.id,
                getVoteValue(comment.vote_state, "like"),
              )
            }
            className={`flex items-center gap-2 px-1 py-1 rounded-full text-sm transition ${
              comment.vote_state === 1
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <ArrowBigUp
              className={`w-4 h-4 ${
                comment.vote_state === 1 ? "fill-white " : ""
              }`}
            />
          </button>
          <span>{comment.vote_count}</span>
          <button
            onClick={() =>
              likeDislikeComment(
                comment.id,
                getVoteValue(comment.vote_state, "dislike"),
              )
            }
            className={`flex items-center gap-2 px-1 py-1 rounded-full text-sm transition ${
              comment.vote_state === -1
                ? "fill-text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <ArrowBigDown
              className={`w-4 h-4 ${
                comment.vote_state === -1 ? "fill-white " : ""
              }`}
            />
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
              className="w-full text-white bg-transparent border-b border-gray-600 text-sm focus:border-white focus:outline-none pb-2"
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
                onClick={postReply}
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

        {/* SHOW OWN REPLIES */}
        {ownReply && (
          <div className="mt-3 ml-3 pl-4 space-y-4">
            {dataReply
              .filter((el) => el.user_id === userId)
              .map((reply) => (
                <div key={reply.id} className="flex gap-4">
                  <Link to={`/profile/${reply.user_id}`}>
                    <img
                      src={
                        reply.profile_picture_url ||
                        "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
                      }
                      className="w-8 h-8 rounded-full mt-0.5"
                      alt="Profile"
                    />
                  </Link>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 text-sm text-white mt-0">
                      <div className="flex items-center gap-2">
                        <Link to={`/profile/${reply.user_id}`}>
                          <span className="font-semibold text-sm">
                            {reply.username}
                          </span>
                        </Link>
                        <span className="text-gray-400 text-xs">
                          {commentDate(reply.created_at)}
                        </span>
                      </div>
                      {reply.is_owner ? (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuKey((prev) =>
                                prev === `reply-${reply.id}`
                                  ? null
                                  : `reply-${reply.id}`,
                              )
                            }
                            className="p-1 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </button>
                          {openMenuKey === `reply-${reply.id}` && (
                            <div className="absolute right-0 mt-1 w-40 bg-[#1C1E22] border border-gray-700 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() =>
                                  handleEditStart(reply.id, reply.content)
                                }
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition rounded-t-lg"
                              >
                                Edit
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition border-t border-gray-700">
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {editingId === reply.id ? (
                      <div className="mt-2">
                        <textarea
                          className="w-full text-white bg-transparent border border-gray-600 text-sm focus:border-[#E8630A] focus:outline-none pb-2 px-2 py-2 rounded-lg"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 mt-2">
                          <button
                            onClick={handleEditCancel}
                            className="text-gray-400 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              await editComment(reply.id, editText);
                              await fetchReply();
                              setEditingId(null);
                              setEditText("");
                            }}
                            className={`px-4 py-2 rounded-full text-xs ${
                              editText
                                ? "bg-[#E8630A] text-white text-sm font-bold hover:bg-[#C75409] transition-all shadow-xl shadow-[#E8630A]/40"
                                : "bg-[#C75409] text-gray-400 text-sm"
                            }`}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300 text-sm mt-1">
                        {reply.content}
                      </p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-gray-400 mt-1">
                      <button
                        onClick={async () => {
                          await likeDislikeComment(
                            reply.id,
                            getVoteValue(reply.vote_state, "like"),
                          );
                          await fetchReply();
                        }}
                        className={`flex items-center gap-2 px-1 py-1 rounded-full text-sm transition ${
                          reply.vote_state === 1
                            ? "text-white hover:bg-white/20"
                            : "text-gray-400 hover:bg-white/20"
                        }`}
                      >
                        <ArrowBigUp
                          className={`w-4 h-4 ${
                            reply.vote_state === 1 ? "fill-white " : ""
                          }`}
                        />
                      </button>
                      <span>{reply.vote_count}</span>
                      <button
                        onClick={async () => {
                          await likeDislikeComment(
                            reply.id,
                            getVoteValue(reply.vote_state, "dislike"),
                          );
                          await fetchReply();
                        }}
                        className={`flex items-center gap-2 px-1 py-1 rounded-full text-sm transition ${
                          reply.vote_state === -1
                            ? "fill-text-white hover:bg-white/20"
                            : "text-gray-400 hover:bg-white/20"
                        }`}
                      >
                        <ArrowBigDown
                          className={`w-4 h-4 ${
                            reply.vote_state === -1 ? "fill-white " : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* SHOW REPLIES */}
        {dataReply.length > 0 && (
          <button
            onClick={() => {
              setShowReplies(!showReplies);
              setOwnReply(!ownReply);
            }}
            className="text-white font-bold text-sm mt-2"
          >
            <div className="flex items-center gap-2 hover:bg-white/20 px-1 py-2 rounded-full transition w-max">
              {showReplies ? "Hide Replies" : `${dataReply.length} Replies`}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showReplies ? "rotate-180" : ""}`}
              />
            </div>
          </button>
        )}

        {showReplies && (
          <div className="mt-3 ml-3 border-l border-gray-700 pl-4 space-y-4">
            {dataReply.map((reply) => (
              <div key={reply.id} className="flex gap-4">
                <Link to={`/profile/${reply.user_id}`}>
                  <img
                    src={
                      reply.profile_picture_url ||
                      "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
                    }
                    className="w-8 h-8 rounded-full mt-0.5"
                    alt="Profile"
                  />
                </Link>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 text-sm text-white mt-0">
                    <div className="flex items-center gap-2">
                      <Link to={`/profile/${reply.user_id}`}>
                        <span className="font-semibold text-sm">
                          {reply.username}
                        </span>
                      </Link>
                      <span className="text-gray-400 text-xs">
                        {commentDate(reply.created_at)}
                      </span>
                    </div>
                    {reply.is_owner ? (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenuKey((prev) =>
                              prev === `reply-${reply.id}`
                                ? null
                                : `reply-${reply.id}`,
                            )
                          }
                          className="p-1 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
                        >
                          <MoreVertical className="w-3 h-3" />
                        </button>
                        {openMenuKey === `reply-${reply.id}` && (
                          <div className="absolute right-0 mt-1 w-40 bg-[#1C1E22] border border-gray-700 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() =>
                                handleEditStart(reply.id, reply.content)
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition rounded-t-lg"
                            >
                              Edit
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition border-t border-gray-700">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {editingId === reply.id ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full text-white bg-transparent border border-gray-600 text-sm focus:border-[#E8630A] focus:outline-none pb-2 px-2 py-2 rounded-lg"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="flex justify-end gap-3 mt-2">
                        <button
                          onClick={handleEditCancel}
                          className="text-gray-400 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            await editComment(reply.id, editText);
                            await fetchReply();
                            setEditingId(null);
                            setEditText("");
                          }}
                          className={`px-4 py-2 rounded-full text-xs ${
                            editText
                              ? "bg-[#E8630A] text-white text-sm font-bold hover:bg-[#C75409] transition-all shadow-xl shadow-[#E8630A]/40"
                              : "bg-[#C75409] text-gray-400 text-sm"
                          }`}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-sm mt-1">
                      {reply.content}
                    </p>
                  )}
                  <div className="flex items-center gap-6 text-sm text-gray-400 mt-1">
                    <button
                      onClick={async () => {
                        await likeDislikeComment(
                          reply.id,
                          getVoteValue(reply.vote_state, "like"),
                        );
                        await fetchReply();
                      }}
                      className={`flex items-center gap-2 px-1 py-1 rounded-full text-sm transition ${
                        reply.vote_state === 1
                          ? "text-white hover:bg-white/20"
                          : "text-gray-400 hover:bg-white/20"
                      }`}
                    >
                      <ArrowBigUp
                        className={`w-4 h-4 ${
                          reply.vote_state === 1 ? "fill-white " : ""
                        }`}
                      />
                    </button>
                    <span>{reply.vote_count}</span>
                    <button
                      onClick={async () => {
                        await likeDislikeComment(
                          reply.id,
                          getVoteValue(reply.vote_state, "dislike"),
                        );
                        await fetchReply();
                      }}
                      className={`flex items-center gap-2 px-1 py-1 rounded-full text-sm transition ${
                        reply.vote_state === -1
                          ? "fill-text-white hover:bg-white/20"
                          : "text-gray-400 hover:bg-white/20"
                      }`}
                    >
                      <ArrowBigDown
                        className={`w-4 h-4 ${
                          reply.vote_state === -1 ? "fill-white " : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
