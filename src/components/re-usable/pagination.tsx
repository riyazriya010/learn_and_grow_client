'use client'

interface PaginationProps {
  directClick: (pageNumber: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ directClick, nextPage, previousPage, currentPage, totalPages }: PaginationProps) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={previousPage}
        className="px-4 py-2 bg-[#ffffff] border border-[#22177A] text-black rounded-md shadow-md hover:bg-gray-100 transition-colors transition"
        disabled={currentPage === 1}
      >
        Prev
      </button>
      
      <div className="flex items-center space-x-2">
        {/* Show page numbers */}
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              // onClick={() => window.location.href = `?page=${pageNumber}`}
              onClick={() => directClick(pageNumber)}
              className={`w-10 h-10 flex items-center justify-center rounded-md border-2 ${
                currentPage === pageNumber
                  ? 'bg-[#22177A] text-white shadow-lg'
                  : 'bg-[#ffffff] border border-gray-300 text-black rounded-md shadow-md hover:bg-[#22177A] rounded-md shadow-md hover:bg-[#433D8B] hover:text-white transition'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        onClick={nextPage}
        className="px-4 py-2 bg-[#ffffff] border border-[#22177A] text-black rounded-md shadow-md hover:bg-gray-100 transition-colorsrounded-md shadow-md transition"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;

