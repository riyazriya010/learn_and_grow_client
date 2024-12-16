"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams  } from 'next/navigation';
import { USER_SERVICE_URL } from '@/utils/constant';

const VerifyEmail = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const token = searchParams.get('token')
            console.log('Token from query: ', token);
            if (!token) return;

            try {
                const response = await axios.patch(`${USER_SERVICE_URL}/verify?token=${token}`);
                setMessage(response.data.message);
            } catch (error) {
                setMessage('Verification failed. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Email Verification</h1>
            <p>{message}</p>
            {message.includes('successful') && (
                <button onClick={() => router.push('/login')}>Go to Login</button>
            )}
        </div>
    );
};

export default VerifyEmail;