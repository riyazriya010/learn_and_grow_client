"use client"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';

const AdminHeader = () => {

    const router = useRouter()

    const handleLogout = () => {
        localStorage.clear();
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        localStorage.clear()
        // router.push(`/pages/login`);
        window.location.replace('/pages/login')
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
                        <a href="/pages/dashboard" className="hover:text-[#433D8B]">Dashboard</a>
                        <a href="/pages/userManagement" className="hover:text-[#433D8B]">User Management</a>
                        <a href="/pages/mentorManagement" className="hover:text-[#433D8B]">Mentor Management</a>
                    </nav>

                    {/* Logout Button */}
                    <button
                        className="px-4 py-2 bg-[#DC3545] text-white rounded-[19px] text-sm font-medium shadow-lg transition-all"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>
        </>
    )
};

export default AdminHeader;