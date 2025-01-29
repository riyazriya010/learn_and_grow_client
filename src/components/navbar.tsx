/////////////////////////////////////////////////// MAin Main /////////



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

  //notification
  const [notify, setNotify] = useState<boolean>(false)


  // Handle dropdown toggle
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage and cookies
    localStorage.clear();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Dispatch Redux actions to reset user and mentor
    dispatch(clearUserDetials());
    dispatch(clearMentor());

    // Redirect to homepage
    router.replace("/");
  };

  // Helper function to generate initials
  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name.split(" ").map((word) => word[0].toUpperCase()).join("");
  };

  useEffect(() => {
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


  // Use Redux data if available, otherwise use localStorage
  useEffect(() => {
    if (Uname) {
      setUser({ username: Uname });
    }
    if (Mname) {
      setMentor({ username: Mname });
    }
  }, [Uname, Mname]);

  if (mentor) {
    const initials = getInitials(Mname);

    return (
      <>
        <header className="bg-[#22177A] text-white py-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-xl font-bold">
            <span className="text-[#ffffff]">Learn</span>
            <span className="px-3 py-1 text-[#22177A] bg-[#ffffff] rounded-full shadow-md">
              &Grow
            </span>
          </div>
        </header>

        {/* Second Header */}
        <header className="bg-white border-b border-gray-300 py-4 pl-[4rem] pr-[1rem]">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Navigation Links */}
            <nav className="flex gap-x-8 text-black">
              <a href="/pages/mentor/dashboard" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">
                Dashboard
              </a>
              <a href="/pages/mentor/courses" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">
                Courses
              </a>
              <a href="/pages/mentor/chat" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">
                Chat
              </a>
              <a href="/pages/mentor/wallet" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">
                Wallet
              </a>
            </nav>

            {/* User Profile Section */}
            <div className="relative">
              <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
                {/* Circle with Initials */}
                <div className="w-8 h-8 rounded-full bg-[#22177A] text-white flex items-center justify-center font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium text-[#22177A]">
                  {mentor.username}
                </span>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
                  <a href="/pages/mentor/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#22177A] hover:text-white">
                    View Profile
                  </a>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FF474C] hover:text-white" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      </>
    );
  }

  if (user) {
    const initials = getInitials(Uname);

    return (
      // <>
      //   <header className="bg-white border-b border-gray-300 py-4 pl-[4rem] pr-[1rem]">
      //     <div className="max-w-6xl mx-auto flex items-center justify-between">
      //       {/* Left Side: Logo */}
      //       {/* <div className="text-[#433D8B] text-xl font-bold">Learn&Grow</div> */}

      //       <div className="flex items-center justify-center space-x-2 text-xl font-bold">
      //         <span className="text-[#22177A]">Learn</span>
      //         <span className="px-3 py-1 text-white bg-[#22177A] rounded-full shadow-md">
      //           &Grow
      //         </span>
      //       </div>

      //       {/* Right Side: Navigation */}
      //       <nav className="flex items-center gap-x-8 text-black ml-4">
      //         <a href="/pages/home" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Home</a>
      //         <a href="/pages/student/course" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Courses</a>

      //         <div className="relative">
      //           <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
      //             {/* Circle with Initials */}
      //             <div className="w-8 h-8 rounded-full bg-[#22177A] text-white flex items-center justify-center font-bold">
      //               {initials}
      //             </div>
      //             <span className="text-sm font-medium text-[#22177A]">
      //               {user.username}
      //             </span>
      //           </div>

      //           {/* Dropdown Menu */}
      //           {isDropdownOpen && (
      //             <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
      //               <a href="/pages/student/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#22177A] hover:text-white">
      //                 View Profile
      //               </a>
      //               <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FF474C] hover:text-white" onClick={handleLogout}>
      //                 Logout
      //               </button>
      //             </div>
      //           )}
      //         </div>
      //       </nav>
      //     </div>
      //   </header>
      // </>

      <>
        <header className="bg-white border-b border-gray-300 py-4 pl-[4rem] pr-[1rem]">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Left Side: Logo */}
            <div className="flex items-center justify-center space-x-2 text-xl font-bold">
              <span className="text-[#22177A]">Learn</span>
              <span className="px-3 py-1 text-white bg-[#22177A] rounded-full shadow-md">
                &Grow
              </span>
            </div>

            {/* Right Side: Navigation */}
            <nav className="flex items-center gap-x-8 text-black ml-4">
              <a href="/pages/home" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Home</a>
              <a href="/pages/student/course" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Courses</a>

              {/* Notification Bell */}
              <div className="relative">
                <Link href="/pages/home">
                  <button className="relative focus:outline-none">
                    {/* Bell Icon */}
                    <div className={`${notify ? "bg-red-500" : "bg-gray-200"} w-8 h-8 text-white flex items-center justify-center rounded-full`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 7 7.388 7 9v5.159c0 .538-.214 1.055-.595 1.436L5 17h5m5 0a3 3 0 11-6 0h6z"
                        />
                      </svg>
                    </div>
                  </button>
                </Link>
              </div>

              {/* User Profile */}
              <div className="relative">
                <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
                  {/* Circle with Initials */}
                  <div className="w-8 h-8 rounded-full bg-[#22177A] text-white flex items-center justify-center font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-[#22177A]">
                    {user.username}
                  </span>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
                    <a href="/pages/student/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#22177A] hover:text-white">
                      View Profile
                    </a>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FF474C] hover:text-white" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </header>
      </>


    );
  }

  return (
    <header className="bg-white border-b border-gray-200 py-4 pl-[4rem] pr-[1rem]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left Side: Logo */}
        {/* <div className="text-[#433D8B] text-xl font-bold">Learn&Grow</div> */}

        <div className="flex items-center justify-center space-x-2 text-xl font-bold">
          <span className="text-[#22177A] ">Learn</span>
          <span className="px-3 py-1 text-white bg-[#22177A] rounded-full shadow-md">
            &Grow
          </span>
        </div>


        {/* Right Side: Navigation */}
        <nav className="flex items-center gap-x-8 text-black ml-4">
          <a href="/" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Home</a>
          <a href="/pages/student/course" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Courses</a>
          <a href="/pages/login-role" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Login</a>
          <a href="/pages/signup-role" className="inline-block py-1 px-4 hover:decoration-[#6E40FF] hover:decoration-4 rounded-lg transition-all">Signup</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;


/////////////////////////////////////// Main Main ///////////////////////////////

// "use client";

// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { clearUserDetials } from "@/redux/slices/userSlice";
// import { clearUserDetials as clearMentor } from "@/redux/slices/mentorSlice";
// import socket from "@/utils/socket";
// import { ToastContainer, toast, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface User {
//   username: string;
// }

// interface Mentor {
//   username: string;
// }

// const Navbar = () => {
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [mentor, setMentor] = useState<Mentor | null>(null);

//   const router = useRouter();
//   const dispatch = useDispatch();

//   // Fetch user and mentor info from Redux state
//   const Uname = useSelector((state: RootState) => state.user.username);
//   const Mname = useSelector((state: RootState) => state.mentor.username);

//   // Handle dropdown toggle
//   const toggleDropdown = () => {
//     setDropdownOpen((prev) => !prev);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.clear();
//     Cookies.remove("accessToken");
//     Cookies.remove("refreshToken");
//     dispatch(clearUserDetials());
//     dispatch(clearMentor());
//     router.replace("/");
//   };

//   // Helper function to generate initials
//   const getInitials = (name: string | undefined) => {
//     if (!name) return "U";
//     return name
//       .split(" ")
//       .map((word) => word[0].toUpperCase())
//       .join("");
//   };

//   useEffect(() => {
//     // Fetch user or mentor data from localStorage
//     const storedUser = localStorage.getItem("user");
//     const storedMentor = localStorage.getItem("mentor");

//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser) as User);
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//         setUser(null);
//       }
//     }

//     if (storedMentor) {
//       try {
//         setMentor(JSON.parse(storedMentor) as Mentor);
//       } catch (error) {
//         console.error("Error parsing mentor data:", error);
//         setMentor(null);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     // Use Redux data if available
//     if (Uname) {
//       setUser({ username: Uname });
//     }
//     if (Mname) {
//       setMentor({ username: Mname });
//     }
//   }, [Uname, Mname]);

//   // Socket event listeners
//   useEffect(() => {
//     const handleReceiveMessage = (newMessage: any) => {
//       console.log("Message received:", newMessage);
//     };

//     const handleNotification = (notification: any) => {
//       console.log("Notification:", notification);

//       // Play notification sound
//       const notificationAudio = new Audio("/Audio/notification.mp3");
//       notificationAudio.play().catch((error) => {
//         console.error("Error playing notification sound:", error);
//       });

//       // Display toast notification
//       toast.info(`New message from ${notification.senderId}`);
//     };

//     socket.on("receiveMessage", handleReceiveMessage);
//     socket.on("notification", handleNotification);

//     return () => {
//       socket.off("receiveMessage", handleReceiveMessage);
//       socket.off("notification", handleNotification);
//     };
//   }, []);

//   return (
//     <>
//       <ToastContainer
//         autoClose={1000}
//         pauseOnHover={false}
//         transition={Slide}
//         hideProgressBar={false}
//         closeOnClick={false}
//         pauseOnFocusLoss={true}
//       />

//       {mentor && (
//         <>
//           <header className="bg-[#22177A] text-white py-6 text-center">
//             <div className="flex items-center justify-center space-x-2 text-xl font-bold">
//               <span className="text-[#ffffff]">Learn</span>
//               <span className="px-3 py-1 text-[#22177A] bg-[#ffffff] rounded-full shadow-md">
//                 &Grow
//               </span>
//             </div>
//           </header>

//           <header className="bg-white border-b border-gray-300 py-4 pl-[4rem] pr-[1rem]">
//             <div className="max-w-6xl mx-auto flex items-center justify-between">
//               <nav className="flex gap-x-8 text-black">
//                 <a href="/pages/mentor/dashboard" className="hover:underline">
//                   Dashboard
//                 </a>
//                 <a href="/pages/mentor/courses" className="hover:underline">
//                   Courses
//                 </a>
//                 <a href="/pages/mentor/wallet" className="hover:underline">
//                   Wallet
//                 </a>
//               </nav>

//               <div className="relative">
//                 <div
//                   className="flex items-center gap-2 cursor-pointer"
//                   onClick={toggleDropdown}
//                 >
//                   <div className="w-8 h-8 rounded-full bg-[#22177A] text-white flex items-center justify-center font-bold">
//                     {getInitials(Mname)}
//                   </div>
//                   <span className="text-sm font-medium text-[#22177A]">
//                     {mentor.username}
//                   </span>
//                 </div>

//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
//                     <a
//                       href="/pages/mentor/profile"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#22177A] hover:text-white"
//                     >
//                       View Profile
//                     </a>
//                     <button
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FF474C] hover:text-white"
//                       onClick={handleLogout}
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </header>
//         </>
//       )}

