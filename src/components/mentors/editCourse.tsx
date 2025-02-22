// 'use client';

// import { mentorApis } from "@/api/mentorApi";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import Navbar from "../navbar";
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useRouter } from "next/navigation";
// import LoadingModal from "../re-usable/loadingModal";

// interface FormValues {
//     courseName: string;
//     description: string;
//     category: string;
//     level: string;
//     duration: string;
//     price: string;
//     thumbnail: FileList | null; // Change to FileList
//     demoVideo: FileList | null; // Change to FileList
// }

// interface CategoryData {
//     categoryName: string;
// }

// const EditCourse = () => {
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     // const [course, setCourse] = useState<FormValues | null>(null);
//     const [courseId, setCourseId] = useState<string | null>(null);
//     const [categories, setCategories] = useState<CategoryData[] | null>(null);

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         formState: { errors },
//     } = useForm<FormValues>();

//     const router = useRouter();

//     useEffect(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         const courseId = urlParams.get("courseId");
//         setCourseId(courseId);

//         if (courseId) {
//             const fetchData = async () => {
//                 setIsLoading(true);
//                 try {
//                     const response = await mentorApis.getCourse(courseId);
//                     console.log('res corse: ', response.data.data)
//                     if (response?.data?.data) {
//                         const fetchedCourse = response.data.data;
//                         // setCourse(fetchedCourse);

//                         // Set the form values with the fetched data
//                         setValue('courseName', fetchedCourse.courseName);
//                         setValue('description', fetchedCourse.description);
//                         setValue('category', fetchedCourse.category);
//                         setValue('level', fetchedCourse.level);
//                         setValue('duration', fetchedCourse.duration);
//                         setValue('price', fetchedCourse.price);
//                     }
//                     const categoryResponse = await mentorApis.getCategories()
//                     if (categoryResponse) {
//                         console.log('cat res ', categoryResponse?.data?.data)
//                         setCategories(categoryResponse?.data?.data)
//                     }
//                 } catch (error) {
//                     console.error("Error fetching course data:", error);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };
//             fetchData();
//         }
//     }, [setValue]);

//     const onSubmit = async (data: FormValues) => {
//         setIsLoading(true);
//         try {
//             const formData = new FormData();

//             // Append files if they exist
//             if (data.demoVideo && data.demoVideo.length > 0) {
//                 formData.append("demoVideo", data.demoVideo[0]); // Access the first file
//             }

//             if (data.thumbnail && data.thumbnail.length > 0) {
//                 formData.append("thumbnail", data.thumbnail[0]); // Access the first file
//             }

//             // Append other fields
//             for (const key of Object.keys(data) as (keyof FormValues)[]) {
//                 if (key !== "demoVideo" && key !== "thumbnail") {
//                     formData.append(key, data[key]); // TypeScript now knows that key is a valid key of FormValues
//                 }
//             }

//             // Log FormData entries
//             for (const [key, value] of formData.entries()) {
//                 console.log(`${key}:`, value);
//             }

//             // Make the API call
//             // const response = await mentorApis.addCourse(formData);
//             // if (response && response.data) {
//             //     toast.success('Course Updated Successfully');
//             //     setTimeout(() => {
//             //         router.push('/pages/mentor/courses');
//             //     }, 2000);
//             // }
//         } catch (error: any) {
//             console.error("Error submitting form:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <>
//             <LoadingModal isOpen={isLoading} message="Please wait, updating course..." />
//             <div className="flex flex-col min-h-screen">
//                 <Navbar />

//                 <ToastContainer
//                     autoClose={2000}
//                     pauseOnHover={false}
//                     transition={Slide}
//                     hideProgressBar={false}
//                     closeOnClick={true}
//                     pauseOnFocusLoss={true}
//                 />

//                 <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
//                     <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
//                         <h1 className="text-3xl text-[#433D8B] font-bold text-center mb-6">Edit Course</h1>

//                         <form onSubmit={handleSubmit(onSubmit)}>
//                             <label className="block font-semibold mb-2">Course Name</label>
//                             <input
//                                 {...register("courseName", { required: "Course Name is required" })}
//                                 type="text"
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                             />
//                             {errors.courseName && <p className="text-red-500 text-sm">{errors.courseName.message}</p>}

//                             <label className="block font-semibold mb-2">Description</label>
//                             <textarea
//                                 {...register("description", { required: "Description is required" })}
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                                 rows={4}
//                             />
//                             {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

//                             <label className="block font-semibold mb-2">Category</label>
//                             <select
//                                 {...register("category", { required: "Category is required" })}
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                             >
//                                 <option value="">Select Category</option>
//                                 {
//                                     categories?.map((cat, index) => {
//                                         return <option key={index} value={cat?.categoryName}>{cat?.categoryName}</option>
//                                     })
//                                 }
//                                 {/* <option value="programming">Programming</option>
//                                 <option value="design">Design</option>
//                                 <option value="business">Business</option> */}
//                             </select>
//                             {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}

