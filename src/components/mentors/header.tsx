"use client"
import { RootState } from '@/redux/store';
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const MentorHeader = () => {
    const name = useSelector((state: RootState) => state.mentor.username);
    // const router = useRouter()
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
        localStorage.clear();
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        router.push(`/`);
      }

    return (
        <>
            {/* First Header */}
            <header className="bg-[#433D8B] text-white py-4 text-center text-xl font-bold">
                Learn&Grow
            </header>

            {/* Second Header */}
            <header className="bg-white shadow-md py-4 px-8">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    {/* Navigation Links */}
                    <nav className="flex gap-x-8 text-black">
                        <a href="/pages/mentor/dashboard" className="hover:text-[#433D8B]">Dashboard</a>
                        {/* <a href="/pages/mentor/profile" className="hover:text-[#433D8B]">Profile</a> */}
                    </nav>

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
                                    href="/pages/mentor/profile"
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
                </div>
            </header>
        </>
    )
};

export default MentorHeader;