"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { USER_SERVICE_URL } from '@/utils/constant';

const VerifyEmail = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const token = searchParams.get('token');
            console.log('Token from query: ', token);
            if (!token) return;

            try {
                const response = await axios.patch(`${USER_SERVICE_URL}/verify?token=${token}`);
                setMessage(response.data.message);
                setIsVerified(true); // Set the verification state to true after success
            } catch (error) {
                setMessage('Verification failed. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="flex items-center space-x-2 text-xl text-blue-600">
                    <div className="w-6 h-6 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">Email Verification</h1>
                
                <p className="text-lg text-center mb-4">{message}</p>

                {isVerified ? (
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-green-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-xl text-green-600 mb-4">Your email has been successfully verified!</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Return to Home
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
