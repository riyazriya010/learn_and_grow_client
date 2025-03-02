'use client';

import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../loggedoutNav/footer';
import Navbar from '../navbar';
import { useSearchParams } from 'next/navigation';
import { studentApis } from '@/app/api/studentApi';
import LoadingModal from '../re-usable/loadingModal';
import { clearUserDetials } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { USER_SERVICE_URL } from '@/utils/constant';
import axios from 'axios';

interface CertificateData {
    _id: string;
    courseName: string;
    userName: string;
    mentorName?: string;
    issuedDate: Date;
}

const CertificatePage = () => {
    const searchParams = useSearchParams();
    const [isloading, setIsLoading] = useState<boolean>(true);
    const [certificate, setCertificate] = useState<CertificateData>();
    const certificateRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch()

    useEffect(() => {
        const certificateId = searchParams.get('certificateId')

        if (certificateId) {
            const fetchData = async () => {
                try {
                    const response = await studentApis.getCertificate(certificateId);
                    if (response) {
                        console.log('res certificate: ', response);
                        setCertificate(response?.data?.result);
                        setIsLoading(false);
                    }
                } catch (error: any) {
                    if (error && error.response?.status === 401) {
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
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, []);

    const handleDownload = async () => {
        if (certificateRef.current) {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width + 50, canvas.height + 50], // Added extra space
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('LearnAndGrow_Certificate.pdf');
        }
    };

    if (isloading) return <LoadingModal isOpen={isloading} message="please wait" />;
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

                <div className="min-h-screen flex items-center justify-center py-10 px-4 bg-gray-100">
                    {certificate?._id ? (
                        <div className="w-full flex flex-col items-center bg-gray-100 py-6 px-4 sm:px-6">

                            {/* Heading */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                                Your Certificate
                            </h1>

                            {/* Download Button */}
                            <button
                                onClick={handleDownload}
                                className="mb-6 px-6 py-2 sm:px-8 sm:py-3 text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-md hover:from-indigo-500 hover:to-purple-500 focus:ring focus:ring-indigo-300"
                            >
                                Download Certificate
                            </button>

                            {/* Certificate Container */}
                            <div
                                ref={certificateRef}
                                className="w-full max-w-4xl sm:max-w-5xl border-8 border-blue-300 bg-white shadow-2xl rounded-lg p-4 sm:p-8 relative min-h-[450px] sm:min-h-[550px] md:min-h-[600px]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>

                                {/* Certificate Content */}
                                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-2 sm:px-6">

                                    {/* Title */}
                                    <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-700 tracking-widest uppercase">
                                        Certificate
                                    </h2>
                                    <p className="text-lg sm:text-2xl font-semibold text-gray-600 mt-2 tracking-wide">
                                        Of Achievement
                                    </p>

                                    {/* Decorative Divider */}
                                    <div className="h-1 w-3/4 sm:w-2/3 bg-blue-400 rounded-full mt-4 mb-6 sm:mb-8"></div>

                                    {/* Recipient's Name */}
                                    <p className="text-sm sm:text-lg text-gray-500">This Certificate is Presented To</p>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-blue-600 italic mt-3 sm:mt-4 font-serif tracking-wider mb-4 sm:mb-6">
                                        {certificate?.userName}
                                    </h1>

                                    {/* Decorative Underline */}
                                    <div className="w-1/2 border-b-4 border-dashed border-blue-400 mt-2 mb-4 sm:mb-6"></div>

                                    {/* Certificate Content */}
                                    <p className="text-sm sm:text-md text-gray-600 max-w-3xl text-center">
                                        In recognition of their outstanding dedication and exceptional performance
                                        in successfully completing the course{' '}
                                        <span className="font-semibold">{certificate?.courseName}</span>.
                                    </p>

                                    {/* Signature and Date Section */}
                                    <div className="flex flex-col sm:flex-row justify-between w-full px-4 sm:px-10 mt-8 sm:mt-12">

                                        {/* Date Section */}
                                        <div className="w-full sm:w-1/2 text-center sm:text-left">
                                            <p className="px-4 sm:px-5">
                                                {certificate?.issuedDate
                                                    ? new Date(certificate?.issuedDate).toLocaleDateString()
                                                    : 'Date not available'}
                                            </p>
                                            <div className="h-1 w-24 sm:w-32 bg-gray-300 rounded-full mx-auto sm:mx-0"></div>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-2">Date of Completion</p>
                                        </div>

                                        {/* Mentor's Signature */}
                                        <div className="w-full sm:w-1/2 text-center sm:text-right mt-6 sm:mt-0">
                                            <p className="text-lg sm:text-xl italic font-signature text-gray-700">
                                                {certificate?.mentorName}
                                            </p>
                                            <div className="h-1 w-24 sm:w-32 bg-gray-300 rounded-full mx-auto sm:mx-0"></div>
                                            <p className="text-xs sm:text-sm text-gray-500">Mentor&apos;s Signature</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center px-4">
                            <p className="text-xl sm:text-2xl text-red-500 font-semibold">🚫 Unauthorized Access</p>
                            <p className="text-gray-500 mt-2">You are not authorized to view this certificate.</p>
                        </div>
                    )}
                </div>


                <Footer />
            </div>
        </>
    );
};

export default CertificatePage;
