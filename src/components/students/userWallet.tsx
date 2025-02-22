'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingModal from '../re-usable/loadingModal';
import MentorFooter from '../mentors/footer';
import Navbar from '../navbar';
import Image from 'next/image';
import ReusableTable from '../re-usable/table';
import Pagination from '../re-usable/pagination';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import axios from 'axios';
import { USER_SERVICE_URL } from '@/utils/constant';

interface WalletData {
    _id?: string;
    balance: number;
    transactions: {
        type: string;
        amount: number;
        date: string;
        description: string;
    }[];
}

const StudentWallet = () => {
    const headers = ['Type', 'Amount', 'Date', 'Description'];
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async (page: number) => {
            setIsLoading(true);
            try {
                const filters = { page, limit: 1 };
                const response = await axios.get(`${USER_SERVICE_URL}/get/student/wallet?filters=${filters}`,{
                    withCredentials: true
                });
                console.log('wallet ',response)
                if (response) {
                    const wallets = response.data?.result?.wallets;
                    console.log(response)
                    const currentPageData = response.data?.result;

                    // Extract the first wallet from the array
                    if (wallets) {
                        setWallet(wallets);
                        setCurrentPage(currentPageData?.currentPage || 1);
                        setTotalPages(currentPageData?.totalPages || 1);
                    } else {
                        setWallet(null);
                    }
                }
            } catch (error: any) {
                if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
                    console.log('401 log', error.response.data.message)
                    toast.warn(error.response.data.message);
                    setTimeout(() => {
                        router.push('/pages/mentor/profile')
                    }, 2000)
                    return;
                }
                if (error && error.response?.status === 401) {
                    toast.warn(error.response.data.message);
                    Cookies.remove('accessToken');
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.replace('/pages/mentor/login');
                    }, 3000);
                    return;
                }
                if (
                    error &&
                    error?.response?.status === 403 &&
                    error?.response?.data?.message === 'Mentor Blocked'
                ) {
                    toast.warn(error?.response?.data?.message);
                    Cookies.remove('accessToken');
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.replace('/pages/mentor/login');
                    }, 3000);
                    return;
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData(currentPage);
    }, [currentPage]);

    if (isLoading) return <LoadingModal isOpen={isLoading} message="Please wait..." />;

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

                <main className="flex-grow px-8 py-4">
                    {wallet ? (
                        <>
                            {/* Balance Section */}
                            <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-md mx-auto">
                                <h2 className="text-xl font-semibold text-gray-800">Wallet Balance</h2>
                                <p className="text-2xl font-bold text-green-600">₹ {wallet.balance.toFixed(2)}</p>
                            </div>

                            {/* Transactions Table */}
                            {wallet.transactions.length === 0 ? (
                                <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
                                    <Image
                                        src="/images/undraw_no-data_ig65.svg"
                                        alt="No Transactions"
                                        width={128}
                                        height={128}
                                        className="mb-4"
                                    />
                                    <h2 className="text-2xl font-semibold text-gray-800">No Transactions Found</h2>
                                </div>
                            ) : (
                                <ReusableTable
                                    headers={headers}
                                    data={wallet.transactions.map((transaction) => ({
                                        Type: transaction.type,
                                        Amount: `₹ ${transaction.amount.toFixed(2)}`,
                                        Date: new Date(transaction.date).toISOString().split('T')[0],
                                        'Description': transaction.description,
                                        handler: () => { },
                                    }))}
                                    tableWidth="max-w-[850px]"
                                />
                            )}
                        </>
                    ) : (
                        // <div className="text-center text-gray-600">Failed to load wallet data.</div>
                        <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
                            <Image
                                src="/images/undraw_no-data_ig65.svg"
                                alt="No Transactions"
                                width={128}
                                height={128}
                                className="mb-4"
                            />
                            <h2 className="text-2xl font-semibold text-gray-800">No Transactions Found</h2>
                        </div>
                    )}
                </main>

                <div className="mb-4">
                    <div className="w-full flex justify-center mt-6">
                        <Pagination
                            nextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            directClick={(pageNumber) => setCurrentPage(pageNumber)}
                            previousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </div>
                </div>

                <MentorFooter />
            </div>
        </>
    );
};

export default StudentWallet;
