"use client";

import { useState } from "react";
import Footer from "../loggedInNav/footer";
import LoggedInHeader from "../loggedInNav/header";
import SideNav from "../side";

const StudentsProfile = () => {
  const [isVerified, setIsVerified] = useState(false);
  const navLink = [{field: "Login Role", link: '/pages/login-role'}, {field: "Signup Role", link: '/pages/signup-role'}];

  return (
    <>
      <LoggedInHeader />
      <div className="flex min-h-screen bg-white">
        {/* Side Navigation */}
        <SideNav navLink={navLink} />

        {/* Profile Section */}
        <div className="flex-1 p-6 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mt-29">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6 relative">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  isVerified ? "border-4 border-blue-500" : "bg-gray-300"
                }`}
              >
                <span className="text-gray-500 text-lg">Profile Pic</span>

                {/* Verified Badge */}
                {isVerified && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white text-xl font-bold">✔</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={'riyas@gmail.com'}
                  className="w-full px-4 py-2 bg-[#F8F9FA] border-2 border-[#D6D1F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
                  disabled
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 bg-[#F8F9FA] border-2 border-[#D6D1F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 bg-[#F8F9FA] border-2 border-[#D6D1F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
                />
              </div>

              {/* Verify Account Button */}
              {!isVerified && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsVerified(true)} // Simulate verification
                    className="bg-yellow-500 text-white px-6 py-2 rounded-[22px] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  >
                    Verify Your Account
                  </button>
                </div>
              )}

              {/* Update Button */}
              <div className="text-center">
                <button
                  type="button"
                  className="bg-[#433D8B] text-white px-6 py-2 rounded-[22px] hover:bg-[#2f296b] focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentsProfile;
