import { useEffect, useState } from "react";
import LightRays from "../components/LightRays";
import { Film } from "lucide-react";
// import MovieCard from "../components/MovieCard";
import axios from "axios";
import MovieCard from "../components/MovieCard";

export default function HomePage() {
  const [previous, setPrevious] = useState(false);
  const [next, setNext] = useState(true);
  const [movieFeatured, setMovieFeatured] = useState<string[]>([]);

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

        <div className="px-4 md:px-8 lg:px-32 h-full pt-32 pb-16 z-10 relative ">
          <h1
            className="text-[#F5F2F2] text-4xl font-bold mb-5"
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Featured Today
          </h1>
          <div className="flex gap-10 flex-wrap ">
            <img
              src="https://cdn-web-2.ruangguru.com/landing-pages/assets/ea26231f-6e60-41ae-b502-ed985e702f1c.jpg"
              alt="Movie Poster"
              className="h-72 w-52 object-contain"
            />
            <img
              src="https://cdn-web-2.ruangguru.com/landing-pages/assets/ea26231f-6e60-41ae-b502-ed985e702f1c.jpg"
              alt="Movie Poster"
              className="h-72 w-52 object-contain"
            />
            <img
              src="https://cdn-web-2.ruangguru.com/landing-pages/assets/ea26231f-6e60-41ae-b502-ed985e702f1c.jpg"
              alt="Movie Poster"
              className="h-72 w-52 object-contain"
            />
            <img
              src="https://cdn-web-2.ruangguru.com/landing-pages/assets/ea26231f-6e60-41ae-b502-ed985e702f1c.jpg"
              alt="Movie Poster"
              className="h-72 w-52 object-contain"
            />
            <img
              src="https://cdn-web-2.ruangguru.com/landing-pages/assets/ea26231f-6e60-41ae-b502-ed985e702f1c.jpg"
              alt="Movie Poster"
              className="h-72 w-52 object-contain"
            />
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-32 h-full pt-32 pb-16 z-10 relative ">
          <h1
            className="text-[#F5F2F2] text-4xl font-bold "
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Featured Today
          </h1>
          <p className="text-[#F5F2F2] mt-2 mb-12">
            TV Shows and Movies Just For You
          </p>
          <div className="flex gap-10 flex-wrap ">
            <MovieCard
              poster_url="https://cdn-web-2.ruangguru.com/landing-pages/assets/ea26231f-6e60-41ae-b502-ed985e702f1c.jpg"
              rating={9.1}
              title="Title"
              description={
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. "
              }
              year={2025}
            />
          </div>
        </div>
      </section>
    </>
  );
}
