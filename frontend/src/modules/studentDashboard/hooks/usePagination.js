import { useState, useCallback, useEffect } from 'react';
import { validatePaginationParams } from '../utils/validation';

const usePagination = (totalItems, itemsPerPage = 10, onPageChange) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(itemsPerPage);
    const [error, setError] = useState(null);

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // Update current page when total items or page size changes
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(Math.max(1, totalPages));
        }
    }, [totalItems, pageSize, currentPage, totalPages]);

    // Handle page change
    const handlePageChange = useCallback((page) => {
        const validation = validatePaginationParams({ page, limit: pageSize });
        
        if (!validation.isValid) {
            setError(validation.errors[0]);
            return;
        }

        if (page < 1 || page > totalPages) {
            setError('Invalid page number');
            return;
        }

        setError(null);
        setCurrentPage(page);
        onPageChange(page);
    }, [pageSize, totalPages, onPageChange]);

    // Handle page size change
    const handlePageSizeChange = useCallback((size) => {
        const validation = validatePaginationParams({ page: 1, limit: size });
        
        if (!validation.isValid) {
            setError(validation.errors[0]);
            return;
        }

        setError(null);
        setPageSize(size);
        setCurrentPage(1);
        onPageChange(1);
    }, [onPageChange]);

    // Get visible page numbers
    const getVisiblePages = useCallback(() => {
        const delta = 2; // Number of pages to show on each side
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
    }, [currentPage, totalPages]);

    return {
        currentPage,
        pageSize,
        totalPages,
        error,
        handlePageChange,
        handlePageSizeChange,
        getVisiblePages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
};

export default usePagination; 