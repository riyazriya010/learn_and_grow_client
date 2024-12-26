// "use client"

// import { RootState } from "@/redux/store";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// const LoggedInHeader = () => {
//     const name = useSelector((state: RootState) => state.user.username)
//     // const [username, setUsername] = useState<string | null>(null)

//     // useEffect(() => {
//     //     const userData = localStorage.getItem('user');
//     //     if (userData) {
//     //         try {
//     //             const parsedData = JSON.parse(userData); // Parse the string to an object
//     //             if (parsedData?.username) {
//     //                 setUsername(parsedData.username);
//     //             }
//     //         } catch (error) {
//     //             console.error("Error parsing user data:", error);
//     //         }
//     //     }
//     // }, []);

//     return (
//         <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
//             <div className="max-w-6xl mx-auto flex items-center justify-between">
//                 {/* Left Side: Logo */}
//                 <div className="text-[#433D8B] text-xl font-bold">
//                     Learn&Grow
//                 </div>

//                 {/* Right Side: Navigation */}
//                 <nav className="flex gap-x-8 text-black ml-4">
//                     <a href="/pages/home-page" className="hover:text-[#433D8B]">Home</a>
//                     <a href="#" className="hover:text-[#433D8B]">Courses</a>
//                     <a href="/pages/student/profile" className="hover:text-[#433D8B]">Account</a>
//                     <p>welcome: {name}</p>

//                 </nav>
//             </div>
//         </header>
//     );
// };

// export default LoggedInHeader;




"use client";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const LoggedInHeader = () => {
    const name = useSelector((state: RootState) => state.user.username);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter()

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const initials = name
        ? name
            .split(" ")
            .map((word) => word[0].toUpperCase())
            .join("")
        : "U";



    const handleLogout = () => {
        localStorage.clear()
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        router.push('/')
    }
    return (
        <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Left Side: Logo */}
                <div className="text-[#433D8B] text-xl font-bold">
                    Learn&Grow
                </div>

                {/* Right Side: Navigation */}
                <nav className="flex items-center gap-x-8 text-black ml-4">
                    <a href="/pages/home" className="hover:text-[#433D8B]">Home</a>
                    <a href="#" className="hover:text-[#433D8B]">Courses</a>
                    {/* <a href="/pages/student/profile" className="hover:text-[#433D8B]">Account</a> */}

                    {/* User Profile Section */}
                    <div className="relative">
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={toggleDropdown}
                        >
                            {/* Circle with Initials */}
                            <div className="w-8 h-8 rounded-full bg-[#433D8B] text-white flex items-center justify-center font-bold">
                                {initials}
                            </div>
                            {/* Name (optional, remove for just the avatar) */}
                            <span className="text-sm font-medium text-[#433D8B]">
                                {name}
                            </span>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-md">
                                <a
                                    href="/pages/student/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    View Profile
                                </a>
                                <a
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </a>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default LoggedInHeader;
