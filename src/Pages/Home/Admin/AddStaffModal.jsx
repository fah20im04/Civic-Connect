import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth"; 

const AddStaffModal = ({ isOpen, onClose, loaderData }) => {
  const axiosSecure = useAxiosSecure();
  const { registerUser, updateUserProfile } = useAuth(); // Firebase functions

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedRegion = watch("region");

  if (!isOpen) return null;

  const districtsByRegion = (region) => {
    if (!region) return [];
    const center = loaderData.find((c) => c.region === region);
    return center ? [center.district] : [];
  };

  const onSubmit = async (data) => {
    const { name, email, password, region, district, phone, photo } = data;

    try {
      // 1. Create user in Firebase
      const userCredential = await registerUser(email, password);
      await updateUserProfile({
        displayName: name,
        photoURL: photo || "",
      });

      const firebaseUid = userCredential.user.uid;

      // 2. Save staff in backend /users route
      await axiosSecure.post("/users", {
        _id: firebaseUid,
        name,
        email,
        phone,
        photo,
        region,
        district,
        role: "staff",
        createdAt: new Date(),
      });

      Swal.fire("Success", "Staff added successfully!", "success");
      onClose();
    } catch (err) {
      console.error("Add staff failed:", err);
      Swal.fire("Error", "Failed to add staff", "error");
    }
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add Staff</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Name is required</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">Email is required</p>
          )}

          <input
            type="text"
            placeholder="Phone"
            className="input input-bordered w-full"
            {...register("phone")}
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">Password is required</p>
          )}

          <input
            type="text"
            placeholder="Photo URL"
            className="input input-bordered w-full"
            {...register("photo")}
          />

          {/* Region */}
          <div>
            <label className="font-semibold mb-1 block">Region</label>
            <select
              className="select select-bordered w-full"
              {...register("region", { required: true })}
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
            {errors.region && (
              <p className="text-red-500 text-sm">Region is required</p>
            )}
          </div>

          {/* District */}
          <div>
            <label className="font-semibold mb-1 block">District</label>
            <select
              className="select select-bordered w-full"
              {...register("district", { required: true })}
              disabled={!selectedRegion}
            >
              <option value="">Select District</option>
              {districtsByRegion(selectedRegion).map((district, idx) => (
                <option key={idx} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-red-500 text-sm">District is required</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
