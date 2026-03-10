import { useEffect, useMemo, useState } from "react";
import LightRays from "../components/LightRays";
import { ArrowLeft, ArrowRight, Film, Mail, MapPin, Phone } from "lucide-react";
// import MovieCard from "../components/MovieCard";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import TrailerCard from "../components/TrailerCard";
import Footer from "../components/Footer";
import { serverApi } from "../api";
import type { ComingMovie, MovieType } from "../type";
import { Link, useLocation } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/swiper-bundle.css";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const [topMovie, setTopMovie] = useState<MovieType[]>([]);
  const [movieFeatured, setMovieFeatured] = useState<MovieType[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [visibleFeatured, setVisibleFeatured] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isBeginningCS, setIsBeginningCS] = useState(true);
  const [isEndCS, setIsEndCS] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [movieComingSoon, setMovieComingSoon] = useState<ComingMovie[]>([]);

  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#movies") {
      const el = document.getElementById("movies");
      el?.scrollIntoView({
        behavior: "smooth",
      });
    }
    if (location.hash === "#contact-us") {
      const el = document.getElementById("contact-us");
      el?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [location]);

  const syncEdges = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const syncEdgesCS = (swiper: SwiperType) => {
    setIsBeginningCS(swiper.isBeginning);
    setIsEndCS(swiper.isEnd);
  };

  async function fetchMovieComingSoon() {
    try {
      const response = await serverApi.get("/api/films/coming-soon");
      console.log(response.data.coming_soon);

      setMovieComingSoon(response.data.coming_soon);
    } catch (error) {
      console.log("Error fetching featured movies:", error);
    }
  }

  async function fetchFeaturedMovies() {
    // Simulate fetching featured movies\
    try {
      const response = await serverApi.get("/api/films");
      setMovieFeatured(response.data.films);
    } catch (error) {
      console.log("Error fetching featured movies:", error);
    }
  }

  async function fetchTopMovie() {
    try {
      const response = await serverApi.get(
        "/api/films?sort=average_rating&order=desc&limit=10",
      );
      setTopMovie(response.data.films);
    } catch (error) {
      console.log("Error fetching top movies:", error);
    }
  }

  useEffect(() => {
    fetchFeaturedMovies();
    fetchTopMovie();
    fetchMovieComingSoon();
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

  const prevFeatured = () => setIndex((i) => i - 1);
  const nextFeatured = () => setIndex((i) => i + 1);

  const translateX = useMemo(() => {
    return -(index * step);
  }, [index, step]);

  return (
    <>
      <Navbar />
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

        <div
          className="relative flex flex-col z-10 min-h-screen justify-center items-center px-6 text-center"
          id="home"
        >
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
            <a
              href="#movies"
              className="px-8 py-3  bg-[#E8630A] text-white font-semibold rounded-full hover:bg-[#C75409] transition-all shadow-lg shadow-[#E8630A]/30"
            >
              Explore Movies
            </a>
            <a
              href="#top"
              className="px-8 py-3 bg-white/10 text-[#F5F2F2] font-semibold rounded-full hover:bg-white/20 transition-all ring-1 ring-white/20 backdrop-blur-sm"
            >
              Explore Top Films
            </a>
          </div>
        </div>

        <div id="movies" className="px-4 md:px-8 lg:px-32 pt-32 pb-16">
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
              {movieFeatured.length
                ? movieFeatured.map((el) => {
                    return (
                      <Link
                        key={el.id}
                        to={`/movies/${el.id}`}
                        className="inline-block shrink-0"
                      >
                        <img
                          key={el.id}
                          src={el.poster_image_url}
                          alt="Movie Poster"
                          className="h-72 w-52 flex-shrink-0 flex-grow-1 object-cover rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-102 hover:shadow-2xl hover:shadow-orange-500/30 hover:brightness-110 "
                        />
                      </Link>
                    );
                  })
                : ""}
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

        <div className="px-4 md:px-8 lg:px-32 h-full pt-24 pb-16 z-10" id="top">
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
          <div className="flex gap-8 relative">
            <button
              className={[
                "prev-btn absolute top-1/2 -translate-y-1/2 left-4 z-20 p-2 bg-black/60 border-2 border-white/80 backdrop-blur-sm rounded-full transition",
                isBeginning
                  ? "opacity-0 pointer-events-none"
                  : "hover:scale-110",
              ].join(" ")}
            >
              <ArrowLeft className="text-white w-8 h-8" />
            </button>
            <button
              className={[
                "next-btn absolute top-1/2 -translate-y-1/2 right-4 z-20 p-2 bg-black/60 border-2 border-white/80 backdrop-blur-sm rounded-full transition",
                isEnd ? "opacity-0 pointer-events-none" : "hover:scale-110",
              ].join(" ")}
            >
              <ArrowRight className="text-white w-8 h-8" />
            </button>
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={1.2}
              navigation={{ prevEl: ".prev-btn", nextEl: ".next-btn" }}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 4 },
              }}
              loop={false}
              onSwiper={syncEdges}
              onSlideChange={syncEdges}
              observer
              observeParents
              updateOnWindowResize
              onResize={syncEdges}
            >
              {topMovie.length
                ? topMovie.map((el, idx) => {
                    return (
                      <SwiperSlide key={el.id}>
                        <Link to={`/movies/${el.id}`} className="inline-block">
                          <MovieCard
                            poster_url={el.poster_image_url}
                            rating={el.average_rating}
                            title={el.title}
                            description={el.description}
                            year={el.release_year}
                            rank={idx + 1}
                          />
                        </Link>
                      </SwiperSlide>
                    );
                  })
                : ""}
            </Swiper>
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-32 h-full pt-24 pb-16 z-10">
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
          <div className="flex gap-8 relative">
            <button
              className={[
                "prev-btn-cs absolute top-1/2 -translate-y-1/2 left-4 z-20 p-2 bg-black/60 border-2 border-white/80 backdrop-blur-sm rounded-full transition",
                isBeginningCS
                  ? "opacity-0 pointer-events-none"
                  : "hover:scale-110",
              ].join(" ")}
            >
              <ArrowLeft className="text-white w-8 h-8" />
            </button>
            <button
              className={[
                "next-btn-cs absolute top-1/2 -translate-y-1/2 right-4 z-20 p-2 bg-black/60 border-2 border-white/80 backdrop-blur-sm rounded-full transition",
                isEndCS ? "opacity-0 pointer-events-none" : "hover:scale-110",
              ].join(" ")}
            >
              <ArrowRight className="text-white w-8 h-8" />
            </button>
            <Swiper
              modules={[Navigation]}
              spaceBetween={48}
              slidesPerView={1.2}
              navigation={{ prevEl: ".prev-btn-cs", nextEl: ".next-btn-cs" }}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 4 },
              }}
              loop={false}
              onSwiper={syncEdgesCS}
              onSlideChange={syncEdgesCS}
              observer
              observeParents
              updateOnWindowResize
              onResize={syncEdgesCS}
            >
              {movieComingSoon?.map((el, idx) => {
                return (
                  <SwiperSlide key={idx}>
                    <TrailerCard
                      image_url={el.thumbnail_url}
                      duration={el.trailer_duration}
                      date={el.release_date}
                      title={el.title}
                      trailer_url={el.trailer_url}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>

        <div className="relative min-h-96 px-4 md:px-8 lg:px-32 py-18 md:py-28">
          <div
            className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/degghm3hf/image/upload/v1771170387/background_netflix_quf4jz.png')",
            }}
          />

          <div
            id="contact-us"
            className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20 text-[#F5F2F2]"
          >
            <div className="flex-1 align-top space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  Contact Us
                </h1>
                <p className="text-gray-300 text-lg">
                  Having a Problem? We're ready to help!
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-xl text-white">Get in Touch</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-300 leading-relaxed">
                        Jl. Anu Gatau Atur Aja Bang No 1, Batam, Indonesia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-300">+62-823-1222-7255</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-300">gowitofficial@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-xl max-h-lg">
              <div className="bg-[#0F1115]/95 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-white/20 shadow-2xl">
                <h2 className="text-white text-center text-2xl md:text-3xl font-bold mb-8">
                  Question...?
                </h2>

                <form className="space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Name..."
                      className="w-full px-6 py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none border-1 border-white/20 hover:border-white/40 focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all font-medium"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email..."
                      className="w-full px-6 py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none border-1 border-white/20 hover:border-white/40 focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Messages..."
                      rows={6}
                      className="w-full px-6 py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl resize-none focus:outline-none border-1 border-white/20 hover:border-white/40 focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all font-medium"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-8 py-2 bg-[#E8630A] text-white font-bold text-lg rounded-xl hover:bg-[#C75409] transition-all shadow-xl shadow-[#E8630A]/40 hover:shadow-2xl hover:shadow-[#E8630A]/50 hover:scale-105"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </section>
    </>
  );
}
