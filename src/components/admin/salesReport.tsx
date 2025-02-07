// 'use client'
// import { useEffect, useState } from "react"
// import Navbar from "../navbar"
// import MentorFooter from "./footer"
// import axios from "axios"
// import jsPDF from "jspdf"
// import "jspdf-autotable" // Import the autoTable plugin
// import { utils, writeFile } from "xlsx"
// import AdminFooter from "./footer"
// import AdminHeader from "./header"

// interface DateRange {
//     startDate: string
//     endDate: string
// }

// interface ReportItem {
//     coursename: string;
//     username: string;
//     categoryName: string;
//     price: number;
//     purchasedAt: string;
//     transactionId: string;
// }

// const AdminSalesReport = () => {
//     const currentYear = new Date().getFullYear();
//     const [selectedDate, setSelectedDate] = useState<DateRange>({ startDate: '', endDate: '' })
//     const [selectedYear, setSelectedYear] = useState<number | ''>(currentYear)
//     const [selectedMonth, setSelectedMonth] = useState<string | ''>('')

//     const [reportData, setReportData] = useState<ReportItem[]>([])
//     const [salesCount, setSalescount] = useState<number | 0>(0)

//     const yearList = Array.from({ length: 10 }, (_, index) => currentYear - index);
//     const monthList = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];

//     const fetchReport = async () => {
//         try {
//             const filters: any = {};
//             if (selectedYear && selectedMonth) {
//                 filters.year = selectedYear;
//                 filters.month = selectedMonth;
//             } else if (selectedYear) {
//                 filters.year = selectedYear;
//             } else if (selectedDate) {
//                 filters.date = selectedDate;
//             }

//             const queryString = `filter=${encodeURIComponent(JSON.stringify(filters))}`;
//             const response = await axios.get(`http://localhost:8001/get/admin/report?${queryString}`);
//             console.log('report response ', response)
//             if(response){
//                 setReportData(response?.data?.result?.report);
//                 setSalescount(response?.data?.result?.salesCount)
//             }
//         } catch (error: any) {
//             console.log(error);
//             setReportData([]); // Reset to an empty array on error
//         }
//     }

//     useEffect(() => {
//         fetchReport();
//     }, []);

//     const handleStartDateChange = (date: string | "") => {
//         setSelectedDate(prev => ({ ...prev, startDate: date }));
//         if (date) {
//             setSelectedMonth('');
//             setSelectedYear('');
//         }
//     };

//     const handleEndDateChange = (date: string | "") => {
//         setSelectedDate(prev => ({ ...prev, endDate: date }));
//         if (date) {
//             setSelectedMonth('');
//             setSelectedYear('');
//         }
//     };

//     const handleMonthChange = (month: string) => {
//         setSelectedMonth(month);
//         if (month) {
//             setSelectedDate({ startDate: '', endDate: '' });
//         }
//     };

//     const exportToPDF = () => {
//         const doc = new jsPDF();
        
//         // Adding title with proper margin
//         doc.text("Learn & Grow - Sales Report", 14, 20);
    
//         // Adding some margin before the table
//         doc.autoTable({
//             startY: 30, // Adjusted start position to ensure the title is visible
//             head: [['Course Name', 'Buyer Name', 'categroy Name', 'Purchased At', 'Price', 'Transaction ID']],
//             body: reportData.map(item => [
//                 item.coursename, 
//                 item.username, 
//                 item.categoryName,
//                 new Date(item.purchasedAt).toLocaleString(), 
//                 item.price, 
//                 item.transactionId
//             ]),
//             margin: { top: 20 } // Adds spacing above the table
//         });
    
//         doc.save("sales_report.pdf");
//     };
    

//     const exportToExcel = () => {
//         const worksheet = utils.json_to_sheet(reportData);
    
//         // Adjust column widths for better visibility
//         const columnWidths = [
//             { wch: 25 }, // Course Name
//             { wch: 25 }, // Buyer Name
//             { wch: 25 }, // Category Name
//             { wch: 25 }, // Purchased At
//             { wch: 25 }, // Price
//             { wch: 25 }, // Transaction ID
//         ];
    
