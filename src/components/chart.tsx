"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { ApexOptions } from "apexcharts";

ChartJS.register(ArcElement, Tooltip, Legend);

// Dynamically import ApexCharts (prevents SSR issues)
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CourseSales {
    courseName: string;
    percentage: string;
}

interface RevenueOrders {
    month: number;
    totalRevenue: number;
    totalOrders: number;
}

interface DashboardData {
    todayRevenue: number;
    prevMonthRevenue: number;
    prevYearRevenue: number;
    totalRevenue: number;
    totalCourses: number;
    mostEnrolledCourse: { courseName: string; enrollments: number } | null;
    leastEnrolledCourse: { courseName: string; enrollments: number } | null;
    totalStudents: number;
    activeStudents: number;
    courseCompletionRate: number;
}

const Dashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [courseSales, setCourseSales] = useState<CourseSales[]>([]);
    const [revenueOrders, setRevenueOrders] = useState<RevenueOrders[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    // Generate the last 10 years dynamically
    const yearList = Array.from({ length: 10 }, (_, index) => currentYear - index);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8001/get/dashboard");
                if (response?.data?.result) {
                    setData(response.data.result);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchData();
    }, []);

    const fetchChartGraphData = async (year: number) => {
        try {
            setSelectedYear(year)
            console.log('year: ', year)
            const response = await axios.get(`http://localhost:8001/get/chart/graph/data?year=${year}`);
            if (response?.data?.result) {
                console.log('res ', response)
                setCourseSales(response.data.result.courseSales || []);
                setRevenueOrders(response.data.result.revenueOrders || []);
                setYear(response.data.result.year || new Date().getFullYear());
            }
        } catch (error) {
            console.error("Error fetching chart graph data:", error);
        }
    };


    useEffect(() => {
        fetchChartGraphData(Number(year));
    }, []);

    // Function to generate distinct colors for each course dynamically
    const generateColors = (count: number) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 137) % 360; // Using golden angle for better distribution
            colors.push(`hsl(${hue}, 70%, 50%)`);
        }
        return colors;
    };

    // Prepare Pie Chart Data (Course Sales Distribution)
    const pieData = {
        labels: courseSales.length > 0 ? courseSales.map(item => item.courseName) : ["No Sales"],
        datasets: [{
            data: courseSales.length > 0 ? courseSales.map(item => parseFloat(item.percentage)) : [100],
            backgroundColor: generateColors(courseSales.length || 1),
        }],
    };

    const pieOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `${tooltipItem.raw}%`;  // ✅ Add `%` in the tooltip
                    }
                }
            },
            legend: {
                labels: {
                    generateLabels: function (chart: any) {
                        return chart.data.labels.map((label: any, index: any) => ({
                            text: `${label} (${chart.data.datasets[0].data[index]}%)`, // ✅ Show `%` in legend
                            fillStyle: chart.data.datasets[0].backgroundColor[index]
                        }));
                    }
                }
            }
        }
    };

    // Prepare ApexCharts Data (Monthly Orders & Revenue)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const apexChartOptions: ApexOptions = {
        chart: {
            type: "area",
            height: 350,
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        xaxis: {
            categories: revenueOrders.length > 0 ? revenueOrders.map(item => months[item.month - 1]) : ["No Data"],
            title: { text: "Months" },
        },
        yaxis: {
            title: { text: "Orders & Revenue" },
            labels: { formatter: (value) => `${value}` },
        },
        colors: ["#36a2eb", "#ff6384"], // Blue for Orders, Red for Revenue
        stroke: { curve: "smooth", width: 2 },
        fill: { type: "gradient", gradient: { shadeIntensity: 0.5, opacityFrom: 0.4, opacityTo: 0, stops: [0, 90, 100] } },
        markers: { size: 4, hover: { size: 6 } },
        legend: { position: "top", horizontalAlign: "right" },
    };

    const apexChartSeries = [
        {
            name: "Orders",
            data: revenueOrders.length > 0 ? revenueOrders.map(item => item.totalOrders) : [0],
        },
        {
            name: "Revenue",
            data: revenueOrders.length > 0 ? revenueOrders.map(item => item.totalRevenue) : [0],
        },
    ];

    return (
        <div className="min-h-screen p-6 bg-white-100">
            <h1 className="text-2xl font-bold mb-6">Mentor Dashboard</h1>

            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card title="Today's Earnings" value={`₹ ${data?.todayRevenue || 0}`} className="bg-blue-50" />
                <Card title="Last 30 Days Earnings" value={`₹ ${data?.prevMonthRevenue || 0}`} className="bg-gray-50" />
                <Card title="Last 365 Days Earnings" value={`₹ ${data?.prevYearRevenue || 0}`} className="bg-blue-50" />
                <Card title="Total Earnings" value={`₹ ${data?.totalRevenue || 0}`} className="bg-gray-50" />
            </div>

            {/* Course Performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card title="Total Courses" value={data?.totalCourses || 0} className="bg-blue-50" />
                <Card title="Most Enrolled Course" value={`${data?.mostEnrolledCourse?.courseName || "N/A"} / ${data?.mostEnrolledCourse?.enrollments || "0"}`} className="bg-gray-50" />
                <Card title="Least Enrolled Course" value={`${data?.leastEnrolledCourse?.courseName || "N/A"} / ${data?.leastEnrolledCourse?.enrollments || "0"}`} className="bg-blue-50" />
            </div>

            {/* Student Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card title="Total Students Enrolled" value={data?.totalStudents || 0} className="bg-gray-50" />
                <Card title="Course Completion Rate (%)" value={`${data?.courseCompletionRate || 0}%`} className="bg-blue-50" />
            </div>


            <label htmlFor="year" className="text-lg font-semibold mr-2">
                Select Year:
            </label>
            <select
                id="year"
                className="border border-gray-300 p-2 rounded-md"
                value={selectedYear}
                onChange={(e) => fetchChartGraphData(Number(e.target.value))}
            >
                {yearList.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Sales Distribution (Pie Chart) */}
                <div className="p-4 bg-white shadow-lg rounded-2xl flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-3">Course Sales Distribution</h2>
                    <h2 className="text-lg font-semibold mb-3">Year - {year}</h2>
                    <div className="w-[350px] h-350px]">
                        <Pie data={pieData} options={pieOptions} />
                    </div>

                </div>

                {/* Monthly Revenue Trends (ApexChart) */}
                <div className="p-4 bg-white shadow-lg rounded-2xl">
                    <h2 className="text-lg font-semibold mb-3">Monthly Orders & Revenue</h2>
                    <h2 className="text-lg font-semibold mb-3">Year - {year}</h2>
                    <ApexChart options={apexChartOptions} series={apexChartSeries} type="area" height={350} />
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, value, className }: { title: string; value: string | number; className?: string }) => (
    <div className={`p-6 shadow-lg rounded-2xl text-center ${className || "bg-white"}`}>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-3xl font-bold text-gray-700">{value}</p>
    </div>
);

