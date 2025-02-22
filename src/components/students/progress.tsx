'use client'

import { useState } from "react";

interface CompletedChapter {
    chapterId: string;
    isCompleted: boolean;
    completedAt?: string;
}

interface PurchasedCourse {
    _id: string;
    courseId: string;
    courseName: string;
    completedChapters: CompletedChapter[];
    totalChapters: number;
    isCourseCompleted: boolean;
}

const courses: PurchasedCourse[] = [
    {
        _id: "1",
        courseId: "101",
        courseName: "Full-Stack Development",
        completedChapters: [
            { chapterId: "c1", isCompleted: true, completedAt: "2024-02-18" },
            { chapterId: "c2", isCompleted: true, completedAt: "2024-02-19" },
        ],
        totalChapters: 5,
        isCourseCompleted: false,
    },
    {
        _id: "2",
        courseId: "102",
        courseName: "Data Structures & Algorithms",
        completedChapters: [{ chapterId: "c1", isCompleted: true, completedAt: "2024-02-17" }],
        totalChapters: 10,
        isCourseCompleted: false,
    },
];

const CourseProgress = () => {
    const [selectedCourse, setSelectedCourse] = useState<PurchasedCourse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (course: PurchasedCourse) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                    <div key={course._id} className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">{course.courseName}</h3>
                        <p className="text-sm text-gray-500">
                            Completed: {course.completedChapters.length}/{course.totalChapters}
                        </p>

                        <button
                            onClick={() => openModal(course)}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            View Progress
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && selectedCourse && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-3">{selectedCourse.courseName} Progress</h2>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                            <div
                                className="bg-green-500 h-4 rounded-full"
                                style={{
                                    width: `${(selectedCourse.completedChapters.length / selectedCourse.totalChapters) * 100}%`,
                                }}
                            ></div>
                        </div>

                        <ul className="space-y-2">
                            {selectedCourse.completedChapters.map((chapter, index) => (
                                <li key={index} className="flex justify-between text-sm text-gray-700">
                                    <span>Chapter {index + 1}</span>
                                    <span className="text-green-600">{chapter.completedAt}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseProgress;
