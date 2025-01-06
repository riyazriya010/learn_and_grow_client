'use client';

import { useEffect, useRef, useState } from "react";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import LoadingModal from "../re-usable/loadingModal";
import { useRouter, useSearchParams } from "next/navigation";
import { studentApis } from "@/app/api/studentApi";

interface Chapter {
    _id: string;
    chapterTitle: string;
    description: string;
    videoUrl: string;
}

interface CompletedChapter {
    chapterId: string;
    isCompleted: boolean;
}

interface PurchasedCourse {
    _id: string;
    completedChapters: CompletedChapter[];
    isCourseCompleted: boolean;
}

interface Course {
    _id: string;
    courseName: string;
    description: string;
    category: string;
    duration: string;
    level: string;
    isPublished: boolean;
    thumbnailUrl: string;
    demoVideo: { url: string }[];
    fullVideo: { chapterId: string; _id: string }[];
}

const CoursePlay = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [course, setCourse] = useState<Course | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [purchasedCourse, setPurchasedCourse] = useState<PurchasedCourse | null>(null);
    const [courseId, setCourseId] = useState<string | null>(null);
    const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
    const searchParams = useSearchParams();
    const router = useRouter()

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [showControls, setShowControls] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const buyedId = searchParams.get("buyedId");
        if (buyedId) {
            const fetchCourseData = async () => {
                try {
                    const response = await studentApis.coursePlay(buyedId);
                    const data = response.data.data;

                    setChapters(data.chapters);
                    setCourse(data.course);
                    setPurchasedCourse(data.purchasedCourse);
                    setCourseId(data?.purchasedCourse?.courseId?._id)
                } catch (error) {
                    console.error("Error fetching course data:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCourseData();
        }
    }, []);



    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && videoRef.current && !videoRef.current.paused) {
                videoRef.current.pause()
                setIsPlaying(false)
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])



    const handleChapterClick = (index: number) => {
        const currentChapter = purchasedCourse?.completedChapters[currentChapterIndex];
        const clickedChapter = purchasedCourse?.completedChapters.find(
            (ch) => ch.chapterId === chapters[index]._id
        );
        if (
            index === currentChapterIndex || // Allow the current chapter to be watched again.
            (clickedChapter?.isCompleted) || // Allow previously completed chapters.
            (index === currentChapterIndex + 1 && currentChapter?.isCompleted) // Allow the next chapter if the current chapter is completed.
        ) {
            setCurrentChapterIndex(index);
            setIsPlaying(false);
        }
    };


    const getVideoUrlForChapter = (chapterId: string): string | undefined => {
        const chapter = chapters.find((ch) => ch._id === chapterId);
        return chapter?.videoUrl;
    };

    const isAllChaptersCompleted = purchasedCourse?.completedChapters.every((ch) => ch.isCompleted);

    const handleQuizButtonClick = () => {
        if (isAllChaptersCompleted) {
            // console.log("Redirecting to quiz...", courseId);
            router.push(`/pages/student/quizz?courseId=${courseId}`)
        }
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            isPlaying ? videoRef.current.pause() : videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleVideoEnd = async () => {
        const chapterId = chapters[currentChapterIndex]?._id;
        if (chapterId && !purchasedCourse?.completedChapters[currentChapterIndex]?.isCompleted) {
            try {
                const response = await studentApis.chapterVideoEnd(chapterId);
                const updatedData = response.data.data;

                setPurchasedCourse(updatedData);
            } catch (error) {
                console.error("Error marking chapter as completed:", error);
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
                                    src={getVideoUrlForChapter(chapters[currentChapterIndex]?._id || "")}
                                    poster={course.thumbnailUrl}
                                    className="w-full h-full object-cover"
                                    onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                                    onContextMenu={(e) => e.preventDefault()}
                                    onEnded={handleVideoEnd}
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
                        <p className="text-sm text-gray-500 mb-2">Category: {course?.category}</p>
                        <p className="text-sm text-gray-500 mb-2">Level: {course?.level}</p>
                        <p className="text-sm text-gray-500">Duration: {course?.duration}</p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-2/5 pl-8">
                    <h3 className="text-lg font-bold mb-4">Chapters</h3>
                    <div className="space-y-4">
                        {chapters.map((chapter, index) => {
                            const completedChapter = purchasedCourse?.completedChapters.find(
                                (ch) => ch.chapterId === chapter._id
                            );

                            return (
                                <div
                                    key={chapter._id}
                                    className={`p-4 rounded-lg border shadow-sm transition-colors cursor-pointer ${index === currentChapterIndex
                                        ? "border-blue-500 text-blue-500 bg-blue-50" // Current chapter being watched
                                        : completedChapter?.isCompleted
                                            ? "border-green-500 text-green-500 bg-green-50" // Completed chapter
                                            : "border-gray-300 bg-white" // Default style for incomplete chapters
                                        }`}
                                    onClick={() => handleChapterClick(index)}
                                >
                                    <h4 className="font-semibold mb-1">{chapter.chapterTitle}</h4>
                                    <p className="text-sm">{chapter.description}</p>
                                    {completedChapter?.isCompleted && <span className="text-green-500">Completed</span>}
                                    {index === currentChapterIndex && <span className="text-blue-500">Currently Watching</span>}
                                </div>
                            );
                        })}

                        <button
                            onClick={handleQuizButtonClick}
                            disabled={!isAllChaptersCompleted}
                            className={`w-full py-2 px-4 mt-4 rounded text-white ${isAllChaptersCompleted ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                                }`}
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
