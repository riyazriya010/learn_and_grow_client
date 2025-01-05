'use client'

import { adminApis } from "@/app/api/adminApis";
import { useEffect, useState } from "react";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import Link from "next/link";
import ReusableTable from "../re-usable/table";
import Image from "next/image";
import { FaLock, FaUnlock } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface CategoryData {
    _id?: string;
    categoryName: string;
    isListed: boolean;
}

const CategoryManagement = () => {
      const headers = ['Category Name'];
      const [category, setCategory] = useState<CategoryData[]>([]);
      const router = useRouter()

      useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await adminApis.getAllCategory()
                if(response && response?.data?.data){
                    console.log('res cat: ', response)
                    setCategory(response?.data?.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData()
      },[])

      const handleListUnlist = (categoryId: string, isListed: boolean) => {
        try{
            if (isListed) {
                console.log(`Category ${categoryId} has been unlisted.`);
              } else {
                console.log(`Category ${categoryId} has been listed.`);
              }

              // here my logic
        }catch(error){
            console.error("Error updating category status:", error);
        }
      }

      const editCategory = async (categoryId: string) => {
        try {
            console.log(`Category ${categoryId} has been Edited.`);
            const categoryToEdit = category.map((cat) => {
              if(cat._id == categoryId){
                return cat.categoryName
              }
            })
            localStorage.setItem('categoryName', String(categoryToEdit[0]))
            router.push(`/pages/edit-category?categoryId=${categoryId}`)
        } catch (error) {
            console.log(error)
        }
      }

    return(
        <>
        <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Content Section */}
      <main className="flex-grow px-8 py-4">
        <div className="flex justify-between items-center mb-4">
          {/* Add Course Button */}
          <Link href="/pages/add-category">
            <button className="bg-[#433D8B] text-white px-6 py-2 rounded-lg hover:opacity-90">
              Add Category
            </button>
          </Link>
        </div>

        {category.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
            <Image
              src="/images/undraw_no-data_ig65.svg" // Path to your illustration
              alt="No Courses"
              width={128}
              height={128}
              className="mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800">No Courses Uploaded Yet</h2>
            <p className="text-gray-600 mt-2">It looks like you haven't added any courses. Start by clicking the button above!</p>
          </div>
        ) : (
          <ReusableTable
            headers={headers}
            data={category.map(cat => ({
                "_id": cat._id,
              "Category Name": cat.categoryName,
              "isListed": cat.isListed
            }))}
            handlers={(row) => [
              {
                handler: () => handleListUnlist(row._id, row.isListed),
                name: row.isListed ? 'Unlist' : 'List',
                icon: row.isListed ? <FaLock /> : <FaUnlock />
              },
              {
                handler: () => editCategory(row._id),
                name: "Edit"
              },
            ]}
            buttonStyles="bg-[#433D8B] text-white text-sm font-medium rounded hover:opacity-90"
            tableWidth="max-w-[450px]"
          />
        )}
      </main>

      <MentorFooter />
    </div>
        </>
    )
}

export default CategoryManagement
