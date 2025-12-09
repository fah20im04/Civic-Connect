import axios from "axios";

const useAxiosSecure = () => {
  // Create an Axios instance with your backend base URL
  const instance = axios.create({
    baseURL: "http://localhost:3000", // your backend URL
  });

  // Optional: add interceptors
  instance.interceptors.request.use(
    (config) => {
      // Add token if you have one (for now can skip)
      // config.headers.Authorization = `Bearer ${token}`;
      console.log("Axios request config:", config);
      return config;
    },
    (error) => {
      console.error("Axios request error:", error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      console.log("Axios response:", response);
      return response;
    },
    (error) => {
      console.error("Axios response error:", error);
      return Promise.reject(error);
    }
  );
  //console.log("AxiosSecure instance:", instance);

  return instance; 

};

export default useAxiosSecure;
