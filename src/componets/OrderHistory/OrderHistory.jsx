import React, { useState } from 'react';
import '../HistoryTable/HistoryTableComplex.css';
import styles from './OrderHistory.module.css';
import classnames from 'classnames';
import { TextField } from '@consta/uikit/TextField';

const OrderHistory = ({
    id_order_history,
    employee,
    state_name,
    old_state_name,
    id_order,
    comment,
    date_add,
    odd_even,
    updateComment,
}) => {

    /** destructure assignment */
    const [editMode, setEditMode] = useState(false);
    const [comment_value, setComment] = useState(comment);

    const handleCommentChange = ({ value }) => setComment(value);

    const activateCommentEditMode = () => {
        setEditMode(true);
    }

    const diactivateCommentEditMode = () => {
        if (comment_value !== comment) {
            updateComment(id_order_history, comment_value);
        }
        setEditMode(false);
    }

    return (
        <div className={classnames(odd_even, styles.orderHistoryRow)}>
            <div className={classnames(styles.idOrderHistory, styles.cell)}>
                {id_order_history}
            </div>
            <div className={classnames(styles.idOrder, styles.cell)}>
                {id_order}
            </div>
            <div className={classnames(styles.oldStateName, styles.cell)}>
                {old_state_name}
            </div>
            <div className={classnames(styles.stateName, styles.cell)}>
                {state_name}
            </div>
            <div className={classnames(styles.comment, styles.cell)} >
                {editMode ? (
                    <div>
                        <TextField 
                            type="text" 
                            autoFocus={true} 
                            className={classnames(styles.commentInput)}
                            value={comment_value}
                            onBlur={diactivateCommentEditMode}
                            onChange={handleCommentChange}
                            form="brick"
                        />
                    </div>
                ) : (
                    <span
                        className={classnames(styles.commentText)}
                        onDoubleClick={activateCommentEditMode}
                        onTouchStart={activateCommentEditMode}
                    >
                        {comment}
                    </span>
                )}
            </div>
            <div className={classnames(styles.employee, styles.cell)}>
                {employee}
            </div>
            <div className={classnames(styles.dateAdd, styles.cell, styles.lastCell)}>
                {date_add}
            </div>
        </div>
    );
}

export default OrderHistory;