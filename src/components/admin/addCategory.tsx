'use client';

import { adminApis } from "@/app/api/adminApis";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface CategoryFormData {
    categoryName: string;
}

const AddCategory = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormData>();

    const onSubmit = async (data: CategoryFormData) => {
        try {
            const response = await adminApis.addCategory(data)
            if (response && response?.data) {
                console.log('res ', response)
                toast.success('Category Added Successfully')
                reset()
            }
        }catch(error: any){
            console.log(error)
            if(error && error.response?.status === 403 && error.response?.data?.message === 'Category Already Exist'){
                toast.warn('Category Already Exist')
                reset()
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
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-[0px_4px_10px_rgba(0,0,0,0.1)]">
                        {/* Form Title */}
                        <h2 className="text-2xl font-bold text-[#433D8B] text-center mb-6">Add Category</h2>

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
                                    id="categoryName"
                                    {...register("categoryName", {
                                        required: "Category name is required",
                                        minLength: {
                                            value: 5,
                                            message: "Category name must be at least 5 characters",
                                        },
                                    })}
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

export default AddCategory;
