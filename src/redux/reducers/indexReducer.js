import { prestashopAPI } from "../../api/api";

const SET_INITIALIZED = 'react-prestashop/indexReducer/SET-INIT-APP';
const SET_ORDERS_HISTORIES = 'react-prestashop/indexReducer/SET-ORDERS-HISTORIES';
const SET_TOTAL_ORDER_HISTORIES = 'react-prestashop/indexReducer/SET-TOTAL-ORDER-HISTORIES';
const SET_TOTAL_PAGES = 'react-prestashop/indexReducer/SET-TOTAL-PAGES';
const ONCHANGE_CURRENT_PAGE = 'react-prestashop/indexReducer/ONCHANGE-CURRENT-PAGE';
const SET_IF_FETCHING = 'react-prestashop/indexReducer/SET-IS-FETCHING';
const SET_SORT = 'react-prestashop/indexReducer/SET-SORT';


const initialState = {
    initialized: false,
    table_columns: [
        {
            name: 'id_order_history',
            label: 'ID',
            filter: true,
            table_name: 'main'
        },
        {
            name: 'id_order',
            label: 'ID заказа',
            filter: true,
            table_name: 'main'
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
        },
        {
            name: 'comment',
            label: 'Причина изменения',
            filter: true,
            filter_condition: 'like',
            table_name: 'main'
        },
        {
            name: 'employee',
            label: 'Пользователь',
            filter: true,
            table_name: 'nothing',
        },
        {
            name: 'date_add',
            label: 'Дата изменения',
            filter: true,
            table_name: 'main',
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
/** ---------------- */

/** Thunk creators */
export const setOrdersHistoriesThunkCreator = (getParams, count) => async (dispatch) => {
    let response = await prestashopAPI.getOrdersHistories(getParams);
    if (response.order_histories) {
        dispatch(setOrdersHistoriesActionCreator(response.order_histories));

        dispatch(setTotalOrderHistoriesActionCreator(response.count));
        const total_pages = Math.ceil(response.count / count);
        dispatch(setTotalPagesActionCreator(total_pages));
    }
}

export const updateOrderHistoriesThunkCreator = (page_num, count, sort) => async (dispatch) => {
    const offset = parseInt((page_num - 1) * count - 1);
    let getParams = {'limit': `${offset},${count}`}
    if (parseInt(page_num) === 1) {
        getParams = {'limit': `${count}`}
    }
    getParams['sort'] = `[${sort.table_name}|${sort.orderby}-${sort.orderway}]`;
    dispatch(setIsFetchingActionCreator(true));

    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams, count));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(onChangeCurrentPageActionCreator(page_num));
    })
}

export const setSortThunkCreator = (sort, page_num, count) => async (dispatch) => {
    const offset = parseInt((page_num - 1) * count - 1);
    let getParams = {'limit': `${offset},${count}`}
    if (parseInt(page_num) === 1) {
        getParams = {'limit': `${count}`}
    }
    getParams['sort'] = `[${sort.table_name}|${sort.orderby}-${sort.orderway}]`;
    dispatch(setIsFetchingActionCreator(true));

    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams, count));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(setSortActionCreator(sort));
    })
}
/** ------------- */

export const initializeApp = (getParams = {}, count) => async (dispatch) => {
    let setOrdersHistories =  dispatch(setOrdersHistoriesThunkCreator(getParams, count, true));

    Promise.all([setOrdersHistories]).then(() => {
        dispatch(setInitializedCreator());
    })
}


