import { Search, Plus, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");

  return (
    <nav className="bg-black/95 backdrop-blur-sm fixed left-0 right-0 z-50 shadow-lg shadow-black/30">
      <div className="h-16 flex items-center justify-between px-4 md:px-8 lg:px-32">
        <div className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/degghm3hf/image/upload/v1770800459/logo_gowit_tr-removebg-preview_vtvyyq.png"
            alt="GOWIT Logo"
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
          />
          <h1 className="text-white text-lg md:text-xl font-bold mr-5 ">
            GOWIT
          </h1>
        </div>

        <div className="flex gap-6">
          <a
            href="/"
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Home
          </a>
          <a
            href="/#movies"
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Movies
          </a>
          <a
            href="/#contact-us"
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Contact Us
          </a>
        </div>

        <div className="hidden md:block flex-1 max-w-md mx-2 lg:mx-6 relative">
          <div>
            <input
              type="text"
              placeholder="Search Movies..."
              className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full px-5 py-1.5 pr-12 border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
            {search ? (
              <div className="absolute top-full mt-2 w-full bg-[#1C1E22] rounded-lg shadow-2xl border border-white/10 max-h-96 overflow-y-auto z-50">
                <div className="p-2">
                  <a
                    href="/movie/1"
                    className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-colors cursor-pointer group"
                  >
                    <img
                      src="https://via.placeholder.com/60x90"
                      alt="Movie"
                      className="w-12 h-16 object-cover rounded shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium group-hover:text-[#E50914] transition-colors">
                        Movie Title
                      </h4>
                      <p className="text-gray-400 text-sm">2024 • ⭐ 8.5</p>
                    </div>
                  </a>
                </div>

                {/* No Results State (optional) */}
                {/* <div className="p-6 text-center">
                  <p className="text-gray-400">No movies found for "{search}"</p>
                </div> */}

                <div className="border-t border-white/10 p-3">
                  <a
                    href={`/search?q=${search}`}
                    className="block text-center text-[#E50914] hover:text-[#E50914]/80 font-medium transition-colors"
                  >
                    View all results for "{search}"
                  </a>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
            <Search size={18} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/watchlist"
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <Plus size={20} className="border border-white/40 rounded" />
            <span className="font-medium hidden lg:inline">Watch List</span>
          </Link>
          <button className="bg-white text-black px-4 lg:px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all text-sm lg:text-base">
            Sign In
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 transition-transform duration-200"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/98 backdrop-blur-lg border-t border-white/10">
          <div className="px-4 py-3 border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Movies..."
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full px-5 py-2 pr-12 border border-white/20 focus:outline-none focus:border-white/40"
                onChange={(e) => setMobileSearch(e.target.value)}
              />
              <button className="absolute right-3 top-3 text-gray-400">
                <Search size={18} />
              </button>
            </div>
          </div>

          {mobileSearch ? (
            <div className="bg-black/98 border-b border-white/10 max-h-72 overflow-y-auto">
              <div className="p-2">
                <a
                  href="/movie/1"
                  className="flex items-center gap-3 p-2.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer "
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMobileSearch("");
                  }}
                >
                  <img
                    src="https://via.placeholder.com/60x90"
                    alt="Movie"
                    className="w-10 h-14 object-cover rounded shadow-md"
                  />
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium group-hover:text-[#E50914] transition-colors">
                      Movie Title
                    </h4>
                    <p className="text-gray-400 text-xs">2024 • ⭐ 8.5</p>
                  </div>
                </a>
              </div>

              <div className="border-t border-white/10 p-2">
                <a
                  href={`/search?q=${mobileSearch}`}
                  className="block text-center text-[#E50914] hover:text-[#E50914]/80 text-sm font-medium transition-colors py-2"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMobileSearch("");
                  }}
                >
                  View all results →
                </a>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col py-2">
            <a
              href="/"
              className="text-white hover:bg-white/10 transition-colors px-6 py-3 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/#movies"
              className="text-white hover:bg-white/10 transition-colors px-6 py-3 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Movies
            </a>
            <a
              href="/#contact-us"
              className="text-white hover:bg-white/10 transition-colors px-6 py-3 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </a>
            <Link
              to="/watchlist"
              className="text-white hover:bg-white/10 transition-colors px-6 py-3 font-medium flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus size={20} className="border border-white/40 rounded" />
              Watch List
            </Link>
          </div>

          <div className="px-4 py-4 border-t border-white/10">
            <button className="w-full bg-white text-black py-2.5 rounded-full font-semibold hover:bg-gray-200 transition-all">
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
