import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { serverApi } from "../api";
import { useNavigate, Link, Navigate } from "react-router";
import { errorAlert } from "../helper/errorAlert";

import axios from "axios";
import { capitalizeEachWord } from "../helper/helper";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [style, setStyle] = useState("");
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await serverApi.get("/api/me");

        setId(response.data.id);
      } catch (error) {
        console.log("Error at Layout:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1115]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm tracking-widest uppercase">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (id) {
    return <Navigate to="/" />;
  }

  const submitRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        return errorAlert("Passwords don't match");
      }

      const response = await serverApi.post("/api/register", {
        name,
        email,
        password,
      });

      Swal.fire({
        title: "Register Successful!",

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

      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        errorAlert(capitalizeEachWord(error.response?.data.error));
      } else {
        console.log("Error at Register Page: ", error);
      }
    }
  };

  const confirmPasswordFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password && value.length > 0) {
      setStyle("border-red-500");
    } else {
      setStyle("");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F1115]">
      <img
        src="../background.png"
        className="hidden md:block md:w-1/2 h-screen object-cover"
        alt="Background"
      />
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0F1115] px-8">
        <div className="w-full max-w-md text-white">
          <h2 className="text-3xl font-bold mb-2">Create your Account</h2>
          <p className="text-gray-400 mb-10">
            Start watching unlimited movies today
          </p>
          <form action="/login" onSubmit={submitRegister} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Full Name</label>
              <input
                type="full name"
                name="full"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Password Confirm</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={confirmPasswordFunction}
                className={`w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-2 mb-2 ${style ? style : ""}`}
              />
              {style ? (
                <p className="text-red-500 font-light text-sm ">
                  Passwords do not match.
                </p>
              ) : (
                ""
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#E50914] hover:bg-red-800 py-3 rounded-lg font-bold transition-300 mb-2"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-gray-400 mt-1">
            Already Have an account?{" "}
            <Link
              to="/login"
              className="text-white underline hover:text-white/90"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
