// 'use client'

// import { useEffect, useState } from "react";
// import LoadingModal from "../re-usable/loadingModal";
// import { studentApis } from "@/api/studentApi";
// import Image from "next/image";
// import MentorFooter from "../mentors/footer";
// import Navbar from "../navbar";

// const StudentViewCourse = () => {
//     const [courseId, setCourseId] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [course, setCourse] = useState<any>(null);

//     useEffect(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         const courseId = urlParams.get("courseId");

//         if (courseId) {
//             setCourseId(courseId);

//             const fetchCourse = async (id: string) => {
//                 try {
//                     const response = await studentApis.getCourse(id);
//                     if (response && response?.data?.data) {
//                         setCourse(response.data.data);
//                     }
//                 } catch (error: any) {
//                     console.error("Error fetching course details:", error);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };

//             fetchCourse(courseId);
//         } else {
//             setIsLoading(false);
//         }
//     }, []);


//     const buyCourse = async (id: string) => {
//         console.log('buy course id: ', id)
//     }

//     if (isLoading) return <LoadingModal isOpen={isLoading} message="Please Wait" />;

//     return (
//         <>
//             <div className="flex flex-col min-h-screen bg-white">
                
//                 {/* Header */}
//                 <header>
//                     <Navbar />
//                 </header>

//                 {/* Main Content */}
//                 <div className="flex flex-1 w-full px-4 py-8 md:px-8 lg:px-16">
//                     {course ? (
//                         <div className="max-w-7xl mx-auto flex">
//                             {/* Left Content */}
//                             <div className="w-[60%] pr-6">
//                                 <h1 className="text-2xl font-bold text-[#656262] mb-2">{course.courseName}</h1>
//                                 {course.ratings ? (
//                                     <p className="text-[#A7A7A7] text-sm mb-4">{course.ratings} ⭐</p>
//                                 ) : (
//                                     <p className="text-[#7F7F7F] text-sm mb-4">No ratings</p>
//                                 )}
//                                 <p className="text-[#7F7F7F] text-sm mb-6">{course.description}</p>
//                                 <hr className="border-t border-gray-300 my-4" />
//                                 <h2 className="text-lg font-semibold text-[#656262] mb-4">Course Highlights</h2>
//                                 <ul className="text-[#7F7F7F] text-sm list-disc list-inside">
//                                     <li>Interactive video lessons</li>
//                                     <li>Hands-on projects</li>
//                                     <li>Certification on completion</li>
//                                     <li>Lifetime access</li>
//                                     <li>Expert mentors</li>
//                                 </ul>
//                                 <h2 className="text-lg font-semibold text-[#656262] mt-6 mb-4">What You'll Learn</h2>
//                                 <p className="text-[#7F7F7F] text-sm">
//                                     Gain essential skills to excel in this field. Comprehensive lessons and hands-on exercises designed to build expertise and confidence.
//                                 </p>
//                             </div>

//                             {/* Vertical Line */}
//                             <div className="border-l border-[#545050] mx-6"></div>

//                             {/* Right Content */}
//                             <div className="w-[40%] flex flex-col items-start">
//                                 <div className="w-full h-[340px] w-[500px] mb-4">
//                                     {course.thumbnailUrl && (
//                                         <div className="relative w-full h-full bg-black">
//                                             <video
//                                                 src={course.demoVideo[0].url}
//                                                 poster={course.thumbnailUrl}
//                                                 onContextMenu={(e) => e.preventDefault()}
//                                                 controls
//                                                 className="w-full h-full object-cover"
//                                                 controlsList="nodownload"
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                                 <p className="text-[#7F7F7F] text-sm mb-2">Duration: {course.duration}</p>
//                                 <p className="text-[#7F7F7F] text-sm mb-2">Level: {course.level}</p>
//                                 <p className="text-[#7F7F7F] text-sm mb-4">Category: {course.category}</p>
//                                 <div className="flex justify-between items-center w-full mb-4">
//                                     <p className="text-xl font-semibold text-[#656262]">₹{course.price}</p>
//                                     <p className="text-green-600 font-semibold">65% off</p>
//                                 </div>
//                                 <button
//                                     onClick={() => buyCourse(course._id)}
//                                     className="bg-red-600 text-white font-semibold py-2 px-6 rounded-[22px] hover:bg-red-700"
//                                 >
//                                     Buy Course
//                                 </button>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="flex flex-col items-center justify-center mt-10">
//                             <Image
//                                 src="/images/undraw_no-data_ig65.svg"
//                                 alt="No Courses"
//                                 width={128}
//                                 height={128}
//                                 className="mb-4"
//                             />
//                             <p className="text-gray-500 text-lg">No course Found</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <MentorFooter />
//             </div>
//         </>
//     );
// };

// export default StudentViewCourse;




'use client'

