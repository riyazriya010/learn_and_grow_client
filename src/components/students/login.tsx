"use client"

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Footer from "../loggedoutNav/footer";
import LoggedOutHeader from "../loggedoutNav/header";
import { studentApis } from "@/api/studentApi";
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/lib/firebase/config";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import Navbar from "../navbar";


export interface StudentLoginCredentials {
    email: string,
    password: string
}

const Login = () => {

    const router = useRouter()
    const dispatch = useDispatch();



    // signup Functionality
    const { register, handleSubmit, reset, formState: { errors }, } = useForm<StudentLoginCredentials>()
    const onSubmit: SubmitHandler<StudentLoginCredentials> = async (data) => {
        try {
            const response = await studentApis.login(data)
            if (response) {
                console.log('ressss log: ', response.data)
                if (response.data && response.data.success) {
                    dispatch(
                        setUser({
                            userId: response.data.user._id,
                            username: response.data.user.username,
                            email: response.data.user.email,
                            role: response.data.user.role
                        }),
                    )
                    // router.push('/pages/home')
                    window.location.replace('/pages/home');
                }
            }

        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error(error.response.data.message);  // Show error toast for invalid credentials
                reset()
            } else if (error && error.response?.status === 403) {
                toast.warn('Your Account Was Blocked')
                reset()
            } else {
                console.log('error: ', error)
            }
        }
    }


    // Google Login Functionality
    const handleGoogleLogin = async () => {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })

        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user;

            let response = await studentApis.googleLogin(user)

            if (response) {
                const googleUser = response.data.googleUser;
                if (response.data.success) {
                    dispatch(
                        setUser({
                            userId: response.data.user._id,
                            username: response.data.user.username,
                            email: response.data.user.email,
                            role: response.data.user.role
                        })
                    )
                    // localStorage.setItem("user", JSON.stringify(googleUser));
                    toast.success("You were Logged");
                    setTimeout(() => {
                        // router.push(`/pages/home`);
                        window.location.replace('/pages/home');
                    }, 2000);
                }
            }

        } catch (error: any) {
            if (error && error.response?.status === 403) {
                toast.warn(error.response?.data?.message)
            }
            console.log(error)
        }
    }


    // forget Password Functionality
    const forgetPassword = () => {
        router.push('/pages/student/forget-password')
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
                <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] w-[400px] p-6 shadow-md rounded-none">
                    <h1 className="text-center text-2xl font-bold mb-6 text-[#433D8B]">Student Login</h1>
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
                        <div className="text-right mb-4">
                            <a href="#" className="text-sm text-blue-600 hover:underline"
                                onClick={forgetPassword}
                            >
                                Forget password?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#433D8B] text-white py-3 rounded-[22px] hover:opacity-90"
                        >
                            Login
                        </button>
                    </form>
                    {/* Google Login Button */}
                    <div className="flex justify-center items-center mt-6 mb-6">
                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            className="flex justify-center items-center w-12 h-12 rounded-full border-[3px] border-[#D9D9D9] bg-white text-[#757575] hover:opacity-90"
                        >
                            {/* <span className="text-xl font-bold">G+</span> */}
                            <img
                                src="/images/glogo.png"
                                alt="Google logo"
                                className="w-8 h-8"
                            />
                        </button>
                    </div>


                    <div className="text-center mt-6">
                        <p className="text-black">
                            Don’t have an account?{' '}
                            <a href="/pages/student/signup" className="text-[#433D8B] font-semibold hover:underline">
                                Signup
                            </a>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />

        </div>
    );
}

export default Login
