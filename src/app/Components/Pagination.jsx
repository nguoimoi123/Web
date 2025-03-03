import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 p-2">
      <button
        onClick={handlePrev}
        className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-600 transition"
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-600 transition"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;