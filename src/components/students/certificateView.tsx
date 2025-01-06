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

interface CertificateData {
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

    useEffect(() => {
        const certificateId = searchParams.get('certificateId')
        // const certificateId = '677ad2212ef5c23f03ab7421';

        if (certificateId) {
            const fetchData = async () => {
                try {
                    const response = await studentApis.getCertificate(certificateId);
                    if (response) {
                        console.log('res certificate: ', response);
                        setCertificate(response?.data?.data);
                        setIsLoading(false);
                    }
                } catch (error: any) {
                    console.log(error);
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
                <div className="min-h-screen flex items-center justify-center py-10 bg-white-100">
                    <div className="min-h-screen flex flex-col items-center bg-white-100 py-10 px-4">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Certificate</h1>
                        <button
                            onClick={handleDownload}
                            className="mb-8 px-8 py-3 text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-md hover:from-indigo-500 hover:to-purple-500 focus:ring focus:ring-indigo-300"
                        >
                            Download Certificate
                        </button>

                        <div
                            ref={certificateRef}
                            className="w-full max-w-5xl aspect-video border-8 border-blue-300 bg-white shadow-2xl rounded-lg p-8 relative min-h-[600px]" // Added min-h-[600px]
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                {/* Certificate Header */}
                                <h2 className="text-5xl font-extrabold text-blue-700 tracking-widest uppercase">
                                    Certificate
                                </h2>
                                <p className="text-2xl font-semibold text-gray-600 mt-2 tracking-wide">
                                    Of Achievement
                                </p>

                                {/* Decorative Divider */}
                                <div className="h-1 w-3/4 bg-blue-400 rounded-full mt-4 mb-8"></div>

                                {/* Recipient's Name */}
                                <p className="text-lg text-gray-500">This Certificate is Presented To</p>
                                <h1 className="text-4xl font-bold text-blue-600 italic mt-4 font-serif tracking-wider mb-6">
                                    {certificate?.userName}
                                </h1>

                                {/* Decorative Underline for Name */}
                                <div className="w-1/2 border-b-4 border-dashed border-blue-400 mt-2 mb-6"></div>

                                {/* Certificate Content */}
                                <p className="text-md text-gray-600 max-w-3xl text-center">
                                    In recognition of their outstanding dedication and exceptional performance
                                    in successfully completing the course{' '}
                                    <span className="font-semibold">{certificate?.courseName}</span>.
                                </p>

                                {/* Signature and Date Section */}
                                <div className="flex justify-between w-full px-10 mt-12">
                                    {/* Date Section */}
                                    <div className="text-left">
                                        <p className="px-5">
                                            {certificate?.issuedDate
                                                ? new Date(certificate?.issuedDate).toLocaleDateString()
                                                : 'Date not available'}
                                        </p>
                                        <div className="h-1 w-35 bg-gray-300 rounded-full"></div>
                                        <p className="text-sm text-gray-500 mt-2">Date of Completion</p>
                                    </div>

                                    {/* Mentor's Signature */}
                                    <div className="text-right">
                                        <p className="text-xl italic font-signature text-gray-700">
                                            {certificate?.mentorName}
                                        </p>
                                        <p className="text-sm text-gray-500">Mentor's Signature</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default CertificatePage;
