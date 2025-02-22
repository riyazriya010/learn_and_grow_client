'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import LoadingModal from "../re-usable/loadingModal";
import Image from "next/image";
import ReusableTable from "../re-usable/table";
import Pagination from "../re-usable/pagination";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import AdminHeader from "./header";
import AdminFooter from "./footer";
import axios from "axios";
import { ADMIN_SERVICE_URL } from "@/utils/constant";

interface CourseData {
  _id?: string;
  courseName: string;
  level: string;
  price: string
}
const NotApprovedCourse = () => {
  const headers = ['Course Name', 'Level', 'Price']
  const [course, setCourse] = useState<CourseData[] | []>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter()

  useEffect(() => {
    setIsLoading(false)
    const fetchData = async (page: number) => {
      try {
        const filters = { page, limit: 3 };
        const response = await axios.get(`${ADMIN_SERVICE_URL}/get/non-approved/courses`,{
            params: filters,
            withCredentials: true
        })
        if (response) {
          console.log('ress ', response)
          const data = response.data?.result?.courses;
          setCourse(data);
          setCurrentPage(response?.data?.result.currentPage);
          setTotalPages(response?.data?.result.totalPages);
        }
      } catch (error: any) {
        if (error && error.response?.status === 401) {
          toast.warn(error.response.data.message);
          Cookies.remove('accessToken');
          localStorage.clear();
          setTimeout(() => {
            window.location.replace('/pages/login');
          }, 3000);
          return;
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchData(currentPage)
  }, [currentPage])

  const viewCourse = (id: string) => {
    router.push(`/pages/course-details?courseId=${id}`)
  }

  if (isLoading) return <LoadingModal isOpen={isLoading} message="Please wait..." />

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AdminHeader />

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

          {course.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
              <Image
                src="/images/undraw_no-data_ig65.svg" // Path to your illustration
                alt="No Courses"
                width={128}
                height={128}
                className="mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">No non-approved course not found yet</h2>
              {/* <p className="text-gray-600 mt-2">It looks like you haven't buyed any courses.</p> */}
            </div>
          ) : (
            <ReusableTable
              headers={headers}
              data={course.map((c) => ({
                "_id": c._id,
                "Course Name": c.courseName,
                'Level': c.level,
                'Price': c.price
              }))}
              handlers={(row) => [

                {
                  handler: () => viewCourse(row._id),
                  name: "View"
                },
              ]}
              buttonStyles="bg-[#433D8B] text-white text-sm font-medium rounded hover:opacity-90"
              tableWidth="max-w-[750px]"
            />
          )}
        </main>

        <div className="mb-4">
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

        <AdminFooter />
      </div>
    </>
  )
}

export default NotApprovedCourse
