"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function StudentOTPVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (otp.join(" ").length === 4) {
      alert(`Entered OTP: ${otp.join("")}`);
    } else {
      alert("Please enter a complete 4-digit OTP.");
    }
  };

  const goToProfile = () => {
    router.push("/pages/student/profile");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Enter OTP</h1>
        <p className="text-gray-600 mb-6">Please enter the 4-digit OTP sent to your email.</p>
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#433D8B] text-white px-6 py-2 rounded-lg hover:bg-[#2f296b] focus:outline-none focus:ring-2 focus:ring-[#433D8B] w-full mb-4"
        >
          Submit
        </button>
        <button
          onClick={goToProfile}
          className="text-[#433D8B] hover:underline"
        >
          Go to Profile
        </button>
      </div>
    </div>
  );
}