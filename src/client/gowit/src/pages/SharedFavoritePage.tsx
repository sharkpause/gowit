import { Heart, Download, Table, RectangleVertical, Star } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

import type { ImportType, WatchListType } from "../type";
import WatchListCard from "../components/WatchListCard";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { serverApi } from "../api";
import Navbar from "../components/Navbar";

export default function SharedFavoritePage() {
  const [favorite, setFavorite] = useState<WatchListType[]>([]);
  const [user, setUser] = useState("");
  const [sort, setSort] = useState("title");
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const { encryptId } = useParams();
  const navigate = useNavigate()

  const fetchFavorite = async () => {
    try {
      const response = await serverApi.get(
        `/api/user/favorites/${encryptId}?sort=${sort}&order=${order}&search=${search}`,
      );

      if (response.data.same_user) {
        return navigate('/watchlist')
      }

      setFavorite(response.data.favorites || []);
      setUser(response.data.owner.name || "");
    } catch (error) {
      console.log("Error at Favorite Page: ", error);
    }
  };

  const download = () => {
    const formattedData = favorite.map((el) => {
      return {
        Title: el.title,
        Description: el.description,
        "Poster URL": window.location.origin + el.poster_image_url,
        "Average Rating": el.average_rating ?? 0,
        "Release Year": el.release_year,
        "Duration (Minutes)": el.runtime,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 80 },
      { wch: 80 },
      { wch: 17 },
      { wch: 17 },
      { wch: 17 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "My Watchlist");

    XLSX.writeFile(workbook, "my-watchlist.xlsx", {
      compression: true,
    });
  };

  useEffect(() => {
    fetchFavorite();
  }, [sort, order, search]);

  return (
    <>
      <Navbar />
      <div
        className={`bg-[#0F1115] overflow-hidden px-3 sm:px-4 md:px-8 lg:px-36 ${favorite.length > 0 || search.length > 0 ? "pt-16 sm:pt-20 md:pt-24" : "pt-8"} pb-12 sm:pb-16`}
      >
        {favorite.length > 0 || search.length > 0 ? (
          <>
            <div className="flex justify-center items-center mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F5F2F2] text-center">
                <span className="text-[#E8630A]">{user}'s</span> Watchlist
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <label className="text-[#F5F2F2] text-xs sm:text-sm font-medium">
                  Sort:
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-[#1C1E22] text-[#F5F2F2] text-xs sm:text-sm text-center px-3 sm:px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#E8630A] transition-colors cursor-pointer"
                >
                  <option value="title">Title</option>
                  <option value="average_rating">Rating</option>
                  <option value="release_date">Year</option>
                  <option value="popularity">Popularity</option>
                  <option value="runtime">Runtime</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[#F5F2F2] text-xs sm:text-sm font-medium whitespace-nowrap">
                  Order:
                </label>
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="bg-[#1C1E22] text-[#F5F2F2] text-xs sm:text-sm text-center px-3 sm:px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#E8630A] transition-colors cursor-pointer"
                >
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </div>

              <input
                type="text"
                className="flex-1 text-[#F5F2F2] text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 border rounded-lg border-gray-700 focus:outline-none focus:border-[#E8630A] transition-colors cursor-pointer"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="flex gap-1 bg-[#1C1E22] rounded-lg p-1 border border-gray-700">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center justify-center px-3 py-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-[#E8630A] text-white "
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <RectangleVertical className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center justify-center px-3 py-2 rounded-md transition-all duration-200 ${
                    viewMode === "table"
                      ? "bg-[#E8630A] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Table className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={download}
                className="bg-[#1C1E22] text-[#F5F2F2] px-3 sm:px-4 py-2 rounded-lg border border-gray-700 hover:border-[#E8630A] focus:outline-none transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className=" sm:inline">Export</span>
              </button>
            </div>
          </>
        ) : (
          ""
        )}
        {favorite.length > 0 ? (
          viewMode === "grid" ? (
            <div className="min-h-screen flex flex-wrap gap-6 sm:gap-8 md:gap-10 lg:gap-16 justify-start md:justify-center">
              {favorite.map((el) => {
                return (
                  <div className="relative" key={el.id}>
                    <WatchListCard
                      id={el.film_id}
                      title={el.title}
                      rating={el.average_rating ?? 0}
                      description={el.description}
                      poster_url={el.poster_image_url}
                      year={el.release_year}
                      minute={el.runtime}
                      notes={el.notes}
                      isShared={true}
                      onOpenNote={() => {}}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full overflow-x-auto min-h-screen">
              <table className="w-full  rounded-lg border border-gray-700">
                <thead>
                  <tr className="bg-[#1C1E22] border-b border-gray-700">
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-[#F5F2F2]">
                      Poster
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-[#F5F2F2]">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-[#F5F2F2]">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-[#F5F2F2]">
                      Year
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-[#F5F2F2]">
                      Runtime
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-[#F5F2F2]">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {favorite.map((el, idx) => (
                    <tr
                      key={el.id}
                      className={`border-b border-gray-700 hover:bg-[#1C1E22]/50 transition-colors ${idx % 2 === 0 ? "bg-[#0F1115]" : "bg-[#0B0C0D]"}`}
                    >
                      <td className="px-4 py-3">
                        <img
                          src={el.poster_image_url}
                          alt={el.title}
                          className="h-12 w-8 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-[#F5F2F2] font-medium max-w-xs truncate">
                        {el.title}
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-300" />
                          <span>{el.average_rating || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-300">
                        {el.release_year}
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-300">
                        {el.runtime}m
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-400 max-w-xs truncate">
                        {el.notes && el.notes.trim() ? (
                          <span className="text-[#E8630A] font-semibold">
                            Has Note
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : search.length > 0 ? (
          <div className="min-h-screen flex flex-col items-center text-[#F5F2F2] space-y-4 px-4 mt-40">
            <Heart className="w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 font-thin opacity-50" />
            <h1 className="text-xl sm:text-2xl md:text-3xl text-center font-semibold mt-4">
              No results found
            </h1>
            <p className="text-sm sm:text-base font-light text-gray-400 text-center max-w-md">
              We couldn't find any movies matching "{search}". Try a different
              search term.
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 bg-[#E8630A] rounded-lg px-6 py-3 hover:bg-[#E8630A]/90 transition-all shadow-md shadow-[#E8630A]/40 hover:shadow-[#E8630A]/50 hover:scale-105 text-sm sm:text-base font-semibold"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="min-h-screen flex justify-center items-center px-4 text-[#F5F2F2]">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center ">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                No Movies Yet
              </h1>

              <p className="mt-4 text-sm sm:text-base text-[#F5F2F2]/70 leading-relaxed">
                <span className="text-[#E8630A] font-semibold">{user}</span>{" "}
                hasn&apos;t added any movies to this watchlist.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
