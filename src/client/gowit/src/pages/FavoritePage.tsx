import { Heart, X, Download, Upload, Binary } from "lucide-react";
import { Link } from "react-router";

import type { WatchListType } from "../type";
import WatchListCard from "../components/WatchListCard";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { serverApi } from "../api";

import { errorAlert } from "../helper/errorAlert";
import axios from "axios";
import Swal from "sweetalert2";
import { capitalizeEachWord } from "../helper/helper";

export default function FavoritePage() {
  const [favorite, setFavorite] = useState<WatchListType[]>([]);
  const [isImport, setIsImport] = useState(false);
  const [fileName, setFileName] = useState("");

  const fetchFavorite = async () => {
    try {
      const response = await serverApi.get("/api/favorites");
      console.log(response.data);

      setFavorite(response.data.favorites || []);
    } catch (error) {
      console.log("Error at Favorite Page: ", error);
    }
  };

  const deleteFavorite = async (id: number) => {
    try {
      const response = await serverApi.delete("/api/favorites/" + id);

      Swal.fire({
        title: `Film Deleted Successfully From Favorite"`,

        icon: "success",
        buttonsStyling: false,
        background: "#0F1115",
        color: "#F5F2F2",
        customClass: {
          title: "text-white",
          confirmButton:
            "px-4 py-2 rounded-lg bg-[#E50914] text-white hover:bg-[#b20710] focus:outline-none",
        },
      });

      fetchFavorite();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        errorAlert(capitalizeEachWord(error.response?.data.error));
      } else {
        console.log("Error at Favorite Page: ", error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const file = e.target.files?.[0];

    if (!file) return;
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      console.log(parsedData);
    };

    setFileName(file.name);
  };

  const download = () => {
    const formattedData = favorite.map((el) => {
      return {
        Title: el.title,
        Description: el.description,
        "Poster URL": el.poster_image_url,
        "Average Rating": el.average_rating,
        "Release Year": el.release_year,
        "Duration (Minutes)": el.runtime,
        Note: el.notes,
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
  }, []);

  return (
    <div
      className={`bg-[#0F1115] overflow-hidden px-4 md:px-8 lg:px-36 ${favorite.length > 0 ? "pt-32" : "pt-8"} pb-16`}
    >
      {favorite.length > 0 ? (
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label className="text-[#F5F2F2] text-sm font-medium">
              Sort by:
            </label>
            <select className="bg-[#1C1E22]  text-[#F5F2F2] text-center px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#E50914] transition-colors cursor-pointer">
              <option value="title">Title</option>
              <option value="average_rating">Rating</option>
              <option value="release_year">Year</option>
              <option value="popularity">Popularity</option>
              <option value="runtime">Runtime</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[#F5F2F2] text-sm font-medium">Order:</label>
            <select className="bg-[#1C1E22] text-[#F5F2F2] text-center px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#E50914] transition-colors cursor-pointer">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <input
            type="text"
            className="flex-1 text-[#F5F2F2] text-sm font-medium px-4 py-2 border rounded-lg border-gray-700 focus:outline-none focus:border-[#E50914] transition-colors cursor-pointer"
            placeholder="Search"
          />

          <button
            onClick={download}
            className="bg-[#1C1E22] text-[#F5F2F2] px-4 py-2 rounded-lg border border-gray-700 hover:border-[#E50914] focus:outline-none transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={() => setIsImport(true)}
            className="bg-[#1C1E22] text-[#F5F2F2] px-4 py-2 rounded-lg border border-gray-700 hover:border-[#E50914] focus:outline-none transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
        </div>
      ) : (
        ""
      )}

      {favorite.length > 0 ? (
        <div className="min-h-screen flex flex-wrap gap-16 justify-center">
          {favorite.map((el, idx: number) => {
            return (
              <div className="relative flex-shrink-0" key={el.id}>
                <button
                  onClick={() => deleteFavorite(el.film_id)}
                  className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-all shadow-lg hover:scale-110 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <WatchListCard
                  title={el.title}
                  rating={el.average_rating}
                  description={el.description}
                  poster_url={el.poster_image_url}
                  year={el.release_year}
                  minute={el.runtime}
                  notes={el.notes}
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
            className="mt-2 bg-[#E50914] rounded-lg p-3 hover:bg-[#E50914]/90 transition-all shadow-md shadow-[#E50914]/40 hover:shadow-[#E50914]/50 hover:scale-105"
          >
            Explore Movies
          </Link>
        </div>
      )}

      {isImport ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 "
          onClick={() => setIsImport(false)}
        >
          <div
            className="relative bg-[#1C1E22] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center">
              <label className="flex items-center justify-center w-full px-4 py-3 bg-[#1C1E22] text-[#F5F2F2] border border-white/20 rounded-xl cursor-pointer hover:border-[#E50914] transition">
                <span className="font-medium">Choose Excel File</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setIsImport(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsImport(false)}
                className="px-5 py-2 text-sm bg-[#E50914] hover:bg-[#b20710] text-white font-semibold rounded-lg transition-colors"
              >
                Download Template
              </button>
              <button
                onClick={() => setIsImport(false)}
                className="px-5 py-2 text-sm bg-[#E50914] hover:bg-[#b20710] text-white font-semibold rounded-lg transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
