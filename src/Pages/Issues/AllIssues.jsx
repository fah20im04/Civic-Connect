import { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { FaLocationPin } from "react-icons/fa6";
import { FaVoteYea } from "react-icons/fa";
import Footer from "../Home/Footer";

const ITEMS_PER_PAGE = 9; // Define how many issues to show per page

const AllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // New state for current page

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
    setCurrentPage(1); // Reset to first page when filters/search change
  }, [category, status, priority, search, issues]);

  // ============================
  // PAGINATION LOGIC
  // ============================
  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Slice the filtered data to get issues for the current page
  const currentIssues = filteredIssues.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ============================
  //  UPVOTE FUNCTION
  // ============================
  const handleUpvote = async (id) => {
    if (!user) return (window.location.href = "/login");

    try {
      await axiosSecure.patch(`/issues/upvote/${id}`);

      // Update the original 'issues' state first
      setIssues((prev) =>
        prev.map((i) => (i._id === id ? { ...i, upvotes: i.upvotes + 1 } : i))
      );
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to upvote");
    }
  };

  return (
    <div className="max-w-full mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">All Issues</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          className="select select-bordered"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Category</option>
          {/* FIX APPLIED HERE: The value now correctly matches the display text (and the backend data) */}
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Pothole">Pothole</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Garbage Overflow">Garbage Overflow</option>
          <option value="Damaged Footpath">Damaged Footpath</option>
          <option value="Other">Other</option>
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

      {/* Issue Cards (Uses currentIssues for rendering) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentIssues.map((issue) => (
          <div key={issue._id} className="border p-4 rounded-lg shadow">
            <img
              src={issue.image}
              className="h-40 w-full object-cover rounded"
              alt={issue.title}
            />

            <h2 className="text-xl font-semibold mt-2">{issue.title}</h2>
            <p className="text-sm text-gray-600">{issue.category}</p>
            <p className="mt-1">
              <FaLocationPin className="inline mr-1" />
              {issue.reporterDistrict}, {issue.reporterRegion}{" "}
              {/* Adjusted location display */}
            </p>

            <div className="flex justify-between mt-3 items-center">
              <button
                onClick={() => handleUpvote(issue._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <FaVoteYea /> {issue.upvotes}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`btn ${
              currentPage === 1 ? "btn-disabled" : "btn-primary"
            }`}
          >
            Previous
          </button>

          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`btn ${
              currentPage === totalPages ? "btn-disabled" : "btn-primary"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Handle no results after filtering/searching */}
      {filteredIssues.length === 0 && (
        <div className="text-center mt-8 text-xl text-gray-500">
          No issues found matching the criteria.
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default AllIssues;
