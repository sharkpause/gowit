import { X } from "lucide-react";
import { serverApi } from "../api";
import { useState } from "react";
import Swal from "sweetalert2";
import { errorAlert } from "../helper/errorAlert";
import { capitalizeEachWord } from "../helper/helper";
import axios from "axios";

export default function VerificationFailed() {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      setLoading(true);
      const userEmail = JSON.parse(localStorage.getItem("userEmail") || "{}");

      console.log(userEmail.email);
      const response = await serverApi.post("/api/verify/resend", {
        email: userEmail.email,
      });

      Swal.fire({
        title: "Verification Link Has Been Sent!",

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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        errorAlert(capitalizeEachWord(error.response?.data.error));
      } else {
        console.log("Error at Resend Function", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050608] min-h-screen px-3 pt-16 pb-16 flex items-center justify-center">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md w-full text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
          <span className="text-2xl text-red-400">
            <X />
          </span>
        </div>

        <h1 className="text-white text-2xl font-bold mb-2">
          Verification Failed
        </h1>

        <p className="text-gray-400 text-sm mb-6">
          Your verification link has expired. <br /> Click the button below to
          resend a new verification link.
        </p>

        <button
          onClick={handleResend}
          className="w-full rounded-xl bg-[#E8630A] hover:bg-[#ff7a1a] text-white font-semibold py-3 transition"
        >
          {loading ? (
            <div className="mx-auto w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Resend Verification Link"
          )}
        </button>
      </div>
    </div>
  );
}
