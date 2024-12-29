'use client'

import Link from "next/link";
import ReusableTable from "../table";
import Navbar from "../navbar";
import MentorFooter from "./footer";
import Image from "next/image";

const MentorCourses = () => {
    const headers = ['Course Name', 'Duration', 'Level', 'Price', 'Actions'];
    const data: any = []; // No courses scenario

    const listCourse = () => {
        console.log('List Course');
    };

    const handlers: any = [{ handler: listCourse, name: 'List' }];
    
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            {/* Content Section */}
            <main className="flex-grow px-8 py-4">
                <div className="flex justify-between items-center mb-4">
                    {/* Add Course Button */}
                    <Link href="/pages/mentor/add-course">
                        <button className="bg-[#433D8B] text-white px-6 py-2 rounded-lg hover:opacity-90">
                            Add Course
                        </button>
                    </Link>
                </div>

                {data.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
                        <Image 
                            src="/images/undraw_no-data_ig65.svg" // Path to your illustration
                            alt="No Courses"
                            width={128} // Set the width
                            height={128} // Set the height
                            className="mb-4"
                        />
                        <h2 className="text-2xl font-semibold text-gray-800">No Courses Uploaded Yet</h2>
                        <p className="text-gray-600 mt-2">It looks like you haven't added any courses. Start by clicking the button above!</p>
                    </div>
                ) : (
                    <ReusableTable 
                        headers={headers} 
                        data={data} 
                        handlers={handlers.length > 0 ? handlers : [{ handler: () => {}, name: 'No Actions' }]} 
                    />
                )}
            </main>

            <MentorFooter />
        </div>
    );
}

export default MentorCourses;


