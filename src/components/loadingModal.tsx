'use client'

const LoadingModal = ({ isOpen, message }: { isOpen: boolean, message: string }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-semibold">Loading ....</h2>
          <p>{message}</p>
        </div>
      </div>
    );
  };

  export default LoadingModal