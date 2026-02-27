import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { serverApi } from "../api";
import { useEffect, useState } from "react";

export default function Layout() {
  const [id, setId] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await serverApi.get("/api/me");
        setId(response.data.id);
      } catch (error) {
        console.log("Error at Layout:", error);
      }
    };

    fetchUser();
  }, []);

  if (!id) {
    return <Navigate to="/login?loginFirst=true" />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
