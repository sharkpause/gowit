import { Link } from "react-router";

export default function LoginPage() {
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
            <form action="/login" method="POST" className="space-y-6">
              <div>
                <label className="text-sm text-gray-400">Email address</label>
                <input
                  type="email"
                  name="email"
                  className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Password</label>
                <input
                  type="password"
                  name="password"
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
