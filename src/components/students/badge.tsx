'use client'

import { studentApis } from "@/app/api/studentApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import LoadingModal from "../re-usable/loadingModal";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import Image from "next/image";
import Cookies from "js-cookie";
import ReusableTable from "../re-usable/table";
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../loggedoutNav/footer";


interface BadgeData {
    _id: string; // ID of the StudentBadge entry
    userId: string;
    badgeId: {
      _id: string; // ID of the Badge
      badgeName: string;
      description: string;
      value: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

const StudentBadge = () => {
  const headers = ['Badge Name', 'Description', 'Value']
  const [badge, setBadge] = useState<BadgeData[] | []>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter()

  useEffect(() => {
    setIsLoading(false)
    const fetchData = async () => {
      try {
        const response = await studentApis.getBadges()
        if (response) {
          console.log('res badge: ', response)
          setBadge(response?.data?.result)
        }
      } catch (error: any) {
        if (error && error.response?.status === 401) {
          toast.warn(error.response.data.message);
          Cookies.remove('accessToken');
          localStorage.clear();
          setTimeout(() => {
            window.location.replace('/pages/student/login');
          }, 3000);
          return;
        }
        if (
          error &&
          error?.response?.status === 403 &&
          error?.response?.data?.message === 'Student Blocked'
        ) {
          toast.warn(error?.response?.data?.message);
          Cookies.remove('accessToken');
          localStorage.clear();
          setTimeout(() => {
            window.location.replace('/pages/student/login');
          }, 3000);
          return;
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])


  const exchangeBadge = (id: string) => {
    console.log('badgeId to exchange: ', id)
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

          {badge.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
              <Image
                src="/images/undraw_no-data_ig65.svg" // Path to your illustration
                alt="No Courses"
                width={128}
                height={128}
                className="mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">No Badges Found Yet</h2>
              <p className="text-gray-600 mt-2">It looks like you haven't completed any courses.</p>
            </div>
          ) : (
            <ReusableTable
              headers={headers}
              data={badge.map((c) => ({
                "_id": c._id,
                "Badge Name": c.badgeId.badgeName,
                'Description': c.badgeId.description,
                "Value": `${c.badgeId.value}`
              }))}
              handlers={(row) => [

                {
                  handler: () => exchangeBadge(row._id),
                  name: "Exchange"
                },
              ]}
              buttonStyles="bg-[#433D8B] text-white text-sm font-medium rounded hover:opacity-90"
              tableWidth="max-w-[750px]"
            />
          )}
        </main>


        <Footer />
      </div>
    </>
  )
}

export default StudentBadge
