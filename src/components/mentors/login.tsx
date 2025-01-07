"use client"

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Footer from "../loggedoutNav/footer";
import LoggedOutHeader from "../loggedoutNav/header";
import { mentorApis } from "@/app/api/mentorApi";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/lib/firebase/config";
import { setUser } from "@/redux/slices/mentorSlice";
import { useDispatch } from "react-redux";
import Navbar from "../navbar";


export interface MentorLoginCredentials {
    email: string,
    password: string
}

const MentorLogin = () => {

    const router = useRouter()
    const dispatch = useDispatch()

    // login functionality
    const { register, handleSubmit, reset, formState: { errors }, } = useForm<MentorLoginCredentials>()
    const onSubmit: SubmitHandler<MentorLoginCredentials> = async (data) => {
        try {
            const response = await mentorApis.login(data)
            if (response) {
                if (response.data.success) {
                    dispatch(
                        setUser({
                            userId: response.data.user._id,
                            username: response.data.user.username,
                            email: response.data.user.email,
                            role: response.data.user.role
                        }),
                    )
                    router.replace('/pages/mentor/dashboard')
                }
            }
        } catch (error: any) {
            if (error && error.response?.status === 401) {
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

    // Google Login
    const handleGoogleLogin = async () => {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })

        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user;

            let response = await mentorApis.googleLogin(user)

            if (response) {
                const googleUser = response.data.googleUser;
                if (response.data.success) {
                    // localStorage.setItem("user", JSON.stringify(googleUser));
                    toast.success("You were Logged");
                    dispatch(
                        setUser({
                            userId: response.data.user._id,
                            username: response.data.user.username,
                            email: response.data.user.email,
                            role: response.data.user.role
                        })
                    )
                    setTimeout(() => {
                        // router.push(`/pages/home`);
                        router.replace('/pages/mentor/dashboard');
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
                <div className="bg-white border-2 border-[#D6D1F0] shadow-lg w-[400px] p-6 rounded-lg">
                    <h1 className="text-center text-2xl font-bold mb-6 text-[#6E40FF]">Mentor Login</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                                Enter your email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 border border-[#333333] bg-white rounded-md focus:outline-none focus:border-[#433D8B]"
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
                                className="w-full p-3 border border-[#333333] bg-white rounded-md focus:outline-none focus:border-[#433D8B]"
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
                                onClick={() => router.push('/pages/mentor/forget-password')}
                            >
                                Forget password?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#6E40FF] text-white py-3 rounded-[0px] hover:opacity-90"
                        >
                            Login
                        </button>
                    </form>

                    <div className="flex justify-center items-center mt-1 mb-8">
                        {/* Divider */}
                        <div className="flex items-center my-6 w-full">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-3 text-sm text-gray-500">or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                    </div>

                    {/* Google Login Button */}
                    {/* <div className="flex justify-center items-center mt-6 mb-6">
                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            className="flex justify-center items-center w-12 h-12 rounded-full border-[3px] border-[#D9D9D9] bg-white text-[#757575] hover:opacity-90"
                        >
                           
                            <img
                                src="/images/glogo.png"
                                alt="Google logo"
                                className="w-8 h-8"
                            />
                        </button>
                    </div> */}

                    <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full flex items-center justify-center py-2 px-4 border border-gray-500 rounded-[0px] bg-white text-gray-700 hover:bg-gray-200 transition mt-[-7%]"
                >
                    <img
                        src="/images/glogo.png"
                        alt="Google"
                        className="w-5 h-5 mr-2"
                    />
                    Login with Google
                </button>


                    <div className="text-center mt-6">
                        <p className="text-sm text-black">
                            Don't have an account?{' '}
                            <a href="/pages/mentor/signup" className="text-base text-[#6E40FF] font-semibold hover:underline">
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

export default MentorLogin
