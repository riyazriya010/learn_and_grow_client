
'use client';

import { useEffect, useState } from 'react';
import LoadingModal from '../re-usable/loadingModal';
import MentorFooter from '../mentors/footer';
import Image from 'next/image';
import ReusableTable from '../re-usable/table';
import Pagination from '../re-usable/pagination';
import { adminApis } from '@/app/api/adminApis';
import AdminHeader from './header';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ADMIN_SERVICE_URL } from '@/utils/constant';
import axios from 'axios';

interface WalletData {
    _id?: string;
    balance: number;
    transactions: {
        type: string;
        courseName: string;
        amount: number;
        date: string;
    }[];
}

const AdminWallet = () => {
    const headers = ['Type', 'Course Name', 'Amount', 'Date'];
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async (page: number) => {
            setIsLoading(true);
            try {
                const filters = { page, limit: 3 };
                const response = await adminApis.getWallet(filters);
                console.log('wallet data: ', response)
                if (response) {
                    const wallets = response.data?.result?.wallets;
                    console.log(wallets)
                    const currentPageData = response.data?.result;

                    // Extract the first wallet from the array
                    if (wallets && wallets.length > 0) {
                        setWallet(wallets[0]);
                        setCurrentPage(currentPageData?.currentPage || 1);
                        setTotalPages(currentPageData?.totalPages || 1);
                    } else {
                        setWallet(null);
                    }
                }
            } catch (error: any) {
                console.error(error);
                if (error && error.response?.status === 401) {
                    toast.warn(error.response.data.message);
                    await axios.post(`${ADMIN_SERVICE_URL}/admin/logout`, {}, { withCredentials: true });
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.replace('/pages/login');
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
                <AdminHeader />

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
                                        'Course Name': transaction.courseName,
                                        Amount: `₹ ${transaction.amount.toFixed(2)}`,
                                        Date: new Date(transaction.date).toISOString().split('T')[0],
                                        handler: () => { },
                                    }))}
                                    tableWidth="max-w-[750px]"
                                />
                            )}
                        </>
                    ) : (
                        <div className="text-center text-gray-600">Failed to load wallet data.</div>
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

export default AdminWallet;
