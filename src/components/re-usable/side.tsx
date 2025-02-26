"use client";

import React from "react";

interface SideNavProps {
    navLink: { field: string; link: string }[];
}

const SideNav: React.FC<SideNavProps> = ({ navLink }) => {
    return (
        <>
            <nav
                className="flex flex-col bg-gradient-to-r from-white to-white-100 h-auto w-64 p-4"
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
        </>


    );
};

export default SideNav;
