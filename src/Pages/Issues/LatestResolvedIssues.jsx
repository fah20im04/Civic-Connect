import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure"; 
import LoadingPage from "../Home/LoadingPage";

const LatestResolvedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/issues"); // fetch all issues
        setIssues(res.data);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Filter resolved & sort by createdAt descending
  const resolvedIssues = issues
    .filter((i) => i.status === "Resolved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  if (loading) return <LoadingPage></LoadingPage>
  if (resolvedIssues.length === 0)
    return <p className="text-center text-gray-500">No resolved issues yet.</p>;

  return (
    <div className="p-6 ">
      <h2 className="text-3xl font-bold mb-6">Latest Resolved Issues</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resolvedIssues.map((issue) => (
          <div
            key={issue._id}
            className=" p-4 rounded-xl shadow hover:shadow-lg transition bg-gradient-to-r from-green-200 via-green-300 to-green-400"
          >
            {issue.image && (
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-48 object-cover mb-3 rounded"
              />
            )}
            <h3 className="font-bold text-lg">{issue.title}</h3>
            <p className="text-sm mb-2">{issue.description}</p>
            <p>
              <span className="font-semibold">Category:</span> {issue.category}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {issue.location}
            </p>
            <button
              onClick={() => navigate(`/issue/${issue._id}`)}
              className="btn btn-sm btn-primary mt-2"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestResolvedIssues;
