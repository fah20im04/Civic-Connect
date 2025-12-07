import useAxiosSecure from "../../Hooks/useAxiosSecure";


const Test = () => {
  const axiosSecure = useAxiosSecure();

  const testApi = async () => {
    try {
      const res = await axiosSecure.get("/users");
      console.log("Response:", res.data);
    } catch (err) {
      console.log("API Error:", err.response?.data || err);
    }
  };

  return (
    <button onClick={testApi} className="btn btn-primary">
      Test API
    </button>
  );
};

export default Test;
