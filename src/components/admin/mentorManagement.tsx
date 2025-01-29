// 'use client'

// import React, { useEffect, useState } from "react";
// import AdminHeader from "./header";
// import AdminFooter from "./footer";
// import { adminApis } from "@/api/adminApis";
// import Swal from "sweetalert2";
// import { FaLock, FaUnlock } from "react-icons/fa";
// import { ToastContainer, toast, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface Mentor {
//     _id: string;
//     username: string;
//     email: string;
//     isBlocked: boolean;
// }

// const MentorManagement: React.FC = () => {
//     const [mentors, setMentors] = useState<Mentor[]>([]);
//     const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
//     const [searchTerm, setSearchTerm] = useState<string>("");
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const mentorsPerPage = 2;

//     useEffect(() => {
//         const fetchMentors = async () => {
//             try {
//                 const response = await adminApis.getMentors();
//                 if (response) {
//                     const data = response.data?.mentors;
//                     setMentors(data);
//                     setFilteredMentors(data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching mentors:", error);
//             }
//         };
//         fetchMentors();
//     }, []);


//     useEffect(() => {
//         const filtered = mentors.filter(
//             (mentor) =>
//                 mentor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setFilteredMentors(filtered);
//         setCurrentPage(1); 
//     }, [searchTerm, mentors]);

//     const blockUser = async (id: string) => {
//         const mentor = mentors.find((d) => d._id === id);
//         if (!mentor) return;

//         const updatedStatus = !mentor.isBlocked;

//         const result = await Swal.fire({
//             title: "Are you sure?",
//             text: `You want to ${updatedStatus ? "block" : "unblock"} this user.`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             cancelButtonColor: "#3085d6",
//             confirmButtonText: updatedStatus ? "Yes, block it!" : "Yes, unblock it!",
//         });

//         if (result.isConfirmed) {
//             try {
//                 const response = updatedStatus
//                     ? await adminApis.blockMentor(id)
//                     : await adminApis.unBlockMentor(id);

//                 if (response) {
//                     setMentors((prevMentors) =>
//                         prevMentors.map((mentor) =>
//                             mentor._id === id
//                                 ? { ...mentor, isBlocked: updatedStatus }
//                                 : mentor
//                         )
//                     );
//                     Swal.fire(
//                         updatedStatus ? "Blocked!" : "Unblocked!",
//                         `The user has been ${updatedStatus ? "blocked" : "unblocked"}.`,
//                         "success"
//                     );
//                 }
//             } catch (error: any) {
//                 if (error && error.response?.status === 401) {
//                     toast.warn(error.response?.data.message);
//                     return;
//                 }
//             }
//         }
//     };


//     const indexOfLastMentor = currentPage * mentorsPerPage;
//     const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
//     const currentMentors = filteredMentors.slice(indexOfFirstMentor, indexOfLastMentor);

//     const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//     return (
//         <div className="min-h-screen flex flex-col">
//             <AdminHeader />

//             <ToastContainer
//                 autoClose={2000}
//                 pauseOnHover={false}
//                 transition={Slide}
//                 hideProgressBar={false}
//                 closeOnClick={false}
//                 pauseOnFocusLoss={true}
//             />

//             <main className="flex-grow flex items-center justify-center py-8 px-4">
//                 <div className="w-full max-w-4xl overflow-x-auto shadow-md rounded-lg px-6">
//                     {/* Search Bar */}
//                     <div className="mb-4">
//                         <input
//                             type="text"
//                             placeholder="Search by username or email"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full p-2 border rounded"
//                         />
//                     </div>

