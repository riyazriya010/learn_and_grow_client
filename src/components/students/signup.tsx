"use client"

import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Footer from "../loggedoutNav/footer"
import LoggedOutHeader from "../loggedoutNav/header";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { studentApis } from "@/app/api/studentApi";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/lib/firebase/config";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import Navbar from "../navbar";
import Button from "../re-usable/button";


export interface Credentials {
    username: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string;
}

export interface UserDetails {
    username: string,
    email: string,
    phone: string
}

const Signup = () => {

    const router = useRouter()
    const dispatch = useDispatch()

    // Signup Form Functionality
    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm<Credentials>()
    const onSubmit: SubmitHandler<Credentials> = async (data) => {
        try {
            let response = await studentApis.signup(data)

            if (response && response.data.success) {
                toast.success(response?.data?.message)
                reset()
                dispatch(
                    setUser({
                        userId: response.data.user._id,
                        username: response.data.user.username,
                        email: response.data.user.email,
                        role: response.data.user.role
                    }),
                )
                setTimeout(() => { 
                    // router.push('/pages/student/verify-alert') 
                    window.location.replace('/pages/student/verify-alert');
                }, 1000)
            }
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.error(error.response.data.message)
                reset()
            }
            // console.error("Unexpected error:", error.message);
            // toast.error("An unexpected error occurred. Please try again.");
        }
    }



    // Google signup functionality
    const handleGoogleSignUp = async () => {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })

        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user;

            let response = await studentApis.googleSignup(user)

            if (response) {
                const googleUser = response.data.googleUser;
                if (response.data.success) {
                    toast.success("You were Logged");
                    dispatch(
                        setUser({
                            userId: response.data.user._id,
                            username: response.data.user.username,
                            email: response.data.user.email,
                            role: response.data.user.role
                        }),
                    )
                    setTimeout(() => {
                        // router.push(`/pages/home`);
                        window.location.replace('/pages/home');
                    }, 2000);
                }
            }

        } catch (error: any) {
            if (error && error.response?.status === 403) {
                toast.warn(error.response?.data?.message)
            } else if (error.response?.status === 409) {
                toast.error(error.response.data.message)
            }
            // console.log(error)
        }
    }

    return (
        // <>
        //     <div className="min-h-screen flex flex-col justify-between bg-white">
        //         {/* Header */}
        //         {/* <LoggedOutHeader /> */}
        //         <Navbar />

        //         <ToastContainer
        //             autoClose={1000}
        //             pauseOnHover={false}
        //             transition={Slide}
        //             hideProgressBar={false}
        //             closeOnClick={false}
        //             pauseOnFocusLoss={true}
        //         />

        //         {/* Signup Form */}
        //         <main className="flex-grow flex items-center justify-center px-4 py-8">
        //             {/* <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] w-[400px] p-6 shadow-md rounded-none"> */}
        //             <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.70)]">
        //                 <h1 className="text-center text-2xl font-bold mb-6 text-[#433D8B]">Student Signup</h1>
        //                 <form onSubmit={handleSubmit(onSubmit)}>
        //                     {/* Name Input */}
        //                     <div className="mb-4">
        //                         <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
        //                             Enter your name:
        //                         </label>
        //                         <input
        //                             type="text"
        //                             id="username"
        //                             className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
        //                             placeholder="Enter your name"
        //                             {...register("username", {
        //                                 required: "username required",
        //                                 pattern: {
        //                                     value: /^(?=.{1,15}$)[A-Za-z][A-Za-z0-9._]*$/,
        //                                     message: "Username can only contain letters, numbers, periods, and underscores. It must start with a letter.",
        //                                 },
        //                             })}
        //                         />
        //                         <p className="text-red-600">{errors.username?.message}</p>
        //                     </div>

        //                     {/* Email Input */}
        //                     <div className="mb-4">
        //                         <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
        //                             Enter your email:
        //                         </label>
        //                         <input
        //                             type="email"
        //                             id="email"
        //                             className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
        //                             placeholder="Enter your email"
        //                             {...register("email", {
        //                                 required: "Email is required",
        //                                 pattern: {
        //                                     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        //                                     message: "Please enter a valid email address",
        //                                 },
        //                             })}
        //                         />
        //                         <p className="text-red-600">{errors.email?.message}</p>
        //                     </div>

        //                     {/* Phone Input */}
        //                     <div className="mb-4">
        //                         <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
        //                             Enter your phone number:
        //                         </label>
        //                         <input
        //                             type="text"
        //                             id="phone"
        //                             className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
        //                             placeholder="Enter your phone number"
        //                             {...register("phone", {
        //                                 required: "Phone number is required",
        //                                 pattern: {
        //                                     value: /^[0-9]{10}$/, // Matches a 10-digit phone number
        //                                     message: "Please enter a valid phone number (10 digits)",
        //                                 },
        //                             })}
        //                         />
        //                         <p className="text-red-600">{errors.phone?.message}</p>
        //                     </div>

        //                     {/* Password Input */}
        //                     <div className="mb-4">
        //                         <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
        //                             Enter your password:
        //                         </label>
        //                         <input
        //                             type="password"
        //                             id="password"
        //                             className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
        //                             placeholder="Enter your password"
        //                             {...register("password", {
        //                                 required: "Enter a password",
        //                                 pattern: {
        //                                     value:
        //                                         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/,
        //                                     message:
        //                                         "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
        //                                 },
        //                             })}
        //                         />
        //                         <p className="text-red-600">{errors.password?.message}</p>
        //                     </div>

        //                     {/* Confirm Password Input */}
        //                     <div className="mb-4">
        //                         <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
        //                             Confirm your password:
        //                         </label>
        //                         <input
        //                             type="password"
        //                             id="confirmPassword"
        //                             className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
        //                             placeholder="Confirm your password"
        //                             {...register("confirmPassword", {
        //                                 validate: (value) => {
        //                                     const { password } = getValues();
        //                                     return password === value || "Passwords should match!";
        //                                 },
        //                             })}
        //                         />
        //                         <p className="text-red-600">{errors.confirmPassword?.message}</p>
        //                     </div>

        //                     {/* Signup Button */}
        //                     {/* <button
        //                         type="submit"
        //                         className="w-full bg-[#433D8B] text-white py-3 rounded-[22px] hover:opacity-90"
        //                     >
        //                         Signup
        //                     </button> */}
        //                     <Button
        //                     type="submit"
        //                     backgroundColor= "#433D8B"
        //                     hoverColor="#433D8B"
        //                     padding="12px 157px"
        //                     // width='w-full'
        //                     borderRadius="22px"
        //                     textColor="white"
        //                     >
        //                         Submit
        //                         </Button>
        //                 </form>

        //                 {/* Google Login Button */}
        //                 <div className="flex justify-center items-center mt-6 mb-6">
        //                     <button
        //                         onClick={handleGoogleSignUp}
        //                         type="button"
        //                         className="flex justify-center items-center w-12 h-12 rounded-full border-[3px] border-[#D9D9D9] bg-white text-[#757575] hover:opacity-90"
        //                     >
        //                         {/* <span className="text-xl font-bold">G+</span> */}
        //                         <img
        //                             src="/images/glogo.png"
        //                             alt="Google logo"
        //                             className="w-8 h-8"
        //                         />
        //                     </button>
        //                 </div>

        //                 {/* Already have an account */}
        //                 <div className="text-center mt-6">
        //                     <p className="text-black">
        //                         Already have an account?{' '}
        //                         <a href="/pages/student/login" className="text-[#433D8B] font-semibold hover:underline">
        //                             Login
        //                         </a>
        //                     </p>
        //                 </div>
        //             </div>
        //         </main>

        //         {/* Footer */}
        //         <Footer />
        //     </div>
        // </>

        <>
    <div className="min-h-screen flex flex-col justify-between bg-white">
        {/* Header */}
        {/* <LoggedOutHeader /> */}
        <Navbar />

        <ToastContainer
            autoClose={1000}
            pauseOnHover={false}
            transition={Slide}
            hideProgressBar={false}
            closeOnClick={false}
            pauseOnFocusLoss={true}
        />

        {/* Signup Form */}
        <main className="flex-grow flex items-center justify-center px-4 py-8">
            <div className="bg-white border-2 border-[#D6D1F0] shadow-lg w-[400px] p-6 rounded-lg">
                <h1 className="text-center text-2xl font-bold mb-6 text-[#6E40FF]">Student Signup</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Input */}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
                            Enter your name:
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-3 border border-black bg-white rounded-md focus:outline-none focus:border-[#433D8B]"
                            placeholder="Enter your name"
                            {...register("username", {
                                required: "Username is required",
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
                            className="w-full p-3 border border-black bg-white rounded-md focus:outline-none focus:border-[#433D8B]"
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
                            className="w-full p-3 border border-black bg-white rounded-md focus:outline-none focus:border-[#433D8B]"
                            placeholder="Enter your phone number"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
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
                            className="w-full p-3 border border-black bg-white rounded-md focus:outline-none focus:border-[#433D8B]"
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
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
                            Confirm your password:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full p-3 border border-black bg-white rounded-md focus:outline-none focus:border-[#433D8B]"
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
                        className="w-full bg-[#6E40FF] text-white py-3 rounded-[0px] hover:opacity-90"
                    >
                        Signup
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-3 text-sm text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Google Signup Button */}
                <button
                    onClick={handleGoogleSignUp}
                    type="button"
                    className="w-full flex items-center justify-center py-2 px-4 border border-gray-500 rounded-[0px] bg-white text-gray-700 hover:bg-gray-200 transition"
                >
                    <img
                        src="/images/glogo.png"
                        alt="Google logo"
                        className="w-5 h-5 mr-2"
                    />
                    Signup with Google
                </button>

                {/* Already have an account */}
                <div className="text-center mt-6">
                    <p className="text-sm text-black">
                        Already have an account?{' '}
                        <a href="/pages/student/login" className="text-base text-[#6E40FF] font-semibold hover:underline">
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

export default Signup