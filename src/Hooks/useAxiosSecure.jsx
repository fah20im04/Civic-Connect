import axios from "axios";
import { getAuth } from "firebase/auth";

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: "http://localhost:3000",
  });

  axiosSecure.interceptors.request.use(async (config) => {
    // console.log("----- Interceptor Triggered -----");
    const auth = getAuth();
    const user = auth.currentUser;

    // console.log("Current User:", user);

    if (user) {
      const token = await user.getIdToken(true);
      // console.log("Token in interceptor:", token);

      config.headers.Authorization = `Bearer ${token}`;
      // console.log(config.headers.Authorization = `Bearer ${token}`);
    } else {
      // console.log("NO USER — NO TOKEN ADDED");
    }

    // console.log("FINAL HEADERS SENT:", config.headers);
    // console.log("---------------------------------");

    return config;
  });

  return axiosSecure;
};

export default useAxiosSecure;
