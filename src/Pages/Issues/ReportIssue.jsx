import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAxios from "../../Hooks/useAxios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { getAuth } from "firebase/auth";

const imageHostKey = import.meta.env.VITE_IMAGE_HOST_KEY;

const ReportIssue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (image) {
      imageUrl = await uploadImageToImgbb(image);
    }

    const issue = {
      title,
      description,
      category,
      image: imageUrl,
      location,
    };

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user.getIdToken();

      await axiosSecure.post("/issues", issue, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/my-issues");
    } catch (error) {
      console.error(error);
      alert("Failed to submit issue");
    }
  };

  return (
    <div className="py-16 ">
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto p-6 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Report an Issue</h2>

        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full mb-3"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full mb-3"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="select select-bordered w-full mb-3"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Pothole">Pothole</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Garbage Overflow">Garbage Overflow</option>
          <option value="Damaged Footpath">Damaged Footpath</option>
          <option value="other">Other</option>
        </select>

        <input
          type="file"
          className="mb-3"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <input
          type="text"
          placeholder="Location"
          className="input input-bordered w-full mb-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button type="submit" className="btn btn-primary w-full">
          Submit Issue
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
