import { Heart, X } from "lucide-react";
import { Link } from "react-router";
import MovieCard from "../components/MovieCard";
import type { MovieWatchlist } from "../type";
import WatchListCard from "../components/WatchListCard";

export default function FavoritePage() {
  const data = [
    {
      title: "Title",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      poster_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jp",
      rating: 9.1,
      year: 2025,
      minute: 128,
    },
    {
      title: "Title",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      poster_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jp",
      rating: 9.1,
      year: 2025,
      minute: 128,
    },
    {
      title: "Title",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      poster_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jp",
      rating: 9.1,
      year: 2025,
      minute: 128,
    },
    {
      title: "Title",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      poster_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jp",
      rating: 9.1,
      year: 2025,
      minute: 128,
    },
    {
      title: "Title",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      poster_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jp",
      rating: 9.1,
      year: 2025,
      minute: 128,
    },
    {
      title: "Title",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      poster_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jp",
      rating: 9.1,
      year: 2025,
      minute: 128,
    },
    {
      title: "Title",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      poster_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jp",
      rating: 9.1,
      year: 2025,
      minute: 128,
    },
    {
      title: "Title",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      poster_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jp",
      rating: 9.1,
      year: 2025,
      minute: 128,
    },
    {
      title: "Title",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      poster_url:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jp",
      rating: 9.1,
      year: 2025,
      minute: 128,
    },
  ];

  return (
    <div className="bg-[#0F1115] overflow-hidden px-4 md:px-8 lg:px-32 pt-32 pb-16">
      {data.length > 0 ? (
        <div className="min-h-screen flex flex-wrap gap-16">
          {data.map((el: MovieWatchlist, idx: number) => {
            return (
              <div className="relative flex-shrink-0" key={idx}>
                <button
                  className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-all shadow-lg hover:scale-110"
                  aria-label="Remove from watchlist"
                >
                  <X className="w-4 h-4" />
                </button>
                <WatchListCard
                  title={el.title}
                  rating={el.rating}
                  description={el.description}
                  poster_url={el.poster_url}
                  year={el.year}
                  minute={el.minute}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="min-h-screen flex flex-col justify-center items-center text-[#F5F2F2] space-y-4">
          <Heart className="w-40 h-40 font-thin" />
          <h1 className="text-2xl mt-1">Your Watchlist has no titles yet.</h1>
          <p className="text-md font-light text-gray-400">
            Keep track of movies and TV shows you want to watch.
          </p>
          <Link
            to="/"
            className="mt-2 bg-[#E50914] rounded-lg p-3 hover:bg-[#E50914]/90 transition-all shadow-xl shadow-[#E50914]/40 hover:shadow-2xl hover:shadow-[#E50914]/50 hover:scale-105"
          >
            Explore Movies
          </Link>
        </div>
      )}
    </div>
  );
}
