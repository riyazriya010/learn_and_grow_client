// 'use client'

// import { mentorApis } from "@/app/api/mentorApi";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import Navbar from "../navbar";

// interface Chapters {
//     title: string;
//     description: string;
//     video: File | null;
// }

// interface FormValues {
//     courseName: string;
//     description: string;
//     category: string;
//     level: string;
//     duration: string;
//     thumbnail: File | null;
//     demoVideo: File | null;
//     // chapters: Chapters[];
// }

// const Work = () => {

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<FormValues>({
//         // defaultValues: {
//         //     chapters: [],
//         // },
//     });

//     const onSubmit = async (data: any) => {
//         try {
//             console.log('data: ', data)
//             const formData = new FormData()

//             if (data.demoVideo && data.demoVideo[0]) {
//                 formData.append("demoVideo", data.demoVideo[0])
//             }

//             if (data.thumbnail && data.thumbnail[0]) {
//                 formData.append("thumbnail", data.thumbnail[0])
//             }

//             // Append other fields
//             for (const key of Object.keys(data)) {
//                 if (key !== "demoVideo" && key !== "thumbnail") {
//                     formData.append(key, data[key]);
//                 }
//             }

//             // Log FormData entries
//             for (const [key, value] of formData.entries()) {
//                 console.log(`${key}:`, value);
//             }

//             // Make the API call
//             const response = await mentorApis.addCourse(formData);
//             console.log("Server Response:", response);

//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     }

//     return (
//         <>
//             <div className="flex flex-col min-h-screen">
//                 <Navbar />
//                 <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
//                     <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
//                         <h1 className="text-3xl text-[#433D8B] font-bold text-center mb-6">Add Course</h1>

//                         <form onSubmit={handleSubmit(onSubmit)}>
//                             {/* Course Name */}
//                             <label className="block font-semibold mb-2">Course Name</label>
//                             <input
//                                 {...register('courseName', { required: 'Course Name is required' })}
//                                 type="text"
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                                 placeholder="Enter course name"
//                             />
//                             {errors.courseName && (
//                                 <p className="text-red-500 text-sm">{errors.courseName.message}</p>
//                             )}

//                             {/* Course Description */}
//                             <label className="block font-semibold mb-2">Description</label>
//                             <input
//                                 {...register('description', { required: 'Description is required' })}
//                                 type="text"
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                             />
//                             {errors.description && (
//                                 <p className="text-red-500 text-sm">{errors.description.message}</p>
//                             )}

//                             {/* Category */}
//                             <label className="block font-semibold mb-2">Category</label>
//                             <select
//                                 {...register('category', { required: 'Category is required' })}
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                             >
//                                 <option value="">Select Category</option>
//                                 <option value="programming">Programming</option>
//                                 <option value="design">Design</option>
//                                 <option value="business">Business</option>
//                             </select>
//                             {errors.category && (
//                                 <p className="text-red-500 text-sm">{errors.category.message}</p>
//                             )}

//                             {/* Level */}
//                             <label className="block font-semibold mb-2">Level</label>
//                             <select
//                                 {...register('level', { required: 'Level is required' })}
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                             >
//                                 <option value="">Select Level</option>
//                                 <option value="beginner">Beginner</option>
//                                 <option value="intermediate">Intermediate</option>
//                                 <option value="advanced">Advanced</option>
//                             </select>
//                             {errors.level && (
//                                 <p className="text-red-500 text-sm">{errors.level.message}</p>
//                             )}

//                             {/* Duration */}
//                             <label className="block font-semibold mb-2">Duration (Hours)</label>
//                             <input
//                                 {...register('duration', { required: 'Duration is required' })}
//                                 type="text"
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                             />
//                             {errors.duration && (
//                                 <p className="text-red-500 text-sm">{errors.duration.message}</p>
//                             )}


//                             {/* Thumbnail */}
//                             <label className="block font-semibold mb-2">Thumbnail</label>
//                             <input
//                                 {...register('thumbnail', {
//                                     required: 'Thumbnail is required',
//                                 })}
//                                 type="file"
//                                 className="mb-4 w-full p-3 rounded border border-[#D6D1F0] bg-[#F4F1FD]"
//                             />
//                             {errors.thumbnail && (
//                                 <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>
//                             )}

//                             {/* Demo Video */}
//                             <label className="block font-semibold mb-2">Demo Video</label>
//                             <input
//                                 {...register('demoVideo', {
//                                     required: 'Demo Video is required',
//                                 })}
//                                 type="file"
//                                 className="mb-4 w-full p-3 rounded border border-[#D6D1F0] bg-[#F4F1FD]"
//                             />
//                             {errors.demoVideo && (
//                                 <p className="text-red-500 text-sm">{errors.demoVideo.message}</p>
//                             )}

//                             {/* Submit */}
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
//     )
// }