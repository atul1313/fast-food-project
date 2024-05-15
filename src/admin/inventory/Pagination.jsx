import React from 'react'

function Pagination({ totalPage, currentPage, onPageChange }) {
    const pages = Array.from({ length: totalPage }, (_, index) => index + 1);

    const getPageRange = () => {
        const displayPages = 4; // Number of page numbers to display before and after ellipsis
        const delta = 2; // Number of pages before and after ellipsis
        const range = [];

        if (totalPage <= displayPages) {
            return pages;
        }

        if (currentPage <= delta + 1) {
            // Display page numbers without ellipsis on the left
            return [...pages.slice(0, displayPages - 1), '...', totalPage];
        }

        if (currentPage >= totalPage - delta) {
            // Display page numbers without ellipsis on the right
            return [1, '...', ...pages.slice(totalPage - displayPages + 2)];
        }

        // Display page numbers with ellipsis on both sides
        return [1, '...', ...pages.slice(currentPage - delta, currentPage + delta), '...', totalPage];
    };
    return (
        <>
            <div className='pagination-btn' style={{padding:"15px"}}>
                <button className='prev' onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Prev
                </button>

                {getPageRange().map((page) => (
                    <button key={page} onClick={() => onPageChange(page)} style={currentPage === page ? {background:"#046cf5",color:"#fff"} : {}} disabled={currentPage === page}>
                        {page}
                    </button>
                ))}

                <button className='next' onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPage}>
                    Next
                </button>
            </div>
        </>
    )
}

export default Pagination;