import { useEffect, useMemo, useState } from "react";
import LightRays from "../components/LightRays";
import { ArrowLeft, ArrowRight, Film } from "lucide-react";
// import MovieCard from "../components/MovieCard";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import TrailerCard from "../components/TrailerCard";
import Footer from "../components/Footer";

export default function HomePage() {
  const [previous, setPrevious] = useState(false);
  const [next, setNext] = useState(true);
  const [movieFeatured, setMovieFeatured] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [visibleFeatured, setVisibleFeatured] = useState(0);

  async function fetchFeaturedMovies() {
    // Simulate fetching featured movies\
    try {
      const response = await axios.get("");
      setMovieFeatured(response.data.films);
    } catch (error) {
      console.log("Error fetching featured movies:", error);
    }
  }

  useEffect(() => {
    fetchFeaturedMovies();
  }, []);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1280) return setVisibleFeatured(5); // xl
      if (w >= 1024) return setVisibleFeatured(4); // lg
      if (w >= 768) return setVisibleFeatured(3); // md
      return setVisibleFeatured(2); // sm / hp
    };

    calc();
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("resize", calc);
    };
  }, []);

  const wFeatured = 208;
  const gapFeatured = 40;
  let total = 6;
  const step = wFeatured + gapFeatured;
  if (Array.isArray(movieFeatured)) {
    total = movieFeatured.length;
  }
  const maxIndex = Math.max(0, total - visibleFeatured);
  console.log(maxIndex);

  const prevFeatured = () => setIndex((i) => i - 1);
  const nextFeatured = () => setIndex((i) => i + 1);

  const translateX = useMemo(() => {
    return -(index * step);
  }, [index, step]);

  return (
    <>
      <section className=" min-h-screen bg-[#0F1115] ">
        {/* Background Image with Opacity */}
        <div
          className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: "url('/netflix.jpg')" }}
        />

        {/* Light Rays Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <LightRays />
        </div>

        <div className="relative flex flex-col z-10 min-h-screen justify-center items-center px-6 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl  font-bold text-[#F5F2F2] mt-8 ">
            Discover Movies with Smarter Insights
          </h1>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5F2F2] mt-4 ">
            Built for discovery, powered by data.
          </h1>

          <p className="text-lg md:text-xl lg:text-xl text-[#F5F2F2]/80 mt-5 max-w-2xl">
            Explore films, track your favorites, and never miss what to watch
            next.
          </p>
          <div className="flex gap-4 mt-8">
            <button className="px-8 py-3  bg-[#E50914] text-white font-semibold rounded-full hover:bg-[#E50914]/90 transition-all shadow-lg shadow-[#E50914]/30">
              Get Started
            </button>
            <button className="px-8 py-3 bg-white/10 text-[#F5F2F2] font-semibold rounded-full hover:bg-white/20 transition-all ring-1 ring-white/20 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-32 pt-32 pb-16">
          <h1
            className="text-[#F5F2F2] text-4xl font-bold mb-5"
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Featured Today
          </h1>

          <div className="relative overflow-hidden">
            <div
              className="flex gap-10 transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${translateX}px)`,
              }}
            >
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jpg"
                alt="Movie Poster"
                className="h-72 w-52 flex-shrink-0 flex-grow-1 object-cover rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-102 hover:shadow-2xl hover:shadow-red-500/30 hover:brightness-110 "
              />
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jpg"
                alt="Movie Poster"
                className="h-72 w-52 flex-shrink-0 flex-grow-1 object-cover rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-102 hover:shadow-2xl hover:shadow-red-500/30 hover:brightness-110 "
              />
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jpg"
                alt="Movie Poster"
                className="h-72 w-52 flex-shrink-0 flex-grow-1 object-cover rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-102 hover:shadow-2xl hover:shadow-red-500/30 hover:brightness-110 "
              />
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jpg"
                alt="Movie Poster"
                className="h-72 w-52 flex-shrink-0 flex-grow-1 object-cover rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-102 hover:shadow-2xl hover:shadow-red-500/30 hover:brightness-110 "
              />
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jpg"
                alt="Movie Poster"
                className="h-72 w-52 flex-shrink-0 flex-grow-1 object-cover rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-102 hover:shadow-2xl hover:shadow-red-500/30 hover:brightness-110 "
              />
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jpg"
                alt="Movie Poster"
                className="h-72 w-52 flex-shrink-0 flex-grow-1 object-cover rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-102 hover:shadow-2xl hover:shadow-red-500/30 hover:brightness-110 "
              />
            </div>

            {index > 0 && (
              <button
                className="absolute top-1/2 -translate-y-1/2 left-4 p-2 bg-black/60 border-2 border-white/80 backdrop-blur-sm rounded-full hover:scale-110 transform transition cursor-pointer"
                onClick={prevFeatured}
              >
                <ArrowLeft className="text-white w-8 h-8" />
              </button>
            )}

            {index < maxIndex && (
              <button
                className="absolute top-1/2 -translate-y-1/2 right-4 p-2 bg-black/60 border-2 border-white/80 backdrop-blur-sm rounded-full hover:scale-110 transform transition cursor-pointer"
                onClick={nextFeatured}
              >
                <ArrowRight className="text-white w-8 h-8" />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-32 h-full pt-24 pb-16 z-10">
          <h1
            className="text-[#F5F2F2] text-4xl font-bold "
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Top Rating Movies
          </h1>
          <p className="text-[#F5F2F2] mt-2 mb-12 font-light">
            TV Shows and Movies Just For You
          </p>
          <div className="flex gap-10 flex-wrap ">
            <MovieCard
              poster_url="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jpg"
              rating={9.1}
              title="Title"
              description={
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. "
              }
              year={2025}
            />
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-32 h-full pt-24 pb-16 z-10  ">
          <h1
            className="text-[#F5F2F2] text-4xl font-bold "
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Coming Soon
          </h1>
          <p className="text-[#F5F2F2] mt-2 mb-12 font-light">
            Trailers For Upcoming Releases
          </p>
          <div>
            <TrailerCard
              image_url={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLVVf6K62C8N59BIawk68Y-tKk-Ask_4H9lA&s"
              }
              duration={100}
              date={"2025-12-25"}
              title={"Title"}
            />
          </div>
        </div>

        <Footer />
      </section>
    </>
  );
}