//                             <label className="block font-semibold mb-2">Level</label>
//                             <select
//                                 {...register("level", { required: "Level is required" })}
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                             >
//                                 <option value="">Select Level</option>
//                                 <option value="beginner">Beginner</option>
//                                 <option value="intermediate">Intermediate</option>
//                                 <option value="advanced">Advanced</option>
//                             </select>
//                             {errors.level && <p className="text-red-500 text-sm">{errors.level.message}</p>}

//                             <label className="block font-semibold mb-2">Duration (Hours)</label>
//                             <input
//                                 {...register("duration", { required: "Duration is required" })}
//                                 type="text"
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                             />
//                             {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}

//                             <label className="block font-semibold mb-2">Price</label>
//                             <input
//                                 {...register("price", { required: "Price is required" })}
//                                 type="text"
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                             />
//                             {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

//                             <label className="block font-semibold mb-2">Thumbnail</label>
//                             <input
//                                 {...register("thumbnail")}
//                                 type="file"
//                                 className="mb-4 w-full p-3 rounded border border-[#D6D1F0] bg-[#F4F1FD]"
//                             />

//                             <label className="block font-semibold mb-2">Demo Video</label>
//                             <input
//                                 {...register("demoVideo")}
//                                 type="file"
//                                 className="mb-4 w-full p-3 rounded border border-[#D6D1F0] bg-[#F4F1FD]"
//                             />

//                             <button
//                                 type="submit"
//                                 className="w-full bg-[#433D8B] text-white px-6 py-3 rounded-lg hover:opacity-90"
//                             >
//                                 Submit
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default EditCourse;








'use client';

import { mentorApis } from "@/app/api/mentorApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../navbar";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, useSearchParams } from "next/navigation";
import LoadingModal from "../re-usable/loadingModal";
import Cookies from "js-cookie";

interface FormValues {
    courseName: string;
    description: string;
    category: string;
    level: string;
    duration: string;
    price: string;
    thumbnail: FileList | null;
    demoVideo: FileList | null;
}

interface CourseData {
    _id: string;
    courseName: string;
}

interface CategoryData {
    categoryName: string;
}