export default Dashboard;






// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     Chart as ChartJS,
//     ArcElement,
//     Tooltip,
//     Legend,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title
// } from "chart.js";
// import { Pie, Line } from "react-chartjs-2";
// import dynamic from "next/dynamic";
// import { ApexOptions } from "apexcharts";

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

// interface CourseSales {
//     courseName: string;
//     percentage: string;
// }

// interface RevenueOrders {
//     month: number;
//     totalRevenue: number;
//     totalOrders: number;
// }

// interface DashboardData {
//     todayRevenue: number;
//     prevMonthRevenue: number;
//     prevYearRevenue: number;
//     totalRevenue: number;
//     totalCourses: number;
//     mostEnrolledCourse: { courseName: string; enrollments: number } | null;
//     leastEnrolledCourse: { courseName: string; enrollments: number } | null;
//     totalStudents: number;
//     activeStudents: number;
//     courseCompletionRate: number;
// }

// const Dashboard = () => {
//     const [data, setData] = useState<DashboardData | null>(null);
//     const [courseSales, setCourseSales] = useState<CourseSales[]>([]);
//     const [revenueOrders, setRevenueOrders] = useState<RevenueOrders[]>([]);
//     const [year, setYear] = useState<number>(new Date().getFullYear());

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8001/get/dashboard");
//                 if (response?.data?.result) {
//                     setData(response.data.result);
//                 }
//             } catch (error) {
//                 console.error("Error fetching dashboard data:", error);
//             }
//         };
//         fetchData();
//     }, []);

//     useEffect(() => {
//         const fetchChartGraphData = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8001/get/chart/graph/data");
//                 if (response?.data?.result) {
//                     setCourseSales(response.data.result.courseSales || []);
//                     setRevenueOrders(response.data.result.revenueOrders || []);
//                     setYear(response.data.result.year || new Date().getFullYear());
//                 }
//             } catch (error) {
//                 console.error("Error fetching chart graph data:", error);
//             }
//         };
//         fetchChartGraphData();
//     }, []);

//     // Function to generate distinct colors for each course dynamically
//     const generateColors = (count: number) => {
//         const colors = [];
//         for (let i = 0; i < count; i++) {
//             const hue = (i * 137) % 360; // Using golden angle for better distribution
//             colors.push(`hsl(${hue}, 70%, 50%)`);
//         }
//         return colors;
//     };

