'use client';

import { adminApis } from "@/app/api/adminApis";
import MentorFooter from "../mentors/footer";
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import LoadingModal from "../re-usable/loadingModal";
import { useRouter } from "next/navigation";
import AdminHeader from "./header";
import { ADMIN_SERVICE_URL } from "@/utils/constant";
import axios from "axios";

export interface CategoryFormData {
    categoryName: string;
}

const EditCategory = () => {
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormData>();


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryId = urlParams.get("categoryId");
        const catName = localStorage.getItem('categoryName')

        if (categoryId) {
           setCategoryId(categoryId)
           setCategoryName(catName)
           setIsLoading(false)
        }else{
            setIsLoading(false)
        }

    }, [])

    const onSubmit = async (data: CategoryFormData) => {
        try {
            const response = await adminApis.editCategory(data, String(categoryId))
            if (response && response?.data) {
                console.log('res ', response)
                toast.success('Category Edited Successfully')
                reset()
            }
            localStorage.removeItem('categoryName')
            reset()
            setTimeout(() => {
                router.push('/pages/category-management')
            }, 2000)
            
        } catch (error: any) {
            if (error && error.response?.status === 401) {
                toast.warn(error.response.data.message);
                await axios.post(`${ADMIN_SERVICE_URL}/admin/logout`, {}, { withCredentials: true });
                localStorage.clear();
                setTimeout(() => {
                  window.location.replace('/pages/login');
                }, 3000);
                return;
              }
            if(error && error?.response?.status === 403){
                toast.warn('Category Already Exist')
            }
        }
    };

    if(isLoading) return <LoadingModal isOpen={isLoading} message="Please Wait"/>

    return (
        <>
            <div className="flex flex-col min-h-screen bg-white">
                {/* Header */}
                <header>
                <AdminHeader />
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
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.1)]">
                        {/* Form Title */}
                        <h2 className="text-2xl font-bold text-[#433D8B] text-center mb-6">Edit Category</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Category Name Field */}
                            <div>
                                <label
                                    htmlFor="categoryName"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={categoryName || ""}
                                    id="categoryName"
                                    {...register("categoryName", {
                                        required: "Category name is required",
                                        minLength: {
                                            value: 5,
                                            message: "Category name must be at least 5 characters",
                                        },
                                        pattern: {
                                            value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                                            message: "Category name cannot have leading/trailing spaces or multiple spaces between words",
                                        },
                                    })}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.categoryName ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Enter category name"
                                />
                                {errors.categoryName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.categoryName.message}</p>
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

export default EditCategory;

