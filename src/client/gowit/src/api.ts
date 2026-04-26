import axios from "axios";

export const serverApi = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "http://23.22.168.181",
  withCredentials: true,
});