//     // Prepare Pie Chart Data (Course Sales Distribution)
//     const pieData = {
//         labels: courseSales.length > 0 ? courseSales.map(item => item.courseName) : ["No Sales"],
//         datasets: [{
//             data: courseSales.length > 0 ? courseSales.map(item => parseFloat(item.percentage)) : [100],
//             backgroundColor: generateColors(courseSales.length || 1),
//         }],
//     };

//     // Prepare Line Chart Data (Monthly Revenue)
//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const lineData = {
//         labels: revenueOrders.length > 0 ? revenueOrders.map(item => months[item.month - 1]) : ["No Data"],
//         datasets: [{
//             label: `Revenue (${year})`,
//             data: revenueOrders.length > 0 ? revenueOrders.map(item => item.totalRevenue) : [0],
//             borderColor: "#36a2eb",
//             backgroundColor: "rgba(54, 162, 235, 0.2)",
//             fill: true,
//         }],
//     };

//     return (
//         <div className="min-h-screen p-6 bg-white-100">
//             <h1 className="text-2xl font-bold mb-6">Mentor Dashboard</h1>

//             {/* Revenue Overview */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//                 <Card title="Today's Earnings" value={`₹ ${data?.todayRevenue || 0}`} className="bg-blue-50" />
//                 <Card title="Last 30 Days Earnings" value={`₹ ${data?.prevMonthRevenue || 0}`} className="bg-gray-50" />
//                 <Card title="Last 1 Year Earnings" value={`₹ ${data?.prevYearRevenue || 0}`} className="bg-blue-50" />
//                 <Card title="Total Earnings" value={`₹ ${data?.totalRevenue || 0}`} className="bg-gray-50" />
//             </div>

//             {/* Course Performance */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <Card title="Total Courses" value={data?.totalCourses || 0} className="bg-blue-50" />
//                 <Card title="Most Enrolled Course" value={`${data?.mostEnrolledCourse?.courseName || "N/A"} / ${data?.mostEnrolledCourse?.enrollments || "0"}`} className="bg-gray-50" />
//                 <Card title="Least Enrolled Course" value={`${data?.leastEnrolledCourse?.courseName || "N/A"} / ${data?.leastEnrolledCourse?.enrollments || "0"}`} className="bg-blue-50" />
//             </div>

//             {/* Student Engagement */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <Card title="Total Students Enrolled" value={data?.totalStudents || 0} className="bg-gray-50" />
//                 <Card title="Course Completion Rate (%)" value={`${data?.courseCompletionRate || 0}%`} className="bg-blue-50" />
//             </div>

//             {/* Charts */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Course Sales Distribution (Pie Chart) */}
//                 <div className="p-4 bg-white shadow-lg rounded-2xl flex flex-col items-center">
//                     <h2 className="text-lg font-semibold mb-3">Course Sales Distribution</h2>
//                     <div className="w-90 h-90">
//                         <Pie data={pieData} />
//                     </div>
//                 </div>

//                 {/* Monthly Revenue Trends (Line Chart) */}
//                 <div className="p-4 bg-white shadow-lg rounded-2xl">
//                     <h2 className="text-lg font-semibold mb-3">Monthly Revenue Trends</h2>
//                     <Line data={lineData} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Card Component for Dashboard Stats
// const Card = ({ title, value, className }: { title: string; value: string | number; className?: string }) => (
//     <div className={`p-6 shadow-lg rounded-2xl text-center ${className || "bg-white"}`}>
//         <h2 className="text-lg font-semibold">{title}</h2>
//         <p className="text-3xl font-bold text-gray-700">{value}</p>
//     </div>
// );

// export default Dashboard;




// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from "chart.js";
// import { Pie, Line } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);


// interface DashboardData {
//     todayRevenue: number;
//     prevMonthRevenue: number;
//     prevYearRevenue: number;
//     totalRevenue: number;
//     totalCourses: number;
//     mostEnrolledCourse: any;
//     leastEnrolledCourse: any;
//     totalStudents: number;
//     activeStudents: number;
//     courseCompletionRate: number;
// }

// interface ChartData {

// }

// interface GraphData {

// }


// const Dashboard = () => {
//     const [data, setData] = useState<DashboardData | null>(null);
//     const [chartData, setChartData] = useState<ChartData | null>(null)
//     const [graphData, setGraphData] = useState<GraphData | null>(null)

