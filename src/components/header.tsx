"use client"

const Header = () => {
    return (
        <header className="bg-white shadow-md py-4 pl-[4rem] pr-[1rem]">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Left Side: Logo */}
                <div className="text-[#433D8B] text-xl font-bold">
                    Learn&Grow
                </div>

                {/* Right Side: Navigation */}
                <nav className="flex gap-x-8 text-black ml-4">
                    <a href="#" className="hover:text-[#433D8B]">Home</a>
                    <a href="#" className="hover:text-[#433D8B]">Courses</a>
                    <a href="#" className="hover:text-[#433D8B]">Login</a>
                    <a href="#" className="hover:text-[#433D8B]">Signup</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
