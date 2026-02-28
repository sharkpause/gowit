import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { serverApi } from "../api";
import { useEffect, useState } from "react";

export default function Layout() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await serverApi.get("/api/me");
        console.log(response);

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

  if (!id) {
    console.log(id);

    return <Navigate to="/login?loginFirst=true" />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
