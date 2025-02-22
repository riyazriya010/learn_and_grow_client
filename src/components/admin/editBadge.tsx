'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { adminApis } from '@/app/api/adminApis';
import AdminHeader from './header';
import AdminFooter from './footer';

export interface BadgeData {
    badgeName: string;
    description: string;
    value: string;
}

const AdminEditBadges = () => {
    const [badgeId, setBadgeId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<BadgeData>();

    useEffect(() => {
        const getId = searchParams.get("badgeId");
        if (getId) setBadgeId(getId);

        const badgeData = localStorage.getItem("badgeData");
        if (badgeData) {
            const parsedData: BadgeData = JSON.parse(badgeData);
            // Prepopulate form fields with badge data
            setValue("badgeName", parsedData.badgeName);
            setValue("description", parsedData.description);
            setValue("value", parsedData.value);
        }
        setIsLoading(false);
    }, [searchParams, setValue]);

    const onSubmit = async (data: BadgeData) => {
        try {
            const response = await adminApis.editBadge(data, String(badgeId));
            if (response) {
                toast.success("Badge updated successfully!");
                localStorage.removeItem("badgeData");
                setTimeout(() => {
                    router.push("/pages/badge-management");
                }, 2000);
            }
        } catch (error: any) {
            if (error?.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
                toast.warn(error.response.data.message);
                setTimeout(() => {
                    router.push('/pages/mentor/profile');
                }, 2000);
                return;
            }
            if (error?.response?.status === 403 && error?.response?.data?.message === 'Mentor Blocked') {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken');
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/mentor/login');
                }, 3000);
                return;
            }
            if (error?.response?.status === 401) {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken');
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/mentor/login');
                }, 3000);
                return;
            }
            if (error?.response?.status === 403) {
                toast.warn('Badge already exists');
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div className="flex flex-col min-h-screen bg-white">
                {/* Header */}
                <header>
                    <AdminHeader/>
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
                        <h2 className="text-2xl font-bold text-[#433D8B] text-center mb-6">Edit Badge</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Badge Name Field */}
                            <div>
                                <label htmlFor="badgeName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Badge Name
                                </label>
                                <input
                                    type="text"
                                    id="badgeName"
                                    {...register("badgeName", {
                                        required: "Badge Name is required",
                                        minLength: {
                                            value: 5,
                                            message: "Badge Name must be at least 5 characters",
                                        },
                                        pattern: {
                                            value: /^[A-Za-z][A-Za-z0-9]*(?:\s[A-Za-z][A-Za-z0-9]*)*$/,
                                            message: "Badge Name must start with a letter and contain only single spaces",
                                        },
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.badgeName ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter the badge name"
                                />
                                {errors.badgeName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.badgeName.message}</p>
                                )}
                            </div>

                            {/* Description Field */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    id="description"
                                    {...register("description", {
                                        required: "Description is required",
                                        minLength: {
                                            value: 10,
                                            message: "Description must be at least 10 characters",
                                        },
                                        pattern: {
                                            value: /^[A-Za-z][A-Za-z0-9]*(?:\s[A-Za-z][A-Za-z0-9]*)*$/,
                                            message: "Description must start with a letter and contain only single spaces",
                                        },
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.description ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter the description"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Value Field */}
                            <div>
                                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                                    Value
                                </label>
                                <input
                                    type="text"
                                    id="value"
                                    {...register("value", {
                                        required: "Value is required",
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.value ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter the value"
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
                                Update Badge
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <AdminFooter />
            </div>
        </>
    );
};

export default AdminEditBadges;
