'use client'

interface PaginationProps {
  nextPage: () => void;
  previousPage: () => void;
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ nextPage, previousPage, currentPage, totalPages }: PaginationProps) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={previousPage}
        className="px-4 py-2 text-[#6E40FF] bg-white border-2 border-[#6E40FF] rounded-md shadow-md hover:bg-[#433D8B] hover:text-white transition"
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
              onClick={() => window.location.href = `?page=${pageNumber}`}
              className={`w-10 h-10 flex items-center justify-center rounded-md border-2 ${
                currentPage === pageNumber
                  ? 'bg-[#6E40FF] text-white shadow-lg'
                  : 'bg-white text-[#6E40FF] shadow-sm hover:bg-[#6E40FF] hover:text-white'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        onClick={nextPage}
        className="px-4 py-2 text-[#6E40FF] bg-white border-2 border-[#6E40FF] rounded-md shadow-md hover:bg-[#433D8B] hover:text-white transition"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;

