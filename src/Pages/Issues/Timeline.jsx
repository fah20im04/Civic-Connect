import React from "react";

const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "In-Progress":
      return "bg-blue-100 text-blue-800";
    case "Resolved":
      return "bg-green-100 text-green-800";
    case "Closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Timeline = ({ timeline }) => {
  const sorted = [...(timeline || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (sorted.length === 0)
    return <p className="text-gray-500">No timeline entries yet.</p>;

  return (
    <div className="relative">
      <div className="border-l-2 border-gray-200 absolute h-full left-4 top-0"></div>
      <ul className="space-y-6 pl-8">
        {sorted.map((it, idx) => (
          <li key={idx} className="relative">
            <div className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-primary"></div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                      it.status
                    )}`}
                  >
                    {it.status || 'update'}
                  </span>
                  <span className="text-sm text-gray-600">{it.message}</span>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>{it.updatedBy}</div>
                  <div className="mt-1">
                    {new Date(it.date).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
