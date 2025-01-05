"use client"

import Link from "next/link"
import Footer from "../loggedoutNav/footer"
import LoggedOutHeader from "../loggedoutNav/header"
import Navbar from "../navbar"

const SignupRole = () => {
    return(
        <>
        <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        {/* <LoggedOutHeader /> */}

        <Navbar />

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center">
          {/* Title */}
          <h1 className="text-[#6E40FF] font-['Edu_NSW_ACT_Foundation'] text-xl mb-8">
            Select Your Signup Role
          </h1>

          <div className="flex space-x-8">
            {/* Left Card */}
            <div className="bg-white border border-[#D6D1F0] rounded-lg p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.1)] flex flex-col items-center text-center">
              <p className="text-black font-medium mb-4">
                Access Courses, Learn, <br /> and Interact with <br /> Mentors
              </p>
              <Link href="/pages/student/signup">
              <button className="px-6 py-2 bg-[#6E40FF] text-white rounded-[0px] hover:opacity-90">
                Student
              </button>
              </Link>
              
            </div>

            {/* Right Card */}
            <div className="bg-white border border-[#D6D1F0] rounded-lg p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.1)] flex flex-col items-center text-center">
              <p className="text-black font-medium mb-4">
                Upload Courses, <br /> Mentor Students, and <br /> Inspire Growth
              </p>

              <Link href="/pages/mentor/signup">
              <button className="px-6 py-2 bg-[#6E40FF] text-white rounded-[0px] hover:opacity-90">
                Mentor
              </button>
              </Link>
              
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
        </>
    )
}

export default SignupRole
