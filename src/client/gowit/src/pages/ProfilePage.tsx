import Swal from "sweetalert2";
import { serverApi } from "../api";
import { Navigate, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { ProfileType } from "../type";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileType>();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await serverApi.post("/api/logout");

      Swal.fire({
        title: "Logout Successful!",

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

      navigate("/");
    } catch (error) {
      console.log("Error at ProfilePage: ", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await serverApi.get("/api/userprofile");
      console.log(response.data);

      setProfile(response.data);
    } catch (error) {
      console.log("Error at ProfilePage: ", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="h-[100vh] relative">
      <div
        className="h-[50vh] relative"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/degghm3hf/image/upload/v1771748577/does-anyone-know-how-to-create-the-netflix-colored-lines-v0-zp69f0bdm13e1_qg1oay.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0F1115] to-transparent" />
      </div>
      <div className="h-[50vh] bg-[#0F1115]" />
      <div className="absolute left-1/2 top-6/12 h-fit w-4xl rounded-2xl -translate-x-1/2 -translate-y-1/2 px-5 py-8 bg-[#0F1115] shadow-2xl shadow-black/50 border border-white/10">
        <div className="absolute left-1/2 -top-15 -translate-x-1/2">
          <div>
            <img
              src="https://res.cloudinary.com/degghm3hf/image/upload/v1771748577/does-anyone-know-how-to-create-the-netflix-colored-lines-v0-zp69f0bdm13e1_qg1oay.webp"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-[#0F1115] shadow-xl object-cover"
            />
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#0F1115]" />
          </div>
        </div>

        <div className="flex justify-between mb-5">
          <button className="py-3 px-3 bg-[#E50914] text-[#F5F2F2] font-semibold rounded-xl hover:bg-[#E50914]/90 shadow-md shadow-[#E50914]/30 cursor-pointer">
            Edit Profile
          </button>
          <button
            onClick={logout}
            className="py-3 px-3 bg-[#E50914] text-[#F5F2F2] font-semibold rounded-xl hover:bg-[#E50914]/90 shadow-md shadow-[#E50914]/30 cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className=" space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2 ml-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile?.name}
              disabled
              className="w-full bg-[#1C1E22] text-[#F5F2F2] px-4 py-3 rounded-lg border border-white/10 cursor-not-allowed opacity-90"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={profile?.email}
              disabled
              className="w-full bg-[#1C1E22] text-[#F5F2F2] px-4 py-3 rounded-lg border border-white/10 cursor-not-allowed opacity-90"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 ml-1">
              Member Since
            </label>
            <input
              type="date"
              value={profile?.created}
              disabled
              className="w-full bg-[#1C1E22] text-[#F5F2F2] px-4 py-3 rounded-lg border border-white/10 cursor-not-allowed opacity-90"
            />
          </div>

          <div>
            <div className="bg-gradient-to-r from-[#E50914]/10 via-[#E50914]/5 to-transparent p-6 rounded-xl border border-[#E50914]/20">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Your Watchlist</p>
                    <h3 className="text-3xl font-bold text-[#F5F2F2]">
                      21{" "}
                      <span className="text-lg text-gray-400 font-normal">
                        Movies
                      </span>
                    </h3>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-400">Recently Added At:</span>{" "}
                    <span className="text-[#F5F2F2] font-medium">
                      February 22, 2026
                    </span>
                  </div>
                </div>

                <div>
                  <div className="bg-[#E50914]/20 p-4 rounded-full  ">
                    <svg
                      className="w-8 h-8 text-[#E50914]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
