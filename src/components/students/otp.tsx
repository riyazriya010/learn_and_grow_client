"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentOTPVerification() {
    const router = useRouter();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimeUp, setIsTimeUp] = useState(false);

    useEffect(() => {
        const storedTime = localStorage.getItem("otp_timer");
        const startTime = storedTime ? parseInt(storedTime) : Date.now();
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remainingTime = Math.max(60 - elapsed, 0);

        setTimeLeft(remainingTime);
        setIsTimeUp(remainingTime === 0);

        if (remainingTime > 0) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimeUp(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if (!localStorage.getItem("otp_timer")) {
            localStorage.setItem("otp_timer", Date.now().toString());
        }
    }, []);

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
        if (isTimeUp) return;

        if (otp.join("").length === 4) {
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
                <p className="text-gray-600 mb-2">Please enter the 4-digit OTP sent to your email.</p>
                <p className="text-red-600 font-bold mb-6">Time left: {timeLeft}s</p>
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
                            disabled={isTimeUp}
                        />
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    className={`px-6 py-2 rounded-lg w-full mb-4 text-white ${
                        isTimeUp
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#433D8B] hover:bg-[#2f296b] focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
                    }`}
                    disabled={isTimeUp}
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
