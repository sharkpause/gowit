import { Copyright, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black/95 ">
      <div className="px-4 md:px-8 lg:px-32 py-12">
        <div className="flex justify-between gap-x-20 mb-8">
          <div className="w-full md:w-80">
            <h3 className="text-white font-bold text-lg mb-4">Gowit</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for discovering movies and series with
              smarter insights. Built for discovery, powered by data.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/movies"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Movies
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-gray-300" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Copyright className="w-4 h-4" />
            <span>2026 Gowit. All Rights Reserved.</span>
          </p>
          <div className="flex gap-6 text-sm">
            <p className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </p>
            <p className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
