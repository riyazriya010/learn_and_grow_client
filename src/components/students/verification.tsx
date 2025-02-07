"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { USER_SERVICE_URL } from '@/utils/constant';

const CheckCircleIcon = ({ className }: { className: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon = ({ className }: { className: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ExclamationCircleIcon = ({ className }: { className: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
    </svg>
);

const StudentVerifyEmail = () => {
    const searchParams = useSearchParams();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'success' | 'failed' | 'expired' | null>(null);

    useEffect(() => {
        const verifyUser = async () => {
            const token = searchParams.get('token');

            console.log('Token from query: ', token);

            if (!token) {
                setMessage('Verification token not found.');
                setStatus('failed');
                setLoading(false);
                return;
            }

            try {
                await axios.patch(`${USER_SERVICE_URL}/verify?token=${token}`);
                setMessage('Verified successfully.');
                setStatus('success');
            } catch (error: any) {
                if (error.response?.status === 401) {
                    setMessage('Token expired. Please go to your profile to verify your account.');
                    setStatus('expired');
                } else {
                    setMessage('Verification failed. Please go to your profile to verify your account.');
                    setStatus('failed');
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

    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />;
            case 'failed':
                return <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />;
            case 'expired':
                return <ExclamationCircleIcon className="w-16 h-16 text-yellow-500 mx-auto" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-semibold text-blue-600 mb-4">Email Verification</h1>
                {getStatusIcon()}
                <p className="text-lg mt-4">{message}</p>
            </div>
        </div>
    );
};

export default StudentVerifyEmail;
