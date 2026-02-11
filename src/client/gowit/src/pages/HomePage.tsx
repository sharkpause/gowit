import LightRays from "../components/LightRays";
import { Film } from "lucide-react";

export default function HomePage() {
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
          <div className="w-fit rounded-full px-6 py-3 bg-white/10 backdrop-blur-xl ring-1 ring-white/20">
            <p className="text-[#F5F2F2]">
              <Film className="inline-block mr-2 text-[#E50914]" size={20} />
              Movie Database Platform
            </p>
          </div>
          <h1 className="text-5xl font-bold text-[#F5F2F2] mt-8 ">
            Discover Movies with Smarter Insights
          </h1>
          <h1 className="text-5xl font-bold text-[#F5F2F2] mt-4 ">
            Built for discovery, powered by data.
          </h1>

          <p className="text-xl text-[#F5F2F2]/80 mt-5 max-w-2xl">
            Explore films, track your favorites, and never miss what to watch
            next.
          </p>
          <div className="flex gap-4 mt-8">
            <button className="px-8 py-3 bg-[#E50914] text-white font-semibold rounded-full hover:bg-[#E50914]/90 transition-all shadow-lg shadow-[#E50914]/30">
              Get Started
            </button>
            <button className="px-8 py-3 bg-white/10 text-[#F5F2F2] font-semibold rounded-full hover:bg-white/20 transition-all ring-1 ring-white/20 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
