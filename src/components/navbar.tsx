
"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUserDetials } from "@/redux/slices/userSlice"; // You can create this action
import { clearUserDetials as clearMentor } from "@/redux/slices/mentorSlice"; // You can create this action
import socket from "@/utils/socket";
import Link from "next/link";
import axios from "axios";
import { MENTOR_SERVICE_URL, USER_SERVICE_URL } from "@/utils/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  userId?: string;
  username: string;
}

interface Mentor {
  username: string;
}

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();

  // Fetch user and mentor info from Redux state
  const Uname = useSelector((state: RootState) => state.user.username);
  const Mname = useSelector((state: RootState) => state.mentor.username);

  // State to determine if the user or mentor is present
  const [user, setUser] = useState<User | null>(null);
  const [mentor, setMentor] = useState<Mentor | null>(null);

  // user notification
  // const [courseMessage, setCourseMessage] = useState<boolean>(false)
  // const [chatMessage, setChatMessage] = useState<boolean>(false)
  // const [notify, setNotify] = useState<boolean>(false)
  // const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

  // //mentor notification
  // const [mentorChatMessage, setMentorChatMessage] = useState<boolean>(false)
  // const [mentorNotify, setMentorNotify] = useState<boolean>(false)

  const [studentCount, setStudentCount] = useState<number>(0)
  const [mentorCount, setMentorCount] = useState<number>(0)
  // const [audio] = useState(new Audio("/Audio/notification.mp3"));


  // Handle dropdown toggle
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Mentor Handle logout
  const mentorLogout = async () => {
    await axios.post(
      `${MENTOR_SERVICE_URL}/mentor/logout`,
      {},
      { withCredentials: true }
    );
    localStorage.clear();
    Cookies.remove("accessToken");
    // Cookies.remove("refreshToken");

    dispatch(clearUserDetials());
    dispatch(clearMentor());
    setTimeout(() => {
      window.location.replace("/");
    }, 2000)
    // router.replace("/");
  };

  // Studnet Handle logout
  const studentLogout = async () => {
    await axios.post(
      `${USER_SERVICE_URL}/student/logout`,
      {},
      { withCredentials: true }
    );
    localStorage.clear();
    Cookies.remove("accessToken");
    // Cookies.remove("refreshToken");

    dispatch(clearUserDetials());
    dispatch(clearMentor());
    setTimeout(() => {
      window.location.replace("/");
    }, 2000)
    // router.replace("/");
  };

  // Helper function to generate initials
  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name.split(" ").map((word) => word[0].toUpperCase()).join("");
  };

  useEffect(() => {
    // notify check
    const getCourseMessage = localStorage.getItem('courseNotification')
    const getChatMessage = localStorage.getItem('chatNotification')
    const getMentorChatMessage = localStorage.getItem('mentorChat')
    if (getChatMessage || getCourseMessage) {
      // setNotify(true)
    }
    if (getMentorChatMessage) {
      // setMentorNotify(true)
    }

    // Check if user or mentor data is available in localStorage
    const storedUser = localStorage.getItem("user");
    const storedMentor = localStorage.getItem("mentor");

    if (storedUser !== undefined) {
      try {
        setUser(JSON?.parse(String(storedUser)) as User);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }

    if (storedMentor !== undefined) {
      try {
        setMentor(JSON?.parse(String(storedMentor)) as Mentor);
      } catch (error) {
        console.error("Error parsing mentor data:", error);
        setMentor(null);
      }
    }
  }, []);

  /////////////////////////////////////// Notification Start ///////////////////////////

  //////////////////////////////////// User Notfication ///////////////////

  // Chat Notify Effect
  useEffect(() => {
    const handleChatNotify = (receiverId: string) => {
      const getUser = localStorage.getItem("user");
      if (getUser) {
        const parsedUser = JSON.parse(getUser)
        console.log('parsedUser:  ', parsedUser)
        console.log('receiverId:  ', receiverId)
        if (parsedUser?.userId === receiverId) {
          console.log('revId matched: ')
          fetchMessageCount()
          // audio.play()
        }
      }


    };

    socket.on("chatNotify", handleChatNotify);

    return () => {
      socket.off("courseNotify", handleChatNotify);
    };
  }, []);

  //////////////////////////////////// Mentor Notfication ////////////////////////

  //mentor chat notify
  useEffect(() => {
    const handleMentorChatNotify = () => {
      fetchMentorMessageCount()
      // audio.play()
    };

    socket.on("mentorChatNotify", handleMentorChatNotify);

    return () => {
      socket.off("mentorChatNotify", handleMentorChatNotify);
    };
  }, []);


  ////////////////////////////////// Student New Notification /////////////////////////

  const fetchMessageCount = async () => {
    try {
      const getUser = localStorage.getItem("user");
      if (!getUser) return;
      const parsedUser = JSON.parse(getUser)
      const studentId = parsedUser?.userId
      const response = await axios.get(`${USER_SERVICE_URL}/get/student/notification/count/${studentId}`, {
        withCredentials: true
      })
      console.log('student noti count', response)
      if (response) {
        setStudentCount(response?.data?.result?.count)
      }

    } catch (error: any) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMessageCount()
  }, [studentCount])


  //////////////////////////////////// Mentor New Notification /////////////////


  const fetchMentorMessageCount = async () => {
    try {
      const getMentor = localStorage.getItem("mentor");
      if (!getMentor) return;
      const parsedMentor = JSON.parse(getMentor)
      const mentorId = parsedMentor?.userId
      const response = await axios.get(`${MENTOR_SERVICE_URL}/get/mentor/notification/count/${mentorId}`, {
        withCredentials: true
      })
      console.log('mentor noti count', response)
      if (response) {
        setMentorCount(response?.data?.result?.count)
      }

    } catch (error: any) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMentorMessageCount()
  }, [mentorCount])

  /////////////////////////////////////// Notification End ///////////////////////////


  // Use Redux data if available, otherwise use localStorage
  useEffect(() => {
    if (Uname) {
      setUser({ username: Uname });
    }
    if (Mname) {
      setMentor({ username: Mname });
    }
  }, [Uname, Mname]);


  // rendering the UI
  if (mentor) {
    const initials = getInitials(Mname);

    const handleBel = async () => {
      try {
        const response = await axios.patch(`${MENTOR_SERVICE_URL}/mentor/notification/seen`, {}, {
          withCredentials: true
        })
        console.log('mentor noti ', response)
        if (response) {
          await fetchMentorMessageCount()
          router.push('/pages/mentor/notifications')
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
        {/* First Header */}
        <header className="bg-[#22177A] text-white py-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-xl font-bold">
            <span className="text-white">Learn</span>
            <span className="px-3 py-1 text-[#22177A] bg-white rounded-full shadow-md">
              &Grow
            </span>
          </div>
        </header>

        {/* Second Header */}
        <header className="bg-white border-b border-gray-300 py-4 px-4 md:px-[4rem]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">

            {/* Navigation Links (Hidden on Small Screens) */}
            <nav className="hidden md:flex gap-x-6 text-black">
              <a href="/pages/mentor/dashboard" className="inline-block py-2 px-4 hover:underline underline-offset-4">Dashboard</a>
              <a href="/pages/mentor/courses" className="inline-block py-2 px-4 hover:underline underline-offset-4">Courses</a>
              <a href="/pages/mentor/chat" className="inline-block py-2 px-4 hover:underline underline-offset-4">Chat</a>
              <a href="/pages/mentor/wallet" className="inline-block py-2 px-4 hover:underline underline-offset-4">Wallet</a>
              <a href="/pages/mentor/sales-report" className="inline-block py-2 px-4 hover:underline underline-offset-4">Sales Report</a>
            </nav>

            {/* Mobile Menu Button */}
            {/* <input type="checkbox" id="menu-toggle" className="hidden peer" /> */}
            <label htmlFor="menu-toggle" className="md:hidden cursor-pointer">
              <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </label>

            {/* Profile & Notification */}
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              {/* Notification Bell */}
              <div className="relative">
                <button className="relative focus:outline-none" onClick={handleBel}>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full">
                    <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 7 7.388 7 9v5.159c0 .538-.214 1.055-.595 1.436L5 17h5m5 0a3 3 0 11-6 0h6z" />
                    </svg>
                  </div>

                  {/* Notification Count Badge */}
                  {mentorCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {mentorCount}
                    </span>
                  )}

                </button>
              </div>

              {/* User Profile Section */}
              <div className="relative">
                <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
                  <div className="w-8 h-8 rounded-full bg-[#22177A] text-white flex items-center justify-center font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-[#22177A] hidden sm:block">
                    {mentor.username}
                  </span>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
                    <a href="/pages/mentor/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#22177A] hover:text-white">View Profile</a>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FF474C] hover:text-white" onClick={mentorLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Mobile Menu (Now Opens on Click) */}
          <input type="checkbox" id="menu-toggle" className="hidden peer" />
          <nav className="hidden peer-checked:flex flex-col md:hidden bg-white shadow-md rounded-md mt-2 p-4">
            <a href="/pages/mentor/dashboard" className="py-2 px-4 block hover:bg-gray-200 rounded-lg">Dashboard</a>
            <a href="/pages/mentor/courses" className="py-2 px-4 block hover:bg-gray-200 rounded-lg">Courses</a>
            <a href="/pages/mentor/chat" className="py-2 px-4 block hover:bg-gray-200 rounded-lg">Chat</a>
            <a href="/pages/mentor/wallet" className="py-2 px-4 block hover:bg-gray-200 rounded-lg">Wallet</a>
            <a href="/pages/mentor/sales-report" className="py-2 px-4 block hover:bg-red-200 rounded-lg">Sales Report</a>
          </nav>
        </header>
      </>

    );
  }

  /// USER SIDE
  if (user) {
    const initials = getInitials(Uname);

    const handleBell = async () => {
      try {
        const response = await axios.patch(`${USER_SERVICE_URL}/student/notification/seen`, {}, {
          withCredentials: true
        })
        console.log('student noti ', response)
        if (response) {
          await fetchMessageCount()
          router.push('/pages/student/notifications')
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

    return (

      <>
        <header className="bg-white border-b border-gray-300 py-4 px-4 sm:px-6 md:px-8 lg:pl-[4rem] lg:pr-[1rem] relative">
          <div className="max-w-6xl mx-auto flex items-center justify-between">

            {/* Left Side: Logo */}
            <div className="flex items-center space-x-2 text-lg sm:text-xl font-bold">
              <span className="text-[#22177A]">Learn</span>
              <span className="px-3 py-1 text-white bg-[#22177A] rounded-full shadow-md">
                &Grow
              </span>
            </div>

            {/* Right Side: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-x-4 sm:gap-x-6 text-black">
              <Link href="/pages/home" className="py-1 px-3 hover:underline text-sm sm:text-base">Home</Link>
              <Link href="/pages/student/course" className="py-1 px-3 hover:underline text-sm sm:text-base">Courses</Link>

              {/* Notification Bell */}
              <div className="relative">
                <button className="relative focus:outline-none" onClick={handleBell}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 7 7.388 7 9v5.159c0 .538-.214 1.055-.595 1.436L5 17h5m5 0a3 3 0 11-6 0h6z" />
                    </svg>
                  </div>
                  {studentCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {studentCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User Profile (Initials & Username) */}
              <div className="relative">
                <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
                  <div className="w-8 h-8 rounded-full bg-[#22177A] text-white flex items-center justify-center font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-[#22177A] hidden sm:inline">{user.username}</span>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
                    <Link href="/pages/student/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#22177A] hover:text-white">
                      View Profile
                    </Link>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FF474C] hover:text-white" onClick={studentLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-3">
              {/* User Initials (Clickable) */}
              <label htmlFor="profile-menu-toggle" className="w-8 h-8 rounded-full bg-[#22177A] text-white flex items-center justify-center font-bold cursor-pointer">
                {initials}
              </label>

              {/* Mobile Menu Button */}
              <label htmlFor="menu-toggle" className="cursor-pointer">
                <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </label>
            </div>

          </div>

          {/* Mobile Dropdown for Profile */}
          <input type="checkbox" id="profile-menu-toggle" className="hidden peer/profile" />
          <div className="hidden peer-checked/profile:flex flex-col absolute right-4 top-16 bg-white border border-gray-300 shadow-md rounded-md w-48">
            <Link href="/pages/student/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#22177A] hover:text-white">
              View Profile
            </Link>
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FF474C] hover:text-white" onClick={studentLogout}>
              Logout
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <input type="checkbox" id="menu-toggle" className="hidden peer" />
          <nav className="hidden peer-checked:flex flex-col md:hidden bg-white shadow-md rounded-md mt-2 p-4">
            <Link href="/pages/home" className="py-2 px-4 block hover:bg-gray-200 rounded-lg">Home</Link>
            <Link href="/pages/student/course" className="py-2 px-4 block hover:bg-gray-200 rounded-lg">Courses</Link>

            {/* Notification Bell */}
            <button className="relative focus:outline-none flex items-center gap-2 py-2 px-4 hover:bg-gray-200 rounded-lg" onClick={handleBell}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 7 7.388 7 9v5.159c0 .538-.214 1.055-.595 1.436L5 17h5m5 0a3 3 0 11-6 0h6z" />
              </svg>
              {studentCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {studentCount}
                </span>
              )}
            </button>
          </nav>

        </header>
      </>



    );
  }

  return (

    <header className="bg-white border-b border-gray-200 py-4 px-4 md:px-[4rem]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center space-x-2 text-xl font-bold">
          <span className="text-[#22177A]">Learn</span>
          <span className="px-3 py-1 text-white bg-[#22177A] rounded-full shadow-md">
            &Grow
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-x-8 text-black">
          <Link href="/" className="inline-block py-2 px-4 hover:underline underline-offset-4">Home</Link>
          <Link href="/pages/student/course" className="inline-block py-2 px-4 hover:underline underline-offset-4">Courses</Link>
          <Link href="/pages/login-role" className="inline-block py-2 px-4 hover:underline underline-offset-4">Login</Link>
          <Link href="/pages/signup-role" className="inline-block py-2 px-4 hover:underline underline-offset-4">Signup</Link>
        </nav>

        {/* Mobile Menu Button */}
        <label htmlFor="menu-toggle" className="md:hidden cursor-pointer">
          <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </label>
      </div>

      {/* Mobile Menu */}
      <input type="checkbox" id="menu-toggle" className="hidden peer" />
      <nav className="hidden peer-checked:flex flex-col md:hidden bg-white shadow-md rounded-md mt-2 p-4">
        <Link href="/" className="py-2 px-4 block hover:bg-gray-200 rounded-lg">Home</Link>
        <Link href="/pages/student/course" className="py-2 px-4 block hover:bg-gray-200 rounded-lg">Courses</Link>
        <Link href="/pages/login-role" className="py-2 px-4 block hover:bg-gray-200 rounded-lg">Login</Link>
        <Link href="/pages/signup-role" className="py-2 px-4 block hover:bg-gray-200 rounded-lg">Signup</Link>
      </nav>

    </header>

  );

};

export default Navbar;
