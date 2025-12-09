// src/Pages/Issue/ChangeStatusButton.jsx
import React from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ChangeStatusButton = ({ issueId, onUpdate }) => {
  const axiosSecure = useAxiosSecure();

  const change = async () => {
    const status = prompt(
      "Enter new status (Pending, In-Progress, Resolved, Closed):"
    );
    const note = prompt("Optional note:");
    if (!status) return;

    try {
      await axiosSecure.post(`/issues/${issueId}/status`, { status, note });
      alert("Status updated");
      onUpdate?.();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  return (
    <button onClick={change} className="btn btn-sm btn-outline">
      Change Status
    </button>
  );
};
export default ChangeStatusButton;
