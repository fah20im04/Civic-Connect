import React from "react";
import { CheckCircle } from "lucide-react";

const FeatureSection = () => {
  const features = [
    "Report public issues instantly",
    "Track issue progress in real-time",
    "Admin verification & assignment",
    "Image upload support",
    "Secure user authentication",
    "View resolved issues on dashboard",
  ];

  return (
    <div className="bg-gray-300 rounded-xl py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Features</h2>

      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((item, i) => (
          <div
            key={i}
            className="p-5 bg-white rounded-xl border shadow hover:shadow-lg transition"
          >
            <CheckCircle className="text-green-600 mb-3" />
            <p className="font-medium">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
