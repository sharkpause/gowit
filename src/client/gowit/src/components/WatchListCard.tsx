import { Dot, NotebookPen, Star, X } from "lucide-react";
import { useState, type Dispatch } from "react";

export default function WatchListCard({
  id,
  poster_url,
  rating,
  title,
  description,
  year,
  minute,
  notes,
  isShared,
  onOpenNote,
}: {
  id: number;
  poster_url: string;
  rating: number;
  title: string;
  description: string;
  year: number;
  minute: number;
  notes: string;
  isShared: boolean;
  onOpenNote: () => void;
}) {
  return (
    <>
      <div
        onClick={onOpenNote}
        className={`w-48 md:w-56 lg:w-64 bg-[#1C1E22] rounded-lg overflow-hidden shadow-lg transition-transform duration-200 hover:scale-102 hover:shadow-2xl hover:shadow-black/50 ${isShared ? "" : "cursor-pointer"}`}
      >
        <div className="relative">
          <img
            src={poster_url}
            alt="Movie Poster"
            className="w-full h-72 object-cover"
          />
          {notes && notes.trim() && (
            <div className="absolute left-0 top-0 z-20 bg-[#E8630A] text-white shadow-lg shadow-black text-xs font-semibold px-3 py-1 rounded-br-lg">
              Noted
            </div>
          )}
        </div>
        <div className="bg-gray-900 h-full py-2 px-3 text-[#F5F2F2]">
          <div className="flex items-center gap-1 mt-1">
            <span>
              <Star className="h-4 w-4 text-amber-300" />
            </span>
            <p className="text-sm text-gray-400">{rating}</p>
          </div>
          <p className="mt-2 font-bold">{title}</p>

          <p className="mt-1 text-gray-400">
            {(description ?? "").length <= 100
              ? description
              : (description ?? "").substring(0, 100) + "..."}
          </p>

          <div className="flex items-center text-sm mt-5 mb-2 text-[#F5F2F2]">
            <p>{year}</p>
            <Dot />
            <p>{minute}m</p>
          </div>
        </div>
      </div>
    </>
  );
}
