// src/Pages/Issue/AssignButton.jsx
import React from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure"; 

export const AssignButton = ({ issueId, onUpdate }) => {
  const axiosSecure = useAxiosSecure();

  const assign = async () => {
    const staffEmail = prompt("Enter staff email to assign:");
    const staffName = prompt("Enter staff name (optional):");
    if (!staffEmail) return;

    try {
      await axiosSecure.post(`/issues/${issueId}/assign`, {
        staffEmail,
        staffName,
      });
      alert("Assigned");
      onUpdate?.();
    } catch (err) {
      console.error(err);
      alert("Assignment failed");
    }
  };

  return (
    <button onClick={assign} className="btn btn-sm btn-outline">
      Assign Staff
    </button>
  );
};
