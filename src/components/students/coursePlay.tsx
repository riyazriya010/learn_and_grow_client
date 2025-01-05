'use client';

import { useEffect, useRef, useState } from "react";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import LoadingModal from "../re-usable/loadingModal";
import { it } from "node:test";

interface Chapter {
    _id: string;
    chapterTitle: string;
    description: string;
    videoUrl: string;
    isCompleted: boolean;
}

interface Course {
    _id: string;
    courseName: string;
    description: string;
    category: string;
    duration: string;
    isPublished: boolean;
    thumbnailUrl: string;
    demoVideo: { url: string }[];
    fullVideo: { chapterId: string; _id: string }[];
}

const CoursePlay = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [course, setCourse] = useState<Course | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);

    // Video state variables
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [showControls, setShowControls] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const userId = '676a9f2a339270ae95450b75'; // Hardcoded for now
        const courseId = "67710140df708808ce0fd712"; // Hardcoded for now

        const fetchCourseData = async () => {
            try {
                const response = await fetch(`http://localhost:8001/course-details/${userId}/${courseId}`);
                const data = await response.json();
                console.log('ddd: ', data)
                setCourse(data.course);
                setChapters(data.chapters);
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, []);

    
    
    // this is for video pause for another tab
    useEffect(() => {
        const handleVisibilityChange = () => {
            if(document.hidden && videoRef.current && !videoRef.current.paused){
                videoRef.current.pause()
                setIsPlaying(false)
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    },[])


    const handleChapterClick = (index: number) => {
        // Allow navigation only if the current chapter is completed
        if (index === currentChapterIndex || chapters[currentChapterIndex]?.isCompleted) {
            setCurrentChapterIndex(index);
        }
    };

    const getVideoUrlForChapter = (chapterId: string): string | undefined => {
        const chapter = chapters.find((ch) => ch._id === chapterId);
        return chapter?.videoUrl;
    };

    const isAllChaptersCompleted = chapters.every((chapter) => chapter.isCompleted);

    const handleQuizButtonClick = () => {
        if (isAllChaptersCompleted) {
            console.log("Redirecting to quiz...");
        }
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVideoTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleVideoEnded = async () => {
        const chapterId = chapters[currentChapterIndex]?._id;
        if (chapterId && !chapters[currentChapterIndex]?.isCompleted) {
            try {
                console.log(`Chapter ${chapterId} completed.`);
                const response = await fetch(`http://localhost:8001/api/complete-chapter/${chapterId}`, {
                    method: 'PATCH',  // Use PATCH instead of POST for updates
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        isCompleted: true,  // Mark the chapter as completed
                    }),
                });
    
                const result = await response.json();
                if (result.success) {
                    setChapters((prev) =>
                        prev.map((chapter) =>
                            chapter._id === chapterId
                                ? { ...chapter, isCompleted: true }
                                : chapter
                        )
                    );
                } else {
                    console.error("Failed to update chapter completion");
                }
            } catch (error) {
                console.error("Error updating chapter completion:", error);
            }
        }
        setIsPlaying(false);
        setCurrentTime(0);
    };

    if (isLoading) return <LoadingModal isOpen={isLoading} message="Please Wait" />;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header>
                <Navbar />
            </header>

            <div className="flex flex-1 w-full px-4 py-8 md:px-8 lg:px-16">
                {/* Left Side */}
                <div className="w-full md:w-3/5 pr-8 border-r border-gray-300">
                    {/* Video Player */}
                    <div
                        className="relative w-full h-[340px] mb-4"
                        onMouseEnter={() => setShowControls(true)}
                        onMouseLeave={() => setShowControls(false)}
                    >
                        {course?.thumbnailUrl && (
                            <div className="relative w-full h-full bg-black">
                                <video
                                    ref={videoRef}
                                    src={getVideoUrlForChapter(chapters[currentChapterIndex]?._id || '')}
                                    poster={course.thumbnailUrl}
                                    className="w-full h-full object-cover"
                                    onTimeUpdate={handleVideoTimeUpdate}
                                    onContextMenu={(e) => e.preventDefault()}
                                    onEnded={handleVideoEnded}
                                />
                                {showControls && (
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4">
                                        <button onClick={handlePlayPause} className="bg-black text-gray-300 p-2 rounded">
                                            {isPlaying ? "Pause" : "Play"}
                                        </button>
                                        <span className="text-gray-300">{Math.floor(currentTime)}s</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Course Description */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-2">{course?.courseName}</h2>
                        <p className="text-gray-700 mb-2">{course?.description}</p>
                        <p className="text-sm text-gray-500">Category: {course?.category}</p>
                        <p className="text-sm text-gray-500">Duration: {course?.duration}</p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-2/5 pl-8">
                    <h3 className="text-lg font-bold mb-4">Chapters</h3>
                    <div className="space-y-4">
                        {chapters.map((chapter, index) => (
                            <div
                                key={chapter._id}
                                className={`p-4 rounded-lg border shadow-sm transition-colors ${index === currentChapterIndex
                                    ? "border-blue-500 text-blue-500 bg-blue-50"
                                    : chapter.isCompleted
                                        ? "border-green-500 text-green-500 bg-green-50"
                                        : "border-gray-300 bg-white"
                                    }`}

                                onClick={() => handleChapterClick(index)}
                            >
                                <h4 className="font-semibold mb-1">{chapter.chapterTitle}</h4>
                                <p className="text-sm">{chapter.description}</p>
                                {chapter.isCompleted && <span className="text-green-500">Completed</span>}
                                {index === currentChapterIndex && <span className="text-blue-500">Currently Watching</span>}
                            </div>
                        ))}

                        <button
                            onClick={handleQuizButtonClick}
                            disabled={!isAllChaptersCompleted}
                            className={`w-full py-2 px-4 mt-4 rounded text-white ${isAllChaptersCompleted ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            {isAllChaptersCompleted ? "Start Quiz" : "Complete All Chapters to Unlock Quiz"}
                        </button>
                    </div>
                </div>
            </div>

            <MentorFooter />
        </div>
    );
};

export default CoursePlay;




////////////////////////////////////////



// 'use client';

// import { useEffect, useRef, useState } from "react";
// import MentorFooter from "../mentors/footer";
// import Navbar from "../navbar";
// import { studentApis } from "@/api/studentApi";
// import LoadingModal from "../loadingModal";

// interface Chapter {
//     _id: string;
//     chapterTitle: string;
//     description: string;
//     videoUrl: string;
//     isCompleted: boolean;
// }

// interface Course {
//     _id: string;
//     courseName: string;
//     description: string;
//     category: string;
//     duration: string;
//     isPublished: boolean;
//     thumbnailUrl: string;
//     demoVideo: { url: string }[];
//     fullVideo: { chapterId: string; _id: string }[]; // No videoUrl here, just chapterId
// }

// const CoursePlay = () => {
//     const [courseId, setCourseId] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [course, setCourse] = useState<Course | null>(null);
//     const [chapters, setChapters] = useState<Chapter[]>([]);
//     const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);


//     // this is video's state variables
//     const [isPlaying, setIsPlaying] = useState<boolean>(false);
//     const [showControls, setShowControls] = useState<boolean>(false);
//     const [currentTime, setCurrentTime] = useState<number>(0);
//     const videoRef = useRef<HTMLVideoElement | null>(null);


//  // this is for whole page functions
//     useEffect(() => {
//         const userId = '676a9f2a339270ae95450b75'
//         const courseId = "67710140df708808ce0fd712"; // Hardcoded for now

//         if (courseId) {
//             setCourseId(courseId);

//             const fetchCourseData = async (id: string) => {
//                 try {
//                     // Fetching course details
//                     const courseResponse = await studentApis.getCourse(id);
//                     if (courseResponse?.data?.data) {
//                         setCourse(courseResponse.data.data);
//                     }

//                     // Fetching chapters from the API
//                     const chapterResponse = await studentApis.getChapters();
//                     if (chapterResponse?.data?.data?.chapters) {
//                         setChapters(chapterResponse.data.data.chapters);
//                     }
//                 } catch (error: any) {
//                     console.error("Error fetching course details:", error);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };

//             fetchCourseData(courseId);
//         } else {
//             setIsLoading(false);
//         }
//     }, []);

//     const handleChapterClick = (index: number) => {
//         // Allow navigation only if the current chapter is completed
//         if (index === currentChapterIndex || chapters[currentChapterIndex]?.isCompleted) {
//             setCurrentChapterIndex(index);
//         }
//     };

//     const getVideoUrlForChapter = (chapterId: string): string | undefined => {
//         const chapterVideo = course?.fullVideo.find((video) => video.chapterId === chapterId);
//         const chapter = chapters.find((ch) => ch._id === chapterVideo?.chapterId);
//         return chapter?.videoUrl;
//     };

//     const isAllChaptersCompleted = chapters.every((chapter) => chapter.isCompleted);

//     const handleQuizButtonClick = () => {
//         // Redirect to quiz if all chapters are completed
//         if (isAllChaptersCompleted) {
//             // Replace with actual routing logic
//             console.log("Redirecting to quiz...");
//         }
//     };


//     // This is for video functions
//     const handlePlayPause = () => {
//         if (videoRef.current) {
//             if (isPlaying) {
//                 videoRef.current.pause();
//             } else {
//                 videoRef.current.play();
//             }
//             setIsPlaying(!isPlaying);
//         }
//     };

//     const handleVideoTimeUpdate = () => {
//         if (videoRef.current) {
//             setCurrentTime(videoRef.current.currentTime);
//         }
//     };

//     const handleVideoEnded = async () => {
//         const chapterId = course?.fullVideo[currentChapterIndex]?.chapterId;
//         if (chapterId) {
//             const chapter = chapters.find((ch) => ch._id === chapterId);
//             if (chapter && !chapter.isCompleted) {
//                 try {
//                     console.log(`Chapter ${chapterId} completed.`);
//                     // Update chapter completion via API
//                     // setChapters((prev) =>
//                     //     prev.map((chapter) =>
//                     //         chapter._id === chapterId
//                     //             ? { ...chapter, isCompleted: true }
//                     //             : chapter
//                     //     )
//                     // );

//                     // const response = await studentApis.updateChaperCompletion(chapterId)
//                     // if(response){
//                     //     console.log('res: ', response)
//                     // }
//                 } catch (error) {
//                     console.error("Error updating chapter completion:", error);
//                 }
//             }
//         }
//         // Reset video state
//         setIsPlaying(false);
//         setCurrentTime(0);
//     };


    
//     if (isLoading) return <LoadingModal isOpen={isLoading} message="Please Wait" />;

//     return (
//         <div className="flex flex-col min-h-screen bg-white">
//             <header>
//                 <Navbar />
//             </header>

//             <div className="flex flex-1 w-full px-4 py-8 md:px-8 lg:px-16">
//                 {/* Left Side */}
//                 <div className="w-full md:w-3/5 pr-8 border-r border-gray-300">
//                     {/* Video Player */}
//                     <div
//                         className="relative w-full h-[340px] mb-4"
//                         onMouseEnter={() => setShowControls(true)}
//                         onMouseLeave={() => setShowControls(false)}
//                     >
//                         {course?.thumbnailUrl && (
//                             <div className="relative w-full h-full bg-black">
//                                 <video
//                                     ref={videoRef}
//                                     src={getVideoUrlForChapter(course?.fullVideo[currentChapterIndex]?.chapterId || '')}
//                                     poster={course.thumbnailUrl}
//                                     className="w-full h-full object-cover"
//                                     onTimeUpdate={handleVideoTimeUpdate}
//                                     onEnded={handleVideoEnded}
//                                 />
//                                 {showControls && (
//                                     <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4">
//                                         <button onClick={handlePlayPause} className="bg-black text-gray-300 p-2 rounded">
//                                             {isPlaying ? "Pause" : "Play"}
//                                         </button>
//                                         <span className="text-gray-300">{Math.floor(currentTime)}s</span>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Course Description */}
//                     <div className="mb-4">
//                         <h2 className="text-xl font-bold mb-2">{course?.courseName}</h2>
//                         <p className="text-gray-700 mb-2">{course?.description}</p>
//                         <p className="text-sm text-gray-500">Category: {course?.category}</p>
//                         <p className="text-sm text-gray-500">Duration: {course?.duration}</p>
//                     </div>
//                 </div>

//                 {/* Right Side */}
//                 <div className="w-full md:w-2/5 pl-8">
//                     <h3 className="text-lg font-bold mb-4">Chapters</h3>
//                     <div className="space-y-4">
//                         {chapters.map((chapter, index) => {
//                             const isCurrentChapter = index === currentChapterIndex;
//                             const isLocked = index > currentChapterIndex && !chapters[index - 1]?.isCompleted;

//                             return (
//                                 <div
//                                     key={chapter._id}
//                                     className={`p-4 rounded-lg border shadow-sm transition-colors ${isLocked
//                                         ? "border-gray-400 text-gray-400 cursor-not-allowed bg-gray-100"
//                                         : isCurrentChapter
//                                             ? "border-blue-500 text-blue-500 bg-blue-50"
//                                             : chapter.isCompleted
//                                                 ? "border-green-500 text-green-500 bg-green-50"
//                                                 : "border-gray-300 bg-white"
//                                         }`}
//                                     onClick={() => !isLocked && handleChapterClick(index)}
//                                 >
//                                     <h4 className="font-semibold mb-1">{chapter.chapterTitle}</h4>
//                                     <p className="text-sm">{chapter.description}</p>
//                                     {chapter.isCompleted && <span className="text-green-500">Completed</span>}
//                                     {isCurrentChapter && <span className="text-blue-500">Currently Watching</span>}
//                                     {isLocked && <span className="text-gray-400">Locked</span>}
//                                 </div>
//                             );
//                         })}

//                         <button
//                             onClick={handleQuizButtonClick}
//                             disabled={!isAllChaptersCompleted}
//                             className={`w-full py-2 px-4 mt-4 rounded text-white ${isAllChaptersCompleted ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
//                         >
//                             {isAllChaptersCompleted ? "Start Quiz" : "Complete All Chapters to Unlock Quiz"}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <MentorFooter />
//         </div>
//     );
// };

// export default CoursePlay;






//////////////////////////////////////////

                                            // Main Importtant and Original

// 'use client';

// import { useEffect, useRef, useState } from "react";
// import MentorFooter from "../mentors/footer";
// import Navbar from "../navbar";
// import { studentApis } from "@/api/studentApi";
// import LoadingModal from "../loadingModal";

// interface Chapter {
//     _id: string;
//     chapterTitle: string;
//     description: string;
//     videoUrl: string;
//     isCompleted: boolean;
// }

// interface Course {
//     _id: string;
//     courseName: string;
//     description: string;
//     category: string;
//     duration: string;
//     isPublished: boolean;
//     thumbnailUrl: string;
//     demoVideo: { url: string }[];
//     fullVideo: { chapterId: string; _id: string }[]; // No videoUrl here, just chapterId
// }

// const CoursePlay = () => {
//     const [courseId, setCourseId] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [course, setCourse] = useState<Course | null>(null);
//     const [chapters, setChapters] = useState<Chapter[]>([]);
//     const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);


//     useEffect(() => {
//         const courseId = "67713238c901f382c99d8a46"; // Hardcoded for now

//         if (courseId) {
//             setCourseId(courseId);

//             const fetchCourseData = async (id: string) => {
//                 try {
//                     // Fetching course details
//                     const courseResponse = await studentApis.getCourse(id);
//                     if (courseResponse?.data?.data) {
//                         setCourse(courseResponse.data.data);
//                     }

//                     // Fetching chapters from the API
//                     const chapterResponse = await studentApis.getChapters();
//                     if (chapterResponse?.data?.data?.chapters) {
//                         setChapters(chapterResponse.data.data.chapters); // Set chapters from the API response
//                     }
//                 } catch (error: any) {
//                     console.error("Error fetching course details:", error);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };

//             fetchCourseData(courseId);
//         } else {
//             setIsLoading(false);
//         }
//     }, []);

//     const handleChapterClick = (index: number) => {
//         // Prevent navigating to the next chapter unless the current one is completed
//         if (chapters[currentChapterIndex]?.isCompleted || index === currentChapterIndex) {
//             setCurrentChapterIndex(index);
//         }
//     };

//     const getVideoUrlForChapter = (chapterId: string): string | undefined => {
//         const chapterVideo = course?.fullVideo.find((video) => video.chapterId === chapterId);
//         if (chapterVideo) {
//             const chapter = chapters.find((ch) => ch._id === chapterVideo.chapterId);
//             return chapter?.videoUrl;
//         }
//         return undefined;
//     };


//     const isAllChaptersCompleted = chapters.every(chapter => chapter.isCompleted);

//     const handleQuizButtonClick = () => {
//         // if (course?.quizId) {
//         //   router.push(`/quiz/${course.quizId}`);
//         // }
//     };


//     if (isLoading) return <LoadingModal isOpen={isLoading} message="Please Wait" />;

//     return (
//         <div className="flex flex-col min-h-screen bg-white">
//             <header>
//                 <Navbar />
//             </header>

//             <div className="flex flex-1 w-full px-4 py-8 md:px-8 lg:px-16">
//                 {/* Left Side */}
//                 <div className="w-full md:w-3/5 pr-8 border-r border-gray-300">
//                     {/* Video Player */}
//                     <div className="w-full h-[340px] w-[500px] mb-4">
//                         {course?.thumbnailUrl && (
//                             <div className="relative w-full h-full bg-black">
//                                 <video
//                                     src={getVideoUrlForChapter(course?.fullVideo[currentChapterIndex]?.chapterId || '')}
//                                     poster={course.thumbnailUrl}
//                                     controls
//                                     className="w-full h-full object-cover"
//                                     controlsList="nodownload"
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     {/* Course Description */}
//                     <div className="mb-4">
//                         <h2 className="text-xl font-bold mb-2">{course?.courseName}</h2>
//                         <p className="text-gray-700 mb-2">{course?.description}</p>
//                         <p className="text-sm text-gray-500">Category: {course?.category}</p>
//                         <p className="text-sm text-gray-500">Duration: {course?.duration}</p>
//                     </div>
//                 </div>

//                 {/* Right Side */}
//                 <div className="w-full md:w-2/5 pl-8">
//                     <h3 className="text-lg font-bold mb-4">Chapters</h3>
//                     <div className="space-y-4">
//                         {chapters.map((chapter, index) => {
//                             const isCurrentChapter = index === currentChapterIndex;
//                             const isCompleted = chapter.isCompleted;
//                             const isLocked = index > currentChapterIndex && !chapters[index - 1]?.isCompleted;

//                             return (
//                                 <div
//                                     key={chapter._id}
//                                     className={`p-4 rounded-lg border shadow-sm transition-colors ${isLocked
//                                         ? "border-gray-400 text-gray-400 cursor-not-allowed bg-gray-100"
//                                         : isCurrentChapter
//                                             ? "border-blue-500 text-blue-500 bg-blue-50"
//                                             : isCompleted
//                                                 ? "border-green-500 text-green-500 bg-green-50"
//                                                 : "border-gray-300 bg-white"
//                                         }`}
//                                     onClick={() => !isLocked && handleChapterClick(index)}
//                                 >
//                                     <h4 className="font-semibold mb-1">{chapter.chapterTitle}</h4>
//                                     <p className="text-sm">{chapter.description}</p>
//                                     {isCompleted && <span className="text-green-500">Watched</span>}
//                                     {isCurrentChapter && <span className="text-blue-500">Currently Watching</span>}
//                                     {isLocked && <span className="text-gray-400">Locked</span>}
//                                 </div>
//                             );
//                         })}

//                         <button
//                             onClick={handleQuizButtonClick}
//                             disabled={!isAllChaptersCompleted}
//                             className={`w-full py-2 px-4 mt-4 rounded text-white ${isAllChaptersCompleted ? 'bg-[#433D8B] hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'
//                                 }`}
//                         >
//                             {isAllChaptersCompleted ? "Start Quiz" : "Complete All Chapters to Unlock Quiz"}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <MentorFooter />
//         </div>
//     );
// };

// export default CoursePlay;



//////////////////////////////////////////////////////////////




// 'use client';

// import { useEffect, useRef, useState } from "react";
// import MentorFooter from "../mentors/footer";
// import Navbar from "../navbar";
// import { studentApis } from "@/api/studentApi";
// import LoadingModal from "../loadingModal";

// interface Chapter {
//     _id: string;
//     chapterTitle: string;
//     description: string;
//     videoUrl: string;
//     isCompleted: boolean;
// }

// interface Course {
//     _id: string;
//     courseName: string;
//     description: string;
//     category: string;
//     duration: string;
//     isPublished: boolean;
//     thumbnailUrl: string;
//     demoVideo: { url: string }[];
//     fullVideo: { chapterId: string; _id: string }[]; // No videoUrl here, just chapterId
// }

// const CoursePlay = () => {
//     const [courseId, setCourseId] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [course, setCourse] = useState<Course | null>(null);
//     const [chapters, setChapters] = useState<Chapter[]>([]);
//     const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
//     const [videoWatchedTime, setVideoWatchedTime] = useState<number>(0);
//     const videoRef = useRef<HTMLVideoElement | null>(null);

//     useEffect(() => {
//         const courseId = "67713238c901f382c99d8a46"; // Hardcoded for now

//         if (courseId) {
//             setCourseId(courseId);

//             const fetchCourseData = async (id: string) => {
//                 try {
//                     // Fetching course details
//                     const courseResponse = await studentApis.getCourse(id);
//                     if (courseResponse?.data?.data) {
//                         setCourse(courseResponse.data.data);
//                     }

//                     // Fetching chapters from the API
//                     const chapterResponse = await studentApis.getChapters();
//                     if (chapterResponse?.data?.data?.chapters) {
//                         setChapters(chapterResponse.data.data.chapters); // Set chapters from the API response
//                     }
//                 } catch (error: any) {
//                     console.error("Error fetching course details:", error);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };

//             fetchCourseData(courseId);
//         } else {
//             setIsLoading(false);
//         }
//     }, []);

//     const handleChapterClick = (index: number) => {
//         // Prevent navigating to the next chapter unless the current one is completed
//         if (chapters[currentChapterIndex]?.isCompleted || index === currentChapterIndex) {
//             setCurrentChapterIndex(index);
//             setVideoWatchedTime(0); // Reset watched time when changing chapters
//         }
//     };

//     const getVideoUrlForChapter = (chapterId: string): string | undefined => {
//         const chapterVideo = course?.fullVideo.find((video) => video.chapterId === chapterId);
//         if (chapterVideo) {
//             const chapter = chapters.find((ch) => ch._id === chapterVideo.chapterId);
//             return chapter?.videoUrl;
//         }
//         return undefined;
//     };

//     const handleTimeUpdate = () => {
//         if (videoRef.current) {
//             const currentTime = videoRef.current.currentTime;
//             const duration = videoRef.current.duration;

//             setVideoWatchedTime(currentTime);

//             // Check if the user has watched at least 90% of the video
//             if (currentTime >= duration * 0.9) {
//                 // Mark chapter as completed
//                 const updatedChapters = [...chapters];
//                 updatedChapters[currentChapterIndex].isCompleted = true;
//                 setChapters(updatedChapters);
//             }
//         }
//     };

//     const isAllChaptersCompleted = chapters.every(chapter => chapter.isCompleted);

//     const handleQuizButtonClick = () => {
//         // if (course?.quizId) {
//         //   router.push(`/quiz/${course.quizId}`);
//         // }
//     };

//     if (isLoading) return <LoadingModal isOpen={isLoading} message="Please Wait" />;

//     return (
//         <div className="flex flex-col min-h-screen bg -white">
//             <header>
//                 <Navbar />
//             </header>

//             <div className="flex flex-1 w-full px-4 py-8 md:px-8 lg:px-16">
//                 {/* Left Side */}
//                 <div className="w-full md:w-3/5 pr-8 border-r border-gray-300">
//                     {/* Video Player */}
//                     <div className="w-full h-[340px] w-[500px] mb-4">
//                         {course?.thumbnailUrl && (
//                             <div className="relative w-full h-full bg-black">
//                                 <video
//                                     ref={videoRef}
//                                     src={getVideoUrlForChapter(course?.fullVideo[currentChapterIndex]?.chapterId || '')}
//                                     poster={course.thumbnailUrl}
//                                     controls
//                                     className="w-full h-full object-cover"
//                                     controlsList="nodownload"
//                                     onTimeUpdate={handleTimeUpdate}
//                                     onEnded={() => {
//                                         const updatedChapters = [...chapters];
//                                         updatedChapters[currentChapterIndex].isCompleted = true;
//                                         setChapters(updatedChapters);
//                                     }}
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     {/* Course Description */}
//                     <div className="mb-4">
//                         <h2 className="text-xl font-bold mb-2">{course?.courseName}</h2>
//                         <p className="text-gray-700 mb-2">{course?.description}</p>
//                         <p className="text-sm text-gray-500">Category: {course?.category}</p>
//                         <p className="text-sm text-gray-500">Duration: {course?.duration}</p>
//                     </div>
//                 </div>

//                 {/* Right Side */}
//                 <div className="w-full md:w-2/5 pl-8">
//                     <h3 className="text-lg font-bold mb-4">Chapters</h3>
//                     <div className="space-y-4">
//                         {chapters.map((chapter, index) => {
//                             const isCurrentChapter = index === currentChapterIndex;
//                             const isCompleted = chapter.isCompleted;
//                             const isLocked = index > currentChapterIndex && !chapters[index - 1]?.isCompleted;

//                             return (
//                                 <div
//                                     key={chapter._id}
//                                     className={`p-4 rounded-lg border shadow-sm transition-colors ${isLocked
//                                         ? "border-gray-400 text-gray-400 cursor-not-allowed bg-gray-100"
//                                         : isCurrentChapter
//                                             ? "border-blue-500 text-blue-500 bg-blue-50"
//                                             : isCompleted
//                                                 ? "border-green-500 text-green-500 bg-green-50"
//                                                 : "border-gray-300 bg-white"
//                                         }`}
//                                     onClick={() => !isLocked && handleChapterClick(index)}
//                                 >
//                                     <h4 className="font-semibold mb-1">{chapter.chapterTitle}</h4>
//                                     <p className="text-sm">{chapter.description}</p>
//                                     {isCompleted && <span className="text-green-500">Watched</span>}
//                                     {isCurrentChapter && <span className="text-blue-500">Currently Watching</span>}
//                                     {isLocked && <span className="text-gray-400">Locked</span>}
//                                 </div>
//                             );
//                         })}

//                         <button
//                             onClick={handleQuizButtonClick}
//                             disabled={!isAllChaptersCompleted}
//                             className={`w-full py-2 px-4 mt-4 rounded text-white ${isAllChaptersCompleted ? 'bg-[#433D8B] hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'
//                                 }`}
//                         >
//                             {isAllChaptersCompleted ? "Start Quiz" : "Complete All Chapters to Unlock Quiz"}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <MentorFooter />
//         </div>
//     );
// };

// export default CoursePlay;









/////////////////////////////////////////////////////////////////////////





// 'use client';

// import { useEffect, useRef, useState } from "react";
// import ReactPlayer from "react-player";
// import MentorFooter from "../mentors/footer";
// import Navbar from "../navbar";
// import { studentApis } from "@/api/studentApi";
// import LoadingModal from "../loadingModal";

// interface Chapter {
//     _id: string;
//     chapterTitle: string;
//     description: string;
//     videoUrl: string;
//     isCompleted: boolean;
// }

// interface Course {
//     _id: string;
//     courseName: string;
//     description: string;
//     category: string;
//     duration: string;
//     isPublished: boolean;
//     thumbnailUrl: string;
//     demoVideo: { url: string }[];
//     fullVideo: { chapterId: string; _id: string }[];
// }

// const CoursePlay = () => {
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [course, setCourse] = useState<Course | null>(null);
//     const [chapters, setChapters] = useState<Chapter[]>([]);
//     const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
//     const [playedSeconds, setPlayedSeconds] = useState<number>(0); // Track progress
//     const [countdown, setCountdown] = useState<number>(1); // Countdown timer
//     const [isPlaying, setIsPlaying] = useState<boolean>(false); // Track play/pause state
//     const playerRef = useRef<ReactPlayer | null>(null);
//     const countdownInterval = useRef<NodeJS.Timeout | null>(null);

//     useEffect(() => {
//         const courseId = "67713238c901f382c99d8a46"; // Hardcoded for now

//         if (courseId) {
//             const fetchCourseData = async (id: string) => {
//                 try {
//                     const courseResponse = await studentApis.getCourse(id);
//                     if (courseResponse?.data?.data) {
//                         setCourse(courseResponse.data.data);
//                     }

//                     const chapterResponse = await studentApis.getChapters();
//                     if (chapterResponse?.data?.data?.chapters) {
//                         setChapters(chapterResponse.data.data.chapters);
//                     }
//                 } catch (error: any) {
//                     console.error("Error fetching course details:", error);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };

//             fetchCourseData(courseId);
//         } else {
//             setIsLoading(false);
//         }

//         // Check if countdown was paused and resume from saved time
//         const savedCountdown = localStorage.getItem("countdown");
//         if (savedCountdown) {
//             setCountdown(Number(savedCountdown));
//         }

//         return () => {
//             if (countdownInterval.current) {
//                 clearInterval(countdownInterval.current);
//             }
//         };
//     }, []);

//     const handlePlay = () => {
//         setIsPlaying(true);
//         startCountdown();
//     };

//     const handlePause = () => {
//         setIsPlaying(false);
//         clearInterval(countdownInterval.current!); // Clear the countdown when paused
//         localStorage.setItem("countdown", countdown.toString()); // Save the countdown to localStorage
//     };

//     const handleVideoEnded = () => {
//         const updatedChapters = [...chapters];
//         updatedChapters[currentChapterIndex].isCompleted = true;
//         setChapters(updatedChapters);

//         // Automatically proceed to the next chapter if available
//         if (currentChapterIndex < chapters.length - 1) {
//             setCurrentChapterIndex(currentChapterIndex + 1);
//         }
//     };

//     const handleProgress = (state: { playedSeconds: number }) => {
//         setPlayedSeconds(state.playedSeconds);
//     };

//     const handleDuration = (duration: number) => {
//         // Handle video duration (optional)
//     };

//     const startCountdown = () => {
//         if (countdownInterval.current) {
//             clearInterval(countdownInterval.current); // Clear existing interval
//         }
//         countdownInterval.current = setInterval(() => {
//             setCountdown((prev) => {
//                 if (prev < 1) {
//                     clearInterval(countdownInterval.current!); // Stop countdown once it reaches 1
//                     return 1;
//                 }
//                 return prev + 1;
//             });
//         }, 1000);
//     };

//     const currentVideoUrl = chapters[currentChapterIndex]?.videoUrl || "";

//     if (isLoading) return <LoadingModal isOpen={isLoading} message="Please Wait" />;

//     return (
//         <div className="flex flex-col min-h-screen bg-white">
//             <header>
//                 <Navbar />
//             </header>

//             <div className="flex flex-1 w-full px-4 py-8 md:px-8 lg:px-16">
//                 {/* Left Side */}
//                 <div className="w-full md:w-3/5 pr-8 border-r border-gray-300">
//                     {/* Video Player */}
//                     <div className="w-full h-[340px] mb-4 relative">
//                         <ReactPlayer
//                             ref={playerRef}
//                             url={currentVideoUrl}
//                             controls={false} // Hide default controls
//                             width="100%"
//                             height="100%"
//                             playing={isPlaying}
//                             onProgress={handleProgress}
//                             onEnded={handleVideoEnded}
//                             onDuration={handleDuration}
//                         />

//                         {/* Custom Controls */}
//                         <div className="absolute bottom-4 left-4 text-white z-10">
//                             <span>Countdown: {countdown}</span>
//                         </div>
//                     </div>

//                     {/* Custom Controls */}
//                     <div className="flex items-center justify-center mt-4 space-x-4">
//                         <button
//                             onClick={handlePause}
//                             className="px-4 py-2 bg-gray-800 text-white rounded"
//                         >
//                             Pause
//                         </button>
//                         <button
//                             onClick={handlePlay}
//                             className="px-4 py-2 bg-gray-800 text-white rounded"
//                         >
//                             Play
//                         </button>
//                     </div>

//                     {/* Course Description */}
//                     <div className="mb-4">
//                         <h2 className="text-xl font-bold mb-2">{course?.courseName}</h2>
//                         <p className="text-gray-700 mb-2">{course?.description}</p>
//                         <p className="text-sm text-gray-500">Category: {course?.category}</p>
//                         <p className="text-sm text-gray-500">Duration: {course?.duration}</p>
//                     </div>
//                 </div>

//                 {/* Right Side */}
//                 <div className="w-full md:w-2/5 pl-8">
//                     <h3 className="text-lg font-bold mb-4">Chapters</h3>
//                     <div className="space-y-4">
//                         {chapters.map((chapter, index) => {
//                             const isCurrentChapter = index === currentChapterIndex;
//                             const isCompleted = chapter.isCompleted;
//                             const isLocked =
//                                 index > currentChapterIndex &&
//                                 !chapters[index - 1]?.isCompleted;

//                             return (
//                                 <div
//                                     key={chapter._id}
//                                     className={`p-4 rounded-lg border shadow-sm transition-colors ${
//                                         isLocked
//                                             ? "border-gray-400 text-gray-400 cursor-not-allowed bg-gray-100"
//                                             : isCurrentChapter
//                                             ? "border-blue-500 text-blue-500 bg-blue-50"
//                                             : isCompleted
//                                             ? "border-green-500 text-green-500 bg-green-50"
//                                             : "border-gray-300 bg-white"
//                                     }`}
//                                     onClick={() =>
//                                         !isLocked && setCurrentChapterIndex(index)
//                                     }
//                                 >
//                                     <h4 className="font-semibold mb-1">
//                                         {chapter.chapterTitle}
//                                     </h4>
//                                     <p className="text-sm">{chapter.description}</p>
//                                     {isCompleted && <span className="text-green-500">Watched</span>}
//                                     {isCurrentChapter && (
//                                         <span className="text-blue-500">
//                                             Currently Watching
//                                         </span>
//                                     )}
//                                     {isLocked && <span className="text-gray-400">Locked</span>}
//                                 </div>
//                             );
//                         })}

//                         <button
//                             disabled={!chapters.every((ch) => ch.isCompleted)}
//                             className={`w-full py-2 px-4 mt-4 rounded text-white ${
//                                 chapters.every((ch) => ch.isCompleted)
//                                     ? "bg-[#433D8B] hover:bg-opacity-90"
//                                     : "bg-gray-400 cursor-not-allowed"
//                             }`}
//                         >
//                             {chapters.every((ch) => ch.isCompleted)
//                                 ? "Start Quiz"
//                                 : "Complete All Chapters to Unlock Quiz"}
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <MentorFooter />
//         </div>
//     );
// };

// export default CoursePlay;
