import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface PaginationProps {
    articlesPerPage: number;
    totalArticles: number;
    currentPage: number;
    onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ articlesPerPage, totalArticles, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleClick = (pageNumber: number) => {
        onPageChange(pageNumber);
    };

    const startPage = currentPage > 5 ? currentPage - 4 : 1;
    const endPage = currentPage > 5 ? currentPage : Math.min(5, totalPages);

    return (
        <nav>
            <ul className="pagination">
                {totalPages > 5 && currentPage > 1 && (
                    <li className="page-item">
                        <button className="page-link" onClick={() => handleClick(currentPage - 1)}>
                            &lt;
                        </button>
                    </li>
                )}
                {pageNumbers.slice(startPage - 1, endPage).map(number => (
                    <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handleClick(number)}>
                            {number}
                        </button>
                    </li>
                ))}
                {totalPages > 5 && currentPage < totalPages && (
                    <li className="page-item">
                        <button className="page-link" onClick={() => handleClick(currentPage + 1)}>
                            &gt;
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;