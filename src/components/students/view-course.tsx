'use client'

import { useEffect, useRef, useState } from "react";
import LoadingModal from "../re-usable/loadingModal";
import { studentApis } from "@/app/api/studentApi";
import Image from "next/image";
import Navbar from "../navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../loggedoutNav/footer";
import { clearUserDetials } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { USER_SERVICE_URL } from "@/utils/constant";
import axios from "axios";

const StudentViewCourse = () => {
    const [courseId, setCourseId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [course, setCourse] = useState<any>(null);
    const [chapters, setChapters] = useState<any>(null);
    const [alreadyBuyed, setAlreadyBuyed] = useState<boolean>(false)
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const searchParams = useSearchParams()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        const getCourseId = searchParams.get('courseId')

        if (getCourseId) {
            setCourseId(String(getCourseId));

            const fetchCourse = async () => {
                try {
                    const response = await studentApis.getCourse(getCourseId, user?.userId);
                    console.log('ress view: ', response)
                    if (response && response?.data?.result?.course) {
                        setCourse(response.data.result?.course);
                        setChapters(response?.data?.result?.chapters)
                        if (response.data.result?.alreadyBuyed) {
                            console.log('enterd')
                            setAlreadyBuyed(true)
                        }
                    } else if (response && response?.data?.result.course) {
                        setCourse(response?.data?.result.course)
                        setChapters(response?.data?.result?.chapters)
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


    const buyCourse = async () => {
        if (!user.userId) {
            toast.warn('Please Login to buy the course')
            setTimeout(() => {
                router.push('/pages/student/login')
            }, 2000)
            return
        }
        try {
            const response = await studentApis.isVerified()
            console.log('ress: ', response)
        } catch (error: any) {
            if (error && error.response?.status === 401 && error.response.data.message === 'Student Not Verified') {
                console.log('401 log', error.response.data.message)
                toast.warn(error.response.data.message);
                setTimeout(() => {
                    window.location.replace('/pages/student/profile');
                }, 3000);
                return;
            }
            if (error && error.response?.status === 401) {
                console.log('401 log', error.response.data.message)
                toast.warn(error.response.data.message);
                await axios.post(`${USER_SERVICE_URL}/student/logout`,{},{ withCredentials: true }); // logout api
                dispatch(clearUserDetials());
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/student/login');
                }, 3000);
                return;
            }
            if (
                error &&
                error?.response?.status === 403 &&
                error?.response?.data?.message === 'Student Blocked'
            ) {
                toast.warn(error?.response?.data?.message);
                await axios.post(`${USER_SERVICE_URL}/student/logout`,{},{ withCredentials: true }); // logout api
                dispatch(clearUserDetials());
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/student/login');
                }, 3000);
                return;
            }
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

                <div className="flex flex-1 w-full px-4 py-8 md:px-4 lg:px-16">
                    {course ? (
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
                            <div className="w-full md:w-[60%] pr-6">
                                <h1 className="text-2xl font-bold text-[#323232] mb-2">{course.courseName}</h1>
                                {course.ratings ? (
                                    <p className="text-[#A7A7A7] text-sm mb-4">{course.ratings} ⭐</p>
                                ) : (
                                    <p className="text-[#7F7F7F] text-sm mb-4">⭐ ⭐ ⭐ ⭐ ⭐</p>
                                )}
                                <p className="text-[#7F7F7F] text-sm mb-6">{course.description}</p>
                                <hr className="border-t border-gray-300 my-4" />
                                <h2 className="text-lg font-semibold text-[#323232] mb-4">Chapters</h2>
                                <ul className="text-[#7F7F7F] text-sm list-disc list-inside">
                                    {chapters.map((chapter, index) => (
                                        <li key={index}>{chapter.chapterTitle}</li>
                                    ))}
                                </ul>
                                <hr className="border-t border-gray-300 my-4" />
                                <h2 className="text-lg font-semibold text-[#323232] mb-4">Course Highlights</h2>
                                <ul className="text-[#7F7F7F] text-sm list-disc list-inside">
                                    <li>Interactive video lessons</li>
                                    <li>Hands-on projects</li>
                                    <li>Certification on completion</li>
                                    <li>Lifetime access</li>
                                    <li>Expert mentors</li>
                                </ul>
                                <h2 className="text-lg font-semibold text-[#323232] mt-6 mb-4">What You&apos;ll Learn</h2>
                                <p className="text-[#7F7F7F] text-sm">
                                    Gain essential skills to excel in this field. Comprehensive lessons and hands-on exercises designed to build expertise and confidence.
                                </p>
                            </div>
                            <div className="hidden md:block border-l border-gray-300 mx-6"></div>
                            <div className="w-full md:w-[40%] flex flex-col items-center md:items-start mt-6 md:mt-0">
                                <div className="w-full h-[340px] md:w-[400px] lg:w-[500px] mb-4 rounded-[18px] shadow-[0_4px_10px_rgba(0,123,255,0.1)]">
                                    {course.thumbnailUrl && (
                                        <div className="relative w-full h-full">
                                            <video
                                                ref={videoRef}
                                                src={course.demoVideo[0].url}
                                                poster={course.thumbnailUrl}
                                                onContextMenu={(e) => e.preventDefault()}
                                                controls
                                                className="w-full h-full object-cover rounded-[18px]"
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
                                </div>
                                {alreadyBuyed ? (
                                    <button
                                        onClick={() => router.push('/pages/student/purchased-course')}
                                        className="font-semibold py-2 px-6 border border-[#22177A] bg-[#ffffff] text-gray-600 rounded-[13px] hover:bg-gray-200 transition-colors"
                                    >
                                        Enrolled
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => buyCourse()}
                                        className="bg-[#22177A] text-white rounded-[13px] font-semibold py-2 px-6"
                                    >
                                        Buy Course
                                    </button>
                                )}
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

                <Footer />
            </div>

        </>
    );
};

export default StudentViewCourse;
