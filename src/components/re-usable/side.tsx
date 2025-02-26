"use client";

import React, { useState } from "react";

interface SideNavProps {
    navLink: { field: string; link: string }[];
}

const SideNav: React.FC<SideNavProps> = ({ navLink }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        // <>
        //     <nav
        //         className="hidden md:flex flex-col bg-gradient-to-r from-white to-white-100 h-full min-h-screen w-64 p-4 md:sticky top-0"
        //         style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
        //     >
        //         <ul className="space-y-4">
        //             {navLink.map((item, index) => (
        //                 <li
        //                     key={index}
        //                     className="text-lg font-small px-4 py-2 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-[#22177A] hover:text-white"
        //                 >
        //                     <a href={item.link}>{item.field}</a>
        //                 </li>
        //             ))}
        //         </ul>
        //     </nav>

        // </>

        <>
            {/* Menu button for small screens */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#22177A] text-white rounded-md"
            >
                ☰
            </button>

            {/* Sidebar */}
            <div className={`fixed inset-0 z-40 flex transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <nav className="w-64 h-full bg-white shadow-lg p-4 flex flex-col">
                    {/* Close button for mobile view */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden mb-4 text-right text-xl font-bold self-end"
                    >
                        ✕
                    </button>

                    <ul className="space-y-4">
                        {navLink.map((item, index) => (
                            <li
                                key={index}
                                className="text-lg px-4 py-2 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-[#22177A] hover:text-white"
                            >
                                <a href={item.link}>{item.field}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Overlay to close sidebar when clicking outside */}
                {isOpen && (
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black opacity-50 lg:hidden"
                    ></div>
                )}
            </div>
        </>

    );
};

export default SideNav;
