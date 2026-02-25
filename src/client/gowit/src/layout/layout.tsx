import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { serverApi } from "../api";
import { useEffect } from "react";

export default function Layout() {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await serverApi.get("/api/me");
        console.log(response);
      } catch (error) {
        console.log("Error at Layout:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
