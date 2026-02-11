import { Search, Plus, Menu, X } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-lg shadow-black/30">
      <div className="h-16 flex items-center justify-between px-4 md:px-8 lg:px-32">
        {/* Logo & Brand */}
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

        {/* Desktop Navigation Links */}
        <div className="flex gap-6">
          <Link
            to="/"
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/movies"
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Movies
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-gray-300 transition-colors font-medium"
          >
            Contact Us
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-2 lg:mx-6 relative">
          <input
            type="text"
            placeholder="Search Movies..."
            className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full px-5 py-1.5 pr-12 border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
            <Search size={18} />
          </button>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 transition-transform duration-200"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/98 backdrop-blur-lg border-t border-white/10">
          {/* Mobile Search */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Movies..."
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full px-5 py-2 pr-12 border border-white/20 focus:outline-none focus:border-white/40"
              />
              <button className="absolute right-3 top-1/2  text-gray-400">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col py-2">
            <Link
              to="/"
              className="text-white hover:bg-white/10 transition-colors px-6 py-3 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="text-white hover:bg-white/10 transition-colors px-6 py-3 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/contact"
              className="text-white hover:bg-white/10 transition-colors px-6 py-3 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/watchlist"
              className="text-white hover:bg-white/10 transition-colors px-6 py-3 font-medium flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Plus size={20} className="border border-white/40 rounded" />
              Watch List
            </Link>
          </div>

          {/* Mobile Sign In */}
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
