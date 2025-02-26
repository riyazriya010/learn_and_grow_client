
"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import socket from "@/utils/socket";
import Navbar from "../navbar";
import MentorFooter from "./footer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EmojiPicker from 'emoji-picker-react';
import { MENTOR_SERVICE_URL, USER_SERVICE_URL } from "@/utils/constant";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

interface StudentData {
  _id: string;
  username: string;
  profilePicUrl: string;
  lastMessage: string;
  mentorMsgCount: number
  updatedAt: string;
}

interface MessageData {
  _id: string;
  message: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  deletedForSender: boolean;
  deletedForReceiver: boolean;
  createdAt: string;
}

interface Mentor {
  userId: string;
  username: string;
  phone: string;
  profile: File | null;
}

const MentoChat = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [inputData, setInputData] = useState<string>('');
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[] | []>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [refreshState, setRefreshState] = useState(0);
  const searchParams = useSearchParams()
  const pathname = usePathname();
  const router = useRouter()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [isTyping, setIsTyping] = useState(false); // State to track typing status
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [user, setUser] = useState<Mentor | null>(null)

  useEffect(() => {
    const getUser = localStorage.getItem('mentor');
    if (getUser) {
      const parsedUser = JSON.parse(getUser);
      setUser(parsedUser);
    }
  }, []);


  const fetchData = async () => {
    try {
      const response = await axios.get(`${MENTOR_SERVICE_URL}/get/students/`, {
        withCredentials: true,
      });
      console.log('mentor got it ', response)
      if (response?.data?.result) {
        const studentData = response.data.result.map(
          (data: { studentData: StudentData }) => data.studentData
        );

        setStudents(studentData)
      }
    } catch (error: any) {
      if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
        console.log('401 log', error.response.data.message)
        toast.warn(error.response.data.message);
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
      if (error && error.response?.status === 403) {
        console.log('403')
        toast.warn(error.response?.data.message)
        Cookies.remove('accessToken')
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

  // get users
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
    const studentId = searchParams.get('senderId');
    if (studentId) {
      const getMentor = async () => {
        try {
          const response = await axios.get(`${MENTOR_SERVICE_URL}/get/student/${studentId}`, {
            withCredentials: true
          })
          console.log('res get student ', response)
          if (response) {
            const student: StudentData = response?.data?.result
            createRoom(student)
          }
        } catch (error: any) {
          if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
            console.log('401 log', error.response.data.message)
            toast.warn(error.response.data.message);
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
          if (error && error.response?.status === 403) {
            console.log('403')
            toast.warn(error.response?.data.message)
            Cookies.remove('accessToken')
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
      socket.emit('mentorTyping', { roomId, userId: user?.userId });
      // setIsTyping(true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a timeout to emit stop typing after 1 second of inactivity
      // typingTimeoutRef.current = setTimeout(() => {
      //     socket.emit('mentorStopTyping', { roomId, userId: user?.userId });
      //     setIsTyping(false);
      // }, 1000);
    } else {
      // If input is cleared, emit stop typing
      socket.emit('mentorsStopTyping', { roomId, userId: user?.userId });
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

    socket.on('studentTyping', handleTyping);
    socket.on('studentStopTyping', handleStopTyping);

    return () => {
      socket.off('studentTyping', handleTyping);
      socket.off('studentStopTyping', handleStopTyping);
    };
  }, [user]);

  //fetch users
  useEffect(() => {

    //setOnline
    socket.emit('onlineUser', user?.userId)

    fetchData();
  }, [user]);

  //connect to server socket
  socket.on("connect", () => {
    console.log(`Mentor connected with socket io ${socket.id}`)
  })

  //scroll top
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);


  const fetchMessage = async (studentId: string) => {
    try {
      const response = await axios.get(`${MENTOR_SERVICE_URL}/get/mentor/messages/${studentId}`, {
        withCredentials: true
      });
      console.log('fetch msg: ', response)
      if (response && response?.data?.result) {
        setMessages(response?.data?.result);
        // Set the last message from the fetched messages
        const filteredMsg = response?.data?.result?.filter((msg: any) => {
          return !msg.deletedForReceiver || (!msg.deletedForSender && msg.senderId !== selectedStudent?._id);
        }).pop();

        const lstMsg = filteredMsg?.message
        setLastMessage(lstMsg || "")
      } else {
        setMessages([]);
      }
    } catch (error: any) {
      if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
        console.log('401 log', error.response.data.message)
        toast.warn(error.response.data.message);
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
      if (error && error.response?.status === 403) {
        console.log('403')
        toast.warn(error.response?.data.message)
        Cookies.remove('accessToken')
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

  // Fetch messages
  useEffect(() => {
    const student = localStorage.getItem('selectedStudent');
    if (student) {
      const parsedStudent = JSON.parse(student);
      setSelectedStudent(parsedStudent);

      fetchMessage(String(parsedStudent?._id));
    } else {
      setSelectedStudent(null);
      setRoomId(null);
    }
  }, [roomId]);


  //notify message count
  const handleUpdateList = async () => {
    await fetchData();
    setRefreshState(prev => prev + 1);
    console.log('refreshState ', refreshState);
    console.log('Student list updated');
  };

  //notify message count
  useEffect(() => {
    socket.on('notifyMentor', handleUpdateList);

    return () => {
      socket.off('notifyMentor', handleUpdateList);
    };
  }, []);


  // Create Room
  const createRoom = async (student: StudentData) => {
    if (student._id) {
      await handleCount(student._id);
    }

    setSelectedStudent(student);
    localStorage.setItem('selectedStudent', JSON.stringify(student));
    try {
      const response = await axios.post(`${MENTOR_SERVICE_URL}/create/mentor/room/`, { studentId: student._id }, {
        withCredentials: true
      });
      setRoomId(response?.data?.result?._id);
      socket.emit('joinRoom', response?.data?.result?._id)
    } catch (error: any) {
      if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
        console.log('401 log', error.response.data.message)
        toast.warn(error.response.data.message);
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
      if (error && error.response?.status === 403) {
        console.log('403')
        toast.warn(error.response?.data.message)
        Cookies.remove('accessToken')
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

  //receive message
  useEffect(() => {
    const handleReceiveMessage = async (data: MessageData) => {
      console.log('Received message:', data);

      setIsTyping(false)

      // Check if the message is for the currently selected mentor
      if (data.senderId === selectedStudent?._id) {
        setLastMessage(data.message);
        await handleCount(selectedStudent._id);
        // If the message is from the selected mentor, add it to the messages
        setMessages((prevMessages) => [...prevMessages, data]);
      } else {
        // If the message is from a different mentor, you can update the unread count
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === data.senderId
              ? { ...student, userMsgCount: student.mentorMsgCount + 1 }
              : student
          )
        );
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    // Clean up the listener on unmount
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [selectedStudent]);


  //save notificaton
  const saveNotification = async (username: string, senderId: string, receiverId: string) => {
    try {
      const data = { username, senderId, receiverId }
      const response = await axios.post(`${USER_SERVICE_URL}/create/chat/notification`, data, {
        withCredentials: true
      })
      if (response) {
        console.log('notification saved to DB response')
      }
    } catch (error: any) {
      if (error && error.response?.status === 401 && error.response.data.message === 'Student Not Verified') {
        console.log('401 log', error.response.data.message)
        toast.warn(error.response.data.message);
        return;
      }
      if (
        error &&
        error?.response?.status === 403 &&
        error?.response?.data?.message === 'Student Blocked'
      ) {
        toast.warn(error?.response?.data?.message);
        Cookies.remove('accessToken');
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/student/login');
        }, 3000);
        return;
      }
      if (error && error.response?.status === 403) {
        toast.warn(error.response.data.message);
        Cookies.remove('accessToken');
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/student/login');
        }, 3000);
        return;
      }
      if (error && error.response?.status === 401) {
        toast.warn(error.response.data.message);
        Cookies.remove('accessToken');
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/student/login');
        }, 3000);
        return;
      }
    }
  }

  // Save message
  const sendMessage = async () => {
    if (!inputData.trim()) return;

    setLastMessage(inputData);
    setInputData('');
    try {
      const data = {
        message: inputData,
        studentId: selectedStudent?._id,
        roomId
      };
      const response = await axios.post(`${MENTOR_SERVICE_URL}/save/mentor/message`, data, {
        withCredentials: true
      });
      if (response) {
        //save notification function
        saveNotification(String(user?.username), String(user?.userId), String(selectedStudent?._id))

        console.log('save message: ', response)
        const messageData = {
          receiverId: selectedStudent?._id,
          message: response.data.result,
          roomId
        }
        await fetchMessage(String(selectedStudent?._id))
        await fetchData()

        socket.emit('studentsStopTyping', { roomId, userId: user?.userId });

        socket.emit('sendMessage', messageData)
      }
      // setMessages((prevMessages) => [...prevMessages, response.data.result]);
    } catch (error: any) {
      if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
        console.log('401 log', error.response.data.message)
        toast.warn(error.response.data.message);
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
      if (error && error.response?.status === 403) {
        console.log('403')
        toast.warn(error.response?.data.message)
        Cookies.remove('accessToken')
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

  //deletedMessage socket
  useEffect(() => {
    const handlefetchMessage = async () => {
      console.log('delete invoked student');
      if (selectedStudent) {
        await fetchMessage(selectedStudent._id);
      }
      setRefreshState(prev => prev + 1);
    };

    socket.on('deletedMessage', handlefetchMessage);

    return () => {
      socket.off('deletedMessage', handlefetchMessage);
    };
  }, [selectedStudent]);

  // Delete message
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
        const response = await axios.patch(`${MENTOR_SERVICE_URL}/delete/mentor/message/everyone/${messageId}`, {}, {
          withCredentials: true
        });
        if (response) {
          socket.emit('deleteNotify')

          await fetchData()
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === messageId
                ? { ...msg, deletedForSender: true, deletedForReceiver: true }
                : msg
            )
          );
        }
      } catch (error: any) {
        if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
          console.log('401 log', error.response.data.message)
          toast.warn(error.response.data.message);
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
        if (error && error.response?.status === 403) {
          console.log('403')
          toast.warn(error.response?.data.message)
          Cookies.remove('accessToken')
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
    } else if (result.isDenied) {
      try {
        const response = await axios.patch(`${MENTOR_SERVICE_URL}/delete/mentor/message/me/${messageId}`, {}, {
          withCredentials: true
        });
        if (response) {
          await fetchData()
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === messageId
                ? { ...msg, deletedForSender: true }
                : msg
            )
          );
        }

      } catch (error: any) {
        if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
          console.log('401 log', error.response.data.message)
          toast.warn(error.response.data.message);
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
        if (error && error.response?.status === 403) {
          console.log('403')
          toast.warn(error.response?.data.message)
          Cookies.remove('accessToken')
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


  //reduce message count
  const handleCount = async (studentId: string) => {
    try {
      const response = await axios.patch(`${MENTOR_SERVICE_URL}/reset/mentor/count/${studentId}`, {}, {
        withCredentials: true
      })
      if (response) {
        console.log('count respo ', response)
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === studentId ? { ...student, mentorMsgCount: 0 } : student
          )
        );
      }
    } catch (error: any) {
      if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
        console.log('401 log', error.response.data.message)
        toast.warn(error.response.data.message);
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
      if (error && error.response?.status === 403) {
        console.log('403')
        toast.warn(error.response?.data.message)
        Cookies.remove('accessToken')
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

        {/* Main Content - Grows to push Footer down */}


        <div className="flex-grow flex flex-col md:flex-row justify-between items-start p-4 md:p-6 bg-white">

          {/* Left Section: Chat List */}
          <div className="w-full md:w-1/3 max-h-[600px] overflow-y-auto pr-4">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Student Chat</h1>
            <ul className="space-y-4">
              {students.slice(0, 6).map((student) => (
                <li
                  key={student._id}
                  className={`border border-gray-300 shadow-sm p-3 md:p-4 rounded-lg flex items-center cursor-pointer transition hover:shadow-md hover:bg-gray-50 ${selectedStudent?._id === student._id ? 'bg-gray-100 border-blue-500' : ''}`}
                  onClick={() => createRoom(student)}
                >
                  <Image
                    src={student?.profilePicUrl || "/default-profile.png"}
                    alt="profile"
                    width={48} height={48}
                    className="rounded-full mr-3 md:mr-4 object-cover border border-gray-200"
                  />
                  <div>
                    <p className="font-medium text-md md:text-lg text-gray-700">{student.username}</p>
                    <p className="text-sm text-gray-500">
                      {student._id === selectedStudent?._id ? lastMessage || student.lastMessage : student.lastMessage}
                    </p>
                  </div>
                  {student._id !== selectedStudent?._id && student.mentorMsgCount > 0 && (
                    <span className="ml-auto w-5 h-5 md:w-6 md:h-6 flex items-center justify-center border border-green-500 bg-green-500 text-white rounded-full text-xs">
                      {student?.mentorMsgCount}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {students.length > 6 && (
              <p className="text-blue-600 mt-4 text-center cursor-pointer hover:underline">Show more...</p>
            )}
          </div>

          {/* Right Section: Messages */}
          <div className="w-full md:w-2/3 flex flex-col bg-white shadow-lg rounded-lg p-4 md:p-6 h-full">

            {/* Chat Header */}
            {selectedStudent && (
              <div className="flex items-center justify-between mb-3 md:mb-4 p-3 md:p-4 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Image
                    src={selectedStudent.profilePicUrl}
                    alt="profile"
                    width={48} height={48}
                    className="rounded-full mr-3 md:mr-4 object-cover border border-gray-200"
                  />
                  <div>
                    <p className="text-md md:text-lg font-bold text-gray-700">{selectedStudent.username}</p>
                    {isTyping && <div className="text-gray-500 italic text-sm">Typing...</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Messages List */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 md:p-4 bg-gray-50 rounded-lg scrollbar-hide"
              style={{ maxHeight: '60vh' }}
            >
              {(() => {
                let currentGroup: { dateLabel: string; messages: MessageData[] } | null = null;

                return messages.reduce((acc, data: MessageData) => {
                  const messageDate = new Date(data.createdAt);
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(today.getDate() - 1);

                  const messageDateFormatted = messageDate.toLocaleDateString();
                  const todayFormatted = today.toLocaleDateString();
                  const yesterdayFormatted = yesterday.toLocaleDateString();

                  let dateLabel = "";
                  if (messageDateFormatted === todayFormatted) {
                    dateLabel = "Today";
                  } else if (messageDateFormatted === yesterdayFormatted) {
                    dateLabel = "Yesterday";
                  } else {
                    dateLabel = messageDateFormatted;
                  }

                  if (!currentGroup || currentGroup.dateLabel !== dateLabel) {
                    if (currentGroup) acc.push(currentGroup);
                    currentGroup = { dateLabel, messages: [data] };
                  } else {
                    currentGroup.messages.push(data);
                  }

                  return acc;
                }, [] as { dateLabel: string; messages: MessageData[] }[]).map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <div className="w-full text-center text-gray-500 text-xs md:text-sm my-2">
                      {group.dateLabel}
                    </div>
                    {group.messages.map((data, messageIndex) => {
                      const isMentorMessage = data.senderId === selectedStudent?._id;
                      const deleteForMe = data.deletedForSender && data.senderId !== selectedStudent?._id;
                      const deleteForEveryOneMentor = data.deletedForReceiver && data.senderId === selectedStudent?._id;
                      const deleteForEveryOneStudent = data.deletedForReceiver && data.senderId !== selectedStudent?._id;

                      let messageContent = data.message;
                      let messageClass = isMentorMessage ? 'bg-blue-100 text-gray-700' : 'bg-green-100 text-gray-700';

                      if (deleteForMe || deleteForEveryOneStudent) {
                        messageContent = "Deleted by you";
                        messageClass = 'bg-gray-300 text-black-700';
                      } else if (deleteForEveryOneMentor) {
                        messageContent = "Deleted by student";
                        messageClass = 'bg-gray-300 text-black-700';
                      }

                      return (
                        <div key={messageIndex} className={`flex ${isMentorMessage ? 'justify-start' : 'justify-end'} w-full`}>
                          <div
                            onClick={() => {
                              if (!isMentorMessage && messageContent !== "Deleted by you" && messageContent !== "Deleted by student") {
                                deleteMessage(data._id);
                              }
                            }}
                            className={`relative p-2 md:p-3 mt-3 md:mt-4 rounded-lg shadow-md max-w-[80%] md:max-w-[75%] min-w-[50px] cursor-pointer text-xs md:text-sm transition-transform hover:scale-105 ${messageClass} break-words flex justify-between items-center`}
                          >
                            <span className="text-left">{messageContent}</span>
                            <span className="text-[9px] md:text-[10px] text-gray-500 whitespace-nowrap ml-2">
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
            {showEmojiPicker && (
              <div className="bottom-14 left-4 w-48 md:w-64">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <div className="flex items-center space-x-2 md:space-x-3 mt-3">
              <button onClick={toggleEmojiPicker} className="text-lg">😀</button>
              <input
                type="text"
                value={inputData}
                className="border border-gray-300 p-2 md:p-3 w-full rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleInputChange}
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 md:px-5 py-2 md:py-3 rounded-lg shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300 transition"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>

          </div>
        </div>


        {/* Footer - Always stays at the bottom */}
        <MentorFooter />
      </div>
    </>

  );
};

export default MentoChat;


