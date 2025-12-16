import axios from "axios";
import React from "react";

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: "https://assignment-11-server-alpha-nine.vercel.app",
  });
  return axiosInstance;
};

export default useAxios;