const EditCourse = () => {
    const [course, setCourse] = useState<CourseData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [courseId, setCourseId] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryData[] | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<{ video: boolean, image: boolean }>({ video: false, image: false });

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();
    const router = useRouter();
    const searchParams = useSearchParams()


    useEffect(() => {
        const getCourseId = searchParams.get('courseId')

        if (getCourseId) {
            setCourseId(getCourseId);

            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const response = await mentorApis.getCourse(getCourseId);
                    if (response?.data?.result) {
                        const fetchedCourse = response.data.result;
                        setCourse(fetchedCourse)
                        setValue('courseName', fetchedCourse.courseName);
                        setValue('description', fetchedCourse.description);
                        setValue('category', fetchedCourse.category);
                        setValue('level', fetchedCourse.level);
                        setValue('duration', fetchedCourse.duration);
                        setValue('price', fetchedCourse.price);
                        setThumbnailUrl(fetchedCourse.thumbnailUrl);
                        setDemoVideoUrl(fetchedCourse.demoVideo[0]?.url);
                    }
                    const categoryResponse = await mentorApis.getCategories();
                    setCategories(categoryResponse?.data?.result || []);
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
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [setValue || searchParams]);


    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            if (data.thumbnail && data.thumbnail.length > 0) {
                console.log('first')
                formData.append("thumbnail", data.thumbnail[0]);
            }
            if (data.demoVideo && data.demoVideo.length > 0) {
                console.log('second')
                formData.append("demoVideo", data.demoVideo[0]);
            }
            for (const key of Object.keys(data) as (keyof FormValues)[]) {
                if (key !== "demoVideo" && key !== "thumbnail") {
                    formData.append(key, data[key]);
                }
            }

            // Log FormData entries
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await mentorApis.editCourseWithFiles(formData, String(courseId))
            console.log('res edit: ', response)
            if (response && response?.data) {
                toast.success('Successfully Course Edited')
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
            if (error && error?.status === 403) {
                toast.warn('Course Name Already Exist')
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <LoadingModal isOpen={isLoading} message="Please wait, updating course..." />
            <div className="flex flex-col min-h-screen">
                <Navbar />

                <ToastContainer
                    autoClose={2000}
                    pauseOnHover={false}
                    transition={Slide}
                    hideProgressBar={false}
                    closeOnClick={true}
                    pauseOnFocusLoss={true}
                />

                {course?._id ? (

                    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
                        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
                            <h1 className="text-3xl text-[#433D8B] font-bold text-center mb-6">Edit Course</h1>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Course Name */}
                                <label className="block font-semibold mb-2">Course Name</label>
                                <input {...register("courseName",
                                    {
                                        required: "Course Name is required",
                                        minLength: {
                                            value: 10,
                                            message: "Course name must be at least 10 characters",
                                        },
                                        pattern: {
                                            value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                                            message: "Course name cannot have leading/trailing spaces or multiple spaces between words",
                                        }
                                    })}
                                    type="text"
                                    className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black" />
                                {errors.courseName && <p className="text-red-500 text-sm">{errors.courseName.message}</p>}

                                {/* Description */}
                                <label className="block font-semibold mb-2">Description</label>
                                <textarea {...register("description",
                                    {
                                        required: "Description is required",
                                        minLength: {
                                            value: 10,
                                            message: "Descriptiom must be at least 10 characters",
                                        },
                                        pattern: {
                                            value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                                            message: "Description cannot have leading/trailing spaces or multiple spaces between words",
                                        }

                                    })}
                                    className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black" rows={4} />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

                                <label className="block font-semibold mb-2">Category</label>
                                <select
                                    {...register("category", { required: "Category is required" })}
                                    className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
                                >
                                    <option value="">Select Category</option>
                                    {
                                        categories?.map((cat, index) => {
                                            return <option key={index} value={cat?.categoryName}>{cat?.categoryName}</option>
                                        })
                                    }
                                    {/* <option value="programming">Programming</option>
                                <option value="design">Design</option>
                                <option value="business">Business</option> */}
                                </select>
                                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}

                                <label className="block font-semibold mb-2">Level</label>
                                <select
                                    {...register("level", { required: "Level is required" })}
                                    className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
                                >
                                    <option value="">Select Level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                {errors.level && <p className="text-red-500 text-sm">{errors.level.message}</p>}

                                <label className="block font-semibold mb-2">Duration (Hours)</label>
                                <input
                                    {...register("duration",
                                        {
                                            required: "Duration is required",
                                            minLength: {
                                                value: 3,
                                                message: "Duration must be at least 3 characters",
                                            },
                                            pattern: {
                                                value: /^(\d+(\.\d{1,2})?)\s?hr$/,
                                                message: "Duration must be in the format 'X hr' or 'X.XX hr'"
                                            }

                                        })}
                                    type="text"
                                    className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
                                />
                                {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}

                                <label className="block font-semibold mb-2">Price</label>
                                <input
                                    {...register("price",
                                        {
                                            required: "Price is required",
                                            minLength: {
                                                value: 3,
                                                message: "Price must be at least 3 characters",
                                            },
                                            pattern: {
                                                value: /^[1-9]\d*$/,  // Ensures only positive whole numbers (no leading/trailing spaces)
                                                message: "Price must be a valid number",
                                            }

                                        })}
                                    type="text"
                                    className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
                                />
                                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}


                                {/* Demo Video */}
                                <label className="block font-semibold mb-2">Demo Video (optional)</label>
                                <input
                                    {...register("demoVideo")}
                                    type="file"
                                    accept="video/*"
                                    className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
                                />
                                {demoVideoUrl && (
                                    <div className="mb-4">
                                        <button onClick={() => setIsModalOpen({ ...isModalOpen, video: true })} type="button" className="px-4 py-2 bg-blue-500 text-white rounded">
                                            Play Demo Video
                                        </button>
                                    </div>
                                )}

                                {/* Thumbnail */}
                                <label className="block font-semibold mb-2">Thumbnail (optional)</label>
                                <input
                                    {...register("thumbnail")}
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
                                />
                                {thumbnailUrl && (
                                    <div className="mb-4">
                                        <button onClick={() => setIsModalOpen({ ...isModalOpen, image: true })} type="button" className="px-4 py-2 bg-green-500 text-white rounded">
                                            Show Thumbnail
                                        </button>
                                    </div>
                                )}

                                <button type="submit" className="w-full bg-[#433D8B] text-white px-6 py-3 rounded-lg hover:opacity-90">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
                        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
                            <h1 className="text-3xl text-red-600 font-bold text-center mb-6">Unauthorized</h1>
                            <p className="text-center text-gray-500">You do not have permission to edit this course.</p>
                        </div>
                    </div>
                )
                }

                {/* Demo Video Modal */}
                {isModalOpen.video && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white rounded p-4 max-w-md w-full aspect-video relative">
                            <button
                                onClick={() => setIsModalOpen({ ...isModalOpen, video: false })}
                                className="absolute top-2 right-2 text-black text-xl z-60"
                            >
                                &times;
                            </button>
                            <video src={String(demoVideoUrl)}
                                controls
                                controlsList="nodownload"
                                className="w-full h-full object-cover"
                                onContextMenu={(e) => e.preventDefault()}
                            />
                            <div className="absolute bottom-0 right-0 text-white text-1xl opacity-50 p-2 z-10">
                                Learn&Grow
                            </div>
                        </div>
                    </div>
                )}

                {/* Thumbnail Modal */}
                {isModalOpen.image && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white rounded p-4 max-w-md w-full relative">
                            <button
                                onClick={() => setIsModalOpen({ ...isModalOpen, image: false })}
                                className="absolute top-2 right-2 text-black text-xl z-60"
                            >
                                &times;
                            </button>
                            <img src={String(thumbnailUrl)} alt="Thumbnail" className="w-full" onContextMenu={(e) => e.preventDefault()} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default EditCourse;




