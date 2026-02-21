import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { MovieType } from "../type";
import { serverApi } from "../api";

export default function DetailPage() {
  const [detailMovie, setDetailMovie] = useState<MovieType>();
  let { id } = useParams();

  const fetchMovie = async () => {
    try {
      const response = await serverApi.get("/api/films/" + id);
      setDetailMovie(response.data);
    } catch (error) {
      console.log("Error at Detail Page ", error);
    }
  };

  useEffect(() => {
    fetchMovie();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return <div className="bg-[#0F1115]">\\</div>;
}
