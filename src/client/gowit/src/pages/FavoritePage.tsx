import {
  Heart,
  X,
  Download,
  Upload,
  Table,
  RectangleVertical,
  Star,
  NotebookPen,
  Share2,
  Check,
} from "lucide-react";
import { Link } from "react-router";

import type { ImportType, UserType, WatchListType } from "../type";
import WatchListCard from "../components/WatchListCard";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { serverApi } from "../api";

import { errorAlert } from "../helper/errorAlert";
import axios from "axios";
import Swal from "sweetalert2";
import { capitalizeEachWord } from "../helper/helper";
import toast from "react-hot-toast";

export default function FavoritePage() {
  const [favorite, setFavorite] = useState<WatchListType[]>([]);
  const [isImport, setIsImport] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loadingImport, setLoadingImport] = useState(false);
  const [sort, setSort] = useState("title");
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");
  const [fileImport, setFileImport] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedMovie, setSelectedMovie] = useState<WatchListType | null>(
    null,
  );
  const [user, setUser] = useState<UserType>();

  const fetchFavorite = async () => {
    try {
      const response = await serverApi.get(
        `/api/favorites?sort=${sort}&order=${order}&search=${search}`,
      );

      setFavorite(response.data.favorites || []);
    } catch (error) {
      console.log("Error at Favorite Page: ", error);
    }
  };

  const deleteFavorite = async (id: number) => {
    try {
      Swal.fire({
        title: "Remove from Favorites?",
        html: '<p class="text-gray-300 text-sm">This movie will no longer appear in your favorites.</p>',
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        buttonsStyling: false,
        background: "#0F1115",
        color: "#F5F2F2",
        customClass: {
          title: "text-2xl font-bold text-white mb-4",
          htmlContainer: "text-white",

          confirmButton:
            "px-6 py-3 mx-2 rounded-lg bg-[#E8630A] text-white text-base font-semibold hover:bg-[#C75409] transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#E8630A]/20",
          cancelButton:
            "px-6 py-3 mx-2 rounded-lg bg-[#1C1E22] text-gray-300 text-base font-semibold hover:bg-[#2A2D33] hover:text-white transition-all border border-gray-600",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          await serverApi.delete("/api/favorites/" + id);
          fetchFavorite();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            buttonsStyling: false,
            background: "#0F1115",
            color: "#F5F2F2",
            customClass: {
              title: "text-white",
              confirmButton:
                "px-4 py-2 mx-2 rounded-lg bg-[#E8630A] text-white hover:bg-[#C75409] focus:outline-none",
            },
          });
        }
      });
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
    reader.readAsBinaryString(file); // Deprecated
    reader.onload = (e) => {
      const container = [];
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData: ImportType[] = XLSX.utils.sheet_to_json(sheet);

      for (const element of parsedData) {
        container.push(element.title);
        // Can push empty titles because excel conversion is case-sensitive
        // So for example if on the excel spreadsheet it's Title, nothing
        // Will be pushed, only if the column is spelled title instead
      }

      setFileImport(container);
    };
    setFileName(file.name);
  };

  const createImport = async () => {
    try {
      setLoadingImport(true);
      console.log(fileImport.length);

      if (fileImport.length < 1) {
        errorAlert("Please Input Excel File First!");
        return;
      }

      await serverApi.post("/api/films/add", {
        titles: fileImport,
      });

      setIsImport(false);
      fetchFavorite();
      Swal.fire({
        title: "Favorites Imported Successfully!",
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
      setFileName("");
      setFileImport([]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        errorAlert(capitalizeEachWord(error.response?.data.error));
      } else {
        console.log("Error at Login Page: ", error);
      }
    } finally {
      setLoadingImport(false);
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

  const updateNote = async (id: number, note: string) => {
    try {
      console.log(id, "aa", note);

      await serverApi.patch("/api/favorites/" + id, {
        notes: note,
      });

      Swal.fire({
        title: "Note Updated Successful!",
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
      fetchFavorite();
    } catch (error) {
      console.log("Error at Watch List Card: ", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await serverApi.get("/api/me");

      setUser(response.data);
    } catch (error) {
      console.log("Error at Layout:", error);
    }
  };

  const handleShare = async () => {
    try {
      const response = await serverApi.get("/api/user/favorites/share");

      const shareData = {
        title: `${user?.name || "My"} Movie Watchlist`,
        url: window.location.href + "/" + response.data.share_code,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard", {
          icon: <Check className="w-5 h-5 font-semibold" />,
          style: {
            fontWeight: 500,
            borderRadius: "10px",
            background: "#0F1115",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchFavorite();
  }, [sort, order, search]);

  return (
    <div
      className={`bg-[#0F1115] overflow-hidden px-3 sm:px-4 md:px-8 lg:px-36 ${favorite.length > 0 || search.length > 0 ? "pt-24 sm:pt-28 md:pt-32" : "pt-8"} pb-12 sm:pb-16`}
    >
      {favorite.length > 0 || search.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 items-center">
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

            <button
              onClick={() => setIsImport(true)}
              className="bg-[#1C1E22] text-[#F5F2F2] px-3 sm:px-4 py-2 rounded-lg border border-gray-700 hover:border-[#E8630A] focus:outline-none transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className=" sm:inline">Import</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-white/5 hover:bg-[#E8630A]/20 text-[#F5F2F2] p-2 rounded-lg border border-gray-700 hover:border-[#E8630A] focus:outline-none transition-all flex items-center justify-center shadow-lg shadow-white/5 hover:shadow-[#E8630A]/20 hover:scale-105 "
              title="Share"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  <button
                    onClick={() => deleteFavorite(el.film_id)}
                    className="absolute top-2 right-2 z-10 bg-[#E8630A] hover:bg-[#C75409] text-white rounded-full p-2 transition-all shadow-lg hover:scale-110 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <WatchListCard
                    id={el.film_id}
                    title={el.title}
                    rating={el.average_rating ?? 0}
                    description={el.description}
                    poster_url={el.poster_image_url}
                    year={el.release_year}
                    minute={el.runtime}
                    notes={el.notes}
                    isShared={false}
                    onOpenNote={() => {
                      setSelectedMovie(el);
                      setNote(el.notes || "");
                    }}
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
                  <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold text-[#F5F2F2]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {favorite.map((el, idx) => (
                  <tr
                    key={el.id}
                    className={`border-b cursor-pointer border-gray-700 hover:bg-[#1C1E22]/50 transition-colors ${idx % 2 === 0 ? "bg-[#0F1115]" : "bg-[#0B0C0D]"}`}
                    onClick={() => {
                      setSelectedMovie(el);
                      setNote(el.notes || "");
                    }}
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
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFavorite(el.film_id);
                        }}
                        className="inline-flex items-center justify-center bg-[#E8630A] hover:bg-[#C75409] text-white rounded p-1.5 transition-all shadow-lg hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
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
        <div className="min-h-screen flex flex-col justify-center items-center text-[#F5F2F2] space-y-4 px-4">
          <Heart className="w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 font-thin" />
          <h1 className="text-xl sm:text-2xl md:text-3xl text-center font-semibold mt-4">
            Your Watchlist has no titles yet.
          </h1>
          <p className="text-sm sm:text-base font-light text-gray-400 text-center max-w-md">
            Keep track of movies and TV shows you want to watch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full pt-2">
            <Link
              to="/"
              className="w-full sm:w-auto mt-2 bg-[#E8630A] rounded-lg px-6 py-3 hover:bg-[#E8630A]/90 transition-all shadow-md shadow-[#E8630A]/40 hover:shadow-[#E8630A]/50 hover:scale-105 text-center text-sm sm:text-base font-semibold"
            >
              Explore Movies
            </Link>
            <button
              onClick={() => setIsImport(true)}
              className="w-full sm:w-auto mt-2 bg-[#1C1E22] rounded-lg px-6 py-3 hover:bg-[#1C1E22]/90 transition-all shadow-md shadow-[#1C1E22]/40 hover:shadow-[#1C1E22]/50 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
          </div>
        </div>
      )}
      {isImport ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-4"
          onClick={() => setIsImport(false)}
        >
          <div
            className="relative bg-[#1C1E22] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center">
              <label className="flex items-center justify-center w-full px-4 py-3 bg-[#1C1E22] text-[#F5F2F2] text-sm sm:text-base border border-white/20 rounded-xl cursor-pointer hover:border-[#E8630A] transition">
                <span className="font-medium text-center">
                  {fileName ? fileName : "Choose Excel File"}
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4">
              <button
                onClick={() => setIsImport(false)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/files/TemplateDownload.xlsx";
                  link.download = "TemplateDownload.xlsx";
                  link.click();
                }}
                className="px-3 sm:px-5 py-2 text-xs sm:text-sm bg-[#E8630A] hover:bg-[#C75409] text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Download Template
              </button>
              <button
                onClick={createImport}
                disabled={loadingImport}
                className="px-3 sm:px-5 py-2 text-xs sm:text-sm bg-[#E8630A] hover:bg-[#C75409] text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {loadingImport ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">Submitting...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {selectedMovie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="relative bg-[#1C1E22] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#F5F2F2]">
                <NotebookPen size={18} className="text-[#E8630A]" />
                <h3 className="font-semibold text-lg">My Note</h3>
              </div>
              <button
                onClick={() => setSelectedMovie(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-3">
              <span className="text-[#F5F2F2] font-medium">
                {selectedMovie.title}
              </span>{" "}
              &mdash; {selectedMovie.release_year}
            </p>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write Your Note About This Film..."
              rows={5}
              className="w-full bg-[#0F1115] text-[#F5F2F2] placeholder-gray-500 border border-white/10 focus:border-white/30 focus:outline-none rounded-xl px-4 py-3 resize-none text-sm"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedMovie(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateNote(selectedMovie.film_id, note);
                  setSelectedMovie(null);
                }}
                className="px-5 py-2 text-sm bg-[#E8630A] hover:bg-[#C75409] text-white font-semibold rounded-lg transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
