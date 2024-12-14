"use client";

import Footer from "./loggedoutNav/footer";
import LoggedOutHeader from "./loggedoutNav/header";
import { useRef } from "react";

const OtpVerificationPage = () => {
    // Use refs to control focus on input boxes
    const inputRefs = Array.from({ length: 4 }, () => useRef<HTMLInputElement | null>(null));

    // Function to handle input change (typed event)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        // Move to next input if value is not empty
        if (value && index < inputRefs.length - 1) {
            inputRefs[index + 1].current?.focus();
        }
    };

    // Function to handle backspace key for navigation (typed event)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };


    return (
        <div className="bg-white min-h-screen flex flex-col">
            {/* Header */}
            <LoggedOutHeader />

            {/* Main Body */}
            <div className="flex flex-1 justify-center items-center px-4">
                <div
                    className="bg-[#F8F9FA] border-2 border-[#D6D1F0] rounded-lg p-8 shadow-md max-w-sm w-full text-center"
                >
                    {/* Verify Account Title */}
                    <h2 className="text-[#433D8B] text-xl font-semibold mb-4">
                        Verify Account
                    </h2>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 flex justify-center items-center bg-[#F8F9FA] rounded-full border-2 border-[#D6D1F0]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-[#433D8B]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* OTP Input Boxes */}
                    <div className="flex justify-center gap-4 mb-6">
                        {inputRefs.map((ref, index) => (
                            <input
                                key={index}
                                ref={ref}
                                type="text"
                                maxLength={1}
                                onChange={(e) => handleInputChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-12 text-center text-xl font-medium rounded-lg bg-[#F8F9FA] border-2 border-[#D6D1F0] focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-[#433D8B]"
                            />
                        ))}
                    </div>

                    {/* Verify Button */}
                    <button
                        className="bg-[#433D8B] text-white py-2 px-12 rounded-lg text-lg font-medium hover:bg-[#322D6B] transition-all"
                    >
                        Verify
                    </button>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default OtpVerificationPage;
