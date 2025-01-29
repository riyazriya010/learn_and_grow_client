"use client"

import Link from "next/link"
import Footer from "../loggedoutNav/footer"
import LoggedOutHeader from "../loggedoutNav/header"
import Navbar from "../navbar"

const SignupRole = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        <header>
          <Navbar />
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-16">
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#666666] mb-12">
            Select Your Signup Role
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Left Card */}
            <div className="bg-white-50 border border-gray-300 rounded-lg p-8 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow">
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Access Courses, Learn, <br /> and Interact with Mentors
              </p>
              <Link href="/pages/student/signup">
                <button className="px-8 py-3 bg-[#ffffff] border border-[#22177A] text-black rounded-[13px] hover:bg-gray-100 transition-colors">
                  Student
                </button>
              </Link>
            </div>

            {/* Right Card */}
            <div className="bg-white-50 border border-gray-300 rounded-lg p-8 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow">
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Upload Courses, Mentor Students, <br /> and Inspire Growth
              </p>
              <Link href="/pages/mentor/signup">
                <button className="px-8 py-3 bg-[#ffffff] border border-[#22177A] text-black rounded-[13px] hover:bg-gray-100 transition-colors">
                  Mentor
                </button>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  )
}

export default SignupRole
