'use client'

import { mentorApis } from "@/app/api/mentorApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../navbar";
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import LoadingModal from "../re-usable/loadingModal";

interface Chapters {
  title: string;
  description: string;
  video: File | null;
}

interface FormValues {
  courseName: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: string;
  thumbnail: File | null;
  demoVideo: File | null;
}

const AddCourse = () => {
  const [chapters, setChapters] = useState<Chapters[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({});

  const router = useRouter()

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      console.log('data: ', data)
      const formData = new FormData()

      if (data.demoVideo && data.demoVideo[0]) {
        formData.append("demoVideo", data.demoVideo[0])
      }

      if (data.thumbnail && data.thumbnail[0]) {
        formData.append("thumbnail", data.thumbnail[0])
      }

      // Append other fields
      for (const key of Object.keys(data)) {
        if (key !== "demoVideo" && key !== "thumbnail") {
          formData.append(key, data[key]);
        }
      }

      // Log FormData entries
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Make the API call
      const response = await mentorApis.addCourse(formData);
      console.log("Server Response:", response);
      if (response && response.data) {
        toast.success('Course Uploaded Successfully')
        setTimeout(() => {
          router.push('/pages/mentor/courses')
        }, 2000)
      }

    } catch (error: any) {
      console.error("Error submitting form:", error);
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <>
    <LoadingModal isOpen={isLoading} message='Please wait course is uploading'/>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <ToastContainer
          autoClose={2000}
          pauseOnHover={false}
          transition={Slide}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnFocusLoss={true}
        />

        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
          
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl text-[#433D8B] font-bold text-center mb-6">Add Course</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Course Name */}
              <label className="block font-semibold mb-2">Course Name</label>
              <input
                {...register('courseName', { required: 'Course Name is required' })}
                type="text"
                className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
                placeholder="Enter course name"
              />
              {errors.courseName && (
                <p className="text-red-500 text-sm">{errors.courseName.message}</p>
              )}

              {/* Course Description */}
              <label className="block font-semibold mb-2">Description</label>
              <input
                {...register('description', { required: 'Description is required' })}
                type="text"
                className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}

              {/* Category */}
              <label className="block font-semibold mb-2">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
              >
                <option value="">Select Category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category.message}</p>
              )}

              {/* Level */}
              <label className="block font-semibold mb-2">Level</label>
              <select
                {...register('level', { required: 'Level is required' })}
                className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.level && (
                <p className="text-red-500 text-sm">{errors.level.message}</p>
              )}

              {/* Duration */}
              <label className="block font-semibold mb-2">Duration (Hours)</label>
              <input
                {...register('duration', { required: 'Duration is required' })}
                type="text"
                className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">{errors.duration.message}</p>
              )}

              {/* Price */}
              <label className="block font-semibold mb-2">Price</label>
              <input
                {...register('price', { required: 'Price is required' })}
                type="text"
                className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}


              {/* Thumbnail */}
              <label className="block font-semibold mb-2">Thumbnail</label>
              <input
                {...register('thumbnail', {
                  required: 'Thumbnail is required',
                })}
                type="file"
                className="mb-4 w-full p-3 rounded border border-[#D6D1F0] bg-[#F4F1FD]"
              />
              {errors.thumbnail && (
                <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>
              )}

              {/* Demo Video */}
              <label className="block font-semibold mb-2">Demo Video</label>
              <input
                {...register('demoVideo', {
                  required: 'Demo Video is required',
                })}
                type="file"
                className="mb-4 w-full p-3 rounded border border-[#D6D1F0] bg-[#F4F1FD]"
              />
              {errors.demoVideo && (
                <p className="text-red-500 text-sm">{errors.demoVideo.message}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#433D8B] text-white px-6 py-3 rounded-lg hover:opacity-90"
              >
                Submit
              </button>

            </form>

          </div>

        </div>
      </div>
    </>
  )
}

export default AddCourse


///////////////////////////////////////////////////////

// 'use client';

// import { mentorApis } from "@/api/mentorApi";
// import { useForm } from "react-hook-form";

// export default function MyForm() {
//   const { register, handleSubmit } = useForm();

//   const onSubmit = async (data: any) => {
//     try {
//       console.log("Data:", data);

//       const formData = new FormData();

//       // Append files and other fields
//       if (data.mainVideo && data.mainVideo[0]) {
//         formData.append("mainVideo", data.mainVideo[0]); // Append the first file for mainVideo
//       }
//       if (data.thumbnail && data.thumbnail[0]) {
//         formData.append("thumbnail", data.thumbnail[0]); // Append the first file for thumbnail
//       }

//       // Append other fields
//       for (const key of Object.keys(data)) {
//         if (key !== "mainVideo" && key !== "thumbnail") {
//           formData.append(key, data[key]);
//         }
//       }

//       // Log FormData entries
//       for (const [key, value] of formData.entries()) {
//         console.log(`${key}:`, value);
//       }

//       // Make the API call
//       const response = await mentorApis.addCourse(formData);
//       console.log("Server Response:", response);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <label>
//         Name:
//         <input type="text" {...register("name", { required: true })} />
//       </label>
//       <br />
//       <label>
//         Main Video:
//         <input type="file" {...register("mainVideo", { required: true })} />
//       </label>
//       <br />
//       <label>
//         Thumbnail:
//         <input type="file" {...register("thumbnail", { required: true })} />
//       </label>
//       <br />
//       <button type="submit">Submit</button>
//     </form>
//   );
// }


