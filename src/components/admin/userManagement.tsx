// "use client";

// import React, { useEffect, useState } from "react";
// import AdminHeader from "./header";
// import AdminFooter from "./footer";
// import { adminApis } from "@/api/adminApis";
// import Swal from "sweetalert2";
// import { FaLock, FaUnlock } from "react-icons/fa";
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   isBlocked: boolean;
// }

// const UserManagement = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 2;

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await adminApis.getUsers();
//         if (response) {
//           const data = response.data?.users;
//           setUsers(data);
//           setFilteredUsers(data);
//         }
//       } catch (error) {
//         console.error("Error fetching mentors:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     const lowerCaseQuery = query.toLowerCase();
//     const filtered = users.filter((user) =>
//       user.username.toLowerCase().includes(lowerCaseQuery)
//     );
//     setFilteredUsers(filtered);
//     setCurrentPage(1);
//   };

//   const blockUser = async (id: string) => {
//     const user = users.find((d) => d._id === id);
//     if (!user) return;

//     const updatedStatus = !user.isBlocked;

//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: `You want to ${updatedStatus ? "block" : "unblock"} this user.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: updatedStatus ? "Yes, block it!" : "Yes, unblock it!",
//     });

//     if (result.isConfirmed) {
//       try {
//         const response = updatedStatus
//           ? await adminApis.blockUser(id)
//           : await adminApis.unBlockUser(id);

//         if (response) {
//           setUsers((prevUsers) =>
//             prevUsers.map((user) =>
//               user._id === id ? { ...user, isBlocked: updatedStatus } : user
//             )
//           );
//           setFilteredUsers((prevUsers) =>
//             prevUsers.map((user) =>
//               user._id === id ? { ...user, isBlocked: updatedStatus } : user
//             )
//           );
//           Swal.fire(
//             updatedStatus ? "Blocked!" : "Unblocked!",
//             `The user has been ${updatedStatus ? "blocked" : "unblocked"}.`,
//             "success"
//           );
//         }
//       } catch (error: any) {
//         if (error && error.response?.status === 401) {
//           toast.warn(error.response?.data.message);
//           return;
//         }
//       }
//     }
//   };


//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header */}
//       <AdminHeader />

//       <ToastContainer
//         autoClose={2000}
//         pauseOnHover={false}
//         transition={Slide}
//         hideProgressBar={false}
//         closeOnClick={false}
//         pauseOnFocusLoss={true}
//       />

//       {/* Main Content */}
//       <main className="flex-grow flex items-center justify-center py-8 px-4">
//         <div className="w-full max-w-4xl overflow-x-auto shadow-md rounded-lg px-6">
//           {/* Search Input */}
//           <div className="mb-4">
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg"
//               placeholder="Search users by username..."
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//           </div>

//           {/* Table */}
//           <table className="w-full border-collapse">
//             {/* Table Head */}
//             <thead className="bg-[#D6D1F0] text-black">
//               <tr>
//                 <th className="py-2 px-6 text-left">Username</th>
//                 <th className="py-2 px-6 text-left">Email</th>
//                 <th className="py-2 px-6 text-left">Action</th>
//               </tr>
//             </thead>

//             {/* Table Body */}
//             <tbody>
//               {paginatedUsers.map((user, index) => (
//                 <tr
//                   key={user._id}
//                   className={`${index % 2 === 0 ? "bg-[#F4F1FD]" : "bg-[#E9E6F6]"
//                     } text-black`}
//                 >
//                   <td className="py-2 px-6">{user.username}</td>
//                   <td className="py-2 px-6">{user.email}</td>
//                   <td className="py-2 px-6">
//                     <button
//                       className={`${user.isBlocked ? "bg-gray-500" : "bg-green-500"
//                         } text-white px-4 py-2 rounded`}
//                       onClick={() => blockUser(user._id)}
//                     >
//                       {user.isBlocked ? (
//                         <>
//                           <FaUnlock className="inline mr-2" /> Unblock
//                         </>
//                       ) : (
//                         <>
//                           <FaLock className="inline mr-2" /> Block
//                         </>
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           <div className="flex justify-between items-center mt-4">
//             <button
//               className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//             >
//               Previous
//             </button>
//             <span>
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <AdminFooter />
//     </div>
//   );
// };

// export default UserManagement;







"use client"

import React, { useEffect, useState } from "react";
import AdminHeader from "./header";
import AdminFooter from "./footer";
import { adminApis } from "@/api/adminApis";
import Swal from "sweetalert2";
import { FaLock, FaUnlock } from "react-icons/fa";
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
}


const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminApis.getUsers();
        if (response) {
          const data = response.data?.users;
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    }
    fetchUsers()
  }, [])

  const blockUser = async (id: string) => {
    const user = users.find((d) => d._id === id);
    if (!user) return;

    const updatedStatus = !user.isBlocked;

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
          ? await adminApis.blockUser(id)
          : await adminApis.unBlockUser(id);

        if (response) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === id
                ? { ...user, isBlocked: updatedStatus }
                : user
            )
          );
          Swal.fire(
            updatedStatus ? "Blocked!" : "Unblocked!",
            `The user has been ${updatedStatus ? "blocked" : "unblocked"}.`,
            "success"
          );
        }
      } catch (error: any) {
        if(error && error.response?.status === 401){
          toast.warn(error.response?.data.message)
          return
      }
      }
    }
  }


  return (
    <div className="min-h-screen flex flex-col">
    {/* Header */}
    <AdminHeader />
  
    <ToastContainer
      autoClose={2000}
      pauseOnHover={false}
      transition={Slide}
      hideProgressBar={false}
      closeOnClick={false}
      pauseOnFocusLoss={true}
    />
  
    {/* Main Content */}
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
            {users.map((user, index) => (
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
  
    {/* Footer */}
    <AdminFooter />
  </div>
  
  );
};

export default UserManagement;



