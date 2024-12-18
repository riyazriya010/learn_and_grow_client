"use client";

import React, { useState } from "react";

interface SideNavProps {
    navLink: { field: string; link: string }[];
}

const SideNav: React.FC<SideNavProps> = ({ navLink }) => {

    return (
        <>
      <nav className="flex flex-col bg-[#F8F9FA] h-full min-h-screen w-64 md:w-72 p-4 text-[#000000]">
        <ul className="space-y-4">
          {navLink.map((item, index) => (
            <li
              key={index}
              className="text-lg font-medium px-4 py-2 rounded-lg hover:bg-[#433D8B] hover:text-white cursor-pointer"
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
