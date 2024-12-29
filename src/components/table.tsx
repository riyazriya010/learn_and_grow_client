'use client'

import React from "react";

interface TableProps {
    headers: string[];
    data: { [key: string]: any }[];
    handlers: { [key: string]: any }[];
}


const ReusableTable: React.FC<TableProps> = ({ headers, data, handlers }) => {

    return (
        <>
            <main className="flex-grow flex items-center justify-center py-8 px-4">
                <div className="w-full max-w-4xl overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full border-collapse table-fixed">
                        {/* Table Head */}
                        <thead className="bg-[#433D8B] text-white">
                            <tr
                                className="bg-[#433D8B] text-white"
                            >
                                {
                                    headers.map((topic, index) => (
                                        <th key={index} className="py-2 px-4 text-left">{topic}</th>
                                    ))
                                }
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {
                                data.map((val: any, index) => (
                                    <tr
                                        key={index}
                                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"
                                            } text-black`}
                                    >
                                        {
                                            Object.keys(val).map((key, index) => (
                                                <td key={index} className="py-2 px-4 truncate">{val[key]}</td>

                                            ))
                                        }
                                        <td className="py-2 px-4" style={{ paddingRight: '4rem' }}>
                                            {
                                                // Displaying buttons for each handler vertically
                                                handlers.map((handlerObj, i) => (
                                                    <div key={i} className="mt-1">
                                                        <button
                                                            className="bg-[#433D8B] text-white px-5 py-1 rounded w-full"
                                                            onClick={handlerObj.handler}
                                                        >
                                                            {handlerObj.name}
                                                        </button>
                                                    </div>
                                                ))
                                            }
                                        </td>

                                        {/* <td className="py-2 px-4"><button
                                            className="bg-[#433D8B] text-white text-white px-5 py-1 rounded mt-1"
                                        >List</button></td> */}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
}

export default ReusableTable