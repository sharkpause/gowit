import { useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import type { CommentType } from "../type";
import { commentDate } from "../helper/helper";

export default function Comment({ comment }: { comment: CommentType }) {
  const [showReplies, setShowReplies] = useState(false);
  const [active, setActive] = useState(false);
  const [text, setText] = useState("");

  const handleReply = () => {
    if (!text.trim()) return;

    setText("");
    setActive(false);
  };

  const cancelReply = () => {
    setText("");
    setActive(false);
  };

  return (
    <div className="flex gap-4">
      <img
        src={
          comment.profile_picture_url ||
          "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
        }
        className="w-10 h-10 rounded-full"
        alt="Profile"
      />
      {/* Bisa diganti dengan avatar user yang komentar */}
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-white">
          <span className="font-semibold">{comment.username}</span>
          <span className="text-gray-400 text-xs">
            {commentDate(comment.created_at)}
          </span>
        </div>
        <p className="text-gray-300 text-sm">{comment.content}</p>
        <div className="flex gap-6 text-sm text-gray-400 mt-1">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition ${
              comment.vote_state === 1
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <ArrowBigUp className="w-4 h-4" />
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition ${
              comment.vote_state === -1
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <ArrowBigDown className="w-4 h-4" />
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
        {/* {comment.replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-white font-bold text-sm mt-2"
          >
            <div className="flex items-center gap-2 hover:bg-white/20 px-4 py-3 rounded-full transition w-max">
              {showReplies
                ? "Hide Replies"
                : ${comment.replies.length} Replies}
              <ChevronDown
                className={w-4 h-4 transition-transform ${showReplies ? "rotate-180" : ""}}
              />
            </div>
          </button>
        )} */}
        {/* 
        {showReplies && (
          <div className="mt-3 ml-3 border-l border-gray-700 pl-4 space-y-4">
            {comment.replies.map((r, i) => (
              <Reply key={i} reply={r} commentId={comment.id} index={i} />
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
}
