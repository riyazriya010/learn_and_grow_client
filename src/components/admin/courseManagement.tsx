'use client'

import { adminApis } from "@/app/api/adminApis";
import { useEffect, useState } from "react";
import MentorFooter from "../mentors/footer";
import Link from "next/link";
import ReusableTable from "../re-usable/table";
import Image from "next/image";
import { FaLock, FaUnlock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AdminHeader from "./header";
import Pagination from "../re-usable/pagination";
import Swal from "sweetalert2";

interface CourseData {
  _id?: string;
  courseName: string;
  category: string;
  isListed: boolean;
}

const CourseManagement = () => {
  const headers = ['Course Name', 'Category'];
  const [course, setCourse] = useState<CourseData[]>([]);
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async (page: number) => {
      try {
        const filters = { page, limit: 4 }
        const response = await adminApis.getAllCourses(filters)
        if (response) {
          const data = response.data?.result?.courses;
          setCourse(data);
          setCurrentPage(response?.data?.result.currentPage);
          setTotalPages(response?.data?.result.totalPages);
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData(currentPage)
  }, [currentPage])


  
  const handleListUnlist = async (courseId: string, isListed: boolean) => {
    try {
      let result;
  
      if (isListed) {
        // Unlisting logic
        result = await Swal.fire({
          title: "Are you sure?",
          text: "You want to unlist this course.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, unlist it!",
        });
        if (result.isConfirmed) {
          console.log(`Course ${courseId} has been unlisted.`);
          const response = await adminApis.courseUnList(courseId);
          if (response) {
            console.log("Unlisted course:", response);
            // Optional: Update your state or handle success feedback here
          }
        }
      } else {
        // Listing logic
        console.log(`Course ${courseId} will be listed.`);
        result = await Swal.fire({
          title: "Are you sure?",
          text: "You want to list this course.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, list it!",
        });
        if (result.isConfirmed) {
          const response = await adminApis.courseList(courseId);
          if (response) {
            console.log("Listed course:", response);
            // Optional: Update your state or handle success feedback here
          }
        }
      }
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };
  

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AdminHeader />

        {/* Content Section */}
        <main className="flex-grow px-8 py-4">
          {course.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
              <Image
                src="/images/undraw_no-data_ig65.svg" // Path to your illustration
                alt="No Courses"
                width={128}
                height={128}
                className="mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">No Courses found Yet</h2>
              <p className="text-gray-600 mt-2">It looks like haven't added any courses.</p>
            </div>
          ) : (
            <ReusableTable
              headers={headers}
              data={course.map(cat => ({
                "_id": cat._id,
                "Course Name": cat.courseName,
                "Category": cat.category,
                "isListed": cat.isListed
              }))}
              handlers={(row) => [
                {
                  handler: () => handleListUnlist(row._id, row.isListed),
                  name: row.isListed ? 'Unlist' : 'List',
                  icon: row.isListed ? <FaLock /> : <FaUnlock />
                }
              ]}
              buttonStyles="bg-[#6E40FF] text-white text-sm font-medium rounded hover:opacity-90"
              tableWidth="max-w-[600px]"
            />
          )}
        </main>

        <div className="mb-4">
          {/* Pagination */}
          <div className="w-full flex justify-center mt-6">
            <Pagination
              nextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              directClick={(pageNumber) => {
                setCurrentPage(pageNumber);
              }}
              previousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
        <MentorFooter />
      </div>
    </>
  )
}

export default CourseManagement
