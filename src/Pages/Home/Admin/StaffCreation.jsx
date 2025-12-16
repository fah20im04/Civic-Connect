import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingPage from "../LoadingPage";
import Swal from "sweetalert2";
import AddStaffModal from "./AddStaffModal";
// Import the new Update Staff Modal component
import UpdateStaffModal from "./UpdateStaffModal";

const StaffCreation = () => {
  const axiosSecure = useAxiosSecure();
  const loaderData = useLoaderData();


  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [staffToUpdate, setStaffToUpdate] = useState(null); 

  const {
    data: staffList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-staff"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/staff");
      return res.data;
    },
  });

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openUpdateModal = (staff) => {
    setStaffToUpdate(staff);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setStaffToUpdate(null);
  };
  const deleteStaff = (id) => {
    Swal.fire({
 
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/admin/staff/${id}`).then(() => {
          refetch();
          Swal.fire("Deleted!", "Staff has been deleted.", "success");
        });
      }
    });
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Manage Staff</h2>
        <button onClick={openAddModal} className="btn btn-primary">
          Add Staff
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table w-full">
          {/* ... (Table Head) ... */}
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, index) => (
              <tr key={staff._id}>
                <td>{index + 1}</td>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>{staff.role}</td>
                <td>
                  
                  <button
                    onClick={() => openUpdateModal(staff)} 
                    className="btn btn-sm btn-info mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteStaff(staff._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>

     
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        loaderData={loaderData}
        refetch={refetch} 
      />


      <UpdateStaffModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        staffData={staffToUpdate} 
        loaderData={loaderData}
        refetch={refetch} 
      />
    </div>
  );
};

export default StaffCreation;
