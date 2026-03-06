import Swal from "sweetalert2";
import { serverApi } from "../api";
import { Navigate, useNavigate } from "react-router";
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
          "Accept": "application/json",
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
            "px-4 py-2 rounded-lg bg-[#E50914] text-white hover:bg-[#b20710] focus:outline-none",
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
          <div className="relative">
            <img
              src={
                picture
                  ? picture
                  : "https://res.cloudinary.com/degghm3hf/image/upload/v1772528750/profile-icon-design-free-vector_jas9j3.jpg"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-[#0F1115] shadow-xl object-cover"
            />

            {isEdit ? (
              loading ? (
                <div className="flex justify-center items-center bg-gray-900/50 cursor-not-allowed absolute inset-0 w-32 h-32 rounded-full">
                  <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <label className="flex justify-center items-center bg-gray-900/50 cursor-pointer hover:bg-gray-900/70 border-4 border-[#0F1115] absolute inset-0 w-32 h-32 rounded-full transition-colors">
                  <Pencil size={20} className="text-white" />
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

            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#0F1115]" />
          </div>
        </div>

        <div className="flex justify-between mb-5">
          {isEdit ? (
            loading ? (
              <div className="flex items-center gap-2 py-3 px-5 bg-gray-700/50 text-gray-400 font-semibold rounded-xl cursor-not-allowed">
                <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                Uploading...
              </div>
            ) : (
              <button
                type="button"
                className="py-3 px-5 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800 shadow-md cursor-pointer transition-colors"
                onClick={updateProfile}
              >
                Done
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={() => setIsEdit(true)}
              className="py-3 px-3 bg-[#E50914] text-[#F5F2F2] font-semibold rounded-xl hover:bg-[#E50914]/90 shadow-md shadow-[#E50914]/30 cursor-pointer"
            >
              Edit Profile
            </button>
          )}

          <button
            type="button"
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEdit}
              className={`w-full bg-[#1C1E22] px-4 py-3 rounded-lg border transition-colors ${
                isEdit
                  ? "text-[#F5F2F2] border-white/30 focus:border-white/60 focus:outline-none cursor-text"
                  : "text-gray-500 border-white/10 cursor-not-allowed opacity-60"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={profile?.email}
              onChange={() => {}}
              readOnly
              disabled={!isEdit}
              className={`w-full bg-[#1C1E22] px-4 py-3 rounded-lg border transition-colors text-gray-500 border-white/10 cursor-not-allowed opacity-60 outline-none`}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 ml-1">
              Member Since
            </label>
            <input
              type="date"
              value={toDateInputValue(profile?.created)}
              onChange={() => {}}
              readOnly
              className={`w-full bg-[#1C1E22] px-4 py-3 rounded-lg border transition-colors text-gray-500 border-white/10 cursor-not-allowed opacity-60 outline-none`}
            />
          </div>

          <div>
            <div className="bg-gradient-to-r from-[#E50914]/10 via-[#E50914]/5 to-transparent p-6 rounded-xl border border-[#E50914]/20">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Your Watchlist</p>
                    <h3 className="text-3xl font-bold text-[#F5F2F2]">
                      {profile?.favorite_count || 0}{" "}
                      <span className="text-lg text-gray-400 font-normal">
                        Movies
                      </span>
                    </h3>
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
