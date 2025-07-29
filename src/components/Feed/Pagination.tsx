import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showItemsCount?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  showItemsCount = true 
}) => {
  // Pagination calculations
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Early return if no pagination needed
  if (totalPages <= 1) {
    return null;
  }

  // Helper function to generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = window.innerWidth < 640 ? 5 : 10;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start: show first 3 + ellipsis + last 2
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push('...');
        for (let i = totalPages - 1; i <= totalPages; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show first 2 + ellipsis + last 3
        for (let i = 1; i <= 2; i++) pages.push(i);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        // Middle: show first + ellipsis + current-1, current, current+1 + ellipsis + last
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Helper function to render page button
  const renderPageButton = (page: number | string, index: number) => {
    const isNumber = typeof page === 'number';
    const isCurrentPage = isNumber && page === currentPage;
    
    return (
      <button
        key={index}
        onClick={() => isNumber ? onPageChange(page) : null}
        disabled={!isNumber}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          isNumber
            ? isCurrentPage
              ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
            : 'text-white/40 cursor-default'
        }`}
      >
        {page}
      </button>
    );
  };

  return (
    <>
      {/* Items Count Display */}
      {showItemsCount && (
        <div className="text-center mb-6">
          <p className="text-white/60">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} posts
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-12">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            currentPage === 1
              ? 'text-white/30 cursor-not-allowed'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          ← Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1 flex-wrap justify-center">
          {generatePageNumbers().map(renderPageButton)}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            currentPage === totalPages
              ? 'text-white/30 cursor-not-allowed'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          Next →
        </button>
      </div>
    </>
  );
};

export default Pagination; 