//         worksheet['!cols'] = columnWidths; // Apply column width settings
    
//         const workbook = utils.book_new();
//         utils.book_append_sheet(workbook, worksheet, "Sales Report");
        
//         writeFile(workbook, "sales_report.xlsx");
//     };
    

//     return (
//         <>
//             <div className="flex flex-col min-h-screen">
//                 <AdminHeader />
//                 <div className="flex flex-wrap mt-3 justify-between p-6 bg-gray-100 shadow-md rounded-lg max-w-4xl mx-auto mb-8">
//                     {/* Filters */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-4">
//                         <div className="flex flex-col">
//                             <label htmlFor="year" className="text-sm font-semibold text-gray-700 mb-2">Select Year:</label>
//                             <select
//                                 id="year"
//                                 className="border border-gray-300 p-3 rounded-md shadow-sm"
//                                 value={selectedYear}
//                                 onChange={(e) => setSelectedYear(Number(e.target.value))}
//                             >
//                                 {yearList.map((year) => (
//                                     <option key={year} value={year}>
//                                         {year}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="flex flex-col">
//                             <label htmlFor="month" className="text-sm font-semibold text-gray-700 mb-2">Select Month:</label>
//                             <select
//                                 id="month"
//                                 className="border border-gray-300 p-3 rounded-md shadow-sm"
//                                 value={selectedMonth}
//                                 onChange={(e) => handleMonthChange(e.target.value)}
//                             >
//                                 <option value="">Select Month</option>
//                                 {monthList.map((month, index) => (
//                                     <option key={index} value={month}>
//                                         {month}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="flex flex-col">
//                             <label htmlFor="start-date" className="text-sm font-semibold text-gray-700 mb-2">Select Start Date:</label>
//                             <input
//                                 type="date"
//                                 value={selectedDate.startDate || ""}
//                                 onChange={(e) => handleStartDateChange(e.target.value)}
//                                 className="border border-gray-300 p-3 rounded-md shadow-sm"
//                             />
//                         </div>

//                         <div className="flex flex-col">
//                             <label htmlFor="end-date" className="text-sm font-semibold text-gray-700 mb-2">Select End Date:</label>
//                             <input
//                                 type="date"
//                                 value={selectedDate.endDate || ""}
//                                 onChange={(e) => handleEndDateChange(e.target.value)}
//                                 className="border border-gray-300 p-3 rounded-md shadow-sm"
//                             />
//                         </div>
//                     </div>

//                     <div className="flex items-center mt-6 sm:mt-0">
//                         <button
//                             className="bg-[#433D8B] text-white px-5 py-3 rounded-full hover:bg-[#352e77] transition duration-300"
//                             onClick={fetchReport}
//                         >
//                             Filter
//                         </button>
//                     </div>
//                 </div>

//                 {/* Export Buttons */}
//                 <div className="flex justify-between p-4 mx-auto max-w-4xl gap-4 mb-8">
//                     <button
//                         className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90"
//                         onClick={exportToPDF}
//                     >
//                         Export to PDF
//                     </button>
//                     <button
//                         className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90"
//                         onClick={exportToExcel}
//                     >
//                         Export to Excel
//                     </button>
//                 </div>

//                 {/* Sales Report Table */}
//                 <div className="overflow-x-auto p-4">
//                     <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
//                         <thead className="bg-[#433D8B] text-white">
//                             <tr>
//                                 <th className="p-4 text-center">Course Name</th>
//                                 <th className="p-4 text-center">Buyer Name</th>
//                                 <th className="p-4 text-center">Category Name</th>
//                                 <th className="p-4 text-center">Purchased At</th>
//                                 <th className="p-4 text-center">Price</th>
//                                 <th className="p-4 text-center">Transaction ID</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {Array.isArray(reportData) && reportData.length > 0 ? (
//                                 reportData.map((item, index) => (
//                                     <tr key={index} className="hover:bg-gray-50">
//                                         <td className="border-t p-4 text-center">{item.coursename}</td>
//                                         <td className="border-t p-4 text-center">{item.username}</td>
//                                         <td className="border-t p-4 text-center">{item.categoryName}</td>
//                                         <td className="border-t p-4 text-center">{new Date(item.purchasedAt).toLocaleDateString('en-GB')}</td>
//                                         <td className="border-t p-4 text-center">{item.price}</td>
//                                         <td className="border-t p-4 text-center">{item.transactionId}</td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={5} className="p-4 text-center text-gray-500">No data available</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Sales Count */}
//                 <div className="text-center mb-3 p-6 shadow-md rounded-lg mx-auto w-full max-w-4xl">
//                     <h3 className="text-xl font-semibold">Total Sales: <span className="text-green-600">{salesCount}</span></h3>
//                 </div>

