"use client"

import { useState } from "react";

const LoggedInHeader = () => {
    const [user, setUser] = useState<string>('mentor')
    
    return (
        <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Left Side: Logo */}
                <div className="text-[#433D8B] text-xl font-bold">
                    Learn&Grow
                </div>

                {/* Right Side: Navigation */}
                <nav className="flex gap-x-8 text-black ml-4">
                    <a href="/pages/home-page" className="hover:text-[#433D8B]">Home</a>
                    <a href="#" className="hover:text-[#433D8B]">Courses</a>
                    {
                        user === 'mentor' ? <a href="/pages/mentor/profile" className="hover:text-[#433D8B]">Account</a> :
                        <a href="/pages/student/profile" className="hover:text-[#433D8B]">Account</a>
                    }
                    
                </nav>
            </div>
        </header>
    );
};

export default LoggedInHeader;
