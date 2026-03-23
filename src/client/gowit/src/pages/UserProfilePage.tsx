import { User, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router";
import { serverApi } from "../api";
import { useEffect, useState } from "react";
import type { OtherUser } from "../type";
import { toDateInputValue } from "../helper/helper";

export default function UserProfilePage() {
  const [dataUser, setDataUser] = useState<OtherUser>();
  const { userId } = useParams();

  const fetchUser = async () => {
    try {
      const response = await serverApi.get(`/api/user/${userId}`);
      setDataUser(response.data);
    } catch (error) {
      console.log("Error at fetchUser function", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative bg-[#0F1115] ">
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
        <div className="absolute mt-8 left-1/2 top-20 sm:top-24 md:top-32 lg:top-40 h-fit w-full max-w-lg mx-auto rounded-2xl -translate-x-1/2 px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-[#0F1115] shadow-2xl shadow-black/50 border border-white/10">
          <div className="absolute left-1/2 -top-12 sm:-top-14 md:-top-16 lg:-top-20 -translate-x-1/2">
            <div className="relative">
              <img
                src={dataUser?.profile_picture_url}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-3 sm:border-4 border-[#0F1115] shadow-xl object-cover"
              />

              <div className="absolute bottom-1 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-[#0F1115]" />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5 md:space-y-6 mt-16">
            <div>
              <label className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2 ml-1">
                <User className="w-4 h-4 text-[#E8630A]" />
                Full Name
              </label>
              <input
                type="text"
                value={dataUser?.name}
                readOnly
                disabled
                className={`w-full bg-[#1C1E22] px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base transition-colors text-white border-white/10 cursor-not-allowed`}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2 ml-1">
                <Calendar className="w-4 h-4 text-[#E8630A]" />
                Member Since
              </label>
              <input
                type="date"
                value={toDateInputValue(dataUser?.created_at)}
                onChange={() => {}}
                readOnly
                className="w-full bg-[#1C1E22] px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base transition-colors text-white border-white/10 cursor-not-allowed outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
