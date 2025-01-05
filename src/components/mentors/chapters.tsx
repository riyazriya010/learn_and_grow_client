'use client'

import { useEffect, useState } from "react";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import Link from "next/link";
import ReusableTable from "../re-usable/table";
import Image from "next/image";
import { FaLock, FaUnlock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { mentorApis } from "@/app/api/mentorApi";

interface ChapterData {
    _id?: string;
    chapterTitle: string;
    description: string;
    videoUrl: string;
}

const Chapters = () => {
      const headers = ['Chapter Title', 'Description'];
      const [chapters, setChapters] = useState<ChapterData[]>([]);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [courseId, setCourseId] = useState<string | null>(null);
      const router = useRouter()

      useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get("courseId");
        if(courseId){
            setCourseId(courseId)
            setIsLoading(false)
        const fetchData = async (courseId: string) => {
            try{
                const response = await mentorApis.getAllChapters(courseId)
                if(response && response?.data?.data){
                    console.log('res chap: ', response)
                    setChapters(response?.data?.data)
                }
            }catch(error){
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData(courseId)
    }else {
        setIsLoading(false)
    }
        
      },[])

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
        } catch (error) {
            console.log(error);
        }
    };


    const addChapter = (courseId: string) => {
        console.log('Add Chapter for Course ID:', courseId);
        router.push(`/pages/mentor/add-chapter?courseId=${courseId}`)
        // Implement the logic to add a chapter
      };

    return(
        <>
        <div className="flex flex-col min-h-screen">
      <Navbar />

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
            <p className="text-gray-600 mt-2">It looks like you haven't added any cahpters. Start by clicking the button above!</p>
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