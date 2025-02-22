'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Navbar from '../navbar';
import MentorFooter from './footer';
import { mentorApis } from '@/app/api/mentorApi';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

interface FormValues {
    title: string;
    description: string;
    chapterVideo: FileList | null;
}

const EditChapter: React.FC = () => {
    const [chapterId, setChapterId] = useState<string | null>(null);
    const [chapterVideoUrl, setChapterVideoUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const chapterId = urlParams.get("chapterId");
        const chapterTitle = localStorage.getItem('chapterTitle');
        const chapterDescription = localStorage.getItem('chapterDescription');
        const chapterVideoUrl = localStorage.getItem('chapterVideoUrl');

        if (chapterId) {
            setChapterId(chapterId);
            setChapterVideoUrl(chapterVideoUrl);
            setValue('title', String(chapterTitle));
            setValue('description', String(chapterDescription));
        }
        // setIsLoading(false);
    }, [setValue]);



    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const formData = new FormData();

            if (data.chapterVideo && data.chapterVideo.length > 0) {
                formData.append("chapterVideo", data.chapterVideo[0]);
            }

            formData.append("title", data.title);
            formData.append("description", data.description);
            console.log('formdata: ', formData)
            const response = await mentorApis.editChapter(formData, String(chapterId));
            if (response && response?.data) {
                toast.success('Chapter updated successfully');
                localStorage.removeItem('chapterTitle');
                localStorage.removeItem('chapterDescription');
                localStorage.removeItem('chapterVideoUrl');
                reset();
                setTimeout(() => {
                    router.push('/pages/mentor/courses');
                }, 2000);
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
            console.error("Error submitting form:", error);
            toast.error('Error updating chapter');
        }
    };

    return (
        <>
            <Navbar />

            <ToastContainer
                autoClose={2000}
                pauseOnHover={false}
                transition={Slide}
                hideProgressBar={false}
                closeOnClick={false}
                pauseOnFocusLoss={true}
            />

            <main className="flex-grow flex items-center justify-center px-4 py-8">
                <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] w-[400px] p-6 shadow-md rounded-none">
                    <h1 className="text-center text-2xl font-bold mb-6 text-[#433D8B]">Edit Chapter</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Chapter Title */}
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
                                Chapter Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                placeholder="Enter chapter title"
                                className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
                                {...register('title',
                                    {
                                        required: 'Title is required',
                                        minLength: {
                                            value: 3,
                                            message: "Chapter name must be at least 5 characters",
                                        },
                                        pattern: {
                                            value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                                            message: "Chapter name cannot have leading/trailing spaces or multiple spaces between words",
                                        }

                                    })}
                            />
                            {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                placeholder="Enter chapter description"
                                rows={4}
                                className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
                                {...register('description',
                                    {
                                        required: 'Description is required',
                                        minLength: {
                                            value: 10,
                                            message: "Description name must be at least 10 characters",
                                        },
                                        pattern: {
                                            value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                                            message: "Description name cannot have leading/trailing spaces or multiple spaces between words",
                                        }

                                    })}
                            ></textarea>
                            {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                        </div>

                        {/* Video File */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Chapter Video
                            </label>
                            <input
                                type="file"
                                className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
                                {...register('chapterVideo')}
                            />
                            {/* Current Video Button */}
                            {chapterVideoUrl && (
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-white bg-[#433D8B] py-2 px-4 rounded hover:opacity-90"
                                    >
                                        Play Current Video
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#433D8B] text-white py-3 rounded-[22px] hover:opacity-90"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </main>

            {/* Video Modal */}
            {isModalOpen && chapterVideoUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-md relative w-[90%] max-w-md aspect-video">
                        {/* Cancel Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
                        >
                            &times;
                        </button>
                        {/* Video Player */}
                        <video
                            src={chapterVideoUrl}
                            controls
                            className="w-full h-full object-cover border border-gray-300 rounded"
                            onContextMenu={(e) => e.preventDefault()}
                            controlsList='nodownload'
                        />
                    </div>
                </div>
            )}

            <MentorFooter />
        </>
    );
};

export default EditChapter;
