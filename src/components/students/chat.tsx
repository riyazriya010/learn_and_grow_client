"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import socket from "@/utils/socket";
import Swal from "sweetalert2";
import Navbar from "../navbar";
import Footer from "../loggedoutNav/footer";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import EmojiPicker from 'emoji-picker-react';
import { MENTOR_SERVICE_URL, USER_SERVICE_URL } from "@/utils/constant";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { clearUserDetials } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";

interface MentorsData {
    _id: string;
    username: string;
    profilePicUrl: string;
    lastMessage: string;
    userMsgCount: number
    updatedAt: string;
}

interface MessageData {
    _id: string
    message: string;
    senderId: string;
    receiverId: string;
    roomId: string;
    deletedForSender: boolean;
    deletedForReceiver: boolean;
    createdAt: string;
    readed: boolean
}

interface User {
    userId: string;
    username: string;
    phone: string;
    profile: File | null;
}


const StudentChat = () => {
    const [mentors, setMentors] = useState<MentorsData[]>([]);
    const [inputData, setInputData] = useState<string>('')
    const [lastMessage, setLastMessage] = useState<string | null>(null)
    const [messages, setMessages] = useState<MessageData[] | []>([])
    const [selectedMentor, setSelectedMentor] = useState<MentorsData | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null)
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [refreshState, setRefreshState] = useState(0);
    const searchParams = useSearchParams()
    const pathname = usePathname();
    const router = useRouter()
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const dispatch = useDispatch()


    const [isTyping, setIsTyping] = useState(false); // State to track typing status
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const getUser = localStorage.getItem('user');
        if (getUser) {
            const parsedUser = JSON.parse(getUser);
            setUser(parsedUser);
        }
    }, []);


    //fetch mentors
    const fetchData = async () => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/get/mentors/`, {
                withCredentials: true,
            });
            console.log("get mentors: ", response);
            if (response?.data?.result) {
                const mentorData = response.data.result.map(
                    (data: { mentorsData: MentorsData }) => data.mentorsData
                );

                setMentors(mentorData)
            }
        } catch (error: any) {
            if (error && error.response?.status === 401) {
                console.log('401 log', error.response.data.message)
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
            if (error && error.response?.status === 403) {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/student/login');
                }, 3000);
                return;
            }
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
        }
    };


    // fetch users
    useEffect(() => {
        fetchData();
    }, []);

    //handle emoji click
    const handleEmojiClick = (emojiData: { emoji: string }) => {
        setInputData((prevMessage) => prevMessage + emojiData.emoji);
    };

    // Toggle emoji picker visibility
    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };


    // Find and set mentor when mentorId is available in params
    useEffect(() => {
        const mentorId = searchParams.get('senderId');
        if (mentorId) {
            const getMentor = async () => {
                try {
                    const response = await axios.get(`${USER_SERVICE_URL}/get/mentor/${mentorId}`, {
                        withCredentials: true
                    })
                    console.log('res get ment ', response)
                    if (response) {
                        const mentor: MentorsData = response?.data?.result
                        createRoom(mentor)
                    }
                } catch (error: any) {
                    if (error && error.response?.status === 401 && error.response.data.message === 'Student Not Verified') {
                        console.log('401 log', error.response.data.message)
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
                    if (error && error.response?.status === 403) {
                        toast.warn(error.response.data.message);
                        Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                        dispatch(clearUserDetials());
                        localStorage.clear();
                        setTimeout(() => {
                            window.location.replace('/pages/student/login');
                        }, 3000);
                        return;
                    }
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
                }

            }
            getMentor()
        }
    }, []);

    //remove params from path
    useEffect(() => {
        const senderId = searchParams.get("senderId");

        if (senderId) {
            // Remove senderId from the URL
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("senderId"); // Remove senderId

            router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
        }
    }, [searchParams]);





    // Emit typing event when user types
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);

        if (e.target.value) {
            // Emit typing event
            socket.emit('studentTyping', { roomId, userId: user?.userId });
            // setIsTyping(true);

            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set a timeout to emit stop typing after 1 second of inactivity
            // typingTimeoutRef.current = setTimeout(() => {
            //     socket.emit('studentTyping', { roomId, userId: user?.userId });
            //     setIsTyping(false);
            // }, 1000);
        } else {
            // If input is cleared, emit stop typing
            socket.emit('studentsStopTyping', { roomId, userId: user?.userId });
            setIsTyping(false);
        }
    };

    // Listen for typing events from the server
    useEffect(() => {
        const handleTyping = (data: { userId: string }) => {
            // Logic to show typing indicator for the specific user
            if (data.userId !== user?.userId) {
                setIsTyping(true);
            }
        };

        const handleStopTyping = (data: { userId: string }) => {
            // Logic to hide typing indicator for the specific user
            if (data.userId !== user?.userId) {
                setIsTyping(false);
            }
        };

        socket.on('mentorTyping', handleTyping);
        socket.on('mentorStopTyping', handleStopTyping);

        return () => {
            socket.off('mentorTyping', handleTyping);
            socket.off('mentorStopTyping', handleStopTyping);
        };
    }, [user]);


    //connect to server socket
    socket.on("connect", () => {
        console.log(`Student connected with socket io ${socket.id}`)
    })

    //scroll top
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);


    //fetch message
    const fetchMessage = async (mentorId: string) => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/get/messages/${mentorId}`, {
                withCredentials: true
            })
            console.log('get msg: ', response)
            if (response && response?.data?.result) {
                setMessages(response?.data?.result)

                const filteredMsg = response?.data?.result?.filter((msg: any) => {
                    return !msg.deletedForReceiver || (!msg.deletedForSender && msg.senderId === selectedMentor?._id);
                }).pop();

                const lstMsg = filteredMsg?.message
                setLastMessage(lstMsg || "")

                // const lastMsg = response.data.result[response.data.result.length - 1];
                // setLastMessage(lastMsg?.message || "");
            } else {
                setMessages([])
            }
        } catch (error: any) {

            if (error && error.response?.status === 401 && error.response.data.message === 'Student Not Verified') {
                console.log('401 log', error.response.data.message)
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
            if (error && error.response?.status === 403) {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/student/login');
                }, 3000);
                return;
            }
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

        }
    }

    //fetch message
    useEffect(() => {
        const mentor = localStorage.getItem('selectedMentor');
        if (mentor) {
            const parsedMentor = JSON.parse(mentor)
            setSelectedMentor(parsedMentor);

            fetchMessage(String(parsedMentor?._id))
        } else {
            setSelectedMentor(null)
            setRoomId(null)
        }
    }, [roomId])


    //notify message count
    const handleUpdateList = async () => {
        await fetchData();
        setRefreshState(prev => prev + 1);
        console.log('Mentors list updated');
        console.log('Mentors list updated');
    };

    //notify message count
    useEffect(() => {
        socket.on('notify', handleUpdateList);

        return () => {
            socket.off('notify', handleUpdateList);
        };
    }, []);


    // Receive message
    useEffect(() => {
        const handleReceiveMessage = async (data: MessageData) => {
            console.log('Received message:', data);

            setIsTyping(false)

            // Check if the message is for the currently selected mentor
            if (data.senderId === selectedMentor?._id) {
                setLastMessage(data.message);
                await handleCount(selectedMentor._id);
                // If the message is from the selected mentor, add it to the messages
                setMessages((prevMessages) => [...prevMessages, data]);
            } else {
                // If the message is from a different mentor, you can update the unread count
                setMentors((prevMentors) =>
                    prevMentors.map((mentor) =>
                        mentor._id === data.senderId
                            ? { ...mentor, userMsgCount: mentor.userMsgCount + 1 }
                            : mentor
                    )
                );
            }

            // Update the last message displayed
        };

        socket.on('receiveMessage', handleReceiveMessage);

        // Clean up the listener on unmount
        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [selectedMentor]); // Add selectedMentor as a dependency




    // Create Room
    const createRoom = async (mentor: MentorsData) => {
        // handleCount(mentor._id)
        if (mentor._id) {
            await handleCount(mentor._id);
        }

        setSelectedMentor(mentor)
        localStorage.setItem('selectedMentor', JSON.stringify(mentor))
        try {
            const respose = await axios.post(`${USER_SERVICE_URL}/create/room/`, { mentorId: mentor._id }, {
                withCredentials: true
            })
            if (respose) {
                console.log('create room: ', respose)
                setRoomId(respose?.data?.result?._id)
                socket.emit('joinRoom', respose?.data?.result?._id)
            }
        } catch (error: any) {
            if (error && error.response?.status === 401 && error.response.data.message === 'Student Not Verified') {
                console.log('401 log', error.response.data.message)
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
            if (error && error.response?.status === 403) {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/student/login');
                }, 3000);
                return;
            }
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
        }
    }


    //save notificaton
    const saveNotification = async (username: string, senderId: string, receiverId: string) => {
        try {
            const data = { username, senderId, receiverId }
            const response = await axios.post(`${MENTOR_SERVICE_URL}/create/mentor/chat/notification`, data, {
                withCredentials: true
            })
            if (response) {
                console.log('notification saved to DB response')
            }
        } catch (error: any) {
            if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
                console.log('401 log', error.response.data.message)
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/student/login');
                }, 3000);
                return;
            }
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
                error?.response?.data?.message === 'Mentor Blocked'
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
            if (error && error.response?.status === 403) {
                console.log('403')
                toast.warn(error.response?.data.message)
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear()
                setTimeout(() => {
                    // router.push('/pages/mentor/login')
                    window.location.replace('/pages/student/login')
                }, 3000)
                return
            }
            if (error && error.response?.status === 401) {
                console.log('401')
                toast.warn(error.response.data.message)
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear()
                setTimeout(() => {
                    // router.push('/pages/mentor/login')
                    window.location.replace('/pages/student/login')
                }, 3000)
                return
            }
        }
    }

    //save message
    const sendMessage = async () => {
        if (!inputData) return

        if (!inputData || !selectedMentor) return;

        setLastMessage(inputData)
        setInputData('')
        try {
            const data = {
                message: inputData,
                mentorId: selectedMentor?._id,
                roomId
            }
            const response = await axios.post(`${USER_SERVICE_URL}/save/message`, data, {
                withCredentials: true
            })
            if (response) {
                saveNotification(String(user?.username), String(user?.userId), String(selectedMentor?._id))

                console.log('save message: ', response)
                const messageData = {
                    receiverId: selectedMentor?._id,
                    message: response.data.result,
                    roomId
                }
                await fetchMessage(selectedMentor._id)
                await fetchData()
                socket.emit('sendMessage', messageData)
            }

            // setMessages((prevMessages) => [...prevMessages, response.data.result]);
        } catch (error: any) {
            if (error && error.response?.status === 401 && error.response.data.message === 'Student Not Verified') {
                console.log('401 log', error.response.data.message)
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear()
                setTimeout(() => {
                    // router.push('/pages/mentor/login')
                    window.location.replace('/pages/student/login')
                }, 3000)
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
            if (error && error.response?.status === 403) {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/student/login');
                }, 3000);
                return;
            }
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
        }
    }


    //deletedMessage socket
    useEffect(() => {
        const handlefetchMessage = async () => {
            console.log('delete invoked student');
            if (selectedMentor) {
                await fetchMessage(selectedMentor._id);
            }
            setRefreshState(prev => prev + 1);
            console.log('refreshState ', refreshState)
        };

        socket.on('deletedMessage', handlefetchMessage);

        return () => {
            socket.off('deletedMessage', handlefetchMessage);
        };
    }, [selectedMentor]);

    // Delete Message
    const deleteMessage = async (messageId: string) => {
        const result = await Swal.fire({
            title: "Delete Message?",
            text: "Choose an option to delete the message.",
            icon: "warning",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: "#d33",
            denyButtonColor: "#3085d6",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Delete for Everyone",
            denyButtonText: "Delete for Me",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.patch(`${USER_SERVICE_URL}/delete/message/everyone/${messageId}`, {}, {
                    withCredentials: true
                })
                if (response) {
                    socket.emit('deleteNotify')

                    console.log('delete ', response)
                    await fetchData()

                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg._id === messageId
                                ? { ...msg, deletedForSender: true, deletedForReceiver: true }
                                : msg
                        )
                    );
                }
                console.log("Message deleted for everyone. Message ID:", messageId);
            } catch (error: any) {
                if (error && error.response?.status === 401 && error.response.data.message === 'Student Not Verified') {
                    console.log('401 log', error.response.data.message)
                    toast.warn(error.response.data.message);
                    Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                    dispatch(clearUserDetials());
                    localStorage.clear()
                    setTimeout(() => {
                        // router.push('/pages/mentor/login')
                        window.location.replace('/pages/student/login')
                    }, 3000)
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
                if (error && error.response?.status === 403) {
                    toast.warn(error.response.data.message);
                    Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                    dispatch(clearUserDetials());
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.replace('/pages/student/login');
                    }, 3000);
                    return;
                }
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
            }
        } else if (result.isDenied) {
            try {
                const response = await axios.patch(`${USER_SERVICE_URL}/delete/message/me/${messageId}`, {}, {
                    withCredentials: true
                })
                if (response) {
                    console.log('delete ', response)
                    await fetchData()

                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg._id === messageId
                                ? { ...msg, deletedForSender: true }
                                : msg
                        )
                    );

                }
                console.log("Message deleted for me. Message ID:", messageId);
                // Add your logic to delete the message for the current user here
            } catch (error: any) {
                if (error && error.response?.status === 401 && error.response.data.message === 'Student Not Verified') {
                    console.log('401 log', error.response.data.message)
                    toast.warn(error.response.data.message);
                    Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                    dispatch(clearUserDetials());
                    localStorage.clear()
                    setTimeout(() => {
                        // router.push('/pages/mentor/login')
                        window.location.replace('/pages/student/login')
                    }, 3000)
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
                if (error && error.response?.status === 403) {
                    toast.warn(error.response.data.message);
                    Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                    dispatch(clearUserDetials());
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.replace('/pages/student/login');
                    }, 3000);
                    return;
                }
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
            }
        } else {
            console.log("Delete action canceled.");
        }
    };

    //reduce message count
    const handleCount = async (mentorId: string) => {
        try {
            const response = await axios.patch(`${USER_SERVICE_URL}/reset/count/${mentorId}`, {}, {
                withCredentials: true
            })
            if (response) {
                console.log('count respo ', response)
                setMentors((prevMentors) =>
                    prevMentors.map((mentor) =>
                        mentor._id === mentorId ? { ...mentor, userMsgCount: 0 } : mentor
                    )
                );
            }
        } catch (error: any) {
            if (error && error.response?.status === 401 && error.response.data.message === 'Student Not Verified') {
                console.log('401 log', error.response.data.message)
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear()
                setTimeout(() => {
                    // router.push('/pages/mentor/login')
                    window.location.replace('/pages/student/login')
                }, 3000)
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
            if (error && error.response?.status === 403) {
                toast.warn(error.response.data.message);
                Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
                dispatch(clearUserDetials());
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/student/login');
                }, 3000);
                return;
            }
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
        }
    }


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

                {/* Main Chat Container */}
                <div className="flex-grow flex justify-between items-start p-6 bg-white-100">
                    {/* Left Section: Mentor Chat List */}
                    {/* <div className="w-1/3 max-h-[600px] overflow-y-auto pr-4">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Mentor Chat</h1>
                        <ul className="space-y-4">
                            {mentors.slice(0, 6).map((mentor) => (
                                <li
                                    key={mentor._id}
                                    className={`border border-gray-300 shadow-sm p-4 rounded-lg flex items-center justify-between cursor-pointer transition hover:shadow-md hover:bg-gray-50 ${selectedMentor?._id === mentor._id ? 'bg-gray-100 border-blue-500' : ''
                                        }`}
                                    onClick={() => createRoom(mentor)}
                                >

                                    <div className="flex items-center">
                                        <img
                                            src={mentor?.profilePicUrl}
                                            alt="profile"
                                            className="w-14 h-14 rounded-full mr-4 object-cover border border-gray-200"
                                        />
                                        <div>
                                            <p className="font-medium text-lg text-gray-700">{mentor.username}</p>
                                            <p className="text-sm text-gray-500">
                                                {' '}
                                                {mentor._id === selectedMentor?._id ? lastMessage || mentor.lastMessage : mentor.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                    <p>
                                        {new Date(mentor.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </p>
                                    {mentor._id !== selectedMentor?._id && mentor.userMsgCount > 0 && (
                                        <span className="ml-auto w-6 h-6 flex items-center justify-center border border-green-500 bg-green-500 text-white rounded-full">
                                            {mentor?.userMsgCount}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {mentors.length > 6 && (
                            <p className="text-blue-600 mt-4 text-center cursor-pointer hover:underline">Show more...</p>
                        )}
                    </div> */}
                    <div className="w-1/3 max-h-[600px] overflow-y-auto pr-4">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Mentor Chat</h1>
                        <ul className="space-y-4">
                            {mentors.slice(0, 6).map((mentor) => (
                                <li
                                    key={mentor._id}
                                    className={`relative border border-gray-300 shadow-sm p-4 rounded-lg flex items-center cursor-pointer transition hover:shadow-md hover:bg-gray-50 ${selectedMentor?._id === mentor._id ? 'bg-gray-100 border-blue-500' : ''
                                        }`}
                                    onClick={() => createRoom(mentor)}
                                >
                                    {/* Timestamp at the top-right */}
                                    <p className="absolute top-2 right-3 text-xs text-gray-500">
                                        {new Date(mentor.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </p>

                                    <div className="flex items-center">
                                        <img
                                            src={mentor?.profilePicUrl}
                                            alt="profile"
                                            className="w-14 h-14 rounded-full mr-4 object-cover border border-gray-200"
                                        />
                                        <div>
                                            <p className="font-medium text-lg text-gray-700">{mentor.username}</p>
                                            <p className="text-sm text-gray-500">
                                                {mentor._id === selectedMentor?._id ? lastMessage || mentor.lastMessage : mentor.lastMessage}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Unread message count */}
                                    {mentor._id !== selectedMentor?._id && mentor.userMsgCount > 0 && (
                                        <span className="ml-auto w-6 h-6 flex items-center justify-center border border-green-500 bg-green-500 text-white rounded-full">
                                            {mentor?.userMsgCount}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {mentors.length > 6 && (
                            <p className="text-blue-600 mt-4 text-center cursor-pointer hover:underline">Show more...</p>
                        )}
                    </div>


                    {/* Right Section: Messages */}
                    <div className="w-2/3 flex flex-col bg-white shadow-lg rounded-lg p-6 min-h-[80vh]">
                        {selectedMentor ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <div className="flex items-center">
                                        <img
                                            src={selectedMentor.profilePicUrl}
                                            alt="profile"
                                            className="w-14 h-14 rounded-full mr-4 object-cover border border-gray-200"
                                        />
                                        <div>
                                            <p className="text-lg font-bold text-gray-700">{selectedMentor.username}</p>
                                            {isTyping && <div className="text-gray-500 italic">Typing...</div>}
                                        </div>
                                    </div>
                                </div>


                                {/* Messages List */}
                                <div
                                    ref={messagesContainerRef}
                                    className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-gray-50 rounded-lg scrollbar-hide"
                                    style={{ maxHeight: '65vh' }}
                                >
                                    {(() => {
                                        // Group messages by their date
                                        const groupedMessages: { dateLabel: string; messages: MessageData[] }[] = [];
                                        let currentGroup: { dateLabel: string; messages: MessageData[] } | null = null;

                                        messages.forEach((data: MessageData) => {
                                            const messageDate = new Date(data.createdAt);
                                            const today = new Date();
                                            const yesterday = new Date(today);
                                            yesterday.setDate(today.getDate() - 1);

                                            const messageDateFormatted = messageDate.toLocaleDateString();
                                            const todayFormatted = today.toLocaleDateString();
                                            const yesterdayFormatted = yesterday.toLocaleDateString();

                                            // Determine the date label for the group
                                            let dateLabel = "";
                                            if (messageDateFormatted === todayFormatted) {
                                                dateLabel = "Today";
                                            } else if (messageDateFormatted === yesterdayFormatted) {
                                                dateLabel = "Yesterday";
                                            } else {
                                                dateLabel = messageDateFormatted; // Shows the date for older messages
                                            }

                                            // Start a new group if necessary
                                            if (!currentGroup || currentGroup.dateLabel !== dateLabel) {
                                                if (currentGroup) {
                                                    groupedMessages.push(currentGroup); // Push the last group
                                                }
                                                currentGroup = { dateLabel, messages: [data] };
                                            } else {
                                                currentGroup.messages.push(data);
                                            }
                                        });

                                        // Push the last group if any
                                        if (currentGroup) {
                                            groupedMessages.push(currentGroup);
                                        }

                                        return groupedMessages.map((group, groupIndex) => (
                                            <div key={groupIndex}>
                                                {/* Date label */}
                                                <div className="w-full text-center text-gray-500 text-sm my-2">
                                                    {group.dateLabel}
                                                </div>

                                                {/* Render messages for this date group */}
                                                {group.messages.map((data: MessageData, messageIndex: number) => {
                                                    const isMentorMessage = data.senderId === selectedMentor?._id;
                                                    const deleteForMe = data.deletedForSender && data.senderId !== selectedMentor?._id;
                                                    const deleteForEveryOneMentor = data.deletedForReceiver && data.senderId === selectedMentor._id;
                                                    const deleteForEveryOneStudent = data.deletedForReceiver && data.senderId !== selectedMentor._id;

                                                    let messageContent = data.message;
                                                    let messageClass = isMentorMessage ? 'bg-blue-100 text-gray-700' : 'bg-green-100 text-gray-700';

                                                    if (deleteForMe || deleteForEveryOneStudent) {
                                                        messageContent = "Deleted by you";
                                                        messageClass = 'bg-gray-300 text-black-700';
                                                    } else if (deleteForEveryOneMentor) {
                                                        messageContent = "Deleted by mentor";
                                                        messageClass = 'bg-gray-300 text-black-700';
                                                    }

                                                    const isDeletedMessage = messageContent === "Deleted by you" || messageContent === "Deleted by mentor";

                                                    const handleClick = () => {
                                                        if (!isMentorMessage && !isDeletedMessage) {
                                                            deleteMessage(data._id);
                                                        }
                                                    };

                                                    return (
                                                        <div key={messageIndex} className={`flex ${isMentorMessage ? 'justify-start' : 'justify-end'} w-full`}>
                                                            <div
                                                                onClick={handleClick}
                                                                className={`relative p-3 mt-4 rounded-lg shadow-md max-w-[75%] min-w-[50px] cursor-pointer text-sm transition-transform hover:scale-105 ${messageClass} break-words flex justify-between items-center`}
                                                            >
                                                                {/* Message content on the left */}
                                                                <span className="text-left">{messageContent}</span>

                                                                {/* Timestamp aligned to the right */}
                                                                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                                                                    {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ));
                                    })()}
                                </div>


                                {/* Input Field and Send Button */}

                                {/* Emoji picker */}
                                {showEmojiPicker && (
                                    <div className="bottom-14 left-4 w-64">
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </div>
                                )}

                                <div className="flex items-center space-x-3">
                                    {/* Show emoji picker button */}
                                    <button onClick={toggleEmojiPicker} className="emoji-button">
                                        😀
                                    </button>
                                    <input
                                        type="text"
                                        value={inputData}
                                        className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                                        onChange={handleInputChange}
                                        placeholder="Type your message..."
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300 transition"
                                        onClick={sendMessage}
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center flex-col h-full text-center">
                                <div className="p-4 bg-gray-200 rounded-full">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-16 h-16 text-gray-500"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.25 15.75h-.75A2.25 2.25 0 015.25 13.5v-7.5A2.25 2.25 0 017.5 3.75h9a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-.75m-6 0h6m-6 0V18a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-2.25m-6 0h6"
                                        />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-semibold text-gray-600 mt-4">Select a Mentor to Start Chatting</h1>
                                <p className="text-gray-500 mt-2">Click on a mentor from the left panel to begin the conversation.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
};

export default StudentChat;


