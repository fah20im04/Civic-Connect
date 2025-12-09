import React from "react";

const LoadingPage = () => {
  return (
    <div className="h-screen flex py-22 flex-col justify-center items-center bg-gray-100 text-center relative overflow-hidden">
      {/* Floating Leaves Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-bounce absolute top-10 left-1/4 text-green-500 text-4xl">
          🍃
        </div>
        <div className="animate-pulse absolute top-1/3 right-1/4 text-green-600 text-3xl">
          🌱
        </div>
        <div className="animate-bounce absolute bottom-20 left-1/3 text-green-400 text-5xl">
          🍀
        </div>
      </div>

      {/* Spinner Animation */}
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-green-600 border-solid mb-6"></div>

      {/* Loading Text */}
      <h2 className="text-xl font-semibold text-green-700">
        CivicConnect is preparing your experience...
      </h2>
      <p className="text-gray-600 mt-2">
        Please hold on while we connect you to the community.
      </p>
    </div>
  );
};

export default LoadingPage;
