import React from 'react';
import classnames from 'classnames';
import styles from './FilterModal.module.css';
import SearchIcon from "../../../img/search-icon.svg";
import SearchIconMinus from "../../../img/search-icon-minus.svg";
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { connect } from 'react-redux';
import { Field, reduxForm } from "redux-form";
import { Input } from '../FormControls/FormControls';
import { formSubmitThunkCreator, setFiltersThunkCreator, unsetFiltersThunkCreator } from '../../../redux/reducers/indexReducer';

const FilterModalForm = (props) => {
    const onManualSubmitForm = async () => {
        props.formSubmit();
    }

    return(
        <div className={styles.filterModal}>
            {
                props.fields.map( (field, index) => {
                    if (field.filter) {
                        return(
                            <div className={classnames(
                                styles.modalInputBlock
                            )} key={index}>
                                <div className={classnames(styles.modalInputLabel)}>
                                    {field.label}
                                </div>
                                <div className={classnames(styles.modalInputsList)}>
                                    {
                                        field.type === 'number' 
                                        ?
                                            <div className={styles.filterInputsList}>
                                                <Field
                                                    type="number"
                                                    component={Input}
                                                    wrapperClassName={styles.filterFormWrapper}
                                                    inputClassName={classnames(styles.filterFormInput, styles.filterInputNumber)}
                                                    placeholder="Равен"
                                                    name={field.name}
                                                />
                                                <span className={styles.filterInputDelimeter}>
                                                    Или
                                                </span>
                                                <Field
                                                    type="number"
                                                    component={Input}
                                                    wrapperClassName={styles.filterFormWrapper}
                                                    inputClassName={classnames(styles.filterFormInput, styles.filterInputNumber)}
                                                    placeholder="От"
                                                    name={field.name + '||range-from'}
                                                />
                                                <span className={styles.filterInputDelimeter}>
                                                    -
                                                </span>
                                                <Field
                                                    type="number"
                                                    component={Input}
                                                    wrapperClassName={styles.filterFormWrapper}
                                                    inputClassName={classnames(styles.filterFormInput, styles.filterInputNumber)}
                                                    placeholder="До"
                                                    name={field.name + '||range-to'}
                                                />
                                                <span className={styles.filterInputDelimeter}>
                                                    Или
                                                </span>
                                                <Field
                                                    type="text"
                                                    component={Input}
                                                    wrapperClassName={styles.filterFormWrapper}
                                                    inputClassName={styles.filterFormInput}
                                                    placeholder="Значения через запятую"
                                                    name={field.name + '||wherein'}
                                                />
                                            </div>
                                        :
                                            <Field
                                                type="text"
                                                component={Input}
                                                wrapperClassName={styles.filterFormWrapper}
                                                inputClassName={styles.filterFormInput}
                                                placeholder="Содержит"
                                                name={field.name}
                                            />
                                    }
                                </div>
                            </div>
                        )
                    }
                    else return ''
                })
            }
            <div className={classnames(styles.formFooter)}>
                <Button
                    size="m"
                    view="primary"
                    label="Применить"
                    width="default"
                    className={styles.filterSubmit}
                    onClick={onManualSubmitForm}
                />
            </div>
        </div>
    );
}

let FilterModalReduxForm = reduxForm({
    form: "filter",
})(FilterModalForm);

const FilterModal = ({
    fields,
    isFiltersUsed,
    formSubmit,
    setFilters,
    unsetFilters,
    sort,
    count
}) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isFiltersEmpty, setIsFiltersEmpty] = React.useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
        setIsFiltersEmpty(false);
    }

    // TODO перенести логику формирования параметров в thunk'у
    const onSubmit = (form_data) => {
        let form_values = [];
        let getParams = {};
        for (let key in form_data) {
            let name_condition_arr = key.split('||');

            for (let field of fields) {
                if (field.name === name_condition_arr[0]) {
                    let get_params_key = `filter[${field.table_name}|${name_condition_arr[0]}]`; 
                    let value = form_data[key];

                    if (name_condition_arr[1] !== undefined) {
                        get_params_key = `filter[${field.table_name}|${name_condition_arr[0]}||${name_condition_arr[1]}]`; 
                        getParams[get_params_key] = `[${value}]`;
                    }
                    else getParams[get_params_key] = `%[${value}]%`;

                    form_values.push(key);
                }
            }
        }
        if (form_values.length > 0) {
            setFilters(getParams, sort, count);
            closeModal();
        }
        else {
            setIsFiltersEmpty(true);
        }
    }

    const onUnsetFilters = () => {
        unsetFilters(sort, count);
    }

    return (
        <div>
            {
                isFiltersUsed 
                ? <img src={SearchIconMinus} alt="" className="searchButton" onClick={onUnsetFilters}/>
                : <img src={SearchIcon} alt="" className="searchButton" onClick={() => setIsModalOpen(true)}/>
            }
            <Modal
                isOpen={isModalOpen}
                hasOverlay
                onOverlayClick={closeModal}
                className={classnames(styles.modalWindow)}
            >
                <div className={classnames(styles.modalHeader)}>
                    <div className={classnames(styles.modalTitle)}>
                        Фильтр по значениям
                        {
                            isFiltersEmpty ?
                            <div className={styles.modalFiltersEmpty}>
                                Ни один из фильтров не задан
                            </div> : ''
                        }
                    </div>
                    <span className={styles.modalClose} onClick={closeModal}>&times;</span>
                </div>
                <div className={classnames(styles.modalBody)}>
                    <FilterModalReduxForm fields={fields} onSubmit={onSubmit} formSubmit={formSubmit}/>
                </div>
            </Modal>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        isFiltersUsed: state.indexReducer.isFiltersUsed,
        fields: state.indexReducer.table_columns,
        count: state.indexReducer.count,
        sort: state.indexReducer.sort
    }
}

const actionCreators = {
    formSubmit: formSubmitThunkCreator,
    setFilters: setFiltersThunkCreator,
    unsetFilters: unsetFiltersThunkCreator,
}

export default connect(mapStateToProps, actionCreators)(FilterModal);