'use client';

import React from 'react';

const LoginPage = () => {
  return (
    <>
    <header className="bg-[#010110] py-4">
      <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#FFFFFF]">YourApp</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="text-[#BFBFBF] hover:text-[#6E40FF]">Home</a>
            </li>
            <li>
              <a href="/login" className="text-[#BFBFBF] hover:text-[#6E40FF]">Login</a>
            </li>
            <li>
              <a href="/register" className="text-[#BFBFBF] hover:text-[#6E40FF]">Sign Up</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <div className="min-h-screen bg-[#010110] flex items-center justify-center">
      <div className="w-full max-w-md bg-[#29292A] p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#FFFFFF] text-center mb-6">Login</h1>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#BFBFBF] mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 bg-[#4D4D4D] text-[#FFFFFF] rounded focus:ring-2 focus:ring-[#6E40FF] focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#BFBFBF] mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 bg-[#4D4D4D] text-[#FFFFFF] rounded focus:ring-2 focus:ring-[#6E40FF] focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#6E40FF] text-[#FFFFFF] font-bold rounded hover:bg-[#856BFF] focus:outline-none focus:ring-2 focus:ring-[#6E40FF]"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-[#BFBFBF] mt-4">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-[#6E40FF] hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
