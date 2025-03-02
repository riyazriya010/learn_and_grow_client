'use client';

import Link from "next/link";
import ReusableTable from "../re-usable/table";
import Navbar from "../navbar";
import MentorFooter from "./footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { mentorApis } from "@/app/api/mentorApi";
import { FaLock, FaUnlock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Pagination from "../re-usable/pagination";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import { MENTOR_SERVICE_URL } from "@/utils/constant";
import axios from "axios";

interface CoursesData {
  _id?: string;
  courseName: string;
  duration: string;
  level: string;
  price: string;
  isPublished: boolean;
}

const MentorCourses = () => {
  const headers = ['Course Name', 'Duration', 'Level', 'Price'];
  const [courses, setCourses] = useState<CoursesData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter()

  const fetchData = async (page: number) => {
    try {
      const filters = { page, limit: 4 };
      const response = await mentorApis.getAllCourses(filters);
      if (response && response?.data?.result) {
        console.log('res: ', response);
        setCourses(response?.data?.result?.courses);
        setCurrentPage(response?.data?.result.currentPage);
        setTotalPages(response?.data?.result.totalPages);
      }
    } catch (error: any) {
      if (error && error.response?.status === 404 &&
        error?.response?.data?.message === 'Courses Not Found') {
        toast.warn(error.response.data.message);
        return
      }
      if(error && error?.response?.status === 401 && error.response?.data?.message === 'Mentor Not Verified'){
        toast.warn(error?.response?.data?.message);
        setTimeout(() => {
          window.location.replace('/pages/mentor/profile');
        }, 3000);
        return;
      }
      if (error && error.response?.status === 401) {
        toast.warn(error.response.data.message);
        await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
      if (
        error &&
        error?.response?.status === 403 &&
        error?.response?.data?.message === 'Mentor Blocked'
      ) {
        toast.warn(error?.response?.data?.message);
        await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);


  const handleListUnlist = async (courseId: string, isPublished: boolean) => {
    try {
      let result;

      if (isPublished) {
        result = await Swal.fire({
          title: "Are you sure?",
          text: "You want to unPublish this course.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, unPublish it!",
        });
        if (result.isConfirmed) {
          const response = await mentorApis.unPublish(String(courseId))
          if (response) {
            fetchData(currentPage);
            Swal.fire(
              "unPublished!",
              `The course has been "unPublished".`,
              "success"
            );
          }
        }
      } else {
        result = await Swal.fire({
          title: "Are you sure?",
          text: "You want to Publish this course.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Publish it!",
        });
        if (result.isConfirmed) {
          const response = await mentorApis.publish(String(courseId))
          if (response) {
            fetchData(currentPage);
            Swal.fire(
              "Published!",
              `The course has been "Published".`,
              "success"
            );
          }
        }
      }
    } catch (error: any) {
      if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
        console.log('401 log', error.response.data.message)
        toast.warn(error.response.data.message);
        setTimeout(() => {
          router.push('/pages/mentor/profile')
        }, 2000)
        return;
      }
      if (error && error.response?.status === 401) {
        toast.warn(error.response.data.message);
        await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
      if (
        error &&
        error?.response?.status === 403 &&
        error?.response?.data?.message === 'Mentor Blocked'
      ) {
        toast.warn(error?.response?.data?.message);
        await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
    }

  };


  const handleSearch = async () => {
    try {
      const filter: any = {}
      if (searchTerm) {
        filter.searchTerm = searchTerm
        filter.page = 1
        filter.limit = 4
        const response = await mentorApis.filterCourse(filter)
        if (response) {
          console.log('res search: ', response)
          setCourses(response?.data?.result?.courses);
          setCurrentPage(response?.data?.result.currentPage);
          setTotalPages(response?.data?.result.totalPages);
        }
      } else {
        return
      }
    } catch (error: any) {
      if (error && error.response?.status === 401) {
        toast.warn(error.response.data.message);
        await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/student/login');
        }, 3000);
        return;
      }
      if (
        error &&
        error?.response?.status === 403 &&
        error?.response?.data?.message === 'Mentor Blocked'
      ) {
        toast.warn(error?.response?.data?.message);
        await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
      if (error && error?.response?.status === 404) {
        toast.warn('Course Not Found')
        setCourses([]);
      }
    }

  }


  const editCourse = async (courseId: string) => {
    router.push(`/pages/mentor/edit-course?courseId=${courseId}`)
  }

  const Chapters = (courseId: string) => {
    router.push(`/pages/mentor/chapters?courseId=${courseId}`)
  };

  const Quizz = (courseId: string) => {
    console.log('Add Quiz for Course ID:', courseId);
    router.push(`/pages/mentor/quizz?courseId=${courseId}`)
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <ToastContainer
        autoClose={2000}
        pauseOnHover={false}
        transition={Slide}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnFocusLoss={true}
      />

      {/* Content Section */}
      <main className="flex-grow px-8 py-4">
        <div className="flex justify-between items-center mb-4">
          {/* Add Course Button */}
          <Link href="/pages/mentor/add-course">
            <button className="bg-[#22177A] text-white px-6 py-2 rounded-[13px]">
              Add Course
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            className="border border-[#22177A] rounded-[13px] px-3 py-2"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="px-4 py-2 border border-[#22177A] bg-[#ffffff] text-black rounded-[13px]"
            onClick={handleSearch}
          >
            Search
          </button>
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
            <p className="text-gray-600 mt-2">It looks like you haven&apos;t added any courses. Start by clicking the button above!</p>
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
                name: row.isPublished ? 'UnPublish' : 'Publish',
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
            buttonStyles=" bg-[#ffffff] border border-[#22177A] text-black rounded-[13px] hover:bg-gray-100 transition-colors"
          />
        )}
        {/* Pagination */}
        <div className="flex justify-center mt-6">
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
      </main>

      <MentorFooter />
    </div>
  );
};

export default MentorCourses;
