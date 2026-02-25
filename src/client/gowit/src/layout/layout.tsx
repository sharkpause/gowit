import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { serverApi } from "../api";

export default async function Layout() {
  const response = await serverApi.get("/api/me");
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