//     const Card = ({ title, value, color, className }: { title?: string, value?: any, color?: string, className?: string }) => (
//         <div className={`p-4 shadow-lg rounded-2xl ${className || 'bg-white'}`}>
//           <h2 className="text-xl font-bold">{title}</h2>
//           <p className={`text-lg text-gray-500 font-semibold ${color}`}>{value}</p>
//         </div>
//       );

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8001/get/dashboard`);
//                 console.log('dashboard data:  ',response)
//                 if (response?.data?.result) {
//                     setData(response.data.result);
//                 }
//             } catch (error) {
//                 console.error("Error fetching dashboard data:", error);
//             }
//         };
//         fetchData();
//     }, []);

//     useEffect(() => {
//         const fetchChartGrapghData = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8001/get/chart/graph/data`);
//                 console.log('chart graph data: ',response)
//                 if (response?.data?.result) {
//                     // setData(response.data.result);
//                     setChartData(response?.data?.result?.
//                         courseSales)
//                     setGraphData(response?.data?.result?.
//                         revenueOrders)
//                 }
//             } catch (error) {
//                 console.error("Error fetching chart graph data:", error);
//             }
//         };
//         fetchChartGrapghData();
//     }, [])

//     // Dummy data for charts (replace with actual API data)
//     const courseSales = [30, 20, 15, 35]; // Course sales distribution
//     const monthlyRevenue = [3000, 5000, 7000, 2000, 6000, 12000]; // Monthly revenue

//     const pieData = {
//         labels: ["JavaScript", "Python", "React", "Next.js"],
//         datasets: [{ data: courseSales, backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"] }],
//     };

//     const lineData = {
//         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//         datasets: [{ label: "Revenue", data: monthlyRevenue, borderColor: "#36a2eb", backgroundColor: "rgba(54, 162, 235, 0.2)", fill: true }],
//     };

//     return (
//         <div className="min-h-screen p-6 bg-white-100">
//             <h1 className="text-2xl font-bold mb-6">Mentor Dashboard</h1>

//             {/* Revenue Overview */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//                 <Card title="Today's Earnings" value={`₹ ${data?.todayRevenue || 0}`} color="text-black-200" className="bg-blue-50"/>
//                 <Card title="Last 30 Days Earnings" value={`₹ ${data?.prevMonthRevenue || 0}`} color="text-black-200" className="bg-gray-50"/>
//                 <Card title="Last 1 Year Earnings" value={data?.prevYearRevenue || 0} color="text-black-200" className="bg-blue-50"/>
//                 <Card title="Total Earnings" value={data?.totalRevenue || 0} color="text-black-100" className="bg-gray-50"/>
//             </div>

//             {/* Course Performance */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <Card title="Total Courses" value={data?.totalCourses || 0} className="bg-blue-50" />
//                 <Card title="Most Enrolled Course" value={`${data?.mostEnrolledCourse?.courseName || "N/A"} / ${data?.mostEnrolledCourse?.enrollments || "0"}`} className="bg-gray-50" />
//                 <Card title="Least Enrolled Course" value={`${data?.leastEnrolledCourse?.courseName || "N/A"} / ${data?.leastEnrolledCourse?.enrollments || "0"}`} className="bg-blue-50" />
//             </div>

//             {/* Student Engagement */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <Card title="Total Students Enrolled" value={data?.totalStudents || 0} className="bg-gray-50" />
//                 {/* <Card title="Active Students" value={data?.activeStudents || 0} /> */}
//                 <Card title="Course Completion Rate (%)" value={`${data?.courseCompletionRate || 0}%`} className="bg-blue-50" />
//             </div>

//             {/* Charts */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Course Sales Distribution (Pie Chart) */}
//                 <div className="p-4 bg-white shadow-lg rounded-2xl flex flex-col items-center">
//                     <h2 className="text-lg font-semibold mb-3">Course Sales Distribution</h2>
//                     <div className="w-90 h-90">
//                         <Pie data={pieData} />
//                     </div>
//                 </div>

//                 {/* Monthly Revenue Trends (Line Chart) */}
//                 <div className="p-4 bg-white shadow-lg rounded-2xl">
//                     <h2 className="text-lg font-semibold mb-3">Monthly Revenue Trends</h2>
//                     <Line data={lineData} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Card Component for Dashboard Stats
// const Card = ({ title, value, color = "text-gray-700" }: { title: string; value: string | number; color?: string }) => (
//     <div className="p-6 bg-white shadow-lg rounded-2xl text-center">
//         <h2 className="text-lg font-semibold">{title}</h2>
//         <p className={`text-3xl font-bold ${color}`}>{value}</p>
//     </div>
// );

// export default Dashboard;
