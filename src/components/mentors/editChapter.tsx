// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import Navbar from '../navbar';
// import MentorFooter from './footer';
// import { mentorApis } from '@/api/mentorApi';
// import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useRouter } from 'next/navigation';

// interface FormValues {
//     title: string;
//     description: string;
//     chapterVideo: File | null;
// }

// const EditChapter: React.FC = () => {
//         const [chapterId, setChapterId] = useState<string | null>(null);
//         const [isLoading, setIsLoading] = useState<boolean>(true);
//         const router = useRouter()

//     const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>();


//      useEffect(() => {
//             const urlParams = new URLSearchParams(window.location.search);
//             const chapterId = urlParams.get("chapterId");
//             const chapterTitle = localStorage.getItem('chapterTitle')
//             const chapterDescription = localStorage.getItem('chapterDescription')
//             const chapterVideoUrl = localStorage.getItem('chapterVideoUrl')

//             if (chapterId) {
//                 setChapterId(chapterId);
//                 setIsLoading(false);
//                 setValue('title', String(chapterTitle))
//                 setValue('description', String(chapterDescription))
//             } else {
//                 setIsLoading(false);
//             }

//         }, []);

//     const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
//         try {
//             console.log('data: ', data)

//             const formData = new FormData()

//             if (data.chapterVideo && data.chapterVideo[0]) {
//                 formData.append("chapterVideo", data.chapterVideo[0])
//             }

//             // Append other fields
//             for (const key of Object.keys(data)) {
//                 if (key !== "chapterVideo") {
//                     formData.append(key, data[key]);
//                 }
//             }

//             // Log FormData entries
//             for (const [key, value] of formData.entries()) {
//                 console.log(`${key}:`, value);
//             }

//             const response = await mentorApis.addChapter(formData, String(chapterId))
//             console.log('res ', response)
//             if (response && response?.data) {
//                 console.log('res ', response)
//                 toast.success('Chapter Edited Successfully')
//                 reset()
//             }
//             localStorage.removeItem('chapterTitle')
//             localStorage.removeItem('chapterDescription')
//             reset()
//             setTimeout(() => {
//                 router.push('/pages/mentor/chapters')
//             }, 2000)


//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     return (
//         <>
//             <Navbar />

//             <ToastContainer
//                 autoClose={2000}
//                 pauseOnHover={false}
//                 transition={Slide}
//                 hideProgressBar={false}
//                 closeOnClick={false}
//                 pauseOnFocusLoss={true}
//             />

//             <main className="flex-grow flex items-center justify-center px-4 py-8">
//                 <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] w-[400px] p-6 shadow-md rounded-none">
//                     <h1 className="text-center text-2xl font-bold mb-6 text-[#433D8B]">Edit Chapter</h1>
//                     <form onSubmit={handleSubmit(onSubmit)}>
//                         {/* Chapter Title */}
//                         <div className="mb-4">
//                             <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
//                                 Chapter Title
//                             </label>
//                             <input
//                                 type="text"
//                                 id="title"
//                                 placeholder="Enter chapter title"
//                                 className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
//                                 {...register('title', { required: 'Title is required' })}
//                             />
//                             {errors.title && <p className="text-red-600">{errors.title.message}</p>}
//                         </div>

//                         {/* Description */}
//                         <div className="mb-4">
//                             <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
//                                 Description
//                             </label>
//                             <textarea
//                                 id="description"
//                                 placeholder="Enter chapter description"
//                                 rows={4}
//                                 className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
//                                 {...register('description', { required: 'Description is required' })}
//                             ></textarea>
//                             {errors.description && <p className="text-red-600">{errors.description.message}</p>}
//                         </div>

//                         {/* Video File */}
//                         <div className="mb-4">
//                             <label className="block text-gray-700 font-semibold mb-2">
//                                 Chapter Video
//                             </label>
//                             <input
//                                 type="file"
//                                 className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
//                                 {...register('chapterVideo', { required: 'Video file is required' })}
//                             />
//                             {errors.chapterVideo && <p className="text-red-600">{errors.chapterVideo.message}</p>}
//                         </div>

//                         {/* Submit Button */}
//                         <button
//                             type="submit"
//                             className="w-full bg-[#433D8B] text-white py-3 rounded-[22px] hover:opacity-90"
//                         >
//                             Submit
//                         </button>
//                     </form>
//                 </div>
//             </main>
//             <MentorFooter />
//         </>
//     );
// };

// export default EditChapter;






'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Navbar from '../navbar';
import MentorFooter from './footer';
import { mentorApis } from '@/app/api/mentorApi';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

interface FormValues {
    title: string;
    description: string;
    chapterVideo: FileList | null;
}

const EditChapter: React.FC = () => {
    const [chapterId, setChapterId] = useState<string | null>(null);
    const [chapterVideoUrl, setChapterVideoUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
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
        setIsLoading(false);
    }, [setValue]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const formData = new FormData();

            if (data.chapterVideo && data.chapterVideo.length > 0) {
                formData.append("chapterVideo", data.chapterVideo[0]);
            }

            formData.append("title", data.title);
            formData.append("description", data.description);

            let response;

            if (data.chapterVideo && data.chapterVideo.length > 0) {
                response = await mentorApis.addChapter(formData, String(chapterId));
            } else {
                // response = await mentorApis.updateChapterWithoutVideo(
                //     { title: data.title, description: data.description },
                //     String(chapterId)
                // );
            }

            if (response && response?.data) {
                toast.success('Chapter updated successfully');
                localStorage.removeItem('chapterTitle');
                localStorage.removeItem('chapterDescription');
                localStorage.removeItem('chapterVideoUrl');
                reset();
                setTimeout(() => {
                    router.push('/pages/mentor/chapters');
                }, 2000);
            }
        } catch (error) {
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
                                {...register('title', { required: 'Title is required' })}
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
                                {...register('description', { required: 'Description is required' })}
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
