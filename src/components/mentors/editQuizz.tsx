'use client'

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../navbar';
import MentorFooter from './footer';
import { mentorApis } from '@/app/api/mentorApi';
import { useSearchParams } from 'next/navigation';
import Cookies from "js-cookie";

export interface IQuizForm {
    question: string;
    option1: string;
    option2: string;
    correctAnswer: string;
}

const EditQuiz = () => {
    const [courseId, setCourseId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const searchParams = useSearchParams()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IQuizForm>();


    useEffect(() => {
        const getCourseId = searchParams.get('courseId')
        
        if(getCourseId){
            setCourseId(getCourseId)
            setIsLoading(false)
        }else{
            setIsLoading(false)
        }
        
    },[searchParams])

    const onSubmit = async (data: IQuizForm) => {
        // Handle form submission logic here
        console.log('Submitted data:', data);
        try {
            const response = await mentorApis.addQuizz(data, String(courseId))
            if (response) {
                console.log('res quizz: ', response)
                toast.success(`Quiz question added successfully!`);
            }
        } catch (error: any) {
            if (error && error.response?.status === 401) {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken');
                localStorage.clear();
                setTimeout(() => {
                  window.location.replace('/pages/mentor/login');
                }, 3000);
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
            if(error && error?.response?.status === 403) {
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
                        <h2 className="text-2xl font-bold text-[#433D8B] text-center mb-6">Edit Quiz Question</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Question Field */}
                            <div>
                                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                                    Question
                                </label>
                                <input
                                    type="text"
                                    id="question"
                                    {...register("question", {
                                        required: "Question is required",
                                        minLength: {
                                            value: 10,
                                            message: "Question must be at least 10 characters",
                                        },
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.question ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter the quiz question"
                                />
                                {errors.question && (
                                    <p className="text-red-500 text-sm mt-1">{errors.question.message}</p>
                                )}
                            </div>

                            {/* Option 1 Field */}
                            <div>
                                <label htmlFor="option1" className="block text-sm font-medium text-gray-700 mb-1">
                                    Option 1
                                </label>
                                <input
                                    type="text"
                                    id="option1"
                                    {...register("option1", {
                                        required: "Option 1 is required",
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.option1 ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter first option"
                                />
                                {errors.option1 && (
                                    <p className="text-red-500 text-sm mt-1">{errors.option1.message}</p>
                                )}
                            </div>

                            {/* Option 2 Field */}
                            <div>
                                <label htmlFor="option2" className="block text-sm font-medium text-gray-700 mb-1">
                                    Option 2
                                </label>
                                <input
                                    type="text"
                                    id="option2"
                                    {...register("option2", {
                                        required: "Option 2 is required",
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.option2 ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter second option"
                                />
                                {errors.option2 && (
                                    <p className="text-red-500 text-sm mt-1">{errors.option2.message}</p>
                                )}
                            </div>

                            {/* Correct Answer Field */}
                            <div>
                                <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                                    Correct Answer
                                </label>
                                <input
                                    type="text"
                                    id="correctAnswer"
                                    {...register("correctAnswer", {
                                        required: "Correct answer is required",
                                        validate: value => {
                                            const option1 = document.getElementById('option1') as HTMLInputElement;
                                            const option2 = document.getElementById('option2') as HTMLInputElement;
                                            return (
                                                value === option1?.value || value === option2?.value || "Correct answer must be one of the options"
                                            );
                                        },
                                    })}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-[#433D8B] text-sm ${errors.correctAnswer ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Enter the correct answer"
                                />
                                {errors.correctAnswer && (
                                    <p className="text-red-500 text-sm mt-1">{errors.correctAnswer.message}</p>
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

export default EditQuiz;
