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

interface Mentor {
    _id: string; // Ensure this matches the type returned by your API
    username: string;
    email: string;
    isBlocked: boolean;
}

const MentorManagement: React.FC = () => {
    const [mentors, setMentors] = useState<Mentor[]>([]);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await adminApis.getMentors();
                if (response) {
                    const data = response.data?.mentors;
                    console.log("mentors:", data);
                    setMentors(data); // Set the entire array at once
                }
            } catch (error) {
                console.error("Error fetching mentors:", error);
            }
        };
        fetchMentors();
    }, []);

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
                    toast.warn(error.response?.data.message)
                    return
                }
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
        <AdminHeader />
      
        <ToastContainer
          autoClose={2000}
          pauseOnHover={false}
          transition={Slide}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnFocusLoss={true}
        />
      
        <main className="flex-grow flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-4xl overflow-x-auto shadow-md rounded-lg">
            <table className="w-full border-collapse table-fixed">
              {/* Table Head */}
              <thead className="bg-[#433D8B] text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Username</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
      
              {/* Table Body */}
              <tbody>
                {mentors.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-100"
                    } text-black`}
                  >
                    <td className="py-2 px-4 truncate">{user.username}</td>
                    <td className="py-2 px-4 truncate">{user.email}</td>
                    <td className="py-2 px-4">
                      <button
                        className={`${
                          user.isBlocked ? "bg-gray-500" : "bg-green-500"
                        } text-white px-3 py-1 rounded`}
                        onClick={() => blockUser(user._id)}
                      >
                        {user.isBlocked ? (
                          <>
                            <FaUnlock className="inline mr-2" /> Unblock
                          </>
                        ) : (
                          <>
                            <FaLock className="inline mr-2" /> Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      
        <AdminFooter />
      </div>
      
    );
};

export default MentorManagement;