import { useEffect, useRef, useState } from "react";
import LoadingModal from "../re-usable/loadingModal";
import { studentApis } from "@/app/api/studentApi";
import Image from "next/image";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentViewCourse = () => {
    const [courseId, setCourseId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [course, setCourse] = useState<any>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const searchParams = useSearchParams()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()

    useEffect(() => {
        const getCourseId = searchParams.get('courseId')

        if (getCourseId) {
            setCourseId(String(getCourseId));

            const fetchCourse = async () => {
                try {
                    const response = await studentApis.getCourse(getCourseId);
                    if (response && response?.data?.data) {
                        setCourse(response.data.data);
                    }
                } catch (error: any) {
                    console.error("Error fetching course details:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCourse();
        } else {
            setIsLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && videoRef.current && !videoRef.current.paused) {
                videoRef.current.pause();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const buyCourse = async (id: string) => {
        if(!user.userId){
            toast.warn('Please Login to buy the course')
            setTimeout(() => {
                router.push('/pages/student/login')
            }, 2000)
            return
        }
        try{
            const response = await studentApis.isVerified()
            console.log('ress: ', response)
        }catch(error: any){
            if(error && error.response?.status === 401){
                toast.warn('Please verify acount to buy the course')
            }
            return
        }

        const courseDetails = {
            courseName: course.courseName,
            price: course.price,
            level: course.level,
            category: course.category
        }
        localStorage.setItem('courseDetails', JSON.stringify(courseDetails))
        router.push(`/pages/student/summary-page?courseId=${courseId}`)
        
    };

    if (isLoading) return <LoadingModal isOpen={isLoading} message="Please Wait" />;

    return (
        <>
            <div className="flex flex-col min-h-screen bg-white">
                <header>
                    <Navbar />
                </header>

                <ToastContainer autoClose={2000} transition={Slide} />

                <div className="flex flex-1 w-full px-4 py-8 md:px-8 lg:px-16">
                    {course ? (
                        <div className="max-w-7xl mx-auto flex">
                            <div className="w-[60%] pr-6">
                                <h1 className="text-2xl font-bold text-[#656262] mb-2">{course.courseName}</h1>
                                {course.ratings ? (
                                    <p className="text-[#A7A7A7] text-sm mb-4">{course.ratings} ⭐</p>
                                ) : (
                                    <p className="text-[#7F7F7F] text-sm mb-4">No ratings</p>
                                )}
                                <p className="text-[#7F7F7F] text-sm mb-6">{course.description}</p>
                                <hr className="border-t border-gray-300 my-4" />
                                <h2 className="text-lg font-semibold text-[#656262] mb-4">Course Highlights</h2>
                                <ul className="text-[#7F7F7F] text-sm list-disc list-inside">
                                    <li>Interactive video lessons</li>
                                    <li>Hands-on projects</li>
                                    <li>Certification on completion</li>
                                    <li>Lifetime access</li>
                                    <li>Expert mentors</li>
                                </ul>
                                <h2 className="text-lg font-semibold text-[#656262] mt-6 mb-4">What You'll Learn</h2>
                                <p className="text-[#7F7F7F] text-sm">
                                    Gain essential skills to excel in this field. Comprehensive lessons and hands-on exercises designed to build expertise and confidence.
                                </p>
                            </div>
                            <div className="border-l border-gray-300 mx-6"></div>
                            <div className="w-[40%] flex flex-col items-start">
                                <div className="w-full h-[340px] w-[500px] mb-4">
                                    {course.thumbnailUrl && (
                                        <div className="relative w-full h-full bg-black">
                                            <video
                                                ref={videoRef}
                                                src={course.demoVideo[0].url}
                                                poster={course.thumbnailUrl}
                                                onContextMenu={(e) => e.preventDefault()}
                                                controls
                                                className="w-full h-full object-cover"
                                                controlsList="nodownload"
                                            />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[#7F7F7F] text-sm mb-2">Duration: {course.duration}</p>
                                <p className="text-[#7F7F7F] text-sm mb-2">Level: {course.level}</p>
                                <p className="text-[#7F7F7F] text-sm mb-4">Category: {course.category}</p>
                                <div className="flex justify-between items-center w-full mb-4">
                                    <p className="text-xl font-semibold text-[#000000]">₹{course.price}</p>
                                    {/* <p className="text-green-600 font-semibold">65% off</p> */}
                                </div>
                                {/* {
                                    false ? <button
                                    onClick={() => buyCourse(course._id)}
                                    className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-[0px]" disabled
                                >
                                    Purchased
                                </button> : <button
                                    onClick={() => buyCourse(course._id)}
                                    className="bg-[#6E40FF] text-white font-semibold py-2 px-6 rounded-[0px]"
                                >
                                    Buy Course
                                </button>
                                } */}
                                <button
                                    onClick={() => buyCourse(course._id)}
                                    className="bg-[#6E40FF] text-white font-semibold py-2 px-6 rounded-[0px]"
                                >
                                    Buy Course
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center mt-10">
                            <Image
                                src="/images/undraw_no-data_ig65.svg"
                                alt="No Courses"
                                width={128}
                                height={128}
                                className="mb-4"
                            />
                            <p className="text-gray-500 text-lg">No course Found</p>
                        </div>
                    )}
                </div>

                <MentorFooter />
            </div>
        </>
    );
};

export default StudentViewCourse;
