import React from 'react';
import '../HistoryTable/HistoryTableComplex.css';
import styles from './OrderHistory.module.css';
import classnames from 'classnames';
import { prestashopAPI } from '../../api/api';

const OrderHistory = ({
    id_order_history,
    employee,
    state_name,
    old_state_name,
    id_order,
    comment,
    date_add,
    odd_even,
}) => {

    const updateComment = async () => {
        
    }

    return (
        <div className={classnames(odd_even, styles.orderHistoryRow)}>
            <div className={classnames(styles.id, styles.cell)}>
                {id_order_history}
            </div>
            <div className={classnames(styles.id, styles.cell)}>
                {id_order}
            </div>
            <div className={classnames(styles.id, styles.cell)}>
                {old_state_name}
            </div>
            <div className={classnames(styles.id, styles.cell)}>
                {state_name}
            </div>
            <div className={classnames(styles.id, styles.cell)} onClick={updateComment} data-id-order-history={id_order_history}>
                {comment}
            </div>
            <div className={classnames(styles.id, styles.cell)}>
                {employee}
            </div>
            <div className={classnames(styles.id, styles.cell, styles.lastCell)}>
                {date_add}
            </div>
        </div>
    );
}

export default OrderHistory;