import React, { useState, useMemo } from "react";
// Import useQuery from TanStack Query
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { FaLocationPin } from "react-icons/fa6";
import { FaVoteYea } from "react-icons/fa";
import Footer from "../Home/Footer";

// Define pagination constant and set it up for server-side control
const ITEMS_PER_PAGE = 9;

const AllIssues = () => {
  // NOTE: You might need useAxiosPublic if this route is not protected
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // 1. State for Filters, Search, and Pagination
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Page number

  // 2. Function to build the URL query string
  const createQueryString = useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (status) params.append("status", status);
    if (priority) params.append("priority", priority);
    if (search) params.append("search", search);

    // Pagination parameters for the server
    params.append("page", currentPage);
    params.append("limit", ITEMS_PER_PAGE);

    return params.toString();
  }, [category, status, priority, search, currentPage]);

  // 3. TanStack Query for data fetching
  const {
    data: issuesData = {},
    isLoading,
    isError,
    refetch,
  } = useQuery({
    // queryKey includes all dependencies to trigger refetch
    queryKey: ["allIssues", createQueryString],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issues?${createQueryString}`);
      return res.data;
    },
  });

  // Extract data from the server response
  const currentIssues = issuesData.issues || [];
  const totalIssues = issuesData.totalIssues || 0;
  const totalPages = Math.ceil(totalIssues / ITEMS_PER_PAGE);

  // ============================
  // PAGINATION HANDLERS
  // ============================
  // The server now handles which data to return, we only change currentPage
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

  // Handler for filter/search changes - always resets page to 1
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  // ============================
  // UPVOTE FUNCTION (using refetch)
  // ============================
  const handleUpvote = async (id) => {
    if (!user) return (window.location.href = "/login");

    try {
      await axiosSecure.patch(`/issues/upvote/${id}`);
      // Instead of manual state manipulation, simply refetch the current page data
      refetch();
      // Show success message
      Swal.fire("Success!", "Issue upvoted successfully.", "success");
    } catch (err) {
      console.log(err);
      // Use Swal/Toast for errors
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to upvote",
        "error"
      );
    }
  };

  // ============================
  // RENDER LOGIC (Loader Challenge)
  // ============================
  if (isLoading) {
    // ✅ Loader Challenge Completed
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="ml-2 text-xl">Loading issues...</p>
      </div>
    );
  }

  // Handle no results *after* loading is complete
  const noResults = currentIssues.length === 0 && totalIssues === 0;

  return (
    <div className="max-w-full mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">All Issues</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          className="select select-bordered"
          onChange={(e) => handleFilterChange(setCategory, e.target.value)}
          value={category}
        >
          <option value="">Category (All)</option>
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Pothole">Pothole</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Garbage Overflow">Garbage Overflow</option>
          <option value="Damaged Footpath">Damaged Footpath</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="select select-bordered"
          onChange={(e) => handleFilterChange(setStatus, e.target.value)}
          value={status}
        >
          <option value="">Status (All)</option>
          <option value="Pending">Pending</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          className="select select-bordered"
          onChange={(e) => handleFilterChange(setPriority, e.target.value)}
          value={priority}
        >
          <option value="">Priority (All)</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
        </select>

        <input
          type="text"
          placeholder="Search issues (Title, Location)..."
          className="input input-bordered w-full"
          onChange={(e) => handleFilterChange(setSearch, e.target.value)}
          value={search}
        />
      </div>

      {/* Issue Cards (Uses currentIssues from server) */}
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
            <p
              className={`text-sm font-bold mt-1 ${
                issue.priority === "High" ? "text-red-500" : "text-green-500"
              }`}
            >
              Priority: {issue.priority}
            </p>
            <p className="mt-1">
              <FaLocationPin className="inline mr-1" />
              {issue.reporterDistrict}, {issue.reporterRegion}
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
      {noResults && !isLoading && (
        <div className="text-center mt-8 text-xl text-gray-500">
          No issues found matching the criteria.
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AllIssues;