//                 <AdminFooter />
//             </div>
//         </>
//     )
// }

// export default AdminSalesReport;




'use client'
import { useEffect, useState } from "react"
import Navbar from "../navbar"
import MentorFooter from "./footer"
import axios from "axios"
import jsPDF from "jspdf"
import "jspdf-autotable" // Import the autoTable plugin
import { utils, writeFile } from "xlsx"
import AdminFooter from "./footer"
import AdminHeader from "./header"
import { ADMIN_SERVICE_URL } from "@/utils/constant"

interface DateRange {
    startDate: string
    endDate: string
}

interface ReportItem {
    coursename: string;
    username: string;
    categoryName: string;
    price: number;
    purchasedAt: string;
    transactionId: string;
}

const AdminSalesReport = () => {
    const currentYear = new Date().getFullYear();
    const [selectedDate, setSelectedDate] = useState<DateRange>({ startDate: '', endDate: '' })
    const [selectedYear, setSelectedYear] = useState<number | ''>(currentYear)
    const [selectedMonth, setSelectedMonth] = useState<string | ''>('')

    const [reportData, setReportData] = useState<ReportItem[]>([])
    const [salesCount, setSalescount] = useState<number | 0>(0)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Number of items per page

    const yearList = Array.from({ length: 10 }, (_, index) => currentYear - index);
    const monthList = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const fetchReport = async () => {
        try {
            const filters: any = {};
            if (selectedYear && selectedMonth) {
                filters.year = selectedYear;
                filters.month = selectedMonth;
            } else if (selectedYear) {
                filters.year = selectedYear;
            } else if (selectedDate) {
                filters.date = selectedDate;
            }

            const queryString = `filter=${encodeURIComponent(JSON.stringify(filters))}`;
            const response = await axios.get(`${ADMIN_SERVICE_URL}/get/admin/report?${queryString}`,{
                withCredentials: true
            });
            console.log('report response ', response)
            if(response){
                setReportData(response?.data?.result?.report);
                setSalescount(response?.data?.result?.salesCount)
            }
        } catch (error: any) {
            console.log(error);
            setReportData([]); // Reset to an empty array on error
        }
    }

    useEffect(() => {
        fetchReport();
    }, []);

    const handleStartDateChange = (date: string | "") => {
        setSelectedDate(prev => ({ ...prev, startDate: date }));
        if (date) {
            setSelectedMonth('');
            setSelectedYear('');
        }
    };

    const handleEndDateChange = (date: string | "") => {
        setSelectedDate(prev => ({ ...prev, endDate: date }));
        if (date) {
            setSelectedMonth('');
            setSelectedYear('');
        }
    };

    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
        if (month) {
            setSelectedDate({ startDate: '', endDate: '' });
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        
        // Adding title with proper margin
        doc.text("Learn & Grow - Sales Report", 14, 20);
    
        // Adding some margin before the table
        doc.autoTable({
            startY: 30, // Adjusted start position to ensure the title is visible
            head: [['Course Name', 'Buyer Name', 'categroy Name', 'Purchased At', 'Price', 'Transaction ID']],
            body: reportData.map(item => [
                item.coursename, 
                item.username, 
                item.categoryName,
                new Date(item.purchasedAt).toLocaleString(), 
                item.price, 
                item.transactionId
            ]),
            margin: { top: 20 } // Adds spacing above the table
        });
    
        doc.save("sales_report.pdf");
    };
    

    const exportToExcel = () => {
        const worksheet = utils.json_to_sheet(reportData);
    
        // Adjust column widths for better visibility
        const columnWidths = [
            { wch: 25 }, // Course Name
            { wch: 25 }, // Buyer Name
            { wch: 25 }, // Category Name
            { wch: 25 }, // Purchased At
            { wch: 25 }, // Price
            { wch: 25 }, // Transaction ID
        ];
    
        worksheet['!cols'] = columnWidths; // Apply column width settings
    
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Sales Report");
        
        writeFile(workbook, "sales_report.xlsx");
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(reportData.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <AdminHeader />
                <div className="flex flex-wrap mt-3 justify-between p-6 bg-gray-100 shadow-md rounded-lg max-w-4xl mx-auto mb-8">
                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-4">
                        <div className="flex flex-col">
                            <label htmlFor="year" className="text-sm font-semibold text-gray-700 mb-2">Select Year:</label>
                            <select
                                id="year"
                                className="border border-gray-300 p-3 rounded-md shadow-sm"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {yearList.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="month" className="text-sm font-semibold text-gray-700 mb-2">Select Month:</label>
                            <select
                                id="month"
                                className="border border-gray-300 p-3 rounded-md shadow-sm"
                                value={selectedMonth}
                                onChange={(e) => handleMonthChange(e.target.value)}
                            >
                                <option value="">Select Month</option>
                                {monthList.map((month, index) => (
                                    <option key={index} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="start-date" className="text-sm font-semibold text-gray-700 mb-2">Select Start Date:</label>
                            <input
                                type="date"
                                value={selectedDate.startDate || ""}
                                onChange={(e) => handleStartDateChange(e.target.value)}
                                className="border border-gray-300 p-3 rounded-md shadow-sm"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="end-date" className="text-sm font-semibold text-gray-700 mb-2">Select End Date:</label>
                            <input
                                type="date"
                                value={selectedDate.endDate || ""}
                                onChange={(e) => handleEndDateChange(e.target.value)}
                                className="border border-gray-300 p-3 rounded-md shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center mt-6 sm:mt-0">
                        <button
                            className="bg-[#433D8B] text-white px-5 py-3 rounded-full hover:bg-[#352e77] transition duration-300"
                            onClick={fetchReport}
                        >
                            Filter
                        </button>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="flex justify-between p-4 mx-auto max-w-4xl gap-4 mb-8">
                    <button
                        className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90"
                        onClick={exportToPDF}
                    >
                        Export to PDF
                    </button>
                    <button
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90"
                        onClick={exportToExcel}
                    >
                        Export to Excel
                    </button>
                </div>

                {/* Sales Report Table */}
                <div className="overflow-x-auto p-4">
                    <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                        <thead className="bg-[#433D8B] text-white">
                            <tr>
                                <th className="p-4 text-center">Course Name</th>
                                <th className="p-4 text-center">Buyer Name</th>
                                <th className="p-4 text-center">Category Name</th>
                                <th className="p-4 text-center">Purchased At</th>
                                <th className="p-4 text-center">Price</th>
                                <th className="p-4 text-center">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border-t p-4 text-center">{item.coursename}</td>
                                        <td className="border-t p-4 text-center">{item.username}</td>
                                        <td className="border-t p-4 text-center">{item.categoryName}</td>
                                        <td className="border-t p-4 text-center">{new Date(item.purchasedAt).toLocaleDateString('en-GB')}</td>
                                        <td className="border-t p-4 text-center">{item.price}</td>
                                        <td className="border-t p-4 text-center">{item.transactionId}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-4 my-6">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg ${
                            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#433D8B] text-white hover:bg-[#352e77]"
                        }`}
                    >
                        Previous
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === index + 1 ? "bg-[#433D8B] text-white" : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg ${
                            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#433D8B] text-white hover:bg-[#352e77]"
                        }`}
                    >
                        Next
                    </button>
                </div>

                {/* Sales Count */}
                <div className="text-center mb-3 p-6 shadow-md rounded-lg mx-auto w-full max-w-4xl">
                    <h3 className="text-xl font-semibold">Total Sales: <span className="text-green-600">{salesCount}</span></h3>
                </div>

                <AdminFooter />
            </div>
        </>
    )
}

export default AdminSalesReport;
