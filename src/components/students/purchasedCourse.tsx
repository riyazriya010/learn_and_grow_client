'use client'

import { studentApis } from "@/app/api/studentApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import LoadingModal from "../re-usable/loadingModal";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import Image from "next/image";
import ReusableTable from "../re-usable/table";
import Pagination from "../re-usable/pagination";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
// import axios from "axios";
// import { USER_SERVICE_URL } from "@/utils/constant";
import { useDispatch } from "react-redux";
import { clearUserDetials } from "@/redux/slices/userSlice";

interface CourseData {
  _id?: string;
  courseDetails: { [key: string]: any };
  completedChapters: [{ [key: string]: any }];
  isCourseCompleted: boolean;
  purchasedAt: string;
}
const PurchasedCourse = () => {
  const headers = ['Course Name', 'Level']
  const [course, setCourse] = useState<CourseData[] | []>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dispatch = useDispatch()


  useEffect(() => {
    setIsLoading(false)
    const fetchData = async (page: number) => {
      try {
        const filters = { page, limit: 4 };
        const response = await studentApis.getPurchasedCourses(filters)
        if (response) {
          console.log('ress ', response)
          const data = response.data?.result?.courses;
          setCourse(data);
          setCurrentPage(response?.data?.result.currentPage);
          setTotalPages(response?.data?.result.totalPages);
        }
      } catch (error: any) {
      console.log('error : ',error)
        if (
          error &&
          error?.response?.status === 403 &&
          error?.response?.data?.message === 'Student Blocked'
        ) {
          toast.warn(error?.response?.data?.message);
          Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
          Cookies.remove('refreshToken');
          localStorage.clear();
          dispatch(clearUserDetials());
          setTimeout(() => {
            window.location.replace('/pages/student/login');
          }, 3000);
          return;
        }
        if (error && error.response?.status === 401) {
          console.log('401 error: ', error)
          toast.warn(error.response.data.message);
          // Cookies.remove('accessToken', { domain: '.learngrow.live', path: '/' });
          // Cookies.remove('refreshToken');
          // localStorage.clear();
          // dispatch(clearUserDetials());
          // setTimeout(() => {
          //   window.location.replace('/pages/student/login');
          // }, 3000);
          return;
        }
        console.log('last error: ',error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData(currentPage)
  }, [currentPage])

  const viewCourse = (id: string) => {
    router.push(`/pages/student/course-play?buyedId=${id}`)
  }

  const checkProgress = (id: string) => {
    console.log('id: ', id)
    setSelectedId(id);
    setIsOpen(true);
  }

  if (isLoading) return <LoadingModal isOpen={isLoading} message="Please wait..." />

  return (
    <>
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

          {course.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
              <Image
                src="/images/undraw_no-data_ig65.svg" // Path to your illustration
                alt="No Courses"
                width={128}
                height={128}
                className="mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">No Courses Buyed Yet</h2>
              <p className="text-gray-600 mt-2">It looks like you haven&apos;t buyed any courses.</p>
            </div>
          ) : (
            <ReusableTable
              headers={headers}
              data={course.map((c) => ({
                "_id": c._id,
                "Course Name": c.courseDetails.courseName,
                'Level': c.courseDetails.level,
              }))}
              handlers={(row) => [

                {
                  handler: () => viewCourse(row._id),
                  name: "View"
                },
                {
                  handler: () => checkProgress(row._id),
                  name: "Progress"
                },
              ]}
              buttonStyles="bg-[#433D8B] text-white text-sm font-medium rounded hover:opacity-90"
              tableWidth="max-w-[650px]"
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

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Progress Details</h2>
              <p className="text-gray-600">ID: {selectedId}</p>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <MentorFooter />
      </div>
    </>
  )
}

export default PurchasedCourse
