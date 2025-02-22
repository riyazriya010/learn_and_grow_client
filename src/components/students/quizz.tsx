'use client'

import { useState, useEffect } from "react";
import Navbar from "../navbar";
import Footer from "../loggedoutNav/footer";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { studentApis } from "@/app/api/studentApi";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Cookies from "js-cookie";

interface QuizzData {
    _id: string;
    questions: { question: string; options: string[]; correct_answer: string }[];
}


const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};


const StudentQuizz = () => {
    const [restart, setRestart] = useState<boolean>(true)
    const [courseId, setCourseId] = useState<string | null>(null)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [quizz, setQuizz] = useState<QuizzData | null>(null);
    const [corretAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [wrongAnswers, setwrongAnswers] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); // To track current question
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [quizCompleted, setQuizCompleted] = useState<boolean | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams()
    const username = useSelector((state: RootState) => state.user.username);

    useEffect(() => {
        setRestart(false)
        const getCourseId = searchParams.get('courseId')
        // const courseId = '67710140df708808ce0fd712'
        if (getCourseId) {
            setCourseId(getCourseId)
            const fetchQuizz = async () => {
                try {
                    const response = await studentApis.getQuizz(String(getCourseId))
                    console.log('response 1 : ', response)

                    const shuffledArray = shuffleArray(response?.data?.result?.questions)
                    const newQuizz = { ...response?.data?.result, questions: shuffledArray }
                    console.log('newQuizz: ', newQuizz)
                    setQuizz(newQuizz);
                    setIsLoading(false);
                } catch (error: any) {
                    if (
                        error &&
                        error?.response?.status === 403 &&
                        error?.response?.data?.message === 'Student Blocked'
                      ) {
                        toast.warn(error?.response?.data?.message);
                        Cookies.remove('accessToken');
                        localStorage.clear();
                        setTimeout(() => {
                          window.location.replace('/pages/student/login');
                        }, 3000);
                        return;
                      }
                    if (error && error.response?.status === 401) {
                        toast.warn(error.response.data.message);
                        Cookies.remove('accessToken');
                        localStorage.clear();
                        setTimeout(() => {
                            window.location.replace('/pages/student/login');
                        }, 3000);
                        return;
                    }
                } finally {
                    setIsLoading(false)
                }
            }
            fetchQuizz()
        }

    }, [restart]);


    const handleOption = (option: string, currentQuestionIndex: any) => {
        if (selectedAnswers[currentQuestionIndex]) return;

        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: option,
        }));

        if (quizz?.questions[currentQuestionIndex].correct_answer === option) {
            setCorrectAnswers((prev) => [...prev, option])
        } else {
            setwrongAnswers((prev) => [...prev, option])
        }
    }

    const handleNextQuestion = () => {
        const totalQuestions = quizz?.questions?.length ?? 0; // Ensures a default value of 0
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    

    const handleSubmitQuiz = async () => {
        console.log(corretAnswers)
        console.log(wrongAnswers)
        if (wrongAnswers.length !== 0) {
            toast.warn(`Your'e not completed the quizz, please try again`)
            setCorrectAnswers([])
            setwrongAnswers([])
            setCurrentQuestionIndex(0)
            setQuizCompleted(false);
            setSelectedAnswers({})
            setRestart(true)
            return
        }
        if ((corretAnswers.length + wrongAnswers.length) === quizz?.questions.length) {
            // Mock response for submission

            try {
                const response = await studentApis.completeCourse(String(courseId))
                console.log('succes: ', response)
                if (response) {
                    if (response?.data?.message === 'Course Completed') {
                        toast.warn('You Already Completed The Course')
                        router.push('/pages/student/get-certificates')
                        return
                    }
                    const courseName = response?.data?.result?.courseName
                    const mentorName = response?.data?.result?.mentorName
                    const data = {
                        username,
                        courseName,
                        mentorName,
                        courseId,
                    }
                    const createCertificate = await studentApis.createCertificate(data)
                    if (createCertificate) {
                        console.log('certi: ', createCertificate)
                        toast.success("Quiz completed successfully!!");
                        setQuizCompleted(true);
                    }

                } else {
                    setQuizCompleted(false);
                    toast.error("You didn't complete the quiz successfully. Try again.");
                }

            } catch (error: any) {
                if (
                    error &&
                    error?.response?.status === 403 &&
                    error?.response?.data?.message === 'Student Blocked'
                  ) {
                    toast.warn(error?.response?.data?.message);
                    Cookies.remove('accessToken');
                    localStorage.clear();
                    setTimeout(() => {
                      window.location.replace('/pages/student/login');
                    }, 3000);
                    return;
                  }
                  if (error && error.response?.status === 401 || error.response?.message === " Course Already Completed") {
                    toast.warn(error.response.data.message);
                    setTimeout(() => {
                        router.replace('/pages/student/get-certificates')
                    }, 3000);
                    return;
                  }
                if (error && error.response?.status === 401) {
                    toast.warn(error.response.data.message);
                    Cookies.remove('accessToken');
                    localStorage.clear();
                    setTimeout(() => {
                      window.location.replace('/pages/student/login');
                    }, 3000);
                    return;
                  }
            }

        }
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
                <div className="min-h-screen flex items-center justify-center py-10 bg-white-100">
                    {isLoading ? (
                        <p>Loading quiz...</p>
                    ) : quizz?._id === '' ? ( // Check if quiz response is empty
                        <div className="flex flex-col items-center justify-center mt-10">
                            <p className="text-red-500 text-lg font-bold">Unauthorized Access</p>
                            <p className="text-gray-600 mt-2">You must purchase the course to access this quiz.</p>
                        </div>
                    ) : 
                     (
                        quizCompleted ?
                            <>
                                <div className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
                                    <p className="text-lg mb-6 text-center">
                                        You have successfully completed your course. Your dedication and hard work have paid off!
                                    </p>
                                    <p className="text-md mb-6 text-center">
                                        Keep pushing forward and continue your learning journey. The knowledge you&apos;ve gained will open up new opportunities.
                                    </p>
                                    <button
                                        className="bg-white text-indigo-600 py-3 px-6 rounded-full font-semibold hover:bg-indigo-100 transition-all"
                                        onClick={() => router.push('/pages/student/get-certificates')}
                                    >
                                        View Certificate
                                    </button>
                                    <button
                                        className="mt-4 text-white underline hover:text-indigo-300"
                                    // onClick={handleShareCertificate}
                                    >
                                        Share Your Achievement
                                    </button>
                                </div>

                            </>
                            :
                            !quizz
                                ? <div className="flex flex-col items-center justify-center mt-10">
                                    <Image
                                        src="/images/undraw_no-data_ig65.svg"
                                        alt="No Courses"
                                        width={128}
                                        height={128}
                                        className="mb-4"
                                    />
                                    <p className="text-gray-500 text-lg">No quizz available</p>
                                    <p className="text-gray-600 mt-2">It looks like you haven&apos;t completed any courses</p>
                                </div>
                                :
                                <div className="bg-white border-2 border-[#D6D1F0] shadow-lg w-[400px] p-6 rounded-lg">
                                    <h1 className="text-center text-2xl font-bold mb-6 text-[#666666]">Question {currentQuestionIndex + 1}</h1>

                                    {/* Display current question */}
                                    <div className="text-center text-xl mb-4">
                                        {quizz?.questions[currentQuestionIndex]?.question}
                                    </div>

                                    {/* Display options */}
                                    <div className="flex justify-around mb-6">
                                        {quizz?.questions[currentQuestionIndex]?.options.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleOption(option, currentQuestionIndex)}
                                                disabled={!!selectedAnswers[currentQuestionIndex]} // Disable if already answered
                                                className={`w-[40%] py-3 rounded-[13px] ${selectedAnswers[currentQuestionIndex] === option
                                                    ? quizz?.questions[currentQuestionIndex].correct_answer === option
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500'
                                                    : 'bg-[#ffffff] text-black border border-[#22177A]'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Display Next Button */}
                                    {currentQuestionIndex < (quizz?.questions?.length ?? 0) - 1 ? (
                                        <button
                                            onClick={handleNextQuestion}
                                            disabled={!selectedAnswers[currentQuestionIndex]}
                                            className="w-[70px] bg-[#6E40FF] text-white py-3 rounded-[13px] ml-[250px] hover:opacity-90"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <>
                                            {wrongAnswers.length + corretAnswers.length === quizz?.questions.length && wrongAnswers.length > 0 ? (
                                                <button
                                                    onClick={handleSubmitQuiz}
                                                    disabled={!selectedAnswers[currentQuestionIndex]}
                                                    className="w-[70px] bg-red-500 text-white py-3 rounded-[13px] ml-[250px] hover:opacity-90"
                                                >
                                                    Retry
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSubmitQuiz}
                                                    disabled={!selectedAnswers[currentQuestionIndex]}
                                                    className="w-[110px] bg-[#6E40FF] text-white py-3 rounded-[13px] ml-[250px] hover:opacity-90"
                                                >
                                                    Submit Quiz
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                    )}

                </div>
                <Footer />
            </div>
        </>
    );
};

export default StudentQuizz;
