"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import {USER_SERVICE_URL } from '@/utils/constant';

const StudentVerifyEmail = () => {
    const searchParams = useSearchParams();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const token = searchParams.get('token');

            console.log('Token from query: ', token);

            if (!token) {
                setMessage('Verification token not found.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.patch(`${USER_SERVICE_URL}/verify?token=${token}`);
                setMessage('Verified successfully.');
                setIsVerified(true);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    setMessage('Token expired. Please go to your profile to verify your account.');
                } else {
                    setMessage('Verification failed. Please go to your profile to verify your account.');
                }
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
            </div>
        </div>
    );
};

export default StudentVerifyEmail;


