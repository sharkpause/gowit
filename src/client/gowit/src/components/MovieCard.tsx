import { Star } from "lucide-react";

export default function MovieCard({
  poster_url,
  rating,
  title,
  description,
  year,
  rank,
}: {
  poster_url: string;
  rating: number;
  title: string;
  description: string;
  year: number;
  rank: number;
}) {
  return (
    <div className="w-48 md:w-56 lg:w-64 bg-[#1C1E22] rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all duration-300 ">
      <div className="relative">
        <div className="absolute top-0 left-0 bg-gradient-to-br from-yellow-400 to-amber-600 text-black font-bold px-3 py-1 rounded-br-lg shadow-lg z-10">
          <span className="text-lg">#{rank}</span>
        </div>

        <img
          src={poster_url}
          alt="Movie Poster"
          className="w-full h-72 object-cover"
        />
      </div>
      <div className="bg-gray-900 h-full py-2 px-3 text-[#F5F2F2]">
        <div className="flex items-center gap-1 mt-1">
          <span>
            <Star className="h-4 w-4 text-amber-300 " />
          </span>
          <p className="text-sm text-gray-400">{rating}</p>
        </div>
        <p className="mt-2 font-bold">{title}</p>

        <p className="mt-1 text-gray-400">
          {description.length <= 100
            ? description
            : description.substring(0, 100) + "..."}
        </p>
        <p className="text-sm mt-5 mb-2 text-[#F5F2F2]">{year}</p>
      </div>
    </div>
  );
}