//       {user && (
//         <header className="bg-white border-b border-gray-300 py-4 pl-[4rem] pr-[1rem]">
//           <div className="max-w-6xl mx-auto flex items-center justify-between">
//             <div className="flex items-center justify-center space-x-2 text-xl font-bold">
//               <span className="text-[#22177A]">Learn</span>
//               <span className="px-3 py-1 text-white bg-[#22177A] rounded-full shadow-md">
//                 &Grow
//               </span>
//             </div>
//             <nav className="flex gap-x-8 text-black">
//               <a href="/pages/home" className="hover:underline">
//                 Home
//               </a>
//               <a href="/pages/student/course" className="hover:underline">
//                 Courses
//               </a>
//             </nav>

//             <div className="relative">
//               <div
//                 className="flex items-center gap-2 cursor-pointer"
//                 onClick={toggleDropdown}
//               >
//                 <div className="w-8 h-8 rounded-full bg-[#22177A] text-white flex items-center justify-center font-bold">
//                   {getInitials(Uname)}
//                 </div>
//                 <span className="text-sm font-medium text-[#22177A]">
//                   {user.username}
//                 </span>
//               </div>

//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
//                   <a
//                     href="/pages/student/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#22177A] hover:text-white"
//                   >
//                     View Profile
//                   </a>
//                   <button
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#FF474C] hover:text-white"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>
//       )}

