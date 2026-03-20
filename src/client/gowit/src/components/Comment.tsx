import { useState } from "react";
import { ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react";
import type { CommentType, ReplyType } from "../type";

const Reply = ({
  reply,
  commentId,
  index,
}: {
  reply: ReplyType;
  commentId: number;
  index: number;
}) => {
  return (
    <div className="flex gap-3">
      <img
        src="/profilicon.png"
        className="w-8 h-8 rounded-full"
        alt="Profile"
        onError={(e) => (e.currentTarget.src = "/profilicon.png")}
      />
      {/* Bisa diganti dengan avatar user yang reply */}
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">@{reply.user}</span>
          <span className="text-gray-400 text-xs">1 tahun lalu</span>
        </div>
        <p className="text-gray-300 text-sm">{reply.text}</p>
        <div className="flex gap-5 text-xs text-gray-400 mt-1">
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition ${
              reply.userVote === "like"
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{reply.likes}</span>
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition ${
              reply.userVote === "dislike"
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{reply.dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

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
        src="/profilicon.png"
        className="w-10 h-10 rounded-full"
        alt="Profile"
        onError={(e) => (e.currentTarget.src = "/profilicon.png")}
      />
      {/* Bisa diganti dengan avatar user yang komentar */}
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">@{comment.user}</span>
          <span className="text-gray-400 text-xs">1 tahun lalu</span>
        </div>
        <p className="text-gray-300 text-sm">{comment.text}</p>
        <div className="flex gap-6 text-sm text-gray-400 mt-1">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition ${
              comment.userVote === "like"
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{comment.likes}</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition ${
              comment.userVote === "dislike"
                ? "text-white hover:bg-white/20"
                : "text-gray-400 hover:bg-white/20"
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
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

        {showReplies && (
          <div className="mt-3 ml-3 border-l border-gray-700 pl-4 space-y-4">
            {comment.replies.map((r, i) => (
              <Reply key={i} reply={r} commentId={comment.id} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
