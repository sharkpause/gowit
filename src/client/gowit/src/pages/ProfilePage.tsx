import Swal from "sweetalert2";
import { serverApi } from "../api";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { ProfileType } from "../type";
import { capitalizeEachWord, toDateInputValue } from "../helper/helper";
import { Pencil } from "lucide-react";
import { errorAlert } from "../helper/errorAlert";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileType>();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");

  const [picture, setPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        errorAlert("Only JPG and PNG files are allowed.");
        e.target.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("profile_picture", file);

      const res = await serverApi.patch("/api/updateuser", formData, {
        // **no manual Content-Type!**
        headers: {
          Accept: "application/json",
        },
      });

      setPicture(res.data.url);
    } catch (error) {
      console.log("Error at Profile Picture: ", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const response = await serverApi.patch("/api/updateuser", {
        name,

        profile_picture_url: picture,
      });

      Swal.fire({
        title: "Profile Updated Successful!",

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

      setIsEdit(false);
      fetchUser();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        errorAlert(capitalizeEachWord(error.response?.data.error));
      } else {
        console.log("Error at Register Page: ", error);
      }
    } finally {
      setLoading(false);
    }
  };

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
            "px-4 py-2 rounded-lg bg-[#E8630A] text-white hover:bg-[#C75409] focus:outline-none",
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
      setName(response.data.name);

      setPicture(response.data.profile);
      setProfile(response.data);
    } catch (error) {
      console.log("Error at ProfilePage: ", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen relative bg-[#0F1115]">
      <div
        className="h-32 sm:h-40 md:h-48 lg:h-64 relative"
        style={{
          backgroundImage: "url('/backgroundProfile.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-12 sm:h-16 md:h-24 lg:h-32 bg-gradient-to-t from-[#0F1115] to-transparent" />
      </div>
      <div className="absolute mt-10 sm:mt-0 left-1/2 top-20 sm:top-24 md:top-32 lg:top-40 h-fit w-full max-w-lg mx-auto rounded-2xl -translate-x-1/2 px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-[#0F1115] shadow-2xl shadow-black/50 border border-white/10">
        <div className="absolute left-1/2 -top-12 sm:-top-14 md:-top-16 lg:-top-20 -translate-x-1/2 ">
          <div className="relative">
            <img
              src={
                picture
                  ? picture
                  : "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
              }
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-3 sm:border-4 border-[#0F1115] shadow-xl object-cover"
            />

            {isEdit ? (
              loading ? (
                <div className="flex justify-center items-center bg-gray-900/50 cursor-not-allowed absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <label className="flex justify-center items-center bg-gray-900/50 cursor-pointer hover:bg-gray-900/70 border-3 sm:border-4 border-[#0F1115] absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full transition-colors">
                  <Pencil size={16} className="text-white sm:w-5 md:w-5" />
                  <input
                    accept=".jpg,.jpeg,.png"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )
            ) : (
              ""
            )}

            <div className="absolute bottom-1 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-[#0F1115]" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 md:gap-3 justify-between mb-4 sm:mb-5 mt-16 sm:mt-12 md:mt-14 lg:mt-16">
          {isEdit ? (
            loading ? (
              <div className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 sm:px-5 bg-gray-700/50 text-gray-400 font-semibold text-sm sm:text-base rounded-xl cursor-not-allowed">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                <span className="hidden sm:inline">Uploading...</span>
              </div>
            ) : (
              <button
                type="button"
                className="py-2.5 sm:py-3 px-4 sm:px-5 bg-gray-700 text-white font-semibold text-sm sm:text-base rounded-xl hover:bg-gray-800 shadow-md cursor-pointer transition-colors"
                onClick={updateProfile}
              >
                Done
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={() => setIsEdit(true)}
              className="py-2.5 sm:py-3 px-4 sm:px-5 bg-[#E8630A] text-[#F5F2F2] font-semibold text-sm sm:text-base rounded-xl hover:bg-[#E8630A]/90 shadow-md shadow-[#E8630A]/30 cursor-pointer transition-all"
            >
              Edit Profile
            </button>
          )}

          <button
            type="button"
            onClick={logout}
            className="py-2.5 sm:py-3 px-4 sm:px-5 bg-[#E8630A] text-[#F5F2F2] font-semibold text-sm sm:text-base rounded-xl hover:bg-[#E8630A]/90 shadow-md shadow-[#E8630A]/30 cursor-pointer transition-all"
          >
            Logout
          </button>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <div>
            <label className="block text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2 ml-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEdit}
              className={`w-full bg-[#1C1E22] px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base transition-colors ${
                isEdit
                  ? "text-[#F5F2F2] border-white/30 focus:border-white/60 focus:outline-none cursor-text"
                  : "text-gray-500 border-white/10 cursor-not-allowed opacity-60"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={profile?.email ?? ""}
              onChange={() => {}}
              readOnly
              disabled={!isEdit}
              className="w-full bg-[#1C1E22] px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base transition-colors text-gray-500 border-white/10 cursor-not-allowed opacity-60 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2 ml-1">
              Member Since
            </label>
            <input
              type="date"
              value={toDateInputValue(profile?.created) ?? ""}
              onChange={() => {}}
              readOnly
              className="w-full bg-[#1C1E22] px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base transition-colors text-gray-500 border-white/10 cursor-not-allowed opacity-60 outline-none"
            />
          </div>

          <div>
            <div className="bg-gradient-to-r from-[#E8630A]/10 via-[#E8630A]/5 to-transparent p-4 sm:p-5 md:p-6 rounded-xl border border-[#E8630A]/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <p className="text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2">
                    Your Watchlist
                  </p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F5F2F2]">
                    {profile?.favorite_count || 0}{" "}
                    <span className="text-base sm:text-lg md:text-xl text-gray-400 font-normal">
                      Movies
                    </span>
                  </h3>
                </div>

                <div>
                  <div className="bg-[#E8630A]/20 p-3 sm:p-4 rounded-full">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-[#E8630A]"
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