//       {!mentor && !user && (
//         <header className="bg-white border-b border-gray-300 py-4 pl-[4rem] pr-[1rem]">
//           <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center justify-center space-x-2 text-xl font-bold">
//               <span className="text-[#22177A]">Learn</span>
//               <span className="px-3 py-1 text-white bg-[#22177A] rounded-full shadow-md">
//                 &Grow
//               </span>
//             </div>
//             <nav className="flex gap-x-8 text-black">
//               <a href="/" className="hover:underline">
//                 Home
//               </a>
//               <a href="/pages/student/course" className="hover:underline">
//                 Courses
//               </a>
//               <a href="/pages/login-role" className="hover:underline">
//                 Login
//               </a>
//               <a href="/pages/signup-role" className="hover:underline">
//                 Signup
//               </a>
//             </nav>
//           </div>
//         </header>
//       )}
//     </>
//   );
// };

// export default Navbar;





//////////////////////////////////////////////



// "use client";

// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// interface User {
//   username: string;
// }

// interface Mentor {
//   username: string;
// }

// const Navbar = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [mentor, setMentor] = useState<Mentor | null>(null);
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const router = useRouter();
//   const Uname = useSelector((state: RootState) => state.user.username);
//   const Mname = useSelector((state: RootState) => state.mentor.username);
//   console.log('u', Uname)
//   console.log('m', Mname)

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedMentor = localStorage.getItem("mentor");

