import { Dot, NotebookPen, Star, X } from "lucide-react";
import { useState } from "react";

export default function WatchListCard({
  poster_url,
  rating,
  title,
  description,
  year,
  minute,
}: {
  poster_url: string;
  rating: number;
  title: string;
  description: string;
  year: number;
  minute: number;
}) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  return (
    <>
      <div
        onClick={() => setShowNote(true)}
        className="w-48 md:w-56 lg:w-64 bg-[#1C1E22] rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform duration-200 hover:scale-102 hover:shadow-2xl hover:shadow-black/50"
      >
        <img
          src={poster_url}
          alt="Movie Poster"
          className="w-full h-72 object-cover"
        />
        <div className="bg-gray-900 h-full py-2 px-3 text-[#F5F2F2]">
          <div className="flex items-center gap-1 mt-1">
            <span>
              <Star className="h-4 w-4 text-amber-300" />
            </span>
            <p className="text-sm text-gray-400">{rating}</p>
          </div>
          <p className="mt-2 font-bold">{title}</p>

          <p className="mt-1 text-gray-400">
            {description.length <= 100
              ? description
              : description.substring(0, 100) + "..."}
          </p>

          <div className="flex items-center text-sm mt-5 mb-2 text-[#F5F2F2]">
            <p>{year}</p>
            <Dot />
            <p>{minute}m</p>
          </div>
        </div>
      </div>

      {showNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowNote(false)}
        >
          <div
            className="relative bg-[#1C1E22] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#F5F2F2]">
                <NotebookPen size={18} className="text-[#E50914]" />
                <h3 className="font-semibold text-lg">My Note</h3>
              </div>
              <button
                onClick={() => setShowNote(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-3">
              <span className="text-[#F5F2F2] font-medium">{title}</span>{" "}
              &mdash; {year}
            </p>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write Your Note About This Film..."
              rows={5}
              className="w-full bg-[#0F1115] text-[#F5F2F2] placeholder-gray-500 border border-white/10 focus:border-white/30 focus:outline-none rounded-xl px-4 py-3 resize-none text-sm"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowNote(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNote(false)}
                className="px-5 py-2 text-sm bg-[#E50914] hover:bg-[#b20710] text-white font-semibold rounded-lg transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
