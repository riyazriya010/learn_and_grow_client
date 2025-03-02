'use client';

import { useState, useEffect } from "react";
import Footer from "../loggedoutNav/footer";
import Navbar from "../navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { MENTOR_SERVICE_URL } from "@/utils/constant";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Notification Interface
interface NotificationData {
    _id: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    seen: boolean;
    createdAt: string;
}

const MentorNotification = () => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const router = useRouter()

    // Fetch Notifications from API
    const fetchNotifications = async () => {
        try {

            const getMentor = localStorage.getItem("mentor");

            if (!getMentor) return; // Exit early if mentor data is not found

            let parsedMentor;
            try {
                parsedMentor = JSON.parse(getMentor);
            } catch (err) {
                console.error("Error parsing mentor data:", err);
                return;
            }

            const mentorId = parsedMentor?.userId;
            if (!mentorId) {
                console.error("Mentor ID not found");
                return;
            }

            const response = await axios.get(`${MENTOR_SERVICE_URL}/mentor/notifications/${mentorId}`, {
                withCredentials: true
            });

            if (response.data.success) {
                console.log('get notification res', response.data.result);
                setNotifications(response.data.result);
            }


        } catch (error: any) {
            if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
                console.log('401 log', error.response.data.message)
                toast.warn(error.response.data.message);
                setTimeout(() => {
                    window.location.replace('/pages/mentor/profile');
                }, 3000);
                return;
            }
            if (error && error.response?.status === 401) {
                toast.warn(error.response.data.message);
                await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
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
                await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/mentor/login');
                }, 3000);
                return;
            }
            if (error && error.response?.status === 403) {
                console.log('403')
                toast.warn(error.response?.data.message)
                await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
                localStorage.clear()
                setTimeout(() => {
                    // router.push('/pages/mentor/login')
                    window.location.replace('/pages/mentor/login')
                }, 3000)
                return
            }
            if (error && error.response?.status === 401) {
                console.log('401')
                toast.warn(error.response.data.message)
                return
            }
        }
    };

    // Delete Notification
    const handleDelete = async (_id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${MENTOR_SERVICE_URL}/mentor/delete/notification/${_id}`, {
                    withCredentials: true
                });
                if (response?.data?.success) {
                    setNotifications(notifications.filter(notification => notification.senderId !== _id));
                }
            } catch (error: any) {
                if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
                    console.log('401 log', error.response.data.message)
                    toast.warn(error.response.data.message);
                    setTimeout(() => {
                        window.location.replace('/pages/mentor/profile');
                      }, 3000);
                    return;
                }
                if (error && error.response?.status === 401) {
                    toast.warn(error.response.data.message);
                    await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
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
                    await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.replace('/pages/mentor/login');
                    }, 3000);
                    return;
                }
                if (error && error.response?.status === 403) {
                    console.log('403')
                    toast.warn(error.response?.data.message)
                    await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
                    localStorage.clear()
                    setTimeout(() => {
                        // router.push('/pages/mentor/login')
                        window.location.replace('/pages/mentor/login')
                    }, 3000)
                    return
                }
                if (error && error.response?.status === 401) {
                    console.log('401')
                    toast.warn(error.response.data.message)
                    return
                }
            }
        }
    };


    const hanldeNotification = async (senderId: string) => {
        console.log(senderId)
        router.push(`/pages/mentor/chat?senderId=${senderId}`)
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

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
            <div className="flex-grow flex items-center justify-center py-10">
                <div className="w-2/3 max-w-2xl bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>

                    {/* Notification List */}
                    {notifications.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto space-y-4">
                            {notifications.slice(0, 5).map((notification) => (
                                <div
                                    key={notification._id}
                                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer"
                                >
                                    <p className="text-gray-700" onClick={() => hanldeNotification(notification.senderId)}>
                                        You have a chat notification from <span className="font-semibold">{notification.senderName}</span>
                                    </p>
                                    <button
                                        onClick={() => handleDelete(notification.senderId)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No notifications found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MentorNotification;
