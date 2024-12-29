'use client'

import { useEffect, useState } from 'react';
import { studentApis } from '@/api/studentApi';
import Navbar from '../navbar';
import MentorFooter from '../mentors/footer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CoursesPage = () => {
  const [courses, setCourses] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter()

  const categories = ['Programming', 'Machine Learning', 'Data Science', 'UI/UX'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const fetchCourses = async () => {
    try {
      const response = await studentApis.fetchAllCourse();
      console.log('API Response:', response);
      if (response?.data && response?.data?.result) {
        setCourses(response.data.result); // Use response.data if that's where the courses are stored
      } else {
        setCourses([]); // Default to empty array if data is missing
      }
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setCourses([]); // Default to empty array on error
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const applyFilters = () => {
    console.log('Filters applied:', { selectedCategory, selectedLevel });
    // Add filtering logic here if needed
  };

  const removeFilters = () => {
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSearchTerm("")
    console.log('Filters removed');
  };

  const handleSearch = () => {
    console.log('Search Term:', searchTerm);
    // Add search logic here if needed
  };

  const commonFilter = () => {
    const cat = selectedCategory
    const level = selectedLevel
    const search = searchTerm
    console.log('common: ', cat, level, search)
  }

  const handleCourseClick = (id: string) => {
    router.push(`/pages/student/view-course?courseId=${id}`)
  }

  const coursesPerPage = 6;
  const paginatedCourses = courses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header><Navbar /></header>

      <div className="flex flex-1 w-full px-4 py-8 md:px-8 lg:px-16">
        {/* Filter Section */}
        <div className="w-full md:w-1/5 p-4 bg-gray-50 border-r border-gray-200 shadow-md ">
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
                  onChange={() => setSelectedCategory(category)}
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
                  onChange={() => setSelectedLevel(level)}
                />
                <span>{level}</span>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-[#433D8B] text-white rounded-md"
              onClick={commonFilter}
            >
              Apply Filter
            </button>
            <button
              className="px-4 py-2 border border-[#433D8B] text-[#433D8B] rounded-md"
              onClick={removeFilters}
            >
              Remove Filter
            </button>
          </div>
        </div>

        {/* Courses Section */}
        <div className="w-full md:w-4/5 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Courses</h2>

            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#433D8B] focus:border-transparent"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-[#433D8B] text-white rounded-md"
                onClick={commonFilter}
              >
                Search
              </button>
            </div>
          </div>

          {paginatedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCourses.map((course: any, index: any) => (
                <div
                  key={index}
                  className="bg-[#FFFFFF] border border-[#D6D1F0] rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleCourseClick(course._id)}
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.name}
                    className="w-full h-32 object-cover mb-4 rounded-t-md"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-[#000000]">{course.courseName}</h3>
                    <p className="text-gray-500 mb-1">Duration: {course.duration}</p>
                    <p className="text-gray-500 mb-1">Level: {course.level}</p>
                    <p className="text-gray-500 mb-1">Category: {course.category}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-700 font-semibold">₹{course.price}</p>
                      <p className="text-gray-700 font-semibold">65% off</p>
                    </div>
                    {/* <p className="text-gray-700 font-semibold">₹{course.price}</p>
                    <p className="text-gray-700 font-semibold">65% off</p> */}
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
          {paginatedCourses.length > 0 && (
            <div className="flex justify-center items-center mt-6">
              {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 mx-1 rounded-md ${currentPage === page
                      ? 'bg-[#433D8B] text-white'
                      : 'border border-gray-300 text-gray-700'
                    }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer><MentorFooter /></footer>
    </div>
  );
};

export default CoursesPage;
