import React from "react";
import classnames from 'classnames';
import style from './Pagination.module.css';

const Pagination = ({
    updateData,
    count,
    currentPage,
    sort,
    totalPages
}) => {

    let paginationStart = 0;
    let paginationEnd = 7;
    if (currentPage > 3) {
        paginationStart = currentPage - 3;
        paginationEnd = currentPage + 2;
    }

    let onChangeCurrentPage = (pageNum) => {
        updateData(pageNum, count, sort);
    }

    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    if (pages.length > 1) {
        return (
            <div className={style.pagination}>
                <ul className={style.paginationList}>
                    <li 
                        className={classnames(style.paginationListItem, {[style.hidden]: currentPage === 1})}
                        onClick={()=> {onChangeCurrentPage(1)}}
                    >
                        ⋘
                    </li>
                    {   
                        pages.slice(paginationStart, paginationEnd).map( page => (
                            <li 
                                className={style.paginationListItem + ' ' + (currentPage === page ? style.paginationListItemCurrent : '')}
                                onClick={()=> {onChangeCurrentPage(page)}}
                            >
                                {page}
                            </li>
                        ))
                    }
                    <li 
                        className={style.paginationListItem + ' ' + (currentPage === pages.length ? style.hidden : '')}
                        onClick={()=> {onChangeCurrentPage(pages.length)}}
                    >
                        ⋙
                    </li>
                </ul>
            </div>
        );
    } else return '';
};

export default Pagination;
