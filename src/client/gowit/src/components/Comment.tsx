import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
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
  fetchComment,
  likeDislikeComment,
  editComment,
  deleteComment,
  focusEditId,
  setFocusEditId,
  activeCommentId,
  setActiveCommentId,
}: {
  comment: CommentType;
  fetchComment: () => Promise<void>;
  likeDislikeComment: (comment_id: number, score: number) => Promise<void>;
  editComment: (
    comment_id: number,
    content: string,
  ) => Promise<boolean | undefined>;
  deleteComment: (comment_id: number) => Promise<void>;
  focusEditId: number | null;
  setFocusEditId: Dispatch<SetStateAction<number | null>>;
  activeCommentId: number | null;
  setActiveCommentId: Dispatch<SetStateAction<number | null>>;
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
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [alertReply, setAlertReply] = useState(false);
  const [showAlertReply, setShowAlertReply] = useState(false);
  const [isEditReplyMode, setIsEditReplyMode] = useState(false);
  const [alertReplyId, setAlertReplyId] = useState(0);
  const [focusEditReplyId, setFocusEditReplyId] = useState<number | null>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);

  const cancelReply = () => {
    setText("");
    setActive(false);
    setActiveCommentId(null);
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

      const responseCheck = await serverApi.post("/api/comments/check", {
        text: text,
      });

      if (responseCheck.data.blocked) {
        setIsEditReplyMode(false); // mode posting, bukan editing
        setAlertReply(true);
        return;
      }

      await serverApi.post(`/api/films/${comment.film_id}/comments`, {
        content: text,
        parent_id: comment.id,
      });
      fetchReply();
      fetchComment();
      setText("");
      setActive(false);
      setActiveCommentId(null);
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
    setActiveCommentId(comment.id);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
    if (activeCommentId === comment.id) {
      setActiveCommentId(null);
    }
  };

  useEffect(() => {
    if (focusEditId === comment.id) {
      handleEditStart(comment.id, editText);
      setFocusEditId(null);
    }
  }, [focusEditId]);

  useEffect(() => {
    if (alertReply) setShowAlertReply(true);
  }, [alertReply]);

  useEffect(() => {
    if (focusEditReplyId !== null) {
      const reply = dataReply.find((r) => r.id === focusEditReplyId);
      if (reply) {
        setEditingId(null);
        setTimeout(() => {
          handleEditStart(focusEditReplyId, editText);
          setFocusEditReplyId(null);
        }, 0);
      }
    }
  }, [focusEditReplyId, dataReply]);

  useEffect(() => {
    if (editingId === comment.id) {
      editTextareaRef.current?.focus();
      const length = editTextareaRef.current?.value.length || 0;
      editTextareaRef.current?.setSelectionRange(length, length);
    }
  }, [editingId]);

  useEffect(() => {
    fetchUser();
    fetchReply();
  }, []);

  return (
    <div className="flex gap-4">
      {comment.is_deleted ? (
        <img
          src={
            comment.profile_picture_url ||
            "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
          }
          className="w-10 h-10 rounded-full mt-0.5 opacity-50 cursor-not-allowed"
          alt="Profile"
        />
      ) : (
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
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 text-sm text-white mt-0">
          <div className="flex items-center gap-2">
            {comment.is_deleted ? (
              <span className="font-semibold text-gray-400">
                {comment.username}
              </span>
            ) : (
              <Link
                to={`/profile${userId === comment.user_id ? "" : "/" + comment.user_id}`}
              >
                <span className="font-semibold">{comment.username}</span>
              </Link>
            )}
            <span className="text-gray-400 text-xs">
              {commentDate(comment.created_at)}
            </span>
            {comment.is_updated && !comment.is_deleted ? (
              <span className="text-gray-400 text-xs">(edited)</span>
            ) : (
              ""
            )}
          </div>
          {comment.is_owner && !comment.is_deleted ? (
            <div className="relative">
              <button
                onClick={() => {
                  const isMenuOpen = openMenuKey === `comment-${comment.id}`;
                  setOpenMenuKey(isMenuOpen ? null : `comment-${comment.id}`);
                  if (!isMenuOpen) {
                    setActiveCommentId(comment.id);
                  } else if (
                    activeCommentId === comment.id &&
                    !editingId &&
                    !active
                  ) {
                    setActiveCommentId(null);
                  }
                }}
                disabled={
                  (activeCommentId !== null &&
                    activeCommentId !== comment.id) ||
                  active === true ||
                  editingId !== null
                }
                className={`p-1 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white ${
                  (activeCommentId !== null &&
                    activeCommentId !== comment.id) ||
                  active === true ||
                  editingId !== null
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {openMenuKey === `comment-${comment.id}` && (
                <div className="absolute right-0 mt-1 w-40 bg-[#1C1E22] border border-gray-700 rounded-lg shadow-lg z-10">
                  <button
                    disabled={active === true}
                    onClick={() => {
                      if (active) return;
                      handleEditStart(comment.id, comment.content);
                      setOpenMenuKey(null);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition rounded-t-lg ${
                      active === true ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                      setOpenMenuKey(null);
                      setActiveCommentId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition border-t border-gray-700"
                  >
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
              ref={editTextareaRef}
            />
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={handleEditCancel}
                className="text-gray-400 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm transition"
              >
                Cancel
              </button>
              <button
                disabled={!editText.trim()}
                onClick={async () => {
                  const success = await editComment(comment.id, editText);
                  setEditingId(null);
                  if (!success) return;
                  await fetchReply();
                  setEditText("");
                  setActiveCommentId(null);
                }}
                className={`px-4 py-2 rounded-full text-xs ${
                  editText.trim()
                    ? "bg-[#E8630A] text-white text-sm font-bold hover:bg-[#C75409] transition-all shadow-xl shadow-[#E8630A]/40 cursor-pointer"
                    : "bg-[#C75409] text-gray-400 text-sm cursor-not-allowed opacity-60"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p
            className={`${comment.is_deleted ? "text-gray-400" : "text-gray-300"} text-sm mt-1 `}
          >
            {comment.content}
          </p>
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
          {userId ? (
            <button
              onClick={() => {
                const newActiveState = !active;
                if (newActiveState) {
                  setActiveCommentId(comment.id);
                } else if (activeCommentId === comment.id) {
                  setActiveCommentId(null);
                }
                setActive(newActiveState);
              }}
              disabled={
                (activeCommentId !== null && activeCommentId !== comment.id) ||
                editingId !== null
              }
              className={`text-white font-bold hover:text-white hover:bg-white/20 px-3 py-2 rounded-full text-sm transition ${
                (activeCommentId !== null && activeCommentId !== comment.id) ||
                editingId !== null
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Reply
            </button>
          ) : (
            ""
          )}
        </div>

        {active && (
          <div className="mt-2">
            <input
              className="w-full text-white bg-transparent border-b border-gray-600 text-sm focus:border-white focus:outline-none pb-2"
              placeholder="Reply to Comments..."
              value={text}
              ref={replyInputRef}
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
                  {reply.is_deleted ? (
                    <img
                      src={
                        reply.profile_picture_url ||
                        "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
                      }
                      className="w-10 h-10 rounded-full mt-0.5 opacity-50 cursor-not-allowed"
                      alt="Profile"
                    />
                  ) : (
                    <Link
                      to={`/profile${userId === reply.user_id ? "" : "/" + reply.user_id}`}
                    >
                      <img
                        src={
                          reply.profile_picture_url ||
                          "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
                        }
                        className="w-10 h-10 rounded-full mt-0.5"
                        alt="Profile"
                      />
                    </Link>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 text-sm text-white mt-0">
                      <div className="flex items-center gap-2">
                        {reply.is_deleted ? (
                          <span className="font-semibold text-gray-400">
                            {reply.username}
                          </span>
                        ) : (
                          <Link
                            to={`/profile${userId === reply.user_id ? "" : "/" + reply.user_id}`}
                          >
                            <span className="font-semibold">
                              {reply.username}
                            </span>
                          </Link>
                        )}
                        <span className="text-gray-400 text-xs">
                          {commentDate(reply.created_at)}
                        </span>
                        {reply.is_updated && !reply.is_deleted ? (
                          <span className="text-gray-400 text-xs">
                            (Edited)
                          </span>
                        ) : (
                          ""
                        )}
                        <span></span>
                      </div>
                      {reply.is_owner && !reply.is_deleted ? (
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
                              <button
                                onClick={async () => {
                                  await deleteComment(reply.id);
                                  await fetchReply();
                                  setOpenMenuKey(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition border-t border-gray-700"
                              >
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
                          autoFocus
                          onFocus={(e) => {
                            const len = e.target.value.length;
                            e.target.setSelectionRange(len, len);
                          }}
                        />
                        <div className="flex justify-end gap-3 mt-2">
                          <button
                            onClick={handleEditCancel}
                            className="text-gray-400 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm transition"
                          >
                            Cancel
                          </button>
                          <button
                            disabled={!editText.trim()}
                            onClick={async () => {
                              if (!editText.trim()) return;

                              const responseCheck = await serverApi.post(
                                "/api/comments/check",
                                {
                                  text: editText,
                                },
                              );

                              if (responseCheck.data.blocked) {
                                setIsEditReplyMode(true); // mode editing
                                setAlertReplyId(reply.id);
                                setAlertReply(true);
                                setOpenMenuKey(null);
                                return;
                              }
                              await editComment(reply.id, editText);
                              await fetchReply();
                              setEditingId(null);
                              setEditText("");
                            }}
                            className={`px-4 py-2 rounded-full text-xs ${
                              editText.trim()
                                ? "bg-[#E8630A] text-white text-sm font-bold hover:bg-[#C75409] transition-all shadow-xl shadow-[#E8630A]/40 cursor-pointer"
                                : "bg-[#C75409] text-gray-400 text-sm cursor-not-allowed opacity-60"
                            }`}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={`${reply.is_deleted ? "text-gray-400" : "text-gray-300"} text-sm mt-1 `}
                      >
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
                {reply.is_deleted ? (
                  <img
                    src={
                      reply.profile_picture_url ||
                      "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
                    }
                    className="w-10 h-10 rounded-full mt-0.5 opacity-50 cursor-not-allowed"
                    alt="Profile"
                  />
                ) : (
                  <Link
                    to={`/profile${userId === reply.user_id ? "" : "/" + reply.user_id}`}
                  >
                    <img
                      src={
                        reply.profile_picture_url ||
                        "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
                      }
                      className="w-10 h-10 rounded-full mt-0.5"
                      alt="Profile"
                    />
                  </Link>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 text-sm text-white mt-0">
                    <div className="flex items-center gap-2">
                      {reply.is_deleted ? (
                        <span className="font-semibold text-gray-400">
                          {reply.username}
                        </span>
                      ) : (
                        <Link
                          to={`/profile${userId === reply.user_id ? "" : "/" + reply.user_id}`}
                        >
                          <span className="font-semibold">
                            {reply.username}
                          </span>
                        </Link>
                      )}
                      <span className="text-gray-400 text-xs">
                        {commentDate(reply.created_at)}
                      </span>
                      {reply.is_updated && !reply.is_deleted ? (
                        <span className="text-gray-400 text-xs">(Edited)</span>
                      ) : (
                        ""
                      )}
                    </div>
                    {reply.is_owner && !reply.is_deleted ? (
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
                            <button
                              onClick={async () => {
                                await deleteComment(reply.id);
                                await fetchReply();
                                setOpenMenuKey(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition border-t border-gray-700"
                            >
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
                        autoFocus
                        onFocus={(e) => {
                          const len = e.target.value.length;
                          e.target.setSelectionRange(len, len);
                        }}
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
                            if (!editText.trim()) return;

                            const responseCheck = await serverApi.post(
                              "/api/comments/check",
                              {
                                text: editText,
                              },
                            );

                            if (responseCheck.data.blocked) {
                              setIsEditReplyMode(true); // mode editing
                              setAlertReplyId(reply.id);
                              setAlertReply(true);
                              setOpenMenuKey(null);
                              return;
                            }
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
                    <p
                      className={`${reply.is_deleted ? "text-gray-400" : "text-gray-300"} text-sm mt-1 `}
                    >
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
      {alertReply && (
        <div
          onClick={() => setAlertReply(false)}
          className={`fixed inset-0 z-50 flex justify-center items-center min-h-screen bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            showAlertReply ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-[#0F1115] rounded-[2.5rem] p-10 max-w-sm w-full transition-all duration-300 ${
              showAlertReply ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <div className="flex flex-col items-center mb-8">
              <div className="mb-3">
                <div className="bg-white/5 border border-rose-900/30 p-6 rounded-[2rem] shadow-[0_0_60px_rgba(244,63,94,0.15)]">
                  <svg
                    className="w-10 h-10 text-rose-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                Comment Etiquette
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We've detected language that may be inconsistent with our
                community guidelines. Let's keep the conversation professional
                and constructive.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  if (isEditReplyMode) {
                    setAlertReply(false);
                    setShowAlertReply(false);
                    setFocusEditReplyId(alertReplyId);
                  } else {
                    setAlertReply(false);
                    setShowAlertReply(false);
                    setActive(true);
                    setTimeout(() => replyInputRef.current?.focus(), 50);
                  }
                }}
                className="w-full bg-[#E8630A] hover:bg-[#C75409] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#E8630A]/20 active:scale-[0.98]"
              >
                Edit {isEditReplyMode ? "Reply" : "Reply"}
              </button>
              <button
                onClick={async () => {
                  if (isEditReplyMode && alertReplyId) {
                    await deleteComment(alertReplyId);
                    setEditingId(null);
                    await fetchReply();
                  } else {
                    setText("");
                    setActive(false);
                  }

                  setAlertReply(false);
                  setShowAlertReply(false);
                  setIsEditReplyMode(false);
                  setActiveCommentId(null);
                  setAlertReplyId(0);
                }}
                className="w-full py-3 text-gray-500 hover:text-red-500 transition-colors font-medium text-sm"
              >
                Delete {isEditReplyMode ? "Reply" : "Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
