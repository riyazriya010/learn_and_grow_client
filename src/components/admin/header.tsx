"use client"
import Cookies from 'js-cookie'

const AdminHeader = () => {

    const handleLogout = () => {
        localStorage.clear();
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        localStorage.clear()
        // router.push(`/pages/login`);
        window.location.replace('/pages/login')
    }

    return (

        // <>
        //     {/* First Header */}
        //     <header className="bg-[#433D8B] text-white py-4 text-center text-xl font-bold">
        //         Learn&Grow
        //     </header>

        //     {/* Second Header */}
        //     <header className="bg-white shadow-md py-4 px-8">
        //         <div className="max-w-6xl mx-auto flex items-center justify-between">
        //             {/* Navigation Links */}
        //             <nav className="flex gap-x-8 text-black text-[13px] font-semi-bold">
        //                 <a href="/pages/dashboard" className="hover:text-[#433D8B]">Dashboard</a>
        //                 <a href="/pages/userManagement" className="hover:text-[#433D8B]">User Management</a>
        //                 <a href="/pages/mentorManagement" className="hover:text-[#433D8B]">Mentor Management</a>
        //                 <a href="/pages/category-management" className="hover:text-[#433D8B]">Category Management</a>
        //                 <a href="/pages/course-management" className="hover:text-[#433D8B]">Course Management</a>
        //                 <a href="/pages/badge-management" className="hover:text-[#433D8B]">Badge Management</a>
        //                 <a href="/pages/wallet" className="hover:text-[#433D8B]">Wallet</a>
        //                 <a href="/pages/sales-report" className="hover:text-[#433D8B]">Sales Report</a>
        //             </nav>

        //             {/* Logout Button */}
        //             <button
        //                 className="px-4 py-2 bg-[#DC3545] text-white rounded-[19px] text-sm font-medium shadow-lg transition-all"
        //                 onClick={handleLogout}
        //             >
        //                 Logout
        //             </button>
        //         </div>
        //     </header>
        // </>

        <>
            {/* First Header */}
            <header className="bg-[#433D8B] text-white py-4 text-center text-lg sm:text-xl font-bold">
                Learn&Grow
            </header>

            {/* Second Header */}
            <header className="bg-white shadow-md py-4 px-4 sm:px-6 md:px-8">
                <div className="max-w-6xl mx-auto flex items-center justify-between">

                    {/* Navigation Links - Desktop */}
                    <nav className="hidden lg:flex gap-x-6 text-black text-xs sm:text-sm font-semibold">
                        <a href="/pages/dashboard" className="hover:text-[#433D8B]">Dashboard</a>
                        <a href="/pages/userManagement" className="hover:text-[#433D8B]">User Management</a>
                        <a href="/pages/mentorManagement" className="hover:text-[#433D8B]">Mentor Management</a>
                        <a href="/pages/category-management" className="hover:text-[#433D8B]">Category Management</a>
                        <a href="/pages/course-management" className="hover:text-[#433D8B]">Course Management</a>
                        <a href="/pages/badge-management" className="hover:text-[#433D8B]">Badge Management</a>
                        <a href="/pages/wallet" className="hover:text-[#433D8B]">Wallet</a>
                        <a href="/pages/sales-report" className="hover:text-[#433D8B]">Sales Report</a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <label htmlFor="menu-toggle" className="lg:hidden cursor-pointer">
                        <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </label>

                    {/* Logout Button */}
                    <button className="hidden sm:block px-4 py-2 bg-[#DC3545] text-white rounded-[19px] text-xs sm:text-sm font-medium shadow-lg transition-all" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                <input type="checkbox" id="menu-toggle" className="hidden peer" />
                <nav className="hidden peer-checked:flex flex-col lg:hidden bg-white shadow-md rounded-md mt-2 p-4 text-center space-y-2 text-black text-sm">
                    <a href="/pages/dashboard" className="hover:text-[#433D8B]">Dashboard</a>
                    <a href="/pages/userManagement" className="hover:text-[#433D8B]">User Management</a>
                    <a href="/pages/mentorManagement" className="hover:text-[#433D8B]">Mentor Management</a>
                    <a href="/pages/category-management" className="hover:text-[#433D8B]">Category Management</a>
                    <a href="/pages/course-management" className="hover:text-[#433D8B]">Course Management</a>
                    <a href="/pages/badge-management" className="hover:text-[#433D8B]">Badge Management</a>
                    <a href="/pages/wallet" className="hover:text-[#433D8B]">Wallet</a>
                    <a href="/pages/sales-report" className="hover:text-[#433D8B]">Sales Report</a>

                    {/* Mobile Logout Button */}
                    <button className="block w-full px-4 py-2 bg-[#DC3545] text-white rounded-md text-sm font-medium shadow-lg" onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            </header>
        </>



    )
};

export default AdminHeader;