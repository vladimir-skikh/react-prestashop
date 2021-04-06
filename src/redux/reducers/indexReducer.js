import { prestashopAPI } from "../../api/api";
import { updateObjectInArray } from '../../utils/helpers/helperObject';
import { submit } from "redux-form";

const SET_INITIALIZED = 'react-prestashop/indexReducer/SET-INIT-APP';
const SET_ORDERS_HISTORIES = 'react-prestashop/indexReducer/SET-ORDERS-HISTORIES';
const SET_TOTAL_ORDER_HISTORIES = 'react-prestashop/indexReducer/SET-TOTAL-ORDER-HISTORIES';
const SET_TOTAL_PAGES = 'react-prestashop/indexReducer/SET-TOTAL-PAGES';
const ONCHANGE_CURRENT_PAGE = 'react-prestashop/indexReducer/ONCHANGE-CURRENT-PAGE';
const SET_IF_FETCHING = 'react-prestashop/indexReducer/SET-IS-FETCHING';
const SET_SORT = 'react-prestashop/indexReducer/SET-SORT';
const UPDATE_COMMENT = 'react-prestashop/indexReducer/UPDATE-COMMENT';
const IS_FILTERS_USED = 'react-prestashop/indexReducer/IS-FILTERS-USED';
const SET_FILTERS = 'react-prestashop/indexReducer/SET-FILTERS';


const initialState = {
    initialized: false,
    table_columns: [
        {
            name: 'id_order_history',
            label: 'ID',
            filter: true,
            table_name: 'main',
            type: 'number'
        },
        {
            name: 'id_order',
            label: 'ID заказа',
            filter: true,
            table_name: 'main',
            type: 'number'
        },
        {
            name: 'old_state_name',
            label: 'Старый статус',
            filter: false,
            table_name: 'osl',
        },
        {
            name: 'state_name',
            label: 'Новый статус',
            filter: true,
            table_name: 'nothing',
            filter_table: 'osl',
            filter_column: 'name',
            type: 'text',
        },
        {
            name: 'comment',
            label: 'Причина изменения',
            filter: true,
            filter_condition: 'like',
            table_name: 'main',
            type: 'text',
        },
        {
            name: 'employee',
            label: 'Пользователь',
            filter: true,
            table_name: 'nothing',
            type: 'text'
        },
        {
            name: 'date_add',
            label: 'Дата изменения',
            filter: true,
            table_name: 'main',
            type: 'date'
        },
    ],
    order_histories: [],
    total_order_histories: undefined,
    total_pages: undefined,
    current_page: 1,
    count: 20,
    sort: {
        table_name: 'main',
        orderby: 'id_order_history',
        orderway: 'DESC'
    },
    isFetching: false,
    filters: {},
    isFiltersUsed: false,
}

export const indexReducer = (state = initialState, action) => {

    let stateCopy;

    switch (action.type) {
        case SET_INITIALIZED: {
            stateCopy = {
                ...state,
                initialized: action.initialized
            }
            break;
        }
        case SET_ORDERS_HISTORIES: {
            stateCopy = {
                ...state,
                order_histories: [...action.order_histories]
            }
            break;
        }
        case SET_TOTAL_ORDER_HISTORIES: {
            stateCopy = {
                ...state,
                total_order_histories: action.total_number
            }
            break;
        }
        case ONCHANGE_CURRENT_PAGE: {
            stateCopy = {
                ...state,
                current_page: action.current_page
            }
            break; 
        }
        case SET_IF_FETCHING: {
            stateCopy = {
                ...state,
                isFetching: action.isFetching
            }
            break; 
        }
        case SET_TOTAL_PAGES: {
            stateCopy = {
                ...state,
                total_pages: action.total_pages
            }
            break; 
        }
        case SET_SORT: {
            stateCopy = {
                ...state,
                sort: {...action.sort}
            }
            break; 
        }
        case UPDATE_COMMENT: {
            stateCopy = {
                ...state,
                order_histories: updateObjectInArray(state.order_histories, action.id_order_history, 'id_order_history', {comment: action.comment})
            }
            break; 
        }
        case IS_FILTERS_USED: {
            stateCopy = {
                ...state,
                isFiltersUsed: action.isFiltersUsed
            }
            break; 
        }
        case SET_FILTERS: {
            stateCopy = {
                ...state,
                filters: {...action.filters}
            }
            break; 
        }
        default:
            stateCopy = {...state};
    }
    return stateCopy;
}

export default indexReducer;

/** Action creators */
export const setOrdersHistoriesActionCreator = (order_histories) => ({type: SET_ORDERS_HISTORIES, order_histories: order_histories});
export const setInitializedCreator = () => ({type: SET_INITIALIZED, initialized: true});
export const setTotalOrderHistoriesActionCreator = (total_number) => ({type: SET_TOTAL_ORDER_HISTORIES, total_number: total_number});
export const setTotalPagesActionCreator = (total_pages) => ({type: SET_TOTAL_PAGES, total_pages: total_pages});
export const onChangeCurrentPageActionCreator = (current_page) => ({type: ONCHANGE_CURRENT_PAGE, current_page: current_page});
export const setIsFetchingActionCreator = (isFetching) => ({type: SET_IF_FETCHING, isFetching: isFetching});
export const setSortActionCreator = (sort) => ({type: SET_SORT, sort: sort});
export const updateCommentActionCreator = (id_order_history, comment) => ({type: UPDATE_COMMENT, id_order_history: id_order_history, comment: comment});
export const setIsFiltersUsedActionCreator = (isFiltersUsed) => ({type: IS_FILTERS_USED, isFiltersUsed: isFiltersUsed});
export const setFiltersActionCreator = (filters) => ({type: SET_FILTERS, filters: filters});
/** ---------------- */

