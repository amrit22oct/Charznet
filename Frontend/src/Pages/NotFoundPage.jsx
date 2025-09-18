// Pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-9xl font-extrabold text-red-500 animate-bounce">404</h1>
      <p className="text-2xl md:text-3xl mt-4">Oops! Page not found.</p>
      <p className="mt-2 text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/home"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