//                     {/* Table */}
//                     <table className="w-full border-collapse">
//                         <thead className="bg-[#D6D1F0] text-black">
//                             <tr>
//                                 <th className="py-2 px-6 text-left">Username</th>
//                                 <th className="py-2 px-6 text-left">Email</th>
//                                 <th className="py-2 px-6 text-left">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {currentMentors.map((mentor, index) => (
//                                 <tr
//                                     key={mentor._id}
//                                     className={`${index % 2 === 0 ? "bg-[#F4F1FD]" : "bg-[#E9E6F6]"} text-black`}
//                                 >
//                                     <td className="py-2 px-6">{mentor.username}</td>
//                                     <td className="py-2 px-6">{mentor.email}</td>
//                                     <td className="py-2 px-6">
//                                         <button
//                                             className={`${mentor.isBlocked ? "bg-gray-500" : "bg-green-500"} text-white px-4 py-2 rounded`}
//                                             onClick={() => blockUser(mentor._id)}
//                                         >
//                                             {mentor.isBlocked ? (
//                                                 <>
//                                                     <FaUnlock className="inline mr-2" /> Unblock
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <FaLock className="inline mr-2" /> Block
//                                                 </>
//                                             )}
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {/* Pagination */}
//                     <div className="flex justify-between items-center mt-4">
//                         <button
//                             className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//                             disabled={currentPage === 1}
//                             onClick={() => paginate(currentPage - 1)}
//                         >
//                             Previous
//                         </button>
//                         <span>
//                             Page {currentPage} of {Math.ceil(filteredMentors.length / mentorsPerPage)}
//                         </span>
//                         <button
//                             className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//                             disabled={currentPage * mentorsPerPage >= filteredMentors.length}
//                             onClick={() => paginate(currentPage + 1)}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             </main>

//             <AdminFooter />
//         </div>
//     );
// };

// export default MentorManagement;







"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "./header";
import AdminFooter from "./footer";
import { adminApis } from "@/app/api/adminApis";
import Swal from "sweetalert2";
import { FaLock, FaUnlock } from "react-icons/fa";
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "../re-usable/pagination";
import Image from "next/image";
import ReusableTable from "../re-usable/table";
import Cookies from "js-cookie";

interface Mentor {
  _id: string; // Ensure this matches the type returned by your API
  username: string;
  email: string;
  isBlocked: boolean;
}

const MentorManagement: React.FC = () => {
  const headers = ['Name', 'Email'];
  const [mentors, setMentors] = useState<Mentor[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMentors = async (page: number) => {
      try {
        const filters = { page, limit: 4 }
        const response = await adminApis.getMentors(filters);
        if (response) {
          console.log(response)
          const data = response.data?.result?.courses;
          setMentors(data);
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
      }
    };
    fetchMentors(currentPage);
  }, [currentPage]);



  const blockUser = async (id: string) => {
    const mentor = mentors.find((d) => d._id === id);
    if (!mentor) return;

    const updatedStatus = !mentor.isBlocked;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to ${updatedStatus ? "block" : "unblock"} this user.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: updatedStatus ? "Yes, block it!" : "Yes, unblock it!",
    });

    if (result.isConfirmed) {
      try {
        const response = updatedStatus
          ? await adminApis.blockMentor(id)
          : await adminApis.unBlockMentor(id);

        if (response) {
          setMentors((prevMentors) =>
            prevMentors.map((mentor) =>
              mentor._id === id
                ? { ...mentor, isBlocked: updatedStatus }
                : mentor
            )
          );
          Swal.fire(
            updatedStatus ? "Blocked!" : "Unblocked!",
            `The user has been ${updatedStatus ? "blocked" : "unblocked"}.`,
            "success"
          );
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
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <AdminHeader />
        <h1 className="text-center text-2xl font-semi-bold text-[#666666] mt-5">Mentor Management</h1>
        <ToastContainer
          autoClose={2000}
          pauseOnHover={false}
          transition={Slide}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnFocusLoss={true}
        />

        {/* Main Content */}
        <main className="flex-grow px-8 py-3">

          {mentors.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
              <Image
                src="/images/undraw_no-data_ig65.svg" // Path to your illustration
                alt="No Users"
                width={128}
                height={128}
                className="mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">No Users Found</h2>
              <p className="text-gray-600 mt-2">It looks like No any users Created Account.</p>
            </div>
          ) : (
            <ReusableTable
              headers={headers}
              data={mentors.map(mentor => ({
                "_id": mentor._id,
                "Name": mentor.username,
                "Email": mentor.email,
                "isBlocked": mentor.isBlocked // Include isBlocked in the data
              }))}
              handlers={(row) => [
                {
                  handler: () => blockUser (row._id),
                  name: row.isBlocked ? 'Unblock' : 'Block', // Dynamically update name
                  icon: row.isBlocked ? <FaUnlock /> : <FaLock />
                }
              ]}
              buttonStyles="bg-[#22177A] text-white text-sm font-medium rounded hover:opacity-90"
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
        <AdminFooter />
      </div>
    </>
  );
};

export default MentorManagement;