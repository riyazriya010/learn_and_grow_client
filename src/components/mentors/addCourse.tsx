'use client'

import { mentorApis } from "@/app/api/mentorApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../navbar";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import LoadingModal from "../re-usable/loadingModal";
import socket from "@/utils/socket";
import axios from "axios";
import { MENTOR_SERVICE_URL } from "@/utils/constant";

// interface Chapters {
//   title: string;
//   description: string;
//   video: File | null;
// }

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

interface CategoryData {
  _id: string;
  categoryName: string;
}

const AddCourse = () => {
  const [categories, setCategories] = useState<CategoryData[] | null>(null);
  const [catId, setCatId] = useState<string | ''>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({});

  const router = useRouter()

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const categoryResponse = await mentorApis.getCategories();
        console.log('cat : ', categoryResponse)
        setCategories(categoryResponse?.data?.result || []);
      } catch (error: any) {
        if(error && error?.response?.status === 401 && error.response?.data?.message === 'Mentor Not Verified'){
          toast.warn(error?.response?.data?.message);
          setTimeout(() => {
            window.location.replace('/pages/mentor/profile');
          }, 3000);
          return;
        }
        if (
          error &&
          error?.response?.status === 403 &&
          error?.response?.data?.message === 'Mentor Blocked'
        ) {
          toast.warn(error?.response?.data?.message);
          await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
          localStorage.clear();
          setTimeout(() => {
            window.location.replace('/pages/mentor/login');
          }, 3000);
          return;
        }
        if (error && error.response?.status === 401) {
          toast.warn(error.response.data.message);
          await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
          localStorage.clear();
          setTimeout(() => {
            window.location.replace('/pages/mentor/login');
          }, 3000);
          return;
        }
      }
    }
    fetchCat()
  }, [])



  // const onSubmit = async (data: any) => {
  //   setIsLoading(true);
  //   try {
  //     console.log('data: ', data)
  //     const formData = new FormData()

  //     if (data.demoVideo && data.demoVideo[0]) {
  //       formData.append("demoVideo", data.demoVideo[0])
  //     }

  //     if (data.thumbnail && data.thumbnail[0]) {
  //       formData.append("thumbnail", data.thumbnail[0])
  //     }

  //     // Append other fields
  //     for (const key of Object.keys(data)) {
  //       if (key !== "demoVideo" && key !== "thumbnail") {
  //         formData.append(key, data[key]);
  //       }
  //     }

  //     // Log FormData entries
  //     for (const [key, value] of formData.entries()) {
  //       console.log(`${key}:`, value);
  //     }

  //     // Make the API call
  //     const response = await mentorApis.addCourse(formData);
  //     console.log("Server Response:", response);
  //     if (response) {
  //       const courseName = response?.result?.courseName
  //       socket.emit('courseUploaded', courseName)
  //       reset()
  //       toast.success('Course Uploaded Successfully')
  //       setTimeout(() => {
  //         router.push('/pages/mentor/courses')
  //       }, 2000)
  //     }

  //   } catch (error: any) {
  //     if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
  //       console.log('401 log', error.response.data.message)
  //       toast.warn(error.response.data.message);
  //       setTimeout(() => {
  //         router.push('/pages/mentor/profile')
  //       }, 2000)
  //       return;
  //     }
  //     if (
  //       error &&
  //       error?.response?.status === 403 &&
  //       error?.response?.data?.message === 'Mentor Blocked'
  //     ) {
  //       toast.warn(error?.response?.data?.message);
  //       Cookies.remove('accessToken');
  //       localStorage.clear();
  //       setTimeout(() => {
  //         window.location.replace('/pages/mentor/login');
  //       }, 3000);
  //       return;
  //     }
  //     if (error && error.response?.status === 401) {
  //       toast.warn(error.response.data.message);
  //       Cookies.remove('accessToken');
  //       localStorage.clear();
  //       setTimeout(() => {
  //         window.location.replace('/pages/mentor/login');
  //       }, 3000);
  //       return;
  //     }
  //     if (error && error?.status === 403) {
  //       toast.warn('Course Name Already Exist')
  //     }
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }


  const onSubmit = async (data: any) => {
    setIsLoading(true);
    data.categoryId = catId
    console.log('catId: ', catId)
    console.log('data: ', data)
    try {
      console.log("data: ", data);



      // Step 1: Get Pre-signed URLs from backend
      const fileRequests: any = [];
      if (data.demoVideo && data.demoVideo[0]) {
        fileRequests.push({
          fileName: data.demoVideo[0].name,
          fileType: data.demoVideo[0].type,
        });
      }
      if (data.thumbnail && data.thumbnail[0]) {
        fileRequests.push({
          fileName: data.thumbnail[0].name,
          fileType: data.thumbnail[0].type,
        });
      }

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

      // Step 2: Upload files to S3 using their respective URLs
      let demoVideoUrl = "";
      let thumbnailUrl = "";

      for (let i = 0; i < urls.length; i++) {
        const fileToUpload = i === 0 ? data.demoVideo[0] : data.thumbnail[0];

        const s3Upload = await axios.put(urls[i].presignedUrl, fileToUpload, {
          headers: { "Content-Type": fileToUpload.type },
        });
        console.log('s3Upload: ', s3Upload)

        if (i === 0) demoVideoUrl = `https://learnandgrow.s3.amazonaws.com/${urls[i].fileKey}`;
        if (i === 1) thumbnailUrl = `https://learnandgrow.s3.amazonaws.com/${urls[i].fileKey}`;
      }

      // Step 3: Send file URLs and course details to the backend
      const response = await axios.post(
        `${MENTOR_SERVICE_URL}/mentor/course-upload`,
        {
          ...data,
          demoVideoUrl,
          thumbnailUrl,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Server Response:", response);

      if (response) {
        const courseName = response?.data?.courseName;
        socket.emit("courseUploaded", courseName);
        reset();
        toast.success("Course Uploaded Successfully");
        setTimeout(() => {
          router.push("/pages/mentor/courses");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error uploading course:", error);
      if(error && error?.response?.status === 401 && error.response?.data?.message === 'Mentor Not Verified'){
        toast.warn(error?.response?.data?.message);
        setTimeout(() => {
          window.location.replace('/pages/mentor/profile');
        }, 3000);
        return;
      }
      if (
        error &&
        error?.response?.status === 403 &&
        error?.response?.data?.message === 'Mentor Blocked'
      ) {
        toast.warn(error?.response?.data?.message);
        await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
      if (error && error.response?.status === 401) {
        toast.warn(error.response.data.message);
        await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }

    }
  };

  return (
    <>
      <LoadingModal isOpen={isLoading} message='Please wait course is uploading' />

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
                {...register('courseName', {
                  required: 'Course Name is required',
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
                className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
                placeholder="Enter course name"
              />
              {errors.courseName && (
                <p className="text-red-500 text-sm">{errors.courseName.message}</p>
              )}

              {/* Course Description */}
              <label className="block font-semibold mb-2">Description</label>
              <input
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: "Descriptiom must be at least 10 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                    message: "Description cannot have leading/trailing spaces or multiple spaces between words",
                  }
                })}
                type="text"
                className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}

              {/* Category */}
              <label className="block font-semibold mb-2">Category</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full p-3 mb-4 rounded border border-[#D6D1F0] bg-[#F4F1FD] text-black"
                onChange={(e) => setCatId(e.target.value)}
              >
                <option value="">Select Category</option>
                {
                  categories?.map((cat, index) => {
                    return <option
                      key={index}
                      value={cat?.categoryName}
                    >
                      {cat?.categoryName}
                    </option>
                  })
                }
                {/* <option value="programming">Programming</option>
                                <option value="design">Design</option>
                                <option value="business">Business</option> */}
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}

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
                {...register('duration', {
                  required: 'Duration is required',
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
              {errors.duration && (
                <p className="text-red-500 text-sm">{errors.duration.message}</p>
              )}

              {/* Price */}
              <label className="block font-semibold mb-2">Price</label>
              <input
                {...register('price', {
                  required: 'Price is required',
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
