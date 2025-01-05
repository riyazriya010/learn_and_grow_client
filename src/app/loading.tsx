"use client";

import React, { useEffect, useState } from "react";

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval); // Stop when it reaches 100%
          return oldProgress;
        }
        return Math.min(oldProgress + 2, 100); // Increase progress by 2% every interval
      });
    }, 50); // Interval set to 50ms for a smooth loading effect

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#6D7BFF] to-[#433D8B]">
      <div className="text-center text-white p-8 rounded-lg shadow-lg bg-opacity-80 max-w-3xl w-full">
        {/* Main Loading Container */}
        <div className="space-y-6">
          {/* Illustration and Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 border-4 border-white rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-white text-[#433D8B] text-3xl rounded-full flex items-center justify-center animate-bounce">
                📚
              </div>
            </div>
          </div>

          {/* Loading Title */}
          <h1 className="text-3xl font-bold">We’re preparing your learning experience...</h1>
          
          {/* Animated Text */}
          <p className="text-lg">Hold tight, we’re setting things up for you!</p>

          {/* Progress Bar */}
          <div className="relative w-full h-4 bg-white bg-opacity-30 rounded-full overflow-hidden mt-6">
            <div
              className="absolute top-0 left-0 h-full bg-[#433D8B] transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Additional Learning Icons */}
          <div className="flex justify-around mt-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl">💻</span>
              <p className="text-sm">Interactive Lessons</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl">📝</span>
              <p className="text-sm">Quizzes</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl">📊</span>
              <p className="text-sm">Progress Tracking</p>
            </div>
          </div>

          {/* Spinning Loader */}
          <div className="flex justify-center mt-6">
            <div className="w-12 h-12 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
          </div>

          {/* Bottom Text */}
          <p className="mt-4 text-lg font-semibold opacity-70">
            Your personalized study environment is almost ready!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
