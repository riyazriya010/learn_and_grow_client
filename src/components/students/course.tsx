'use client'

import { useCallback, useEffect, useState } from 'react';
import { studentApis } from '@/app/api/studentApi';
import Navbar from '../navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Pagination from '../re-usable/pagination';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Footer from '../loggedoutNav/footer';

const CoursesPage = () => {
  const [courses, setCourses] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFliter] = useState<boolean>(true)

  const router = useRouter();

  const categories = ['Programming', 'Machine Learning', 'Data Science', 'Cyber Security'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];


  const fetchCourses = useCallback(async (page: number) => {
    console.log('fun')
    try {
      const filters = { page, limit: 2 };
      const response = await studentApis.fetchAllCourse(filters);
      if (response?.data) {
        console.log('res ', response)
        setCourses(response?.data?.result.courses);
        setCurrentPage(response?.data?.result.currentPage);
        setTotalPages(response?.data?.result.totalPages);
        setTotalCourses(response?.data?.result.totalCourses);
        console.log('totalCourse ', totalCourses)
      } else {
        setCourses([]);
      }
    } catch (error: any) {
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
      if (error && error?.response?.status === 404 && error?.response?.data?.message === 'Courses Not Found') {
        toast.warn('Courses Not Foundd')
      }
      setCourses([]);
    }
  }, [courses])


  // const fetchCourses = async (page: number) => {
  //   try {
  //     const filters = { page, limit: 2 };
  //     const response = await studentApis.fetchAllCourse(filters);
  //     if (response?.data) {
  //       console.log('res ', response)
  //       setCourses(response?.data?.result.courses);
  //       setCurrentPage(response?.data?.result.currentPage);
  //       setTotalPages(response?.data?.result.totalPages);
  //       setTotalCourses(response?.data?.result.totalCourses);
  //     } else {
  //       setCourses([]);
  //     }
  //   } catch (error: any) {
  //     if (
  //       error &&
  //       error?.response?.status === 403 &&
  //       error?.response?.data?.message === 'Student Blocked'
  //     ) {
  //       toast.warn(error?.response?.data?.message);
  //       Cookies.remove('accessToken');
  //       localStorage.clear();
  //       setTimeout(() => {
  //         window.location.replace('/pages/student/login');
  //       }, 3000);
  //       return;
  //     }
  //     if (error && error?.response?.status === 404 && error?.response?.data?.message === 'Courses Not Found') {
  //       toast.warn('Courses Not Foundd')
  //     }
  //     setCourses([]);
  //   }
  // };


  const restoreFilters = () => {
    const filters = localStorage.getItem('filters');
    if (filters) {
      const parsedFilters = JSON.parse(filters);
      if (parsedFilters.selectedCategory) setSelectedCategory(parsedFilters.selectedCategory);
      if (parsedFilters.selectedLevel) setSelectedLevel(parsedFilters.selectedLevel);
      if (parsedFilters.searchTerm) setSearchTerm(parsedFilters.searchTerm);
    }
  };



  useEffect(() => {
    restoreFilters()
    const filters = localStorage.getItem('filters')
    const parsedFilters = JSON.parse(String(filters))

    if (parsedFilters) {
      setFliter(false)
      const filteringData = async () => {
        try {
          const response = await studentApis.filterData(parsedFilters)

          if (response && response?.data) {
            setCourses(response?.data?.result?.courses);
            setCurrentPage(response?.data?.result?.currentPage);
            setTotalPages(response?.data?.result?.totalPages);
            setTotalCourses(response?.data?.result?.totalCourses);
          } else {
            setCourses([]);
          }

        } catch (error: any) {
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
          if (error && error?.response?.status === 404) {
            toast.warn('Course Not Found')
            setCourses([]);
          }
        }
      }
      filteringData()
      return
    }
    fetchCourses(currentPage);
  }, [currentPage, selectedCategory, selectedLevel, searchTerm]);



  // Remove filters and fetch data
  const removeFilters = () => {
    setFliter(true)
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSearchTerm("");
    localStorage.removeItem('filters');
    setCurrentPage(1);
    fetchCourses(1);
  };


  const commonFilter = async () => {
    try {
      setFliter(false)
      const filters: any = {};
      if (selectedCategory) filters.selectedCategory = selectedCategory;
      if (selectedLevel) filters.selectedLevel = selectedLevel;
      if (searchTerm) filters.searchTerm = searchTerm;
      filters.page = 1
      filters.limit = 6

      if (selectedCategory || selectedLevel || searchTerm) {
        localStorage.setItem('filters', JSON.stringify(filters))
      }

      const response = await studentApis.filterData(filters)
      console.log('res filtered: ', response.data.result.courses)
      if (response && response?.data) {
        setCourses(response?.data?.result?.courses);
        setCurrentPage(response?.data?.result?.currentPage);
        setTotalPages(response?.data?.result?.totalPages);
        setTotalCourses(response?.data?.result?.totalCourses);
      } else {
        setCourses([]); // Set empty array if courses are not found
      }
    } catch (error: any) {
      console.log('errorrr: ', error);
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
      if (error && error?.response?.status === 404) {
        toast.warn('Course Not Found')
        setCourses([]);
        setCurrentPage(1)
        setTotalPages(1)
      }
    }
  };

  // Handle course click
  const handleCourseClick = (id: string) => {
    router.push(`/pages/student/view-course?courseId=${id}`);
  };


  // return (
  //   <div className="flex flex-col min-h-screen bg-white">
  //     <header><Navbar /></header>

  //     <ToastContainer
  //       autoClose={2000}
  //       pauseOnHover={false}
  //       transition={Slide}
  //       hideProgressBar={false}
  //       closeOnClick={false}
  //       pauseOnFocusLoss={true}
  //     />

  //     <div className="flex flex-1 w-full px-4 py-8 md:px-8 lg:px-16">
  //       {/* Filter Section */}
  //       <div className="w-full md:w-1/5 p-7 bg-white">
  //         <h2 className="text-xl font-semibold mb-4">Filters</h2>

  //         {/* Categories */}
  //         <div className="mb-6">
  //           <h3 className="text-lg font-medium mb-2">Category</h3>
  //           {categories.map((category) => (
  //             <label key={category} className="flex items-center gap-2 mb-2">
  //               <input
  //                 type="checkbox"
  //                 className="form-checkbox h-4 w-4 text-[#433D8B]"
  //                 checked={selectedCategory === category}
  //                 onChange={() =>
  //                   setSelectedCategory(selectedCategory === category ? null : category)
  //                 }
  //               />
  //               <span>{category}</span>
  //             </label>
  //           ))}
  //         </div>

  //         {/* Levels */}
  //         <div className="mb-6">
  //           <h3 className="text-lg font-medium mb-2">Level</h3>
  //           {levels.map((level) => (
  //             <label key={level} className="flex items-center gap-2 mb-2">
  //               <input
  //                 type="checkbox"
  //                 className="form-checkbox h-4 w-4 text-[#433D8B]"
  //                 checked={selectedLevel === level}
  //                 onChange={() => setSelectedLevel(selectedLevel === level ? null : level)}
  //               />
  //               <span>{level}</span>
  //             </label>
  //           ))}
  //         </div>

  //         {/* Buttons */}
  //         {
  //           filter ? <button
  //             className='px-4 py-2 bg-[#22177A] text-white rounded-[13px]'
  //             onClick={commonFilter}
  //           > Apply Filter</button>
  //             : <button
  //               className='px-4 py-2 border border-[#22177A] bg-[#ffffff] text-gray-600 rounded-[13px] hover:bg-gray-200 transition-colors'
  //               onClick={removeFilters}
  //             > Remove Filter</button>
  //         }
  //       </div>

  //       {/* Courses Section */}
  //       <div className="w-full md:w-4/5 p-4">

  //         {/* Search Bar */}
  //         <div className="flex justify-between items-center mb-4">
  //           <h2 className="text-xl font-semibold">Courses</h2>

  //           {/* Search Bar */}
  //           <div className="flex items-center gap-2">
  //             <input
  //               type="text"
  //               className="border border-gray-400 rounded-[13px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#191919] focus:border-transparent"
  //               placeholder="Search courses..."
  //               value={searchTerm}
  //               onChange={(e) => setSearchTerm(e.target.value)}
  //             />
  //             <button
  //               className="px-4 py-2 border border-[#22177A] bg-[#ffffff] text-gray-600 rounded-[13px] hover:bg-gray-100 transition-colors"
  //               onClick={commonFilter}
  //             >
  //               Search
  //             </button>
  //           </div>
  //         </div>

  //         {(courses && courses.length > 0) ? (
  //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  //             {courses.map((course: any, index: any) => (
  //               <div
  //                 key={index}
  //                 className="bg-[#FFFFFF] border border-[#D6D1F0] rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
  //                 onClick={() => handleCourseClick(course._id)}
  //               >
  //                 <img
  //                   src={course.thumbnailUrl}
  //                   alt={course.name}
  //                   className="w-full h-32 object-cover mb-4 rounded-t-md"
  //                 />
  //                 <div className="p-4">
  //                   <h3 className="text-lg font-bold mb-2 text-[#000000]">{course.courseName}</h3>
  //                   <p className="text-gray-500 mb-1">Duration: {course.duration}</p>
  //                   <p className="text-gray-500 mb-1">Level: {course.level}</p>
  //                   <p className="text-gray-500 mb-1">Category: {course.category}</p>
  //                   <div className="flex justify-between items-center">
  //                     <p className="text-gray-700 font-semibold">₹{course.price}</p>
  //                     {/* <p className="text-gray-700 font-semibold">65% off</p> */}
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         ) : (
  //           <div className="flex flex-col items-center justify-center mt-10">
  //             <Image
  //               src="/images/undraw_no-data_ig65.svg"
  //               alt="No Courses"
  //               width={128}
  //               height={128}
  //               className="mb-4"
  //             />
  //             <p className="text-gray-500 text-lg">No courses available</p>
  //           </div>
  //         )}

  //         {/* Pagination */}
  //         <div className="flex justify-center mt-6">
  //           <Pagination
  //             nextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
  //             directClick={(pageNumber) => {
  //               setCurrentPage(pageNumber);
  //               fetchCourses(pageNumber);
  //             }}
  //             previousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  //             currentPage={currentPage}
  //             totalPages={totalPages}
  //           />
  //         </div>

  //       </div>
  //     </div>

  //     <footer>
  //       {/* <MentorFooter /> */}
  //       <Footer />
  //     </footer>
  //   </div>
  // );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header><Navbar /></header>

      <ToastContainer
        autoClose={2000}
        pauseOnHover={false}
        transition={Slide}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnFocusLoss={true}
      />

      <div className="flex flex-1 w-full px-4 py-8 md:px-6 lg:px-12 xl:px-16 flex-col md:flex-row">
        {/* Filter Section */}
        <div className="w-full md:w-1/4 lg:w-1/5 p-4 md:p-7 bg-white">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Category</h3>
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-[#433D8B]"
                  checked={selectedCategory === category}
                  onChange={() =>
                    setSelectedCategory(selectedCategory === category ? null : category)
                  }
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

          {/* Levels */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Level</h3>
            {levels.map((level) => (
              <label key={level} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-[#433D8B]"
                  checked={selectedLevel === level}
                  onChange={() => setSelectedLevel(selectedLevel === level ? null : level)}
                />
                <span>{level}</span>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <button
            className={`px-4 py-2 rounded-[13px] ${filter ? 'bg-[#22177A] text-white' : 'border border-[#22177A] bg-[#ffffff] text-gray-600 hover:bg-gray-200 transition-colors'}`}
            onClick={filter ? commonFilter : removeFilters}
          >
            {filter ? 'Apply Filter' : 'Remove Filter'}
          </button>
        </div>

        {/* Courses Section */}
        <div className="w-full md:w-3/4 lg:w-4/5 p-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold">Courses</h2>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                className="border border-gray-400 rounded-[13px] px-3 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-[#191919] focus:border-transparent"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="px-4 py-2 border border-[#22177A] bg-[#ffffff] text-gray-600 rounded-[13px] hover:bg-gray-100 transition-colors"
                onClick={commonFilter}
              >
                Search
              </button>
            </div>
          </div>

          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course: any, index: any) => (
                <div
                  key={index}
                  className="bg-[#FFFFFF] border border-[#D6D1F0] rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleCourseClick(course._id)}
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.name}
                    className="w-full h-32 md:h-40 lg:h-48 object-cover mb-4 rounded-t-md"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-[#000000]">{course.courseName}</h3>
                    <p className="text-gray-500 mb-1">Duration: {course.duration}</p>
                    <p className="text-gray-500 mb-1">Level: {course.level}</p>
                    <p className="text-gray-500 mb-1">Category: {course.category}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-700 font-semibold">₹{course.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-10">
              <Image
                src="/images/undraw_no-data_ig65.svg"
                alt="No Courses"
                width={128}
                height={128}
                className="mb-4"
              />
              <p className="text-gray-500 text-lg">No courses available</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              nextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              directClick={(pageNumber) => {
                setCurrentPage(pageNumber);
                fetchCourses(pageNumber);
              }}
              previousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>

      <footer><Footer /></footer>
    </div>
  );


};

export default CoursesPage;




