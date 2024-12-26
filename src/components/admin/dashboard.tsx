"use client";

import React from "react";
import AdminFooter from "./footer";
import AdminHeader from "./header";

const AdminDashboard = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Site Header */}
            <AdminHeader />

            {/* Main Content */}
            <main className="flex-grow px-6 py-4">
                <h2 className="text-2xl font-bold text-433D8B mb-4">Dashboard Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-F8F9FA border border-D6D1F0 rounded-lg p-6 text-center">
                        <h3 className="text-xl font-semibold text-433D8B">Active Users</h3>
                        <p className="text-2xl font-bold text-gray-700">1,234</p>
                    </div>
                    <div className="bg-F8F9FA border border-D6D1F0 rounded-lg p-6 text-center">
                        <h3 className="text-xl font-semibold text-433D8B">Active Mentors</h3>
                        <p className="text-2xl font-bold text-gray-700">87</p>
                    </div>
                    <div className="bg-F8F9FA border border-D6D1F0 rounded-lg p-6 text-center">
                        <h3 className="text-xl font-semibold text-433D8B">Best Selling Course</h3>
                        <p className="text-2xl font-bold text-gray-700">React Basics</p>
                    </div>
                    <div className="bg-F8F9FA border border-D6D1F0 rounded-lg p-6 text-center">
                        <h3 className="text-xl font-semibold text-433D8B">Top Category</h3>
                        <p className="text-2xl font-bold text-gray-700">Web Development</p>
                    </div>
                </div>

                {/* Example Chart Section */}
                <div className="bg-F8F9FA border border-D6D1F0 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-433D8B mb-4">User Activity Chart</h3>
                    <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-500">
                        [Chart Placeholder]
                    </div>
                </div>
            </main>

            {/* Footer */}
            <AdminFooter />
        </div>
    );
};

export default AdminDashboard;
