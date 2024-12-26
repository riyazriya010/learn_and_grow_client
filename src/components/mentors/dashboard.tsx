"use client";

import React from "react";
import MentorHeader from "./header";
import MentorFooter from "./footer";
import Navbar from "../navbar";

const MentorDashboard = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Site Header */}
            {/* <MentorHeader /> */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow px-6 py-8">
                <h2 className="text-2xl font-bold text-[#433D8B] mb-6">Revenue Management</h2>

                {/* Revenue Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[#F8F9FA] border border-[#D6D1F0] rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-[#433D8B]">Revenue (Yesterday)</h3>
                        <p className="text-2xl font-bold text-gray-700">$1,200</p>
                    </div>
                    <div className="bg-[#F8F9FA] border border-[#D6D1F0] rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-[#433D8B]">Revenue (Last Month)</h3>
                        <p className="text-2xl font-bold text-gray-700">$25,600</p>
                    </div>
                    <div className="bg-[#F8F9FA] border border-[#D6D1F0] rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-[#433D8B]">Revenue (Last Year)</h3>
                        <p className="text-2xl font-bold text-gray-700">$305,400</p>
                    </div>
                    <div className="bg-[#F8F9FA] border border-[#D6D1F0] rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-[#433D8B]">Current Month Enrollments</h3>
                        <p className="text-2xl font-bold text-gray-700">1,120</p>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-[#F8F9FA] border border-[#D6D1F0] rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-[#433D8B] mb-4">Revenue Trends</h3>
                    <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-500">
                        [Line Chart Placeholder]
                    </div>
                </div>

                {/* Enrollment Breakdown */}
                <div className="bg-[#F8F9FA] border border-[#D6D1F0] rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-[#433D8B] mb-4">Enrollment Trends</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#433D8B] text-white flex items-center justify-center text-lg font-bold">
                                320
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-gray-700">Enrollments (Yesterday)</h4>
                                <p className="text-sm text-gray-500">+15% compared to the day before</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#433D8B] text-white flex items-center justify-center text-lg font-bold">
                                1,120
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-gray-700">Enrollments (This Month)</h4>
                                <p className="text-sm text-gray-500">+20% compared to last month</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Courses */}
                <div className="bg-[#F8F9FA] border border-[#D6D1F0] rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#433D8B] mb-4">Top Performing Courses</h3>
                    <ul className="space-y-4">
                        <li className="flex justify-between">
                            <span className="text-gray-700">React Basics</span>
                            <span className="text-gray-500">320 Enrollments</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-700">Advanced Node.js</span>
                            <span className="text-gray-500">290 Enrollments</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-gray-700">UI/UX Mastery</span>
                            <span className="text-gray-500">250 Enrollments</span>
                        </li>
                    </ul>
                </div>
            </main>

            {/* Footer */}
            <MentorFooter />
        </div>
    );
};

export default MentorDashboard;
