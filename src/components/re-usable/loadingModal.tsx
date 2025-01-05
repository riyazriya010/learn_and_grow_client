// 'use client'

// const LoadingModal = ({ isOpen, message }: { isOpen: boolean, message: string }) => {
//     if (!isOpen) return null;
  
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//         <div className="bg-white p-6 rounded shadow-lg">
//           <h2 className="text-lg font-semibold">Loading ....</h2>
//           <p>{message}</p>
//         </div>
//       </div>
//     );
//   };

//   export default LoadingModal


'use client';

const LoadingModal = ({ isOpen, message }: { isOpen: boolean; message: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-lg">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80 text-center relative">
        <div className="flex justify-center items-center">
          <svg
            className="w-16 h-16 text-blue-500 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="4" strokeLinecap="round"></circle>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
            ></path>
          </svg>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Updating...</h2>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
