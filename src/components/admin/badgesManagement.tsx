'use client';

import { adminApis } from "@/app/api/adminApis";
import { useEffect, useState } from "react";
import MentorFooter from "../mentors/footer";
import Link from "next/link";
import ReusableTable from "../re-usable/table";
import Image from "next/image";
import { FaLock, FaUnlock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AdminHeader from "./header";
import Pagination from "../re-usable/pagination";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { ToastContainer, toast, Slide, Flip, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BadgeData {
  _id?: string;
  badgeName: string;
  description: string;
  value: string;
  isListed: boolean;
}

const BadgeManagement = () => {
  const headers = ['Badge Name', "Description", "Value"];
  const [badge, setBadge] = useState<BadgeData[]>([]);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (page: number) => {
    try {
      const filters = { page, limit: 3 };
      const response = await adminApis.getAllBadge(filters);
      if (response) {
        const data = response.data?.result?.badges;
        console.log(data)
        setBadge(data);
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

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleListUnlist = async (categoryId: string, isListed: boolean) => {
    try {
      let result;
      if (isListed) {
        result = await Swal.fire({
          title: "Are you sure?",
          text: "You want to unlist this category.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, unlist it!",
        });

        if (result.isConfirmed) {
          const response = await adminApis.unListCategory(categoryId);
          if (response) {
            console.log('Category unlisted: ', response);
            fetchData(currentPage)
            Swal.fire(
              "UnListed!",
              `The category has been "unlisted".`,
              "success"
            );
          }
        }
      } else {
        result = await Swal.fire({
          title: "Are you sure?",
          text: "You want to list this category.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, list it!",
        });

        if (result.isConfirmed) {
          const response = await adminApis.listCategory(categoryId);
          if (response) {
            console.log('Category listed: ', response);
            fetchData(currentPage);
            Swal.fire(
              "Listed!",
              `The category has been "listed".`,
              "success"
            );
          }
        }
      }
    } catch (error) {
      console.error("Error updating category status:", error);
    }
  };

  const editCategory = async (badgeId: string) => {
    try {
      const BadgeToEdit = badge.find((b) => b._id === badgeId);
      if (BadgeToEdit) {
        localStorage.setItem('badgeData', JSON.stringify(BadgeToEdit));
      } else {
        console.log('Badge not found');
      }
      router.push(`/pages/edit-badge?badgeId=${badgeId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AdminHeader />

        <h1 className="text-center text-2xl font-semi-bold text-[#666666] mt-5">Badge Management</h1>

        {/* Content Section */}
        <main className="flex-grow px-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/pages/add-badges">
              <button className="bg-[#433D8B] text-white px-6 py-2 rounded-lg hover:opacity-90">
                Add Badge
              </button>
            </Link>
          </div>

          {badge.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
              <Image
                src="/images/undraw_no-data_ig65.svg"
                alt="No Courses"
                width={128}
                height={128}
                className="mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">No Courses Uploaded Yet</h2>
              <p className="text-gray-600 mt-2">
                It looks like you haven't added any courses. Start by clicking the button above!
              </p>
            </div>
          ) : (
            <ReusableTable
              headers={headers}
              data={badge.map((cat) => ({
                _id: cat._id,
                "Badge Name": cat.badgeName,
                "Description": cat.description,
                "Value": `₹ ${cat.value}.00`,
                isListed: cat.isListed,
              }))}
              handlers={(row) => [
                // {
                //   handler: () => handleListUnlist(row._id, row.isListed),
                //   name: row.isListed ? "Unlist" : "List",
                //   icon: row.isListed ? <FaLock /> : <FaUnlock />,
                // },
                {
                  handler: () => editCategory(row._id),
                  name: "Edit",
                },
              ]}
              buttonStyles="bg-[#22177A] text-white text-sm font-medium rounded hover:opacity-90"
              tableWidth="max-w-[800px]"
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
  );
};

export default BadgeManagement;
