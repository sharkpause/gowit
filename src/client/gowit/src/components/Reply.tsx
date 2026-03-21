import { House, ThumbsDown, ThumbsUp } from "lucide-react";
import type { CommentType } from "../type";
import { useState } from "react";
import { commentDate } from "../helper/helper";

export default function Reply({ reply }: { reply: CommentType }) {
  return (
    <>
      <div className="flex gap-3">
        <img
          src="/profilicon.png"
          className="w-8 h-8 rounded-full"
          alt="Profile"
        />
        {/* Bisa diganti dengan avatar user yang reply */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">@{reply.user_name}</span>
            <span className="text-gray-400 text-xs">
              {commentDate(reply.created_at)}
            </span>
          </div>
          <p className="text-gray-300 text-sm">{reply.content}</p>
          <div className="flex gap-5 text-xs text-gray-400 mt-1">
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition ${
                reply.user_name === "like"
                  ? "text-white hover:bg-white/20"
                  : "text-gray-400 hover:bg-white/20"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{reply.vote_count}</span>
            </button>
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition ${
                reply.user_name === "dislike"
                  ? "text-white hover:bg-white/20"
                  : "text-gray-400 hover:bg-white/20"
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{reply.vote_count}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
