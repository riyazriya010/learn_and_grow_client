'use client';

import { useEffect, useState } from "react";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import ReusableTable from "../re-usable/table";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { mentorApis } from "@/app/api/mentorApi";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import Cookies from "js-cookie";

interface Question {
    _id: string;
    question: string;
    option1: string;
    option2: string;
    correct_answer: string;
    quizId: string;
}

interface QuizzData {
    _id?: string;
    courseId: string;
    questions: Question[];
}

const Quizz = () => {
    const headers = ['Question', 'Option 1', 'Option 2', 'Correct Answer'];
    const [quizzes, setQuizzes] = useState<QuizzData[]>([]);
    const [courseId, setCourseId] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams()

    useEffect(() => {
        const getCourseId = searchParams.get('courseId')

        if (getCourseId) {
            setCourseId(getCourseId);

            const fetchData = async () => {
                try {
                    const response = await mentorApis.getAllQuizz(getCourseId);
                    if (response && response.data && response.data.result && Array.isArray(response.data.result)) {
                        console.log('res quizz: ', response);

                        // Assuming response.data.data is an array of quiz objects
                        const quizData = response.data.result.map((quiz: any) => ({
                            courseId: quiz.courseId,
                            questions: quiz.questions.map((question: any) => ({
                                _id: question._id,
                                question: question.question,
                                option1: question.options[0],
                                option2: question.options[1],
                                correct_answer: question.correct_answer,
                            })),
                        }));
                        console.log(quizData)
                        setQuizzes(quizData); // Set the quiz data
                    } else {
                        setQuizzes([]); // Set to empty array if no questions found
                    }
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
                }
            };

            fetchData();
        }
    }, []);

    const addQuizz = (courseId: string) => {
        console.log('Add Quiz for Course ID:', courseId);
        router.push(`/pages/mentor/add-quizz?courseId=${courseId}`);
    };

    const deleteQuizz = async (quizId: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result: any) => {
            if (result.isConfirmed) {
                try {
                    const response = await mentorApis.deleteQuizz(quizId, String(courseId));
                    if (response) {
                        setQuizzes((prevQuizzes) =>
                            prevQuizzes.map((quiz) => ({
                                ...quiz,
                                questions: quiz.questions.filter((question) => question._id !== quizId),
                            })).filter((quiz) => quiz.questions.length > 0)
                        );
                        toast.success("Successfully deleted the quiz!");
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
                }
            }
        });
    };

    return (
        <>
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

                {/* Content Section */}
                <main className="flex-grow px-8 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            className="bg-[#433D8B] text-white px-6 py-2 rounded-lg hover:opacity-90"
                            onClick={() => addQuizz(String(courseId))}
                        >
                            Add Quiz
                        </button>
                    </div>

                    {quizzes.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
                            <Image
                                src="/images/undraw_no-data_ig65.svg" // Path to your illustration
                                alt="No Quizzes"
                                width={128}
                                height={128}
                                className="mb-4"
                            />
                            <h2 className="text-2xl font-semibold text-gray-800">No quizzes uploaded yet</h2>
                            <p className="text-gray-600 mt-2">It looks like you haven&apos;t added any quizzes. Start by clicking the button above!</p>
                        </div>
                    ) : (
                        <ReusableTable
                            headers={headers}
                            data={quizzes.flatMap(quiz =>
                                quiz.questions.map(question => ({
                                    "_id": question._id,
                                    "Question": question.question, // Match with header
                                    "Option 1": question.option1,  // Match with header
                                    "Option 2": question.option2,  // Match with header
                                    "Correct Answer": question.correct_answer, // Match with header
                                }))
                            )}
                            handlers={(row) => [
                                {
                                    handler: () => deleteQuizz(row._id),
                                    name: "Delete"
                                },
                            ]}
                            buttonStyles="bg-[#FF474c] text-white text-sm font-medium rounded hover:opacity-90"
                            tableWidth="max-w-[850px]"
                        />
                    )}
                </main>

                <MentorFooter />
            </div>
        </>
    );
}

export default Quizz;