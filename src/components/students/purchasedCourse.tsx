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

  useEffect(() => {
    setIsLoading(false)
    const fetchData = async (page: number) => {
      try {
        const filters = { page, limit: 3 };
        const response = await studentApis.getPurchasedCourses(filters)
        if (response) {
          console.log('ress ', response)
          const data = response.data?.data?.courses;
          setCourse(data);
          setCurrentPage(response?.data?.data.currentPage);
          setTotalPages(response?.data?.data.totalPages);
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData(currentPage)
  }, [currentPage])

  const viewCourse = (id: string) => {
    router.push(`/pages/student/course-play?buyedId=${id}`)
  }

  if (isLoading) return <LoadingModal isOpen={isLoading} message="Please wait..." />

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />

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
              <p className="text-gray-600 mt-2">It looks like you haven't buyed any courses.</p>
            </div>
          ) : (
            <ReusableTable
              headers={headers}
              data={course.map((c) => ({
                "_id": c._id,
                "Course Name": c.courseDetails.courseName,
                'Level': c.courseDetails.level
              }))}
              handlers={(row) => [

                {
                  handler: () => viewCourse(row._id),
                  name: "View"
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

        <MentorFooter />
      </div>
    </>
  )
}

export default PurchasedCourse
