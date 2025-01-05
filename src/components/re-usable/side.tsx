"use client";

import React from "react";
import { FaUser, FaSignInAlt } from "react-icons/fa";

interface SideNavProps {
    navLink: { field: string; link: string }[];
}

const SideNav: React.FC<SideNavProps> = ({ navLink }) => {
    return (
        <nav className="flex flex-col bg-gradient-to-r from-gray-50 to-gray-100 shadow-md h-full min-h-screen w-64 p-4">
            <ul className="space-y-4">
                {navLink.map((item, index) => (
                    <li
                        key={index}
                        className="text-lg font-small px-4 py-2 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-[#433D8B] hover:text-white"
                    >
                        {/* Add relevant icons */}
                        {/* {index === 0 ? <FaSignInAlt /> : <FaUser />} */}
                        <a href={item.link}>{item.field}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SideNav;
