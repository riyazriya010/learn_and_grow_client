'use client';

import Navbar from "../navbar";
import Footer from "../loggedoutNav/footer";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import CryptoJS from 'crypto-js';
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import Cookies from "js-cookie";
import { USER_SERVICE_URL } from "@/utils/constant";
import { clearUserDetials } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";

interface CourseDetails {
    courseName: string;
    level: string;
    category: string;
    price: string;
}

const SummaryPage = () => {
    const [courseId, setCourseId] = useState<string | null>(null);
    const [course, setCourse] = useState<CourseDetails | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | null>("PayU");
    const [txnid, setTxnid] = useState<string | null>(null);
    const [hash, setHash] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number | 0>(0)

    const searchParams = useSearchParams()
    const dispatch = useDispatch()

    const router = useRouter()

    const userDetails = useSelector((state: RootState) => state.user)
    const { username, email } = userDetails

    const phone = '8525010630';

    const generateTxnid = () => 'txn' + new Date().getTime();


    useEffect(() => {

        setTxnid(generateTxnid());

        const getCourseDetails = localStorage.getItem('courseDetails')
        if (getCourseDetails) {
            setCourse(JSON.parse(getCourseDetails))
        }
        const getCourseId = searchParams.get('courseId')

        if (getCourseId) {
            setCourseId(String(getCourseId))
        }
    }, []);

    //Get Wallet Data
    useEffect(() => {
        const getWalletBalance = async () => {
            try {

                const response = await axios.get(`${USER_SERVICE_URL}/get/wallet/balance`, {
                    withCredentials: true
                })

                console.log('summary wallet ', response)
                setWalletBalance(Number(response?.data?.result))

            } catch (error: any) {
                if (error && error.response?.status === 401) {
                    toast.warn(error.response.data.message);
                    Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
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
                    Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                    dispatch(clearUserDetials());
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.replace('/pages/student/login');
                    }, 3000);
                    return;
                }
            }
        }
        getWalletBalance()
    }, [])


    useEffect(() => {
        if (!txnid) return;

        const key = 'hLAGgn';
        const amount = course?.price;
        const productinfo = courseId;
        const firstname = username || '';
        const userEmail = email || '';
        const udf1 = '';
        const udf2 = '';
        const udf3 = '';
        const udf4 = '';
        const udf5 = '';
        const salt = 'r9i1EoMfQy968ezHT4wch5ouStEp8o1l';

        const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${userEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
        const generatedHash = CryptoJS.SHA512(hashString).toString();

        setHash(generatedHash);
    }, [txnid]);

    const handleWalletPayment = async () => {
        if (Number(course?.price) <= Number(walletBalance)) {
            try {
                const response = await axios.post(`${USER_SERVICE_URL}/buy/course/wallet`,
                    {
                        price: course?.price,
                        courseId: courseId
                    }, { withCredentials: true }
                )
                console.log('wallet buy res ', response)
                if (response && response?.data?.success) {
                    toast.success('Course Buyed SuccessFully')

                    setTimeout(() => {
                        router.replace('/pages/student/purchased-course')
                    }, 2000)
                    return
                }
            } catch (error) {
                console.error("Wallet payment error:", error);
                toast.error("An error occurred during wallet payment.", { transition: Slide });
            }
        } else {
            toast.error("Insufficient Amount in Wallet.", { transition: Slide });
        }
    };

    const handlePayUPayment = async () => {
        const formData = {
            key: 'hLAGgn',
            txnid: txnid,
            productinfo: courseId,
            amount: course?.price,
            email: email,
            firstname: username,
            lastname: course?.courseName,
            surl: 'https://learngrow.live/api/paymentSuccess',
            furl: 'https://learngrow.live/api/paymentFailure',
            phone: phone,
            hash: hash,
        };

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://test.payu.in/_payment';

        Object.keys(formData).forEach((key) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formData[key as keyof typeof formData] || '';
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    };

    const handlePayment = async () => {
        try {
            // Check if the course is already purchased
            const response = await axios.get(`${USER_SERVICE_URL}/already/buyed/course/${courseId}`, {
                withCredentials: true,
            });

            console.log('Already Purchased: ', response?.data?.message);

            if (response?.data?.message === 'Already Buyed') {  // Change API response to 'Already Purchased'
                toast.warn('Course Already Purchased');
                setTimeout(() => {
                    router.replace('/pages/student/purchased-course');
                }, 2000);
                return;
            }

            // Proceed to payment
            if (paymentMethod === 'Wallet') {
                await handleWalletPayment();
            } else if (paymentMethod === 'PayU') {
                await handlePayUPayment();
            } else {
                toast.error('Please select a valid payment method.', { transition: Slide });
            }
        } catch (error: any) {
            console.error('Payment Error:', error);

            if (error?.response?.status === 401) {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/student/login');
                }, 3000);
                return;
            }

            if (error?.response?.status === 403 && error?.response?.data?.message === 'Student Blocked') {
                toast.warn(error?.response?.data?.message);
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/student/login');
                }, 3000);
                return;
            }

            // Handle other errors
            toast.error('Something went wrong. Please try again.');
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <ToastContainer
                autoClose={2000}
                pauseOnHover={false}
                transition={Slide}
                hideProgressBar={false}
                closeOnClick={false}
                pauseOnFocusLoss={true}
            />

            <div className="flex-1 bg-white-100 py-16 px-6">

                <div className="max-w-5xl mx-auto bg-gradient-to-r from-white rounded-lg shadow-lg overflow-hidden border border-gray-500">
                    <div className="md:flex">
                        {/* Combined Container */}
                        <div className="md:w-full p-8">
                            <div className="md:flex rounded-[0px] shadow-[0_4px_10px_rgba(0,0,0,10)]">
                                {/* Course Summary */}
                                <div className="md:w-1/2 bg-[#22177A] text-white p-8 flex flex-col justify-between">
                                    <h3 className="text-2xl font-bold mb-4">Course Summary</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="font-bold">Course Name:</span>
                                            <span>{course?.courseName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold">Category:</span>
                                            <span>{course?.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold">Level:</span>
                                            <span>{course?.level}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold">Price:</span>
                                            <span>₹ {course?.price}.00</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <span className="text-lg font-semibold">Total Amount: ₹ {course?.price}.00</span>
                                    </div>
                                </div>

                                {/* Payment Section */}
                                <div className="md:w-1/2 p-8">
                                    {/* Wallet Balance */}
                                    <div className="bg-gray-100 rounded-lg shadow-md p-4 mb-6">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Your Wallet Details</h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Available Balance:</span>
                                            <span className="text-[#22177A] font-bold">₹ {walletBalance || 0}</span>
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Payment Details</h3>
                                    <div className="space-y-4">

                                        <div className="flex justify-between">
                                            <span className="font-bold">Total Amount:</span>
                                            <span>₹ {course?.price}.00</span>
                                        </div>

                                        <div className="text-[15px] text-gray-400">
                                            Select Payment Method:
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="PayU"
                                                    checked={paymentMethod === "PayU"}
                                                    onChange={() => setPaymentMethod("PayU")}
                                                    className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                />
                                                <span>PayU</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="Wallet"
                                                    checked={paymentMethod === "Wallet"}
                                                    onChange={() => setPaymentMethod("Wallet")}
                                                    className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                />
                                                <span>Wallet</span>
                                            </label>
                                        </div>

                                        <button
                                            onClick={handlePayment}
                                            className="mt-6 w-full bg-[#22177A] text-white py-3 rounded-[0px] shadow-lg"
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </div>

    );
};

export default SummaryPage;