/** Thunk creators */
export const setOrdersHistoriesThunkCreator = (getParams, count) => async (dispatch) => {
    let response = await prestashopAPI.getOrdersHistories(getParams);
    if (response.order_histories !== undefined) {
        dispatch(setOrdersHistoriesActionCreator(response.order_histories));

        dispatch(setTotalOrderHistoriesActionCreator(response.count));
        const total_pages = Math.ceil(response.count / count);
        dispatch(setTotalPagesActionCreator(total_pages));
    }
    else {
        Promise.reject(response.error_msg);
    }
}

export const updateOrderHistoriesThunkCreator = (page_num, count, sort, filters, fields) => async (dispatch) => {
    const offset = parseInt((page_num - 1) * count - 1);
    let getParams = {
        'sort': `[${sort.table_name}|${sort.orderby}-${sort.orderway}]`,
        'limit': parseInt(page_num) === 1 ? `${count}` : `${offset},${count}`,
        'filter': getRequestParamsByFilters(filters, fields),
    }

    dispatch(setIsFetchingActionCreator(true));
    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams, count));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(onChangeCurrentPageActionCreator(page_num));
    })
}

export const setSortThunkCreator = (sort, page_num, count, filters, fields) => async (dispatch) => {
    const offset = parseInt((page_num - 1) * count - 1);
    let getParams = {
        'sort': `[${sort.table_name}|${sort.orderby}-${sort.orderway}]`,
        'limit': parseInt(page_num) === 1 ? `${count}` : `${offset},${count}`,
        'filter': getRequestParamsByFilters(filters, fields),
    }
    
    dispatch(setIsFetchingActionCreator(true));
    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams, count));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(setSortActionCreator(sort));
    })
}

export const updateCommentThunkCreator = (id_order_history, comment) => async (dispatch) => {
    let response_update = await prestashopAPI.updateComment(id_order_history, comment);

    if (response_update.affected_rows > 0) {
        dispatch(updateCommentActionCreator(id_order_history, comment));
    }
    else {
        Promise.reject(response_update.error_msg);
    }
}

export const setFiltersThunkCreator = (form_data, fields, sort, count) => async (dispatch) => {
    const getParams = {
        'filter': getRequestParamsByFilters(form_data, fields),
        'limit': `${count}`,
        'sort': `[${sort.table_name}|${sort.orderby}-${sort.orderway}]`
    };

    dispatch(setIsFetchingActionCreator(true));
    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams, count));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(onChangeCurrentPageActionCreator(1));
        dispatch(setFiltersActionCreator(form_data));
        dispatch(setIsFiltersUsedActionCreator(true));
    });
}

export const unsetFiltersThunkCreator = (sort, count) => async (dispatch) => {
    let getParams = {
        'limit': `${count}`,
        'sort': `[${sort.table_name}|${sort.orderby}-${sort.orderway}]`
    }
    dispatch(setIsFetchingActionCreator(true));
    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams, count));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(onChangeCurrentPageActionCreator(1));
        dispatch(setFiltersActionCreator({}));
        dispatch(setIsFiltersUsedActionCreator(false));
    });
}

// manual submit filter form
export const formSubmitThunkCreator = () => async (dispatch) => {
    const action = submit('filter');
    dispatch(action);
}
/** ------------- */
export const initializeApp = (getParams = {}, count) => async (dispatch) => {
    let setOrdersHistories =  dispatch(setOrdersHistoriesThunkCreator(getParams, count, true));

    Promise.all([setOrdersHistories]).then(() => {
        dispatch(setInitializedCreator());
    })
}


/** Other functions */
const getRequestParamsByFilters = (form_data, fields) => {
    let getParams = {};
    for (let key in form_data) {
        let name_condition_arr = key.split('||');

        for (let field of fields) {
            if (field.name === name_condition_arr[0] && form_data[key] !== '') {
                let get_params_key = '';
                if (field.filter_table !== undefined) 
                    get_params_key = `filter[${field.filter_table}|${field.filter_column}]`; 
                else
                    get_params_key = `filter[${field.table_name}|${name_condition_arr[0]}]`; 

                let value = form_data[key];

                if (name_condition_arr[1] !== undefined) {
                    if (field.filter_table !== undefined) 
                        get_params_key = `filter[${field.filter_table}|${field.filter_column}||${name_condition_arr[1]}]`; 
                    else
                        get_params_key = `filter[${field.table_name}|${name_condition_arr[0]}||${name_condition_arr[1]}]`; 
                    getParams[get_params_key] = `[${value}]`;
                }
                else getParams[get_params_key] = `%[${value}]%`;
            }
        }
    }

    return Object.keys(getParams).length > 0 ? getParams : false;
}