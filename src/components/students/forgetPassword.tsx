"use client"

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Footer from "../loggedoutNav/footer";
import { studentApis } from "@/app/api/studentApi";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import Navbar from "../navbar";


export interface StudentForgetCredentials {
    email: string,
    password: string,
    confirmPassword: string
}

const StudentForgetPassword = () => {

    const router = useRouter()

    // Form Submit Functionality
    const { register, handleSubmit, getValues, formState: { errors }, } = useForm<StudentForgetCredentials>()
    const onSubmit: SubmitHandler<StudentForgetCredentials> = async (data) => {
        try {
            const response = await studentApis.forgetPass(data)
            if (response) {
                console.log(response)
                if (response.data.success) {
                    toast.success('Password Updated Successfully')
                    setTimeout(() => {
                        router.push('/pages/student/login')
                    }, 1000)
                }
            }
        } catch (error: any) {
            if (error && error.response?.status === 401) {
                toast.error(error.response.data.message)
                return
            }
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">

            {/* Header */}

            {/* <LoggedOutHeader /> */}
            <Navbar />

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
                <div className="bg-white border border-gray-400 w-[400px] p-6 rounded-lg">
                    <h1 className="text-center text-2xl font-semi-bold mb-6 text-[#666666]">Update Password</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-500 font-semibold mb-2">
                                Enter your email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:border-[#433D8B]"
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
                            <label htmlFor="password" className="block text-gray-500 font-semibold mb-2">
                                Enter your password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:border-[#433D8B]"
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

                        {/* Confirm Password Input */}
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-gray-500 font-semibold mb-2">
                                Confirm your password:
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full p-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:border-[#433D8B]"
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

                        <button
                            type="submit"
                            className="w-full bg-[#22177A] text-white py-3 rounded-[13px]"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <Footer />

        </div>
    );
}

export default StudentForgetPassword
