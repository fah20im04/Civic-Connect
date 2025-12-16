import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure"; 

const UpdateStaffModal = ({
  isOpen,
  onClose,
  staffData,
  loaderData,
  refetch,
}) => {
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

 
  const selectedRegion = watch("region", staffData?.reporterRegion);

 
  useEffect(() => {
    if (staffData) {
      
      reset({
        name: staffData.name || "",
        email: staffData.email || "",
        phone: staffData.phone || "",
        photo: staffData.photo || "",
        
        region: staffData.region || "",
        district: staffData.district || "",
      });
    }
  }, [staffData, reset]);

  if (!isOpen || !staffData) return null;

  const districtsByRegion = (region) => {
    if (!region || !loaderData) return [];
    return [
      ...new Set(
        loaderData
          .filter((item) => item.region === region)
          .map((item) => item.district)
      ),
    ];
  };

  const onSubmit = async (data) => {
    const { name, email, phone, photo, region, district } = data;

   
    const updatedData = {
      name,
      phone: phone || null,
      photo: photo || null,
      region,
      district,
    };

    try {
    
      await axiosSecure.patch(`/admin/staff/${staffData._id}`, updatedData);

      Swal.fire(
        "Updated!",
        "Staff information updated successfully!",
        "success"
      );
      refetch(); 
      onClose();
    } catch (err) {
      console.error("Update staff failed:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update staff.";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
   
    <div
      className="fixed inset-0 bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose}
    >
      
      <div
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg" 
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Update Staff: {staffData.name}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Name is required</p>
          )}

          {/* Email Input - Readonly for security since UID is linked to this email */}
          <input
            type="email"
            placeholder="Email (Cannot be changed)"
            className="input input-bordered w-full bg-gray-100"
            {...register("email", { required: true })}
            readOnly
          />

          {/* Phone Input */}
          <input
            type="text"
            placeholder="Phone"
            className="input input-bordered w-full"
            {...register("phone")}
          />

          {/* Photo URL Input */}
          <input
            type="text"
            placeholder="Photo URL (Optional)"
            className="input input-bordered w-full"
            {...register("photo")}
          />

          {/* Region Selector */}
          <div>
            <label className="font-semibold mb-1 block">Region</label>
            <select
              className="select select-bordered w-full"
              {...register("region", { required: true })}
            >
              <option value="">Select Region</option>
              {[...new Set(loaderData?.map((item) => item.region))].map(
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

          {/* District Selector */}
          <div>
            <label className="font-semibold mb-1 block">District</label>
            <select
              className="select select-bordered w-full"
              {...register("district", { required: true })}
              disabled={!selectedRegion}
            >
              <option value="">Select District</option>
              {/* Ensure districts update based on the currently selected region */}
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

          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-info">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStaffModal;
