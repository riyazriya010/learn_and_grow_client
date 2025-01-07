'use client';

import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../navbar';
import Footer from '../loggedoutNav/footer';
import { useRouter } from 'next/navigation';

const PaymentFailure = () => {
    const router = useRouter();

    const handleBackToHome = () => {
        router.replace('/pages/student/course'); // Replace this with your home page route
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <ToastContainer autoClose={2000} transition={Slide} />
            <div className="flex-1 bg-white-100 py-16 px-6">
                <div className="flex flex-col items-center justify-center bg-white-100">
                    <h1 className="text-3xl font-semibold text-red-600 mb-6">Payment Failed</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        Unfortunately, your payment could not be processed. You can purchase the course later.
                    </p>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <button
                            onClick={handleBackToHome}
                            className="w-full py-2 bg-[#6E40FF] text-white rounded-[0px]"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentFailure;
