'use client'

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../navbar';
import MentorFooter from '../mentors/footer';
import { mentorApis } from '@/app/api/mentorApi';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import { adminApis } from '@/app/api/adminApis';

export interface IBadgeForm {
    badgeName: string;
    description: string;
    value: string;
    correctAnswer: string;
}

const AdminAddBadges = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IBadgeForm>();


    const onSubmit = async (data: IBadgeForm) => {
        // Handle form submission logic here
        console.log('Submitted data:', data);
        try {
            const response = await adminApis.addBadge(data)
            if (response) {
                console.log('res badge: ', response)
                toast.success(`Badge added successfully!`);
                reset()
                setTimeout(() => {
                    router.push(`/pages/badge-management`)
                }, 2000)
            }
        } catch (error: any) {
            if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
                console.log('401 log', error.response.data.message)
                toast.warn(error.response.data.message);
                setTimeout(() => {
                    router.push('/pages/mentor/profile')
                }, 2000)
                return;
            }
            if (
                error &&
                error?.response?.status === 403 &&
                error?.response?.data?.message === 'Mentor Blocked'
            ) {
                toast.warn(error?.response?.data?.message);
                Cookies.remove('accessToken');
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/mentor/login');
                }, 3000);
                return;
            }
            if (
                error && error?.response?.status === 401) {
                toast.warn(error?.response?.data?.message);
                Cookies.remove('accessToken');
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/mentor/login');
                }, 3000);
                return;
            }

            if (error && error?.response?.status === 403) {
                toast.warn('Question Already Exist')
            }
        }
    };

    return (
        <>
            <div className="flex flex-col min-h-screen bg-white">
                {/* Header */}
                <header>
                    <Navbar />
                </header>

                <ToastContainer
                    autoClose={2000}
                    pauseOnHover={false}
                    transition={Slide}
                    hideProgressBar={false}
                    closeOnClick={false}
                    pauseOnFocusLoss={true}
                />

                {/* Main Content */}
                <div className="flex flex-1 w-full px-4 py-8 md:px-8 lg:px-16 justify-center items-center">
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,2)]">
                        {/* Form Title */}
                        <h2 className="text-2xl font-bold text-[#433D8B] text-center mb-6">Add Badge</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Question Field */}
                            <div>
                                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                                    Badge Name
                                </label>
                                <input
                                    type="text"
                                    id="badgeName"
                                    {...register("badgeName", {
                                        required: "badgeName is required",
                                        minLength: {
                                            value: 5,
                                            message: "badgeName must be at least 10 characters",
                                        },
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.badgeName ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter the quiz question"
                                />
                                {errors.badgeName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.badgeName.message}</p>
                                )}
                            </div>

                            {/* Option 1 Field */}
                            <div>
                                <label htmlFor="option1" className="block text-sm font-medium text-gray-700 mb-1">
                                    Descritpion
                                </label>
                                <input
                                    type="text"
                                    id="description"
                                    {...register("description", {
                                        required: "description is required",
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.description ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter first option"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Option 2 Field */}
                            <div>
                                <label htmlFor="option2" className="block text-sm font-medium text-gray-700 mb-1">
                                    Value
                                </label>
                                <input
                                    type="text"
                                    id="value"
                                    {...register("value", {
                                        required: "value is required",
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.value ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter second option"
                                />
                                {errors.value && (
                                    <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#433D8B] text-white py-2 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#433D8B]"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <MentorFooter />
            </div>
        </>
    );
};

export default AdminAddBadges;
