"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function MentorVerificationNotice() {
  const router = useRouter();

  const goToProfile = () => {
    router.push("/pages/mentor/profile");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Verification Email Sent</h1>
        <p className="text-gray-600 text-center mb-6">
          A verification link has been sent to your email address. Please check
          your inbox and click the link to verify your account.
        </p>
        <p className="text-gray-500 text-sm text-center mb-6">
          If you don’t see the email, please check your spam or junk folder.
        </p>
        <div className="text-center">
          <button
            onClick={goToProfile}
            className="bg-[#433D8B] text-white px-6 py-2 rounded-lg hover:bg-[#2f296b] focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
