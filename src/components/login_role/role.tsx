"use client"

import Link from "next/link"
import Footer from "../loggedoutNav/footer"
import LoggedOutHeader from "../loggedoutNav/header"
import Navbar from "../navbar"

const LoginRole = () => {
  return (
    //   <>
    //   <div className="flex flex-col min-h-screen bg-white">
    //   {/* Header */}
    //   <LoggedOutHeader />

    //   {/* Main Content */}
    //   <main className="flex-grow flex flex-col items-center justify-center">
    //     {/* Title */}
    //     <h1 className="text-[#433D8B] font-['Edu_NSW_ACT_Foundation'] text-xl mb-8">
    //       Select Your Login Role
    //     </h1>

    //     <div className="flex space-x-8">
    //       {/* Left Card */}
    //       <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] rounded-lg p-8 shadow-md flex flex-col items-center text-center">
    //         <p className="text-black font-medium mb-4">
    //           Access Courses, Learn, <br /> and Interact with <br /> Mentors
    //         </p>

    //         <Link href="/pages/student/login">
    //         <button className="mt-4 px-6 py-2 bg-[#433D8B] text-white rounded-[22px] hover:opacity-90">
    //           Student
    //         </button>
    //         </Link>

    //       </div>

    //       {/* Right Card */}
    //       <div className="bg-[#F8F9FA] border-2 border-[#D6D1F0] rounded-lg p-8 shadow-md flex flex-col items-center text-center">
    //         <p className="text-black font-medium mb-4">
    //           Upload Courses, <br /> Mentor Students, and <br /> Inspire Growth
    //         </p>

    //         <Link href="/pages/mentor/login">
    //         <button className="mt-4 px-6 py-2 bg-[#433D8B] text-white rounded-[22px] hover:opacity-90">
    //           Mentor
    //         </button>
    //         </Link>

    //       </div>
    //     </div>
    //   </main>

    //   {/* Footer */}
    //   <Footer />
    // </div>
    //   </>

    <>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        {/* <LoggedOutHeader /> */}

        <Navbar />

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
          {/* Title */}
          <h1 className="text-[#6E40FF] font-['Edu_NSW_ACT_Foundation'] text-xl mb-8">
            Select Your Login Role
          </h1>

          <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
            {/* Left Card */}
            <div className="bg-white border border-[#D6D1F0] rounded-lg p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.1)] flex flex-col items-center text-center">
              <p className="text-gray-700 mb-4">
                Access Courses, Learn, <br /> and Interact with <br /> Mentors
              </p>
              <Link href="/pages/student/login">
                <button className="px-6 py-2 bg-[#6E40FF] text-white rounded-[0px] hover:opacity-90">
                  Student
                </button>
              </Link>
            </div>

            {/* Right Card */}
            <div className="bg-white border border-[#D6D1F0] rounded-lg p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.1)] flex flex-col items-center text-center">
              <p className="text-gray-700 mb-4">
                Upload Courses, <br /> Mentor Students, and <br /> Inspire Growth
              </p>
              <Link href="/pages/mentor/login">
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

export default LoginRole
