"use client"

import Footer from "../footer";
import Header from "../header";



const Login = () => {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">

            {/* Header */}

            <Header />


            {/* Login Form */}
            <main className="flex-grow flex items-center justify-center px-4 py-8">
                <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] w-[400px] p-6 shadow-md rounded-none">
                    <h1 className="text-center text-2xl font-bold mb-6 text-[#433D8B]">User Login</h1>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                                Enter your email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                                Enter your password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-3 border border-[#433D8B] bg-[#F4F1FD] rounded-none focus:outline-none focus:border-[#433D8B]"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="text-right mb-4">
                            <a href="#" className="text-sm text-blue-600 hover:underline">
                                Forget password?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#433D8B] text-white py-3 rounded-[22px] hover:opacity-90">
                            Login
                        </button>
                    </form>
                    {/* Google Login Button */}
                    <div className="flex justify-center items-center mt-6 mb-6">
                        <button
                            type="button"
                            className="flex justify-center items-center w-12 h-12 rounded-full border-[3px] border-[#D9D9D9] bg-white text-[#757575] hover:opacity-90"
                        >
                            <span className="text-xl font-bold">G+</span>
                        </button>
                    </div>


                    <div className="text-center mt-6">
                        <p className="text-black">
                            Don’t have an account?{' '}
                            <a href="#" className="text-[#433D8B] font-semibold hover:underline">
                                Signup
                            </a>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
            
        </div>
    );
}

export default Login
