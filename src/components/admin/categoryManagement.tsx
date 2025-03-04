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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ADMIN_SERVICE_URL } from "@/utils/constant";
import axios from "axios";

interface CategoryData {
  _id?: string;
  categoryName: string;
  isListed: boolean;
}

const CategoryManagement = () => {
  const headers = ['Category Name'];
  const [category, setCategory] = useState<CategoryData[]>([]);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (page: number) => {
    try {
      const filters = { page, limit: 3 };
      const response = await adminApis.getAllCategory(filters);
      if (response) {
        const data = response.data?.result?.courses;
        setCategory(data);
        setCurrentPage(response?.data?.result.currentPage);
        setTotalPages(response?.data?.result.totalPages);
      }
    } catch (error: any) {
      if (error && error.response?.status === 401) {
        toast.warn(error.response.data.message);
        await axios.post(`${ADMIN_SERVICE_URL}/admin/logout`, {},{ withCredentials: true });
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
    } catch (error: any) {
      console.error("Error updating category status:", error);
      if (error && error.response?.status === 401) {
        toast.warn(error.response.data.message);
        await axios.post(`${ADMIN_SERVICE_URL}/admin/logout`, {},{ withCredentials: true });
        localStorage.clear();
        setTimeout(() => {
          window.location.replace('/pages/login');
        }, 3000);
        return;
      }
    }
  };

  const editCategory = async (categoryId: string) => {
    try {
      const categoryToEdit = category.find((cat) => cat._id === categoryId);
      if (categoryToEdit) {
        localStorage.setItem('categoryName', categoryToEdit.categoryName);
      } else {
        console.log('Category not found');
      }
      router.push(`/pages/edit-category?categoryId=${categoryId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AdminHeader />

        <h1 className="text-center text-2xl font-semi-bold text-[#666666] mt-5">Category Management</h1>

        {/* Content Section */}
        <main className="flex-grow px-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/pages/add-category">
              <button className="bg-[#433D8B] text-white px-6 py-2 rounded-lg hover:opacity-90">
                Add Category
              </button>
            </Link>
          </div>

          {category.length === 0 ? (
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
                It looks like you haven&apos;t added any courses. Start by clicking the button above
              </p>
            </div>
          ) : (
            <ReusableTable
              headers={headers}
              data={category.map((cat) => ({
                _id: cat._id,
                "Category Name": cat.categoryName,
                isListed: cat.isListed,
              }))}
              handlers={(row) => [
                {
                  handler: () => handleListUnlist(row._id, row.isListed),
                  name: row.isListed ? "Unlist" : "List",
                  icon: row.isListed ? <FaLock /> : <FaUnlock />,
                },
                {
                  handler: () => editCategory(row._id),
                  name: "Edit",
                },
              ]}
              buttonStyles="bg-[#22177A] text-white text-sm font-medium rounded hover:opacity-90"
              tableWidth="max-w-[600px]"
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

export default CategoryManagement;
