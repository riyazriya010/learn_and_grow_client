'use client'

import { useEffect, useState } from "react";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import ReusableTable from "../re-usable/table";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { mentorApis } from "@/app/api/mentorApi";
import Cookies from "js-cookie";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MENTOR_SERVICE_URL } from "@/utils/constant";
import axios from "axios";

interface ChapterData {
  _id?: string;
  chapterTitle: string;
  description: string;
  videoUrl: string;
}

const Chapters = () => {
  const headers = ['Chapter Title', 'Description'];
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [courseId, setCourseId] = useState<string | null>(null);
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const courseId = searchParams.get("courseId");
    if (courseId) {
      setCourseId(courseId)
      const fetchData = async (courseId: string) => {
        try {
          const response = await mentorApis.getAllChapters(courseId)
          if (response && response?.data?.result) {
            console.log('res chap: ', response)
            setChapters(response?.data?.result)
          }
        } catch (error: any) {
          if (error && error?.response?.status === 401 && error.response?.data?.message === 'Mentor Not Verified') {
            toast.warn(error?.response?.data?.message);
            setTimeout(() => {
              window.location.replace('/pages/mentor/profile');
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
          if (error && error.response?.status === 401) {
            toast.warn(error.response.data.message);
            await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
            localStorage.clear();
            setTimeout(() => {
              window.location.replace('/pages/mentor/login');
            }, 3000);
            return;
          }
        }
      }
      fetchData(courseId)
    }

  }, [])


  const editChapter = async (chapterId: string) => {
    try {
      console.log(`Category ${chapterId} has been Edited.`);

      // Find the chapter you want to edit
      const feildToEdit = chapters
        .map((c) => {
          if (c._id === chapterId) {
            return [c.chapterTitle, c.description, c.videoUrl];
          }
          return undefined;
        })
        .filter((item): item is [string, string, string] => item !== undefined);

      // Ensure feildToEdit is not empty
      if (feildToEdit.length > 0) {
        localStorage.setItem('chapterTitle', feildToEdit[0][0]);
        localStorage.setItem('chapterDescription', feildToEdit[0][1]);
        localStorage.setItem('chapterVideoUrl', feildToEdit[0][2]);
        router.push(`/pages/mentor/edit-chapter?chapterId=${chapterId}`);
      } else {
        console.log(`Chapter with ID ${chapterId} not found.`);
      }
    } catch (error: any) {
      if (
        error &&
        error?.response?.status === 403 &&
        error?.response?.data?.message === 'Mentor Blocked'
      ) {
        toast.warn(error?.response?.data?.message);
        Cookies.remove('accessToken');
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
      if (
        error && error?.response?.status === 401) {
        toast.warn(error?.response?.data?.message);
        Cookies.remove('accessToken');
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/mentor/login');
        }, 3000);
        return;
      }
    }
  };


  const addChapter = (courseId: string) => {
    console.log('Add Chapter for Course ID:', courseId);
    router.push(`/pages/mentor/add-chapter?courseId=${courseId}`)
    // Implement the logic to add a chapter
  };

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
          <div className="flex justify-between items-center mb-4">
            {/* Add Course Button */}
            {/* <Link href="/pages/add-category"> */}
            <button
              className="bg-[#433D8B] text-white px-6 py-2 rounded-lg hover:opacity-90"
              onClick={() => addChapter(String(courseId))}
            >
              Add Chapters
            </button>
            {/* </Link> */}
          </div>

          {chapters.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
              <Image
                src="/images/undraw_no-data_ig65.svg" // Path to your illustration
                alt="No Courses"
                width={128}
                height={128}
                className="mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">No chapters Uploaded Yet</h2>
              <p className="text-gray-600 mt-2">It looks like you haven&apos;t added any cahpters. Start by clicking the button above</p>
            </div>
          ) : (
            <ReusableTable
              headers={headers}
              data={chapters.map(c => ({
                "_id": c._id,
                "Chapter Title": c.chapterTitle,
                'Description': c.description
              }))}
              handlers={(row) => [
                {
                  handler: () => editChapter(row._id),
                  name: "Edit"
                },
              ]}
              buttonStyles="bg-[#433D8B] text-white text-sm font-medium rounded hover:opacity-90"
              tableWidth="max-w-[650px]"
            />
          )}
        </main>

        <MentorFooter />
      </div>
    </>
  )
}

export default Chapters
