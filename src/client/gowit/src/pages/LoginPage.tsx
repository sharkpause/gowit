import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { serverApi } from "../api";
import Swal from "sweetalert2";
import { errorAlert } from "../helper/errorAlert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await serverApi.post("/api/login", { email, password });

      Swal.fire({
        title: "Login Successful!",
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
      console.log("Error at Login Page: ", error);
      // errorAlert(error);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-[#0F1115]">
        <img
          src="../background.png"
          className="hidden md:block md:w-1/2 h-screen object-cover"
          alt="Background"
        />
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#0F1115] px-8">
          <div className="w-full max-w-md text-white">
            <h2 className="text-3xl font-bold mb-2">Login to your Account</h2>
            <p className="text-gray-400 mb-6">
              Don't have an Account?{" "}
              <Link
                to="/register"
                className="text-white underline hover:text-white/90"
              >
                Create a new Account now!
              </Link>
            </p>
            <button className="w-full flex items-center justify-center gap-3 bg-[#1E1E1E] hover:bg-[#2d3745] py-3 rounded-lg mb-6 transition">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
            <div className="flex items-center my-6">
              <div className="grow border-t border-gray-600" />
              <span className="px-3 text-gray-400 text-sm">
                or Sign with Email
              </span>
              <div className="grow border-t border-gray-600" />
            </div>
            <form onSubmit={loginSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-gray-400">Email address</label>
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
                  className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-2 mb-10"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#E50914] hover:bg-red-800 py-3 rounded-lg font-bold transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
