import React, { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingPage from "./LoadingPage";
import { AuthContext } from "../../Contexts/AuthContext";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const axiosInstance = useAxios();
  const { user: authUser } = useContext(AuthContext);
  console.log("user form profile", authUser);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
    // console.log(authUser.email)
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
  });

  useEffect(() => {
    if (!authUser?.email) return; 
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for:", authUser.email);
        const res = await axiosSecure.get(`/profile?email=${authUser.email}`);
        console.log("Profile response:", res.data);
        setUser(res.data);
        setFormData({
          displayName: res.data.displayName || "",
          email: res.data.email || "",
        });
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await axiosSecure.patch("/profile", formData);
      setUser(res.data);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const res = await axiosSecure.post("/subscribe");
      
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Failed to start subscription");
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <LoadingPage />;
      </div>
    );
  }

  if (!user)
    return <p className="py-20 text-center text-red-500">User not found.</p>;

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {user.isBlocked && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">
          Your account is blocked. Please contact the authorities.
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Display Premium Badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">{user.displayName}</h2>
          <img src={user.photoURL} alt="" />

          {user.isPremium && (
            <span className="px-2 py-1 text-xs bg-yellow-400 text-white font-bold rounded">
              Premium
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
              disabled={user.isBlocked}
            />
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
              disabled
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={updating || user.isBlocked}
          className={`px-4 py-2 rounded text-white ${
            user.isBlocked ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>

        {/* Subscribe Section */}
        {!user.isPremium && !user.isBlocked && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
            <p className="mb-2">
              Subscribe for 1000tk to remove issue limits and enjoy premium
              features.
            </p>
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {subscribing ? "Processing..." : "Subscribe Now"}
            </button>
          </div>
        )}

        {user.isPremium && (
          <p className="mt-4 text-green-600 font-semibold">
            You are a premium user. No limits on issue submission.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
