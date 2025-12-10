// Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <NavLink to="/dashboard" className="hover:bg-gray-200 font-bold p-2 rounded">Overview</NavLink>
      <NavLink to="/dashboard/my-issues" className="hover:bg-gray-200 p-2 font-bold rounded">My Issues</NavLink>
      <NavLink to="/dashboard/report-issue" className="hover:bg-gray-200 p-2 font-bold rounded">Report Issue</NavLink>
    </aside>
  );
};

export default Sidebar;
