import { Play, Plus } from "lucide-react";

export default function TrailerCard({
  image_url,
  duration,
  date,
  title,
}: {
  image_url: string;
  duration: number;
  date: string;
  title: string;
}) {
  // Format duration from seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();
  };

  return (
    <div className="w-full max-w-[320px] rounded-xl overflow-hidden  cursor-pointer">
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        <img
          src={image_url}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-4 left-5 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-5 h-5 text-black fill-black ml-0.5" />
        </div>

        <div className="absolute bottom-6 left-17 text-white font-bold text-md">
          {formatDuration(duration)}
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-4 flex items-center gap-4">
        <div className="w-12 h-12 border-2 border-gray-500 rounded-md flex items-center justify-center hover:border-white transition-colors">
          <Plus className="w-6 h-6 text-gray-300" />
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-sm font-semibold">
            {formatDate(date)}
          </span>
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
}
