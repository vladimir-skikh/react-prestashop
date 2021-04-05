import React from 'react';
import style from './FormControls.module.css';

/** используется деструктуризация (rest оператор) */
const FromControl= ({
    children, 
    formControlProps
}) => {
    return (
        <div className={
            style.formControl + ' ' 
            + formControlProps.wrapperClassName
        }>
            {children}
        </div>
    );
}

export const Textarea = (props) => {
    const {input, meta, ...restProps} = props;

    const formControlProps = {
        inputClassName: props.inputClassName ? props.inputClassName : '',
        wrapperClassName: props.wrapperClassName ? props.wrapperClassName : '',
    }

    return <FromControl 
        {...props} 
        input={input}
        formControlProps={formControlProps}
    > 
        <textarea {...input} {...restProps} className={formControlProps.inputClassName}/> 
    </FromControl>
}

export const Input = (props) => {
    const {input, meta, ...restProps} = props;

    const formControlProps = {
        inputClassName: props.inputClassName ? props.inputClassName : '',
        wrapperClassName: props.wrapperClassName ? props.wrapperClassName : '',
    }

    return <FromControl 
        input={input}
        formControlProps={formControlProps}
    > 
        <input {...input} {...restProps} className={formControlProps.inputClassName}/> 
    </FromControl>
}