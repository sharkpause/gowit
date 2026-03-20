import { useEffect, useMemo, useState } from "react";
import LightRays from "../components/LightRays";
import { ArrowLeft, ArrowRight, Mail, MapPin, Phone } from "lucide-react";
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
import { Navigation } from "swiper/modules";

import "swiper/swiper-bundle.css";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import { errorAlert } from "../helper/errorAlert";
import { capitalizeEachWord } from "../helper/helper";

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
  const [loadingMail, setLoadingMail] = useState(false);
  const [movieComingSoon, setMovieComingSoon] = useState<ComingMovie[]>([]);
  const [swiperTop, setSwiperTop] = useState(true);
  const [swiperComing, setSwiperComing] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingComingSoon, setLoadingComingSoon] = useState(true);

  console.log(swiperTop);

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
      setLoadingComingSoon(true);
      const response = await serverApi.get("/api/films/coming-soon");
      console.log(response.data);

      setMovieComingSoon(response.data.coming_soon);
    } catch (error) {
      console.log("Error fetching featured movies:", error);
    } finally {
      setLoadingComingSoon(false);
    }
  }

  async function postMail(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoadingMail(true);
      console.log(message);

      await serverApi.post("/api/contact", {
        name,
        email,
        question: message,
      });

      Swal.fire({
        title: "Question Sent Successfully!",
        icon: "success",
        buttonsStyling: false,
        background: "#0F1115",
        color: "#F5F2F2",
        customClass: {
          title: "text-white",
          confirmButton:
            "px-4 py-2 rounded-lg bg-[#E8630A] text-white hover:bg-[#C75409] focus:outline-none",
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        errorAlert(capitalizeEachWord(error.response?.data.error));
      } else {
        console.log("Error at postMail Function: ", error);
      }
    } finally {
      setLoadingMail(false);
    }
  }

  async function fetchFeaturedMovies() {
    // Simulate fetching featured movies\
    try {
      setLoadingFeatured(true);
      const response = await serverApi.get("/api/films?limit=100");
      setMovieFeatured(response.data.films);
    } catch (error) {
      console.log("Error fetching featured movies:", error);
    } finally {
      setLoadingFeatured(false);
    }
  }

  async function fetchTopMovie() {
    try {
      setLoadingTop(true);
      const response = await serverApi.get(
        "/api/films?sort=average_rating&order=desc&limit=10",
      );
      setTopMovie(response.data.films);
    } catch (error) {
      console.log("Error fetching top movies:", error);
    } finally {
      setLoadingTop(false);
    }
  }

  if (loadingFeatured || loadingTop || loadingComingSoon) {
    <div className="flex min-h-screen items-center justify-center bg-[#0F1115]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#E8630A] border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400 text-sm tracking-widest uppercase">
          Loading...
        </span>
      </div>
    </div>;
  }

  const checkTopMovies = () => {
    let w = window.innerWidth;

    if (w >= 1024) {
      if (topMovie.length < 4) {
        console.log("a");

        setSwiperTop(false);
      } else {
        setSwiperTop(true);
      }
    } else if (w >= 640) {
      if (topMovie.length < 3) {
        console.log("b");

        setSwiperTop(false);
      } else {
        setSwiperTop(true);
      }
    } else {
      console.log("c");

      if (topMovie.length < 2) {
        setSwiperTop(false);
      } else {
        setSwiperTop(true);
      }
    }
  };

  const checkComingMovies = () => {
    let w = window.innerWidth;

    if (w >= 1024) {
      if (movieComingSoon.length < 4) {
        setSwiperComing(false);
      } else {
        setSwiperComing(true);
      }
    } else {
      if (movieComingSoon.length < 2) {
        setSwiperComing(false);
      } else {
        setSwiperComing(true);
      }
    }
  };

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

  useEffect(() => {
    checkTopMovies();
  }, [topMovie]);

  useEffect(() => {
    checkComingMovies();
  }, [movieComingSoon]);

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
          className="relative flex flex-col z-10 min-h-screen justify-center items-center px-4 sm:px-6 md:px-8 text-center pt-20 sm:pt-24 md:pt-0"
          id="home"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5F2F2] mt-4 sm:mt-6 md:mt-8">
            Discover Movies with Smarter Insights
          </h1>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5F2F2] mt-3 sm:mt-4 md:mt-4">
            Built for discovery, powered by data.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#F5F2F2]/80 mt-4 sm:mt-5 md:mt-6 max-w-2xl px-2">
            Explore films, track your favorites, and never miss what to watch
            next.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-4 sm:px-0">
            <a
              href="#movies"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#E8630A] text-white font-semibold rounded-full hover:bg-[#C75409] transition-all shadow-lg shadow-[#E8630A]/30 text-center"
            >
              Explore Movies
            </a>
            <a
              href="#top"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 text-[#F5F2F2] font-semibold rounded-full hover:bg-white/20 transition-all ring-1 ring-white/20 backdrop-blur-sm text-center"
            >
              Explore Top Films
            </a>
          </div>
        </div>

        <div
          id="movies"
          className="px-3 sm:px-4 md:px-8 lg:px-32 pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16"
        >
          <h1
            className="text-[#F5F2F2] text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-4 sm:mb-5"
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
                          className="h-72 w-52 shrink-0 grow object-cover rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-102 hover:shadow-2xl hover:shadow-orange-500/30 hover:brightness-110 "
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

        <div
          className="px-3 sm:px-4 md:px-8 lg:px-32 h-full pt-16 sm:pt-24 md:pt-24 pb-12 sm:pb-16 z-10"
          id="top"
        >
          <h1
            className="text-[#F5F2F2] text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Top Rating Movies
          </h1>
          <p className="text-[#F5F2F2] mt-2 sm:mt-3 mb-6 sm:mb-8 md:mb-12 font-light text-sm sm:text-base">
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

            {swiperTop ? (
              <Swiper
                modules={[Navigation]}
                spaceBetween={18}
                slidesPerView={2}
                navigation={{ prevEl: ".prev-btn", nextEl: ".next-btn" }}
                breakpoints={{
                  640: { slidesPerView: 3 },
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
                          <Link
                            to={`/movies/${el.id}`}
                            className="inline-block"
                          >
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
            ) : topMovie.length ? (
              topMovie.map((el, idx) => {
                return (
                  <Link
                    to={`/movies/${el.id}`}
                    key={el.id}
                    className="inline-block"
                  >
                    <MovieCard
                      poster_url={el.poster_image_url}
                      rating={el.average_rating}
                      title={el.title}
                      description={el.description}
                      year={el.release_year}
                      rank={idx + 1}
                    />
                  </Link>
                );
              })
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="px-3 sm:px-4 md:px-8 lg:px-32 h-full pt-16 sm:pt-24 md:pt-24 pb-12 sm:pb-16 z-10">
          <h1
            className="text-[#F5F2F2] text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Coming Soon
          </h1>
          <p className="text-[#F5F2F2] mt-2 sm:mt-3 mb-6 sm:mb-8 md:mb-12 font-light text-sm sm:text-base">
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
            {swiperComing ? (
              <Swiper
                modules={[Navigation]}
                spaceBetween={48}
                slidesPerView={1.2}
                navigation={{ prevEl: ".prev-btn-cs", nextEl: ".next-btn-cs" }}
                breakpoints={{
                  640: { slidesPerView: 2 },
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
            ) : (
              movieComingSoon?.map((el, idx) => {
                return (
                  <TrailerCard
                    key={idx}
                    image_url={el.thumbnail_url}
                    duration={el.trailer_duration}
                    date={el.release_date}
                    title={el.title}
                    trailer_url={el.trailer_url}
                  />
                );
              })
            )}
          </div>
        </div>

        <div className="relative min-h-screen px-3 sm:px-4 md:px-8 lg:px-32 py-12 sm:py-16 md:py-20 lg:py-28">
          <div
            className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/degghm3hf/image/upload/v1771170387/background_netflix_quf4jz.png')",
            }}
          />

          <div
            id="contact-us"
            className="relative z-10 flex flex-col lg:flex-row items-start gap-8 sm:gap-10 md:gap-12 lg:gap-20 text-[#F5F2F2]"
          >
            <div className="flex-1 align-top space-y-6 sm:space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
                  Contact Us
                </h1>
                <p className="text-gray-300 text-base sm:text-lg">
                  Having a Problem? We're ready to help!
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-white">
                  Get in Touch
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-300 leading-relaxed">
                        Jl. Anu Gatau Atur Aja Bang No 1, Batam, Indonesia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-300">+62-823-1222-7255</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-300">gowitofficial@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-xl">
              <div className="bg-[#0F1115]/95 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl border border-white/20 shadow-2xl">
                <h2 className="text-white text-center text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8">
                  Question...?
                </h2>

                <form onSubmit={postMail} className="space-y-4 sm:space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Name..."
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none border border-white/20 hover:border-white/40 focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all font-medium text-sm sm:text-base"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email..."
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:outline-none border border-white/20 hover:border-white/40 focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all font-medium text-sm sm:text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Messages..."
                      rows={5}
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 text-white placeholder-gray-400 rounded-xl resize-none focus:outline-none border border-white/20 hover:border-white/40 focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all font-medium text-sm sm:text-base"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pt-2 sm:pt-3">
                    <button
                      type="submit"
                      disabled={loadingMail}
                      className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#E8630A] text-white font-bold text-base sm:text-lg rounded-xl hover:bg-[#C75409] transition-all shadow-xl shadow-[#E8630A]/40 hover:shadow-2xl hover:shadow-[#E8630A]/50 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {loadingMail ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Submit"
                      )}
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
