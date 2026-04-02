import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Mail, MapPin, Phone } from "lucide-react";
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

import { motion, AnimatePresence } from "framer-motion";
import "swiper/swiper-bundle.css";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import { errorAlert } from "../helper/errorAlert";
import { capitalizeEachWord } from "../helper/helper";

export default function HomePage() {
  const [topMovie, setTopMovie] = useState<MovieType[]>([]);
  const [movieFeatured, setMovieFeatured] = useState<MovieType[]>([]);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isBeginningCS, setIsBeginningCS] = useState(true);
  const [isBeginningFeatured, setIsBeginningFeatured] = useState(true);
  const [isEndFeatured, setIsEndFeatured] = useState(false);
  const [isEndCS, setIsEndCS] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loadingMail, setLoadingMail] = useState(false);
  const [movieComingSoon, setMovieComingSoon] = useState<ComingMovie[]>([]);
  const [swiperFeatured, setSwiperFeatured] = useState(true);
  const [swiperTop, setSwiperTop] = useState(true);
  const [swiperComing, setSwiperComing] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingComingSoon, setLoadingComingSoon] = useState(true);

  const location = useLocation();
  const [bgIndex, setBgIndex] = useState(0);
  const goToSlide = (index: number) => {
    setBgIndex(index);
  };

  const heroSlides = [
    {
      image: "/Herobg1.jpg",
      logoImage: "/Herobg1logo.png",
      logoSize: "max-h-[100px] md:max-h-[160px]",
      desc: "In the heart of New York City, the powerful Corleone crime family faces rising tensions as rival gangs and dangerous business deals threaten their empire. When Don Vito Corleone is attacked, his reluctant son Michael is drawn into the violent underworld, setting him on a path that will change him forever. ",
      rating: "7.3",
      year: "1972",
      isMovie: true,
    },
    {
      image: "/Herobg2.jpeg",
      logoImage: "/Herobg2logo.png",
      logoSize: "max-h-[65px] md:max-h-[95px]",
      desc: "In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power hungry Na'vi tribe led by the ruthless Varang.",
      rating: "7.3",
      year: "2025",
      isMovie: true,
    },
    {
      image: "/Herobg3.webp",
      logoImage: "/Herobg3logo.png",
      logoSize: "max-h-[100px] md:max-h-[160px]",
      desc: "After the world has forgotten who he truly is, Peter Parker starts over in New York City—alone, anonymous, and determined to rebuild his life. But as new threats rise from the shadows and old enemies resurface, he must redefine what it means to be a hero without the support he once had.",
      rating: "7.3",
      year: "2026",
      isMovie: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

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

  useEffect(() => {
    if (location.hash === "#contact-us") {
      const timer = setTimeout(() => {
        const el = document.getElementById("contact-us");

        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 50;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
      }, 100);

      return () => clearTimeout(timer);
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

  const syncEdgesFeatured = (swiper: SwiperType) => {
    setIsBeginningFeatured(swiper.isBeginning);
    setIsEndFeatured(swiper.isEnd);
  };

  async function fetchMovieComingSoon() {
    try {
      setLoadingComingSoon(true);
      const response = await serverApi.get("/api/films/coming-soon");

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

  const checkFeaturedMovie = () => {
    let w = window.innerWidth;

    if (w >= 1024) {
      if (movieFeatured.length < 4) {
        setSwiperFeatured(false);
      } else {
        setSwiperFeatured(true);
      }
    } else if (w >= 640) {
      if (movieFeatured.length < 3) {
        setSwiperFeatured(false);
      } else {
        setSwiperFeatured(true);
      }
    } else {
      if (movieFeatured.length < 2) {
        setSwiperFeatured(false);
      } else {
        setSwiperFeatured(true);
      }
    }
  };

  const checkTopMovies = () => {
    let w = window.innerWidth;

    if (w >= 1280) {
      if (topMovie.length < 5) {
        setSwiperTop(false);
      } else {
        setSwiperTop(true);
      }
    } else if (w >= 1024) {
      if (topMovie.length < 4) {
        setSwiperTop(false);
      } else {
        setSwiperTop(true);
      }
    } else if (w >= 640) {
      if (topMovie.length < 3) {
        setSwiperTop(false);
      } else {
        setSwiperTop(true);
      }
    } else {
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
    checkTopMovies();
  }, [topMovie]);

  useEffect(() => {
    checkComingMovies();
  }, [movieComingSoon]);

  useEffect(() => {
    checkFeaturedMovie();
  }, [movieFeatured]);

  return (
    <>
      <Navbar />
      <main className="bg-[#0F1115] overflow-x-hidden">
        {/* HERO SECTION */}
        <section id="home">
          <div className="relative min-h-screen flex items-center justify-center pt-8">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <AnimatePresence>
                <motion.div
                  key={heroSlides[bgIndex].image}
                  initial={{
                    y: bgIndex === 0 ? 100 : 0,
                    x: bgIndex === 0 ? 0 : "100%",
                    opacity: 0,
                  }}
                  animate={{ y: 0, x: 0, opacity: 0.3 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${heroSlides[bgIndex].image}')`,
                  }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent" />
            </div>

            <div className="relative flex flex-col z-10 h-screen w-full justify-end items-start px-6 sm:px-12 md:px-20 pb-16 sm:pb-24 md:pb-32 text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={bgIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-start w-full max-w-2xl"
                >
                  {heroSlides[bgIndex].isMovie && (
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-[#E8630A] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Movie
                      </span>
                      <span className="text-[#F5F2F2]/80 text-xs font-medium">
                        {heroSlides[bgIndex].year}
                      </span>
                    </div>
                  )}

                  {heroSlides[bgIndex].logoImage && (
                    <img
                      src={heroSlides[bgIndex].logoImage}
                      alt="Movie Logo"
                      // Kita panggil logoSize dari array di sini
                      className={`h-auto w-auto mb-5 object-contain ${heroSlides[bgIndex].logoSize}`}
                    />
                  )}

                  <p className="text-[13px] md:text-[14px] text-[#F5F2F2]/70 max-w-lg leading-relaxed text-left">
                    {heroSlides[bgIndex].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-row items-center gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setBgIndex(index);
                  }}
                  className="group relative p-4 cursor-pointer focus:outline-none"
                >
                  <div
                    className={`transition-all duration-500 rounded-full ${
                      bgIndex === index
                        ? "w-2 h-2 bg-[#E8630A]"
                        : "w-2 h-2 bg-white/20 group-hover:bg-white/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="movies">
          <div className="px-3 sm:px-4 md:px-8 lg:px-32 pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16">
            <h1
              className="text-[#F5F2F2] text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-4 sm:mb-5"
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Featured Today
            </h1>

            <div className="flex gap-8 relative">
              <button
                className={[
                  "prev-btn-featured absolute top-1/2 -translate-y-1/2 left-4 z-20 p-2 bg-black/60 border-2 border-white/80 backdrop-blur-sm rounded-full transition",
                  isBeginningFeatured
                    ? "opacity-0 pointer-events-none"
                    : "hover:scale-110",
                ].join(" ")}
              >
                <ArrowLeft className="text-white w-8 h-8" />
              </button>
              <button
                className={[
                  "next-btn-featured absolute top-1/2 -translate-y-1/2 right-4 z-20 p-2 bg-black/60 border-2 border-white/80 backdrop-blur-sm rounded-full transition",
                  isEndFeatured
                    ? "opacity-0 pointer-events-none"
                    : "hover:scale-110",
                ].join(" ")}
              >
                <ArrowRight className="text-white w-8 h-8" />
              </button>

              {swiperFeatured ? (
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView={2}
                  navigation={{
                    prevEl: ".prev-btn-featured",
                    nextEl: ".next-btn-featured",
                  }}
                  breakpoints={{
                    640: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                  }}
                  loop={false}
                  onSwiper={syncEdgesFeatured}
                  onSlideChange={syncEdgesFeatured}
                  observer
                  observeParents
                  updateOnWindowResize
                  onResize={syncEdgesFeatured}
                  className="w-full"
                >
                  {movieFeatured.length
                    ? movieFeatured.map((el) => {
                        return (
                          <SwiperSlide key={el.id}>
                            <Link
                              to={`/movies/${el.id}`}
                              className="inline-block"
                            >
                              <img
                                src={el.poster_image_url}
                                alt="Movie Poster"
                                className="h-72 w-52 object-cover rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 hover:brightness-110"
                              />
                            </Link>
                          </SwiperSlide>
                        );
                      })
                    : ""}
                </Swiper>
              ) : movieFeatured.length ? (
                movieFeatured.map((el) => {
                  return (
                    <Link
                      key={el.id}
                      to={`/movies/${el.id}`}
                      className="inline-block"
                    >
                      <img
                        src={el.poster_image_url}
                        alt="Movie Poster"
                        className="h-72 w-52 object-cover rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 hover:brightness-110"
                      />
                    </Link>
                  );
                })
              ) : (
                ""
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
                  navigation={{
                    prevEl: ".prev-btn-cs",
                    nextEl: ".next-btn-cs",
                  }}
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
        </section>

        <section id="contact-us">
          <div className="relative min-h-screen px-3 sm:px-4 md:px-8 lg:px-32 py-12 sm:py-16 md:py-20 lg:py-28">
            <div
              className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://res.cloudinary.com/degghm3hf/image/upload/v1771170387/background_netflix_quf4jz.png')",
              }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8 sm:gap-10 md:gap-12 lg:gap-20 text-[#F5F2F2]">
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
                        <p className="text-gray-300">+62 813-3150-9003</p>
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
        </section>

        <Footer />
      </main>
    </>
  );
}
