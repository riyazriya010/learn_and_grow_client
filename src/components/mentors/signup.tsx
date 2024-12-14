"use client"

import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { ToastContainer, toast, Bounce, ToastOptions } from "react-toastify";
import Footer from "../loggedoutNav/footer"
import { USER_SERVICE_URL } from "@/utils/constant";
import axios from "axios";
import LoggedOutHeader from "../loggedoutNav/header";


const toastOptions: ToastOptions = {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
};

const MentorSignup = () => {

    interface Credential {
        username: string,
        email: string,
        phone: string,
        password: string,
        confirmPassword: string;
    }

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<Credential>()

    const onSubmit: SubmitHandler<Credential> = async (data) => {
        try {
            console.log('data: ', data)
            const userSerivceUrl = USER_SERVICE_URL
            let response: any = await toast.promise(
                axios.post(`${userSerivceUrl}/signup`, data),
                {
                    pending: "Signing up",
                    success: "User registered successfully",
                    error: "Failed to signup",
                },
                toastOptions
            )
        } catch (error: any) {
            console.error(error.message)
            const errorMessage = error?.response?.data?.length 
            ? error?.response.data
            : "Internal server error"
            toast.error(errorMessage, toastOptions);
        }
    }

    return (
        <>
            <ToastContainer />

            <div className="min-h-screen flex flex-col justify-between bg-white">
                {/* Header */}
                <LoggedOutHeader />

                {/* Signup Form */}
                <main className="flex-grow flex items-center justify-center px-4 py-8">
                    <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] w-[400px] p-6 shadow-md rounded-none">
                        <h1 className="text-center text-2xl font-bold mb-6 text-[#433D8B]">Mentor Signup</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Name Input */}
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
                                    Enter your name:
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
                                    placeholder="Enter your name"
                                    {...register("username", {
                                        required: "username required",
                                        pattern: {
                                            value: /^(?=.{1,15}$)[A-Za-z][A-Za-z0-9._]*$/,
                                            message: "Username can only contain letters, numbers, periods, and underscores. It must start with a letter.",
                                        },
                                    })}
                                />
                                <p className="text-red-600">{errors.username?.message}</p>
                            </div>

                            {/* Email Input */}
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                                    Enter your email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
                                    placeholder="Enter your email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                />
                                <p className="text-red-600">{errors.email?.message}</p>
                            </div>

                            {/* Phone Input */}
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                                    Enter your phone number:
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
                                    placeholder="Enter your phone number"
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/, // Matches a 10-digit phone number
                                            message: "Please enter a valid phone number (10 digits)",
                                        },
                                    })}
                                />
                                <p className="text-red-600">{errors.phone?.message}</p>
                            </div>

                            {/* Password Input */}
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                                    Enter your password:
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
                                    placeholder="Enter your password"
                                    {...register("password", {
                                        required: "Enter a password",
                                        pattern: {
                                            value:
                                                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/,
                                            message:
                                                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
                                        },
                                    })}
                                />
                                <p className="text-red-600">{errors.password?.message}</p>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
                                    Confirm your password:
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
                                    placeholder="Confirm your password"
                                    {...register("confirmPassword", {
                                        validate: (value) => {
                                            const { password } = getValues();
                                            return password === value || "Passwords should match!";
                                        },
                                    })}
                                />
                                <p className="text-red-600">{errors.confirmPassword?.message}</p>
                            </div>

                            {/* Signup Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#433D8B] text-white py-3 rounded-[22px] hover:opacity-90"
                            >
                                Signup
                            </button>
                        </form>

                        {/* Google Login Button */}
                        <div className="flex justify-center items-center mt-6 mb-6">
                            <button
                                type="button"
                                className="flex justify-center items-center w-12 h-12 rounded-full border-[3px] border-[#D9D9D9] bg-white text-[#757575] hover:opacity-90"
                            >
                                <span className="text-xl font-bold">G+</span>
                            </button>
                        </div>

                        {/* Already have an account */}
                        <div className="text-center mt-6">
                            <p className="text-black">
                                Already have an account?{' '}
                                <a href="/pages/mentor/login" className="text-[#433D8B] font-semibold hover:underline">
                                    Login
                                </a>
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    )
}

export default MentorSignup