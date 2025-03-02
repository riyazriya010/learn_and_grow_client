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
import Navbar from "../navbar";
import MentorFooter from "./footer";
import { MENTOR_SERVICE_URL } from "@/utils/constant";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    // const [year, setYear] = useState<number>(new Date().getFullYear());

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number | "">(currentYear);
    const [selectedDate, setSelectedDate] = useState<string | "">("");
    const [selectedMonth, setSelectedMonth] = useState<string | "">("");

    // Generate the last 10 years dynamically
    const yearList = Array.from({ length: 10 }, (_, index) => currentYear - index);
    const monthList = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${MENTOR_SERVICE_URL}/get/dashboard`, {
                    withCredentials: true
                });
                if (response?.data?.result) {
                    setData(response.data.result);
                }
            } catch (error: any) {
                if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
                    console.log('401 log', error.response.data.message)
                    toast.warn(error.response.data.message);
                    setTimeout(() => {
                        window.location.replace('/pages/mentor/profile');
                    }, 3000);
                    return;
                }
                if (error && error.response?.status === 401) {
                    toast.warn(error.response.data.message);
                    await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.replace('/pages/mentor/login');
                    }, 3000);
                    return;
                }
                if (
                    error &&
                    error?.response?.status === 403 &&
                    error?.response?.data?.message === 'Mentor Blocked'
                ) {
                    toast.warn(error?.response?.data?.message);
                    await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.replace('/pages/mentor/login');
                    }, 3000);
                    return;
                }
                if (error && error.response?.status === 403) {
                    console.log('403')
                    toast.warn(error.response?.data.message)
                    await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
                    localStorage.clear()
                    setTimeout(() => {
                        // router.push('/pages/mentor/login')
                        window.location.replace('/pages/mentor/login')
                    }, 3000)
                    return
                }
                if (error && error.response?.status === 401) {
                    console.log('401')
                    toast.warn(error.response.data.message)
                    return
                }
            }
        };
        fetchData();
    }, []);

    // Track the selected day and month
    const handleDayChange = (date: string | "") => {
        setSelectedDate(date);
        if (date) {
            // Reset selectedMonth if day is selected
            setSelectedMonth('');
            setSelectedYear('')
        }
    };

    // Track the selected month
    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
        if (month) {
            // Reset selectedDay if month is selected
            setSelectedDate('');
        }
    };

    const fetchChartGraphData = async () => {
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

            console.log('filters: ', filters);

            // Convert the filters object into a query string
            const queryString = `filter=${encodeURIComponent(JSON.stringify(filters))}`;

            const response = await axios.get(`${MENTOR_SERVICE_URL}/get/chart/graph/data?${queryString}`, {
                withCredentials: true
            });
            if (response?.data?.result) {
                console.log('res ', response)
                setCourseSales(response.data.result.courseSales || []);
                setRevenueOrders(response.data.result.revenueOrders || []);
                // setYear(response.data.result.year || new Date().getFullYear());
            }
        } catch (error: any) {
            if (error && error.response?.status === 401 && error.response.data.message === 'Mentor Not Verified') {
                console.log('401 log', error.response.data.message)
                toast.warn(error.response.data.message);
                setTimeout(() => {
                    window.location.replace('/pages/mentor/profile');
                }, 3000);
                return;
            }
            if (error && error.response?.status === 401) {
                toast.warn(error.response.data.message);
                await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/mentor/login');
                }, 3000);
                return;
            }
            if (
                error &&
                error?.response?.status === 403 &&
                error?.response?.data?.message === 'Mentor Blocked'
            ) {
                toast.warn(error?.response?.data?.message);
                await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
                localStorage.clear();
                setTimeout(() => {
                    window.location.replace('/pages/mentor/login');
                }, 3000);
                return;
            }
            if (error && error.response?.status === 403) {
                console.log('403')
                toast.warn(error.response?.data.message)
                await axios.post(`${MENTOR_SERVICE_URL}/mentor/logout`, {}, { withCredentials: true }); //mentor logout api
                localStorage.clear()
                setTimeout(() => {
                    // router.push('/pages/mentor/login')
                    window.location.replace('/pages/mentor/login')
                }, 3000)
                return
            }
            if (error && error.response?.status === 401) {
                console.log('401')
                toast.warn(error.response.data.message)
                return
            }
        }
    };


    useEffect(() => {
        // setSelectedYear(year)
        fetchChartGraphData();
    }, []);

    // Function to generate distinct colors for each course dynamically
    const generateColors = (count: number) => {
        const colors: any = [];
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
        <>
            <div className="flex flex-col min-h-screen bg-white">
                {/* Header */}
                <header>
                    <Navbar />
                </header>

                <ToastContainer
                    autoClose={2000}
                    pauseOnHover={false}
                    transition={Slide}
                    hideProgressBar={false}
                    closeOnClick={false}
                    pauseOnFocusLoss={true}
                />

                <div className="min-h-screen p-6 bg-white-100">
                    {/* <h1 className="text-2xl font-bold mb-6">Mentor Dashboard</h1> */}

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


                    <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg shadow-md w-full max-w-4xl mx-auto">
                        <div className="flex flex-col w-1/3">
                            <label htmlFor="year" className="text-sm font-semibold mb-1">Select Year:</label>
                            <select
                                id="year"
                                className="border border-gray-300 p-2 rounded-md"
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

                        <div className="flex flex-col w-1/3">
                            <label htmlFor="day" className="text-sm font-semibold mb-1">Select Date:</label>
                            <input
                                type="date"
                                value={selectedDate || ""} // Use selectedDate directly
                                onChange={(e) => handleDayChange(e.target.value)} // Set the selected date value
                                className="border border-gray-300 p-2 rounded-md"
                            />
                        </div>

                        <div className="flex flex-col w-1/3">
                            <label htmlFor="month" className="text-sm font-semibold mb-1">Select Month:</label>
                            <select
                                id="month"
                                className="border border-gray-300 p-2 rounded-md"
                                value={selectedMonth}
                                onChange={(e) => handleMonthChange(e.target.value)}
                            >
                                <option value="">Select Month</option> {/* Placeholder option */}
                                {monthList.map((month, index) => (
                                    <option key={index} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="bg-[#433D8B] text-white px-5 rounded-[22px] hover:opacity-90"
                            onClick={fetchChartGraphData}
                        >
                            Filter
                        </button>
                    </div>



                    {/* Charts */}
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Course Sales Distribution (Pie Chart) */}
                        <div className="p-4 bg-white shadow-lg rounded-2xl flex flex-col items-center">
                            <h2 className="text-lg font-semibold mb-3">Course Sales Distribution</h2>
                            <h2 className="text-lg font-semibold mb-3">
                                {
                                    selectedYear && selectedMonth
                                        ? `${selectedMonth} - ${selectedYear} - data selected`
                                        : selectedYear
                                            ? `${selectedYear} - data selected`
                                            : selectedDate
                                                ? `${selectedDate} - data selected`
                                                : "No filter selected"
                                }
                            </h2>

                            <div className="w-[350px] h-350px]">
                                <Pie data={pieData} options={pieOptions} />
                            </div>

                        </div>

                        {/* Monthly Revenue Trends (ApexChart) */}
                        <div className="p-4 bg-white shadow-lg rounded-2xl">
                            <h2 className="text-lg font-semibold mb-3">Monthly Orders & Revenue</h2>
                            <h2 className="text-lg font-semibold mb-3">
                                {
                                    selectedYear && selectedMonth
                                        ? `${selectedMonth} - ${selectedYear} - data selected`
                                        : selectedYear
                                            ? `${selectedYear} - data selected`
                                            : selectedDate
                                                ? `${selectedDate} - data selected`
                                                : "No filter selected"
                                }
                            </h2>
                            <ApexChart options={apexChartOptions} series={apexChartSeries} type="area" height={350} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <MentorFooter />
            </div>
        </>
    );
};

const Card = ({ title, value, className }: { title: string; value: string | number; className?: string }) => (
    <div className={`p-6 shadow-lg rounded-2xl text-center ${className || "bg-white"}`}>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-3xl font-bold text-gray-700">{value}</p>
    </div>
);

export default Dashboard;



