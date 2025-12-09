import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange, isMobile = false }) => {
  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center ${isMobile ? 'gap-3 mt-8 mb-4' : 'gap-4 mt-8'}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`avantbold ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} rounded border border-[#FFF7DC] ${
          currentPage === 1 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:bg-[#FFF7DC] hover:text-[#181818]'
        } cream-text transition-colors`}
      >
        {isMobile ? 'Prev' : 'Previous'}
      </button>
      <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'}`}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`avantbold ${isMobile ? 'w-8 h-8 text-xs' : 'w-10 h-10'} rounded border border-[#FFF7DC] ${
              currentPage === page 
                ? 'cream-bg metallic-text' 
                : 'cream-text hover:bg-[#FFF7DC] hover:text-[#181818]'
            } cursor-pointer transition-colors`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`avantbold ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} rounded border border-[#FFF7DC] ${
          currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:bg-[#FFF7DC] hover:text-[#181818]'
        } cream-text transition-colors`}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
