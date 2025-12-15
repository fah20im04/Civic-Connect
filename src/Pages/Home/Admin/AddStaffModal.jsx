import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useAuthContext } from "../../../Context/AuthContext"; // Firebase Auth

const AddStaffModal = ({ isOpen, onClose, loaderData }) => {
  const axiosSecure = useAxiosSecure();
  const { createUserWithEmail } = useAuthContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    photo: "",
    region: "",
    district: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Get districts from loaderData (OurCenters.json)
  const districtsByRegion = (region) => {
    if (!region) return [];
    const center = loaderData.find((c) => c.region === region);
    return center ? [center.district] : [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, region, district } = formData;
    if (!name || !email || !password || !region || !district) {
      return Swal.fire("Error", "Please fill all required fields", "error");
    }

    setLoading(true);
    try {
      // 1. Create staff in Firebase
      const firebaseUser = await createUserWithEmail(email, password, {
        displayName: name,
        photoURL: formData.photo,
      });

      // 2. Save staff in backend /users route
      await axiosSecure.post("/users", {
        _id: firebaseUser.uid,
        name,
        email,
        phone: formData.phone,
        photo: formData.photo,
        region,
        district,
        role: "staff",
        createdAt: new Date(),
      });

      Swal.fire("Success", "Staff added successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Add staff failed:", error);
      Swal.fire("Error", "Failed to add staff", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <h2 className="text-xl font-semibold mb-4">Add Staff</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="photo"
            placeholder="Photo URL"
            value={formData.photo}
            onChange={handleChange}
            className="input input-bordered w-full"
          />

          {/* Region */}
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Region</option>
            {[...new Set(loaderData.map((item) => item.region))].map(
              (region, idx) => (
                <option key={idx} value={region}>
                  {region}
                </option>
              )
            )}
          </select>

          {/* District */}
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="select select-bordered w-full"
            disabled={!formData.region}
            required
          >
            <option value="">Select District</option>
            {districtsByRegion(formData.region).map((district, idx) => (
              <option key={idx} value={district}>
                {district}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
