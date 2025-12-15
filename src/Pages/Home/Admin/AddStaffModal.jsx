import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AddStaffModal = ({ isOpen, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    photo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return Swal.fire("Error", "Please fill all required fields", "error");
    }

    setLoading(true);
    try {
      await axiosSecure.post("/admin/staff", formData);
      Swal.fire("Success", "Staff added successfully!", "success");
      onClose();
      setFormData({ name: "", email: "", phone: "", password: "", photo: "" });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to add staff", "error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg mb-4">Add Staff</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold block mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone"
              value={formData.phone}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Photo URL</label>
            <input
              type="text"
              name="photo"
              placeholder="Enter photo URL"
              value={formData.photo}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="modal-action justify-end">
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
