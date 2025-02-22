"use client"

import Link from "next/link";

const LoggedOutHeader = () => {
    return (
        <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Left Side: Logo */}
                <div className="text-[#433D8B] text-xl font-bold">
                    Learn&Grow
                </div>

                {/* Right Side: Navigation */}
                <nav className="flex gap-x-8 text-black ml-4">
                    <Link href="/" className="hover:text-[#433D8B]">Home</Link>
                    <Link href="#" className="hover:text-[#433D8B]">Courses</Link>
                    <Link href="/pages/login-role" className="hover:text-[#433D8B]">Login</Link>
                    <Link href="/pages/signup-role" className="hover:text-[#433D8B]">Signup</Link>
                </nav>
            </div>
        </header>
    );
};

export default LoggedOutHeader;
