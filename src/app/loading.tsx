"use client";

import React from "react";

const LoadingPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
  <div className="flex flex-col items-center space-y-6">
    {/* Illustration of Student with Laptop */}
    <div className="relative">
      <div className="relative w-64 h-64">
        {/* Laptop */}
        <div className="absolute top-16 left-20 w-24 h-16 bg-[#433D8B] rounded-md shadow-md"></div>
        <div className="absolute top-18 left-22 w-20 h-8 bg-white rounded-sm shadow-inner"></div>
        {/* Student Body */}
        <div className="absolute bottom-10 left-28 w-12 h-20 bg-[#433D8B] rounded-lg"></div>
        <div className="absolute bottom-8 left-30 w-4 h-8 bg-gray-300 rounded-full"></div>
        {/* Desk */}
        <div className="absolute bottom-0 left-12 w-40 h-4 bg-gray-200 rounded-t-lg shadow-md"></div>
      </div>
    </div>

    {/* Loading Message */}
    <p className="text-center text-[#433D8B] text-lg font-bold">
      Setting up your study space...
    </p>

    {/* Progress Bar */}
    <div className="relative w-64 h-3 bg-gray-300 rounded-full overflow-hidden">
      <div className="absolute top-0 left-0 h-3 bg-[#433D8B] animate-loading"></div>
    </div>
  </div>
</div>
    );
};

export default LoadingPage;
