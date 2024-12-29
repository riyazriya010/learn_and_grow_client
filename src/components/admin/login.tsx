"use client"

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { studentApis } from "@/api/studentApi";
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import AdminHeader from "./header";
import AdminFooter from "./footer";
import { adminApis } from "@/api/adminApis";
import axios from "axios";


export interface AdminLoginCredentials {
    email: string,
    password: string
}

const AdminLogin = () => {

    const router = useRouter()

    // const notify = () => toast.error("Invalid Credentials!");

    const { register, handleSubmit, formState: { errors }, } = useForm<AdminLoginCredentials>()

    const onSubmit: SubmitHandler<AdminLoginCredentials> = async (data) => {
        try {
            const response = await adminApis.login(data)

            if (response && response?.data?.message === 'Invalid Credential') {
                toast.error('Invalid Credential')
            } else if (response && response?.data?.success) {
                // router.push('/pages/dashboard')
                window.location.replace('/pages/dashboard');
            }

        } catch (error: any) {
            if (error && error.response?.status === 409) {
                toast.error('Invalid Credential')
            }else if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
                toast.error('Server is not running or cannot be reached');
            } else {
                console.log('e ', error.message)
                toast.error('Something Went Wrong')
            }
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">

            {/* Header */}

            <ToastContainer
                autoClose={2000}
                pauseOnHover={false}
                transition={Slide}
                hideProgressBar={false}
                closeOnClick={false}
                pauseOnFocusLoss={true}
            />

            {/* Login Form */}
            <main className="flex-grow flex items-center justify-center px-4 py-8">
                <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] w-[400px] p-6 shadow-md rounded-none">
                    <h1 className="text-center text-2xl font-bold mb-6 text-[#433D8B]">Admin Login</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                    required: "Password is required",
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

                        <button
                            type="submit"
                            className="w-full bg-[#433D8B] text-white py-3 rounded-[22px] hover:opacity-90"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <AdminFooter />

        </div>
    );
}

export default AdminLogin
