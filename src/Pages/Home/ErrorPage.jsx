import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
      {/* Animated Sad Face */}
      <div className="mb-6 animate-bounce">
        <svg
          className="w-24 h-24 text-red-600 mx-auto"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path
            d="M8 16c1.5-1 6.5-1 8 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Error Code */}
      <h1 className="text-6xl font-extrabold text-red-600 mb-2">404</h1>

      {/* Message */}
      <p className="text-lg text-gray-700 mb-6 max-w-md">
        Oops! The page you’re looking for doesn’t exist. Even CivicConnect feels
        sad about broken links.
      </p>

      {/* Action Button */}
      <Link
        to="/"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition duration-300"
      >
        Go Back Home
      </Link>

      {/* Footer Note */}
      <p className="mt-8 text-sm text-gray-500">
        Need help?{" "}
        <a href="/contact" className="underline hover:text-red-600">
          Contact Support
        </a>
      </p>
    </div>
  );
};

export default ErrorPage;
