"use client";

import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";


interface SideNavProps {
    navLink: { field: string; link: string }[];
}

const SideNav: React.FC<SideNavProps> = ({ navLink }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>

            {/* Hamburger button for small screens */}
            <button
                className="md:hidden p-2 fixed top-4 left-4 bg-[#22177A] text-white rounded-lg z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <IoMenu size={24} />
            </button>

            <nav
                className="hidden md:flex flex-col bg-gradient-to-r from-white to-white-100 h-full min-h-screen w-64 p-4 md:sticky top-0"
                style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
            >
                <ul className="space-y-4">
                    {navLink.map((item, index) => (
                        <li
                            key={index}
                            className="text-lg font-small px-4 py-2 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-[#22177A] hover:text-white"
                        >
                            <a href={item.link}>{item.field}</a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Overlay when menu is open (for mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

        </>
    );
};

export default SideNav;
