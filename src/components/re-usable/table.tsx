'use client';

import React from "react";

interface TableProps {
  headers: string[];
  data: { [key: string]: any }[]; // Data with consistent keys
  handlers?: (row: { [key: string]: any }) => { handler: () => void; name: string; icon?: React.ReactNode }[];
  buttonStyles?: string;
  tableWidth?: string;
}

const ReusableTable: React.FC<TableProps> = ({ headers, data, handlers, buttonStyles, tableWidth }) => {

  // return (
  //   <main className="flex-grow flex items-center justify-center py-8 px-4">
  //     <div
  //       className={`shadow-md rounded-lg overflow-x-auto ${
  //         tableWidth || "max-w-fit"
  //       }`}
  //     >
  //       <table className="w-full border-collapse table-fixed">
  //         <thead className="bg-[#22177A] text-white">
  //           <tr>
  //             {headers.map((header, index) => (
  //               <th key={index} className="py-2 px-4 text-left">{header}</th>
  //             ))}
  //             {handlers && <th className="py-2 px-4 text-center">Actions</th>}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {data.map((row, rowIndex) => (
  //             <tr
  //               key={rowIndex}
  //               className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"} text-black`}
  //             >
  //               {headers.map((header, colIndex) => {
  //                 const key = header.toLowerCase().replace(/\s+/g, ""); // Optional adjustment
  //                 const value = row[header] || row[key]; // Match header directly or its transformed version

  //                 const displayValue =
  //                   typeof value === "object"
  //                     ? Array.isArray(value)
  //                       ? value.map((item: any) => item.type || item.url || item._id).join(", ")
  //                       : JSON.stringify(value)
  //                     : value;

  //                 return (
  //                   <td key={colIndex} className="py-2 px-4 truncate">
  //                     {displayValue || "N/A"}
  //                   </td>
  //                 );
  //               })}
  //               {handlers && (
  //                 <td className="py-2 px-4 text-center">
  //                   <div className="flex flex-col items-center justify-center gap-2">
  //                     {handlers(row).map((handlerObj, handlerIndex) => (
  //                       <button
  //                         key={handlerIndex}
  //                         className={`mt-1 flex items-center justify-center ${
  //                           buttonStyles || "bg-[#6E40FF] text-white px-3 py-1 rounded-[0px]"
  //                         }`}
  //                         onClick={handlerObj.handler}
  //                         style={{
  //                           width: '120px', // Ensures all buttons are the same width
  //                           height: '36px', // Ensures consistent height
  //                         }}
  //                       >
  //                         {handlerObj.icon && <span className="mr-2">{handlerObj.icon}</span>}
  //                         <span className="text-center">{handlerObj.name}</span>
  //                       </button>
  //                     ))}
  //                   </div>
  //                 </td>
  //               )}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </main>
  // );


  return (
    <main className="flex-grow flex items-center justify-center py-8 px-4">
      <div className={`shadow-md rounded-lg overflow-x-auto w-full ${tableWidth || "max-w-fit"}`}>
        <table className="min-w-full border-collapse table-auto">
          <thead className="bg-[#22177A] text-white text-sm md:text-base">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="py-2 px-4 text-left whitespace-nowrap">{header}</th>
              ))}
              {handlers && <th className="py-2 px-4 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"} text-black`}>
                {headers.map((header, colIndex) => {
                  const key = header.toLowerCase().replace(/\s+/g, "");
                  const value = row[header] || row[key];

                  const displayValue =
                    typeof value === "object"
                      ? Array.isArray(value)
                        ? value.map((item: any) => item.type || item.url || item._id).join(", ")
                        : JSON.stringify(value)
                      : value;

                  return (
                    <td key={colIndex} className="py-2 px-4 text-sm md:text-base truncate max-w-[200px] md:max-w-[300px] lg:max-w-none">
                      {displayValue || "N/A"}
                    </td>
                  );
                })}
                {handlers && (
                  <td className="py-2 px-4 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                      {handlers(row).map((handlerObj, handlerIndex) => (
                        <button
                          key={handlerIndex}
                          className={`mt-1 flex items-center justify-center ${buttonStyles || "bg-[#6E40FF] text-white px-3 py-1 rounded-[0px]"}`}
                          onClick={handlerObj.handler}
                          style={{
                            width: "120px",
                            height: "36px",
                          }}
                        >
                          {handlerObj.icon && <span className="mr-2">{handlerObj.icon}</span>}
                          <span className="text-center">{handlerObj.name}</span>
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );


};

export default ReusableTable;
