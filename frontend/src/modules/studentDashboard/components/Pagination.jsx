import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useDashboard } from '../context/DashboardContext';

const Pagination = () => {
    const { pagination, handlePageChange } = useDashboard();
    const { currentPage, totalPages } = pagination;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show on each side of current page
        const range = [];
        const rangeWithDots = [];

        // Always show first page
        range.push(1);

        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i > 1 && i < totalPages) {
                range.push(i);
            }
        }

        // Always show last page
        if (totalPages > 1) {
            range.push(totalPages);
        }

        // Add dots where needed
        let l;
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center items-center space-x-2 mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === 1
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-white/10 text-white hover:bg-white/20 hover:text-yellow-300'
                }`}
            >
                <FaChevronLeft />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((number, index) => (
                <button
                    key={index}
                    onClick={() => number !== '...' && handlePageChange(number)}
                    disabled={number === '...'}
                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                        number === currentPage
                            ? 'bg-yellow-400/20 text-yellow-300 font-semibold border border-yellow-300/30'
                            : number === '...'
                            ? 'bg-transparent text-white/50 cursor-default'
                            : 'bg-white/10 text-white hover:bg-white/20 hover:text-yellow-300'
                    }`}
                >
                    {number}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === totalPages
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-white/10 text-white hover:bg-white/20 hover:text-yellow-300'
                }`}
            >
                <FaChevronRight />
            </button>
        </div>
    );
};

export default Pagination; 