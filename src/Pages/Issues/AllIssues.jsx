import { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure"; 
import { Link } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { FaLocationPin } from "react-icons/fa6";
import { FaVoteYea } from "react-icons/fa";
 

const AllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);

  // Filters
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axiosSecure
      .get("/issues")
      .then((res) => {
        setIssues(res.data);
        setFilteredIssues(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // ============================
  // FILTER + SEARCH
  // ============================
  useEffect(() => {
    let temp = [...issues];

    if (category) temp = temp.filter((i) => i.category === category);
    if (status) temp = temp.filter((i) => i.status === status);
    if (priority) temp = temp.filter((i) => i.priority === priority);
    if (search)
      temp = temp.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase())
      );

    setFilteredIssues(temp);
  }, [category, status, priority, search, issues]);

  // ============================
  //  UPVOTE FUNCTION
  // ============================
  const handleUpvote = async (id) => {
    if (!user) return (window.location.href = "/login");

    try {
      await axiosSecure.patch(`/issues/upvote/${id}`);

      
      setFilteredIssues((prev) =>
        prev.map((i) => (i._id === id ? { ...i, upvotes: i.upvotes + 1 } : i))
      );
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to upvote");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">All Issues</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          className="select select-bordered"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Category</option>
          <option value="Road">Road</option>
          <option value="Water">Water</option>
          <option value="Electricity">Electricity</option>
        </select>

        <select
          className="select select-bordered"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          className="select select-bordered"
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Priority</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
        </select>

        <input
          type="text"
          placeholder="Search issues..."
          className="input input-bordered w-full"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Issue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <div key={issue._id} className="border p-4 rounded-lg shadow">
            <img
              src={issue.image}
              className="h-40 w-full object-cover rounded"
            />

            <h2 className="text-xl font-semibold mt-2">{issue.title}</h2>
            <p className="text-sm text-gray-600">{issue.category}</p>
            <p className="mt-1"><FaLocationPin></FaLocationPin> {issue.location}</p>

            <div className="flex justify-between mt-3 items-center">
              <button
                onClick={() => handleUpvote(issue._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
               <FaVoteYea></FaVoteYea> {issue.upvotes}
              </button>

              <Link
                to={`/viewDetails/${issue._id}`}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllIssues;
