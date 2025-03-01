"use client"

import React, { useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Footer from "../loggedoutNav/footer";
import { studentApis } from "@/app/api/studentApi";
import { ToastContainer, toast, Slide } from 'react-toastify';
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

    // login Functionality
    const { register, handleSubmit, reset, formState: { errors }, } = useForm<StudentLoginCredentials>()
    const onSubmit: SubmitHandler<StudentLoginCredentials> = async (data) => {
        try {
            const response = await studentApis.login(data)
            if (response) {
                console.log('Login Response: ', response)
                if (response.data && response.data.success) {
                    dispatch(
                        setUser({
                            userId: response.data.result._id,
                            username: response.data.result.username,
                            email: response.data.result.email,
                            role: response.data.result.role
                        }),
                    )
                    setTimeout(() => {
                        // router.replace('/pages/home')
                    window.location.replace('/pages/home');
                    }, 2000)
                    
                }
                // router.replace('/pages/home')
            }

        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error(error.response.data.message);
                reset()
            } else if (error && error.response?.status === 403) {
                toast.warn('Your Account Was Blocked')
                reset()
            } else {
                console.log('error: ', error)
            }
        }
    }


    const handleGoogleLogin = useCallback(async () => {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })

        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user;

            const response = await studentApis.googleLogin(user)

            if (response) {
                // const googleUser = response.data.googleUser;
                if (response.data.success) {
                    dispatch(
                        setUser({
                            userId: response.data.result._id,
                            username: response.data.result.username,
                            email: response.data.result.email,
                            role: response.data.result.role
                        })
                    )
                    toast.success("You were Logged");
                    setTimeout(() => {
                        // router.replace('/pages/home')
                        window.location.replace('/pages/home')
                    }, 2000);
                }
            }

        } catch (error: any) {
            if (error && error.response?.status === 403) {
                toast.warn(error.response?.data?.message)
            }
            console.log(error)
        }
    }, [dispatch])


    // Google Login Functionality
    // const handleGoogleLogin = async () => {
    //     const auth = getAuth(app)
    //     const provider = new GoogleAuthProvider()
    //     provider.setCustomParameters({ prompt: 'select_account' })

    //     try {
    //         const result = await signInWithPopup(auth, provider)
    //         const user = result.user;

    //         let response = await studentApis.googleLogin(user)

    //         if (response) {
    //             const googleUser = response.data.googleUser;
    //             if (response.data.success) {
    //                 dispatch(
    //                     setUser({
    //                         userId: response.data.result._id,
    //                         username: response.data.result.username,
    //                         email: response.data.result.email,
    //                         role: response.data.result.role
    //                     })
    //                 )
    //                 // localStorage.setItem("user", JSON.stringify(googleUser));
    //                 toast.success("You were Logged");
    //                 setTimeout(() => {
    //                     // router.push(`/pages/home`);
    //                     window.location.replace('/pages/home');
    //                 }, 2000);
    //             }
    //         }

    //     } catch (error: any) {
    //         if (error && error.response?.status === 403) {
    //             toast.warn(error.response?.data?.message)
    //         }
    //         console.log(error)
    //     }
    // }


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
                <div className="bg-white border border-gray-400 w-[400px] p-6 rounded-lg">
                    <h1 className="text-center text-2xl font-semi-bold mb-6 text-[#666666]">Student Login</h1>
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
                        <div className="text-right mb-4">
                            <a href="#" className="text-sm text-gray-600 hover:underline"
                                onClick={forgetPassword}
                            >
                                Forget password?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#22177A] text-white py-3 rounded-[13px]"
                        >
                            Login
                        </button>
                    </form>

                    {/* Google Login Button */}
                    <div className="flex justify-center items-center mt-1 mb-8">
                        {/* Divider */}
                        <div className="flex items-center my-6 w-full">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-3 text-sm text-gray-500">or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full flex items-center justify-center py-2 px-4 border border-[#22177A] rounded-[13px] bg-white text-gray-700 hover:bg-gray-200 transition mt-[-7%]"
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
                            Don’t have an account?{' '}
                            <a href="/pages/student/signup" className="text-base text-[#191919] font-semibold hover:underline">
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




