'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Navbar from '../navbar';
import MentorFooter from './footer';
import { mentorApis } from '@/app/api/mentorApi';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from "js-cookie";
import LoadingModal from '../re-usable/loadingModal';
import { MENTOR_SERVICE_URL } from '@/utils/constant';
import axios from 'axios';

export interface FormValues {
    title: string;
    description: string;
    chapterVideo: File | null;
}

const AddChapter: React.FC = () => {
    const [courseId, setCourseId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams()
    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();


    useEffect(() => {
        const getCourseId = searchParams.get('courseId')

        if (getCourseId) {
            setCourseId(getCourseId);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }

    }, [searchParams]);

    const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
        setIsLoading(true)
        try {

            //         const fileRequests: any = [];
            //         const formData = new FormData()

            //         if (data.chapterVideo && data.chapterVideo[0]) {
            //             // formData.append("chapterVideo", data.chapterVideo[0])
            //             fileRequests.push({
            //                 fileName: data.chapterVideo[0].name,
            //                 fileType: data.chapterVideo[0].type,
            //             });
            //         }

            //         // Append other fields
            //         for (const key of Object.keys(data)) {
            //             if (key !== "chapterVideo") {
            //                 formData.append(key, data[key]);
            //             }
            //         }

            //         // Log FormData entries
            //         for (const [key, value] of formData.entries()) {
            //             console.log(`${key}:`, value);
            //         }

            //         // Get Pre-Signed URL
            //         const presignedResponse = await axios.post(
            //             `${MENTOR_SERVICE_URL}/mentor/generate-presigned-url`,
            //             { files: fileRequests },
            //             {
            //                 headers: { "Content-Type": "application/json" },
            //                 withCredentials: true,
            //             }
            //         );

            //         console.log("Pre-signed URLs response:", presignedResponse);
            //         const urls = presignedResponse.data.urls;

            //         let videoUrl = "";

            //         for (let i = 0; i < urls.length; i++) {
            //             const fileToUpload = i === 0 && data.chapterVideo[0]

            //             const s3Upload = await axios.put(urls[i].presignedUrl, fileToUpload, {
            //                 headers: { "Content-Type": fileToUpload.type },
            //             });
            //             console.log('s3Upload: ', s3Upload)

            //             if (i === 0) videoUrl = `https://learnandgrow.s3.amazonaws.com/${urls[i].fileKey}`;
            //         }

            //         // Step 3: Send file URLs and course details to the backend
            //   const response = await axios.post(
            //     `${MENTOR_SERVICE_URL}/mentor/chapter-upload?courseId=${courseId}`,
            //     {
            //     //   ...data,
            //       chapterTitle:
            //       description:
            //       videoUrl,
            //     },
            //     {
            //       headers: { "Content-Type": "application/json" },
            //       withCredentials: true,
            //     }
            //   );

            
            const fileRequests: any = [];
            const formData = new FormData();

            if (data.chapterVideo && data.chapterVideo[0]) {
                fileRequests.push({
                    fileName: data.chapterVideo[0].name,
                    fileType: data.chapterVideo[0].type,
                });
            }

            // Append other fields
            for (const key of Object.keys(data)) {
                if (key !== "chapterVideo") {
                    formData.append(key, data[key]);
                }
            }

            // Log FormData entries
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            // Get Pre-Signed URL
            const presignedResponse = await axios.post(
                `${MENTOR_SERVICE_URL}/mentor/generate-presigned-url`,
                { files: fileRequests },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            console.log("Pre-signed URLs response:", presignedResponse);
            const urls = presignedResponse.data.urls;

            let videoUrl = "";

            for (let i = 0; i < urls.length; i++) {
                const fileToUpload = i === 0 && data.chapterVideo[0];

                const s3Upload = await axios.put(urls[i].presignedUrl, fileToUpload, {
                    headers: { "Content-Type": fileToUpload.type },
                });
                console.log("s3Upload: ", s3Upload);

                if (i === 0)
                    videoUrl = `https://learnandgrow.s3.amazonaws.com/${urls[i].fileKey}`;
            }

            // Step 3: Send file URLs and course details to the backend
            const response = await axios.post(
                `${MENTOR_SERVICE_URL}/mentor/chapter-upload?courseId=${courseId}`,
                {
                    chapterTitle: data.title, // Correctly mapped field
                    description: data.description, // Correctly mapped field
                    videoUrl,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            console.log("Server Response:", response);

            // const response = await mentorApis.addChapter(formData, String(courseId))
            if (response) {
                toast.success('Chapter Added Successfully')
                setTimeout(() => {
                    router.push('/pages/mentor/courses')
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
            if (error && error.response?.status === 401) {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken');
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/mentor/login');
                }, 3000);
                return;
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <>
            <LoadingModal isOpen={isLoading} message='Please wait course is uploading' />

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
                    <h1 className="text-center text-2xl font-bold mb-6 text-[#433D8B]">Add Chapter</h1>
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
                                {...register('title', {
                                    required: 'Title is required',
                                    minLength: {
                                        value: 5,
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
                                {...register('description', {
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
                                {...register('chapterVideo', { required: 'Video file is required' })}
                            />
                            {errors.chapterVideo && <p className="text-red-600">{errors.chapterVideo.message}</p>}
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
            <MentorFooter />
        </>
    );
};

export default AddChapter;