//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser) as User);
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//         setUser(null);
//       }
//     }

//     if (storedMentor) {
//       try {
//         setMentor(JSON.parse(storedMentor) as Mentor);
//       } catch (error) {
//         console.error("Error parsing mentor data:", error);
//         setMentor(null);
//       }
//     }
//   }, []);

//   const toggleDropdown = () => {
//     setDropdownOpen((prev) => !prev);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     Cookies.remove("accessToken");
//     Cookies.remove("refreshToken");
//     setUser(null);
//     setMentor(null);
//     router.push("/");
//   };

//   if (mentor) {
//     const initials = Mname
//       ? Mname
//           .split(" ")
//           .map((word) => word[0].toUpperCase())
//           .join("")
//       : "U";

//     return (
//       <>
//         {/* First Header */}
//         <header className="bg-[#433D8B] text-white py-4 text-center text-xl font-bold">
//           Learn&Grow
//         </header>

//         {/* Second Header */}
//         <header className="bg-white shadow-md py-4 px-8">
//           <div className="max-w-6xl mx-auto flex items-center justify-between">
//             {/* Navigation Links */}
//             <nav className="flex gap-x-8 text-black">
//               <a
//                 href="/pages/mentor/dashboard"
//                 className="hover:text-[#433D8B]"
//               >
//                 Dashboard
//               </a>
//             </nav>

//             {/* User Profile Section */}
//             <div className="relative">
//               <div
//                 className="flex items-center gap-2 cursor-pointer"
//                 onClick={toggleDropdown}
//               >
//                 {/* Circle with Initials */}
//                 <div className="w-8 h-8 rounded-full bg-[#433D8B] text-white flex items-center justify-center font-bold">
//                   {initials}
//                 </div>
//                 <span className="text-sm font-medium text-[#433D8B]">
//                   {mentor.username}
//                 </span>
//               </div>

//               {/* Dropdown Menu */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
//                   <a
//                     href="/pages/mentor/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     View Profile
//                   </a>
//                   <button
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>
//       </>
//     );
//   }

//   if (user) {
//     const initials = user.username
//       ? user.username
//           .split(" ")
//           .map((word) => word[0].toUpperCase())
//           .join("")
//       : "U";

//     return (
//       <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           {/* Left Side: Logo */}
//           <div className="text-[#433D8B] text-xl font-bold">Learn&Grow</div>

//           {/* Right Side: Navigation */}
//           <nav className="flex items-center gap-x-8 text-black ml-4">
//             <a href="/pages/home" className="hover:text-[#433D8B]">Home</a>
//             <a href="#" className="hover:text-[#433D8B]">Courses</a>

//             <div className="relative">
//               <div
//                 className="flex items-center gap-2 cursor-pointer"
//                 onClick={toggleDropdown}
//               >
//                 {/* Circle with Initials */}
//                 <div className="w-8 h-8 rounded-full bg-[#433D8B] text-white flex items-center justify-center font-bold">
//                   {initials}
//                 </div>
//                 <span className="text-sm font-medium text-[#433D8B]">
//                   {user.username}
//                 </span>
//               </div>

//               {/* Dropdown Menu */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
//                   <a
//                     href="/pages/student/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     View Profile
//                   </a>
//                   <button
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </nav>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
//       <div className="max-w-6xl mx-auto flex items-center justify-between">
//         {/* Left Side: Logo */}
//         <div className="text-[#433D8B] text-xl font-bold">Learn&Grow</div>

//         {/* Right Side: Navigation */}
//         <nav className="flex items-center gap-x-8 text-black ml-4">
//           <a href="/" className="hover:text-[#433D8B]">Home</a>
//           <a href="#" className="hover:text-[#433D8B]">Courses</a>
//           <a href="/pages/login-role" className="hover:text-[#433D8B]">
//             Login
//           </a>
//           <a href="/pages/signup-role" className="hover:text-[#433D8B]">
//             Signup
//           </a>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

