'use client'
import React, { useEffect, useState } from "react";
import AdminHeader from "./header";
import AdminFooter from "./footer";
import { adminApis } from "@/app/api/adminApis";
import Swal from "sweetalert2";
import { FaLock, FaUnlock } from "react-icons/fa";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "../re-usable/pagination";
import Image from "next/image";
import ReusableTable from "../re-usable/table";
import Link from "next/link";

interface User {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
}

const UserManagement = () => {
  const headers = ['Name', 'Email'];
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUsers = async (page: number) => {
      try {
        const filters = { page, limit: 4 };
        const response = await adminApis.getUsers(filters);
        if (response) {
          const data = response.data?.result?.courses;
          setUsers(data);
          setCurrentPage(response?.data?.result.currentPage);
          setTotalPages(response?.data?.result.totalPages);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers(currentPage);
  }, [currentPage]);

  const blockUser  = async (id: string) => {
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
          ? await adminApis.blockUser (id)
          : await adminApis.unBlockUser (id);

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
        if (error && error.response?.status === 401) {
          toast.warn(error.response?.data.message);
          return;
        }
      }
    }
  };

  return (
    <>
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
        <main className="flex-grow px-8 py-4">

          {users.length === 0 ? (
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
              data={users.map(user => ({
                "_id": user._id,
                "Name": user.username,
                "Email": user.email,
                "isBlocked": user.isBlocked // Include isBlocked in the data
              }))}
              handlers={(row) => [
                {
                  handler: () => blockUser (row._id),
                  name: row.isBlocked ? 'Unblock' : 'Block', // Dynamically update name
                  icon: row.isBlocked ? <FaUnlock /> : <FaLock />
                }
              ]}
              buttonStyles="bg-[#433D8B] text-white text-sm font-medium rounded hover:opacity-90"
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
        {/* Footer */}
        <AdminFooter />
      </div>
    </>
  );
};

export default UserManagement;

