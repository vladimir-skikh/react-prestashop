import React from 'react';
import '../HistoryTable/HistoryTableComplex.css';
import styles from './OrderHistory.module.css';
import classnames from 'classnames';
import { prestashopAPI } from '../../api/api';

const OrderHistory = ({
    id,
    employee,
    state_name,
    old_state_name,
    id_order,
    comment,
    date_add,
    odd_even,
}) => {

    /* const updateComment = async (e) => {
        const id_order_history = e.target.dataset.idOrderHistory;

        let response = await prestashopAPI.updateComment(id_order_history);
    } */

    return (
        <div className={classnames(odd_even, styles.orderHistoryRow)}>
            <div className={classnames(styles.id, styles.cell)}>
                {id}
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
            <div className={classnames(styles.id, styles.cell)} onClick={updateComment} data-id-order-history={id}>
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