'use client'

import { studentApis } from "@/app/api/studentApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import LoadingModal from "../re-usable/loadingModal";
import MentorFooter from "../mentors/footer";
import Navbar from "../navbar";
import Image from "next/image";
import ReusableTable from "../re-usable/table";

interface CertificateData {
    _id?: string;
    userId: string;
    courseId: string;
    courseName: string;
    issuedDate: Date;
}

const Certificates = () => {
    const headers = ['Course Name', 'Issued Date']
    const [certificate, setCertificate] = useState<CertificateData[] | []>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter()

    useEffect(() => {
        setIsLoading(false)
        const fetchData = async () => {
            try {
                const response = await studentApis.getCertificates()
                if (response) {
                    console.log('res certificate: ', response)
                    setCertificate(response?.data?.data)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const viewCertificate = (id: string) => {
        // console.log('Idd: ', id)
        router.push(`/pages/student/certificate-view?certificateId=${id}`)
    }

    if (isLoading) return <LoadingModal isOpen={isLoading} message="Please wait..." />

    return (
        <>
        <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* Content Section */}
      <main className="flex-grow px-8 py-4">

        {certificate.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-96 bg-gray-100 rounded-lg shadow-lg p-6">
            <Image
              src="/images/undraw_no-data_ig65.svg" // Path to your illustration
              alt="No Courses"
              width={128}
              height={128}
              className="mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800">No Certificates Buyed Yet</h2>
            <p className="text-gray-600 mt-2">It looks like you haven't completed any courses.</p>
          </div>
        ) : (
          <ReusableTable
            headers={headers}
            data={certificate.map((c) => ({
                "_id": c._id,
              "Course Name": c.courseName,
              'Issued Date': new Date(c?.issuedDate).toLocaleDateString()
            }))}
            handlers={(row) => [
                
              {
                handler: () => viewCertificate(row._id),
                name: "View"
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

export default Certificates
