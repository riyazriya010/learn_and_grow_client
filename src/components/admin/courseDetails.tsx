'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import AdminHeader from "./header";
import AdminFooter from "./footer";
import { ADMIN_SERVICE_URL } from "@/utils/constant";

const CourseDetails = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");

    const [chapters, setChapters] = useState<any[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        if (courseId) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${ADMIN_SERVICE_URL}/get/non-approved/course-details?courseId=${courseId}`, {
                        withCredentials: true
                    });
                    console.log('res chap ', response);
                    setChapters(response.data.result);
                } catch (error) {
                    console.log("Error fetching chapters:", error);
                }
            };
            fetchData();
        }
    }, [courseId]);

    const handleApprove = async () => {
        try {
            console.log(courseId)
            const response = await axios.patch(`${ADMIN_SERVICE_URL}/approve/course?courseId=${courseId}`, {}, {
                withCredentials: true
            });
            if (response) {
                setIsApproved(true);
                router.replace('/pages/approve-course')
            }
        } catch (error) {
            console.log("Error approving course:", error);
        }
    };

    const selectVideo = (url: string) => {
        console.log('Selected Video URL:', url);
        setSelectedVideo(url);
    };

    return (
        <>


            <div className="flex flex-col min-h-screen bg-white">
                <AdminHeader />

                {/* Main Content Wrapper */}
                <div className="flex-grow max-w-6xl mx-auto p-8">
                    {/* Check if chapters exist */}
                    {chapters.length === 0 ? (
                        <p className="text-center text-xl font-semibold text-gray-800">No chapters found</p>
                    ) : (
                        <>
                            {/* Header Section */}
                            <div className="flex justify-between items-center bg-gray-50 p-6 rounded-lg shadow-md">
                                <h1 className="text-3xl font-bold text-gray-800">Course Details</h1>
                                {!isApproved ? (
                                    <button
                                        onClick={handleApprove}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition"
                                    >
                                        ✅ Approve Course
                                    </button>
                                ) : (
                                    <span className="text-green-600 text-lg font-semibold">Course Approved ✅</span>
                                )}
                            </div>

                            {/* Main Content */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                                {/* Chapter List */}
                                <div className="bg-gray-50 shadow-md rounded-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">📖 Chapters</h2>
                                    <ul className="space-y-3">
                                        {chapters.map((chapter) => (
                                            <li
                                                key={chapter._id}
                                                className={`p-4 border rounded-lg cursor-pointer transition 
                                    ${selectedVideo === chapter.videoUrl ? "bg-blue-100 font-semibold border-blue-500" : "hover:bg-gray-100"}`}
                                                onClick={() => selectVideo(chapter.videoUrl)}
                                            >
                                                {chapter.chapterTitle}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Video Player */}
                                <div className="col-span-2 bg-gray-50 shadow-md rounded-lg p-6 flex items-center justify-center">
                                    {selectedVideo ? (
                                        <div className="w-full">
                                            <video
                                                key={selectedVideo} // Forces re-render when URL changes
                                                controls
                                                className="w-full h-72 rounded-lg shadow-lg"
                                                onContextMenu={(e) => e.preventDefault()}
                                                controlsList="nodownload"
                                                disablePictureInPicture
                                            >
                                                <source src={selectedVideo} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-lg">🎥 Select a chapter to watch the video</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Stays at Bottom */}
                <AdminFooter />
            </div>



        </>
    );
};

export default CourseDetails;