/////////////////////////////////////////////////////////////////////


// 'use client';

// import React, { useState } from 'react';
// import Navbar from '../navbar';
// import MentorFooter from './footer';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { mentorApis } from '@/api/mentorApi';

// interface Chapters {
//     title: string;
//     description: string;
//     video: File | null;
// }

// const AddCourse = () => {
//     const [chapters, setChapters] = useState<Chapters[]>([]);
//     const {
//         register,
//         handleSubmit,
//         setValue,
//         watch,
//         reset,
//         formState: { errors },
//     } = useForm<>({
//         defaultValues: {
//             chapters: [],
//         },
//     });

//     const handleAddChapter = () => {
//         const newChapter = { title: '', description: '', video: null };
//         setChapters((prevChapters) => [...prevChapters, newChapter]);
//         setValue('chapters', [...chapters, newChapter]); // Sync with useForm
//     };

//     const handleRemoveChapter = (index: number) => {
//         const updatedChapters = chapters.filter((_, i) => i !== index);
//         setChapters(updatedChapters);
//         setValue('chapters', updatedChapters); // Sync with useForm
//     };

//     const handleChangeChapter = (
//         index: number,
//         field: keyof Chapters,
//         value: string | File | null
//     ) => {
//         const updatedChapters = [...chapters];
//         updatedChapters[index] = { ...updatedChapters[index], [field]: value };
//         setChapters(updatedChapters);
//         setValue('chapters', updatedChapters); // Sync with useForm
//     };



//     const onSubmit = async (data: any) => {
//         try {
//             // Send FormData to the server
//             console.log('data: ', data)
//             // const formData = new FormData()
//             // formData.append('mainVideo', data.mainVideo[0])
//             // formData.append('thumbnail', data.thumbnail[0])
//             // formData.append('description', data.description);
//             // formData.append('courseName', data.courseName);
//             // formData.append('category', data.category);
//             // formData.append('level', data.level);
//             // formData.append('duration', data.duration);

//             // for (const [key, value] of formData.entries()) {
//             //     console.log(`${key}:`, value);
//             // }
//             data.mainVidoe = data.mainVideo[0]
//             data.thumbnail = data.thumbnail[0]
//             const response = await mentorApis.addCourse(data);
//             console.log('Response:', response);
//             // reset();

//         } catch (error) {
//             console.error('Error submitting form:', error);
//         }
//     };




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

//                             {/* Description */}
//                             <label className="block font-semibold mb-2">Description</label>
//                             <textarea
//                                 {...register('description', { required: 'Description is required' })}
//                                 className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                                 placeholder="Enter course description"
//                                 rows={4}
//                             ></textarea>
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
//                                 {...register('mainVideo', {
//                                     required: 'Demo Video is required',
//                                 })}
//                                 type="file"
//                                 className="mb-4 w-full p-3 rounded border border-[#D6D1F0] bg-[#F4F1FD]"
//                             />
//                             {errors.mainVideo && (
//                                 <p className="text-red-500 text-sm">{errors.mainVideo.message}</p>
//                             )}

//                             {/* Chapters */}
//                             {/* <div className="mb-4">
//                                 <h2 className="text-lg font-semibold mb-3">Chapters</h2>
//                                 {chapters.map((chapter, index) => (
//                                     <div
//                                         key={index}
//                                         className="bg-[#F8F9FA] p-4 rounded-lg border border-[#D6D1F0] mb-4"
//                                     >
//                                         <label className="block font-semibold mb-2">Chapter Title</label>
//                                         <input
//                                             type="text"
//                                             value={chapter.title}
//                                             onChange={(e) =>
//                                                 handleChangeChapter(index, 'title', e.target.value)
//                                             }
//                                             className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                                             placeholder="Enter chapter title"
//                                         />
//                                         {!chapter.title && (
//                                             <p className="text-red-500 text-sm">Chapter title is required</p>
//                                         )}

//                                         <label className="block font-semibold mb-2">Chapter Description</label>
//                                         <textarea
//                                             value={chapter.description}
//                                             onChange={(e) =>
//                                                 handleChangeChapter(index, 'description', e.target.value)
//                                             }
//                                             className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
//                                             placeholder="Enter chapter description"
//                                             rows={3}
//                                         ></textarea>
//                                         {!chapter.description && (
//                                             <p className="text-red-500 text-sm">Chapter description is required</p>
//                                         )}

//                                         <label className="block font-semibold mb-2">Chapter Video</label>
//                                         <input
//                                             type="file"
//                                             onChange={(e) =>
//                                                 handleChangeChapter(index, 'video', e.target.files?.[0] || null)
//                                             }
//                                             className="mb-4 w-full p-3 rounded border border-[#D6D1F0] bg-[#F4F1FD]"
//                                         />
//                                         {!chapter.video && (
//                                             <p className="text-red-500 text-sm">Chapter video is required</p>
//                                         )}

//                                         <button
//                                             type="button"
//                                             onClick={() => handleRemoveChapter(index)}
//                                             className="text-white bg-red-500 px-4 py-2 rounded"
//                                         >
//                                             Remove Chapter
//                                         </button>
//                                     </div>
//                                 ))}

//                                 <button
//                                     type="button"
//                                     onClick={handleAddChapter}
//                                     className="text-white bg-[#433D8B] px-4 py-2 rounded"
//                                 >
//                                     Add Chapter
//                                 </button>
//                             </div> */}

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
//                 <MentorFooter />
//             </div>
//         </>
//     );
// };

// export default AddCourse;
