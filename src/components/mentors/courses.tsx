'use client';

import Link from "next/link";
import ReusableTable from "../re-usable/table";
import Navbar from "../navbar";
import MentorFooter from "./footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { mentorApis } from "@/app/api/mentorApi";
import { FaLock, FaUnlock } from "react-icons/fa"; // Import icons for list/unlist
import { useRouter } from "next/navigation";

interface CoursesData {
  _id?: string;
  courseName: string;
  duration: string;
  level: string;
  price: string;
  isPublished: boolean; // Add isPublished to the interface
}

const MentorCourses = () => {
  const headers = ['Course Name', 'Duration', 'Level', 'Price'];
  const [courses, setCourses] = useState<CoursesData[]>([]);

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await mentorApis.getAllCourses();
        if (response && response?.data?.result) {
          console.log('res: ', response);
          setCourses(response?.data?.result);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleListUnlist = async (courseId: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        // Unlist the course
        // await mentorApis.unlistCourse(courseId);
        console.log(`Course ${courseId} has been unlisted.`);
      } else {
        // List the course
        // await mentorApis.listCourse(courseId);
        console.log(`Course ${courseId} has been listed.`);
      }
      // Refresh the course list after the action
      const response = await mentorApis.getAllCourses();
      if (response && response?.data?.result) {
        setCourses(response.data.result);
      }
    } catch (error: any) {
      console.error("Error updating course status:", error);
    }
  };

  const editCourse = async (courseId: string) => {
    router.push(`/pages/mentor/edit-course?courseId=${courseId}`)
  }

  const Chapters = (courseId: string) => {
    // console.log('Add Chapter for Course ID:', courseId);
    // router.push(`/pages/mentor/add-chapter?courseId=${courseId}`)
    router.push(`/pages/mentor/chapters?courseId=${courseId}`)
    // Implement the logic to add a chapter
  };

  const Quizz = (courseId: string) => {
    console.log('Add Quiz for Course ID:', courseId);
    // Implement the logic to add a quiz
    router.push(`/pages/mentor/quizz?courseId=${courseId}`)
  };

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

        {courses.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
            <Image
              src="/images/undraw_no-data_ig65.svg" // Path to your illustration
              alt="No Courses"
              width={128}
              height={128}
              className="mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800">No Courses Uploaded Yet</h2>
            <p className="text-gray-600 mt-2">It looks like you haven't added any courses. Start by clicking the button above!</p>
          </div>
        ) : (
          <ReusableTable
            headers={headers}
            data={courses.map(course => ({
                "_id": course._id,
              "Course Name": course.courseName, // Map headers to data keys
              "Duration": course.duration,
              "Level": course.level,
              "Price": course.price,
              "isPublished": course.isPublished
            }))}
            handlers={(row) => [
              {
                handler: () => handleListUnlist(row._id, row.isPublished),
                name: row.isPublished ? 'Unlist' : 'List',
                icon: row.isPublished ? <FaLock /> : <FaUnlock />
              },
              {
                handler: () => Chapters(row._id),
                name: "Chapters"
              },
              {
                handler: () => Quizz(row._id),
                name: "Quizz"
              },
              {
                handler: () => editCourse(row._id),
                name: "Edit Course"
              }
            ]}
          />


        //   <ReusableTable
        //                 headers={headers}
        //                 data={courses}
        //                 handlers={(row) => [
        //                     {
        //                         handler: () => handleListUnlist(row._id, row.isPublished),
        //                         name: row.isPublished ? 'Unlist' : 'List',
        //                         icon: row.isPublished ? <FaLock /> : <FaUnlock />
        //                     },
        //                     {
        //                         handler: () => addChapter(row._id),
        //                         name: 'Add Chapter',
        //                     },
        //                     {
        //                         handler: () => addQuizz(row._id),
        //                         name: 'Add Quiz',
        //                     },
        //                 ]}
        //             />

        )}
      </main>

      <MentorFooter />
    </div>
  );
};

export default MentorCourses;
