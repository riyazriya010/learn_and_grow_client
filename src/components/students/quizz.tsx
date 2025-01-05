'use client'

import { useState, useEffect } from "react";
import Navbar from "../navbar";
import Footer from "../loggedoutNav/footer";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface QuizzData {
    _id: string;
    questions: { question: string; options: string[]; }[];
}

const StudentQuizz = () => {
    const [quizz, setQuizz] = useState<QuizzData | null>(null);
    const [answers, setAnswers] = useState<string[]>([]); // To store selected answers
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); // To track current question
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [quizCompleted, setQuizCompleted] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Simulating fetching quiz data
        const mockQuiz: QuizzData = {
            _id: "123",
            questions: [
                { question: "What is 2 + 2?", options: ["3", "4"] },
                { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars"] },
                { question: "What is the capital of France?", options: ["Berlin", "Paris"] },
                { question: "What is the largest mammal?", options: ["Elephant", "Blue Whale"] },
                { question: "Which is the largest ocean?", options: ["Atlantic Ocean", "Pacific Ocean"] }
            ]
        };
        setQuizz(mockQuiz);
        setIsLoading(false); // Set loading to false after fetching mock data
    }, []);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizz?.questions.length! - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmitQuiz = async () => {
        if (answers.length === quizz?.questions.length) {
            // Mock response for submission
            const response = { success: true }; 
            if (response.success) {
                setQuizCompleted(true);
                toast.success("Quiz completed successfully! Click to view your certificate.");
                setTimeout(() => {
                    router.push("/pages/certificate");
                }, 2000);
            } else {
                setQuizCompleted(false);
                toast.error("You didn't complete the quiz successfully. Try again.");
            }
        }
    };

    const handleOptionChange = (option: string) => {
        // Prevent changing the answer once selected
        if (answers[currentQuestionIndex] === undefined) {
            const newAnswers = [...answers];
            newAnswers[currentQuestionIndex] = option;
            setAnswers(newAnswers);
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
                    ) : (
                        <div className="bg-white border-2 border-[#D6D1F0] shadow-lg w-[400px] p-6 rounded-lg">
                            <h1 className="text-center text-2xl font-bold mb-6 text-[#6E40FF]">Question {currentQuestionIndex + 1}</h1>

                            {/* Display current question */}
                            <div className="text-center text-xl mb-4">
                                {quizz?.questions[currentQuestionIndex].question}
                            </div>

                            {/* Display options */}
                            <div className="flex justify-around mb-6">
                                {quizz?.questions[currentQuestionIndex].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionChange(option)}
                                        className="w-[40%] bg-[#6E40FF] text-white py-3 rounded-lg hover:opacity-80"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            {/* Display Next Button */}
                            {currentQuestionIndex < quizz?.questions.length! - 1 ? (
                                <button
                                    onClick={handleNextQuestion}
                                    className="w-full bg-[#6E40FF] text-white py-3 rounded-[22px] hover:opacity-90"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitQuiz}
                                    className="w-full bg-[#6E40FF] text-white py-3 rounded-[22px] hover:opacity-90"
                                >
                                    Submit Quiz
                                </button>
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
