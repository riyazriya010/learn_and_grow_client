'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Footer from '../loggedoutNav/footer';
import Navbar from '../navbar';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { studentApis } from '@/app/api/studentApi';
import LoadingModal from '../re-usable/loadingModal';
import Cookies from "js-cookie";

const PaymentSuccess = () => {
    const [courseId, setCourseId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    const txnid = searchParams.get('txnid');
    const amountPaid = searchParams.get('amountPaid');
    const bankRefNum = searchParams.get('bankRefNum');
    const courseName = searchParams.get('courseName');

    const handleNavigateToCourses = () => {
        router.replace('/pages/student/purchased-course');
    };

    useEffect(() => {
        const getCourseId = searchParams.get('courseId');

        if (getCourseId) {
            setCourseId(getCourseId)
            const payment = async () => {
                try {
                    const response = await studentApis.payment(String(getCourseId), String(txnid) , Number(amountPaid), String(courseName))
                    if (response) {
                        console.log('res ', response)
                        toast.success('You Have Purchased the course')
                    }
                } catch (error: any) {
                    if (error && error.response?.status === 401) {
                        toast.warn(error.response.data.message);
                        Cookies.remove('accessToken');
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
            payment()
        } else {
            setIsLoading(false)
        }
    }, [searchParams])


    if(isLoading) return <LoadingModal isOpen={isLoading} message='please wait for payment success...'/>

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <ToastContainer autoClose={2000} transition={Slide} />
            <div className="flex-1 bg-white-100 py-16 px-6">
                <div className="flex flex-col items-center justify-center bg-white-100">
                    <h1 className="text-3xl font-semibold text-[#666666] mb-6">Payment Successful!</h1>
                    <p className="text-lg text-gray-700 mb-6">Thank you for your purchase. Your payment was successful.</p>
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                        <div className="mb-4">
                            {/* <p className="font-medium text-gray-800">Course Name: <span className="text-[#6E40FF]">{courseName}</span></p> */}
                            {/* <p className="font-medium text-gray-800">Course ID: <span className="text-[#6E40FF]">{courseId}</span></p> */}
                            <p className="font-medium text-gray-800">Transaction ID: <span className="text-[#6E40FF]">{txnid}</span></p>
                            <p className="font-medium text-gray-800">Amount Paid: <span className="text-[#6E40FF]">₹{amountPaid}</span></p>
                            {/* <p className="font-medium text-gray-800">Bank Reference Number: <span className="text-[#6E40FF]">{bankRefNum}</span></p> */}
                        </div>
                        <button
                            onClick={handleNavigateToCourses}
                            className="w-full py-2 bg-[#22177A] text-white rounded-[13px]"
                        >
                            Go to Courses Purchased
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
