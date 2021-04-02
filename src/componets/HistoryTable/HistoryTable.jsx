import React from 'react';
import classnames from 'classnames';
import OrderHistoryContainer from '../OrderHistory/OrderHistoryContainer';
import './HistoryTableComplex.css';
import styles from './HistoryTable.module.css';
import Pagination from '../common/Pagination/Pagination';
import Preloader from "../common/Preloader/Preloader";

class HistoryTable extends React.Component {
    changeSort = (e) => {
        const filter = e.target.dataset.sortFilter;
        if (!!filter) {
            const table_name = e.target.dataset.tableName;
            const orderby = e.target.dataset.sortName;
            const orderway = e.target.dataset.sortWay;

            const sort = {
                table_name: table_name,
                orderby: orderby,
                orderway: orderway,
            }

            this.props.changeSort(sort, this.props.current_page, this.props.count);
        }
    }

    render() {
        if (this.props.isFetching) {
            return (
                <Preloader/>
            )
        }
        return (
            <div>
                <div className={classnames(styles.historyTable)}>
                    <div className={styles.tableHeader}>
                        {
                            this.props.table_columns.map( (column, index) => {
                                return(
                                    <div className={classnames(
                                        styles.headerCell, 
                                        {[styles.headerCellActive]: this.props.sort.orderby === column.name}, 
                                        {[styles.lastCell]: this.props.table_columns.length - 1 === index}
                                    )}>
                                        <div 
                                            key={index}
                                            className={classnames(styles.headerCellText)}
                                            data-table-name={column.table_name}
                                            data-sort-filter={column.filter ? column.filter : false}
                                            data-sort-name={column.name}
                                            data-sort-way={this.props.sort.orderby === column.name && this.props.sort.orderway === 'ASC' ? 'DESC' : 'ASC' }
                                            onClick={this.changeSort}
                                        >
                                            {column.label}
                                            {
                                                column.filter 
                                                ? <div className={classnames(
                                                        styles.sortButton, 
                                                        {
                                                            [styles.sortAsc]: this.props.sort.orderby === column.name && this.props.sort.orderway === 'ASC', 
                                                            [styles.sortDesc]: this.props.sort.orderby === column.name && this.props.sort.orderway === 'DESC'
                                                        },
                                                    )}
                                                >▼</div> 
                                                : ''
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        this.props.order_histories.map( (order_history, index) => {
                            return(
                                <OrderHistoryContainer 
                                    key={order_history.id}
                                    order_history={order_history} 
                                    odd_even={index % 2 === 0? 'even' : 'odd'} 
                                />
                            )
                        })
                    }
                </div>
                <Pagination 
                    updateData={this.props.updateData}
                    count={this.props.count}
                    currentPage={this.props.current_page}
                    totalPages={this.props.total_pages}
                    sort={this.props.sort}
                />
            </div>
        ); 
    }
}

export default HistoryTable;