import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingPage from "../LoadingPage";
import Swal from "sweetalert2";

const UserManagement = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all users (admin only)
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data;
    },
  });

  // Block / Unblock
  const handleBlockToggle = async (user) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to ${user.isBlocked ? "UNBLOCK" : "BLOCK"} this user`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/admin/users/${user.email}/block`, {
        block: !user.isBlocked,
      });

      Swal.fire("Success", "User status updated", "success");
      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Action failed", "error");
    }
  };

  // Make Admin
  const handleMakeAdmin = async (user) => {
    const result = await Swal.fire({
      title: "Make Admin?",
      text: "This user will get full admin access",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Make Admin",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/admin/users/${user.email}/make-admin`);
      Swal.fire("Success", "User is now an admin", "success");
      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to make admin", "error");
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subscription</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>

                <td>{user.displayName || "N/A"}</td>

                <td>{user.email}</td>

                <td>
                  {user.isPremium ? (
                    <span className="badge badge-success">Premium</span>
                  ) : (
                    <span className="badge">Free</span>
                  )}
                </td>

                <td>
                  {user.isBlocked ? (
                    <span className="badge badge-error">Blocked</span>
                  ) : (
                    <span className="badge badge-success">Active</span>
                  )}
                </td>

                <td>
                  {user.role === "admin" ? (
                    <span className="badge badge-primary">Admin</span>
                  ) : (
                    <span className="badge">Citizen</span>
                  )}
                </td>

                <td className="flex gap-2">
                  {/* Block / Unblock */}
                  <button
                    onClick={() => handleBlockToggle(user)}
                    className={`btn btn-xs ${
                      user.isBlocked ? "btn-success" : "btn-error"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>

                  {/* Make Admin */}
                  <button
                    onClick={() => handleMakeAdmin(user)}
                    disabled={user.role === "admin"}
                    className="btn btn-xs btn-primary disabled:opacity-50"
                  >
                    Make Admin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center p-6 text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
