import { FilePlay, Play, X } from "lucide-react";
import { useState } from "react";

export default function TrailerCard({
  image_url,
  duration,
  date,
  title,
  trailer_url,
}: {
  image_url: string;
  duration: number;
  date: string;
  title: string;
  trailer_url: string;
}) {
  const [showTrailer, setShowTrailer] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      {showTrailer && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-2xl mx-4 bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-white font-semibold text-sm truncate">
                {title}
              </h3>
              <button
                type="button"
                onClick={() => setShowTrailer(false)}
                className="text-gray-400 hover:text-white transition-colors ml-4 shrink-0"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={trailer_url}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[320px] rounded-xl overflow-hidden group">
        <div className="relative aspect-video bg-gray-900 overflow-hidden">
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <button
            type="button"
            onClick={() => setShowTrailer(true)}
            className="absolute bottom-4 left-5 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer"
          >
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </button>

          <div className="absolute bottom-6 left-17 text-white font-bold text-md">
            {formatDuration(duration)}
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-4 flex items-center gap-4">
          <div className="w-12 h-12 border-2 border-gray-500 rounded-md flex items-center justify-center transition-colors">
            <FilePlay className="w-6 h-6 text-gray-300" />
          </div>

          <div className="flex flex-col">
            <span className="text-gray-400 text-sm font-semibold">
              {formatDate(date)}
            </span>
            <h3 className="text-white text-lg font-semibold">{title}</h3>
          </div>
        </div>
      </div>
    </>
  );
}
