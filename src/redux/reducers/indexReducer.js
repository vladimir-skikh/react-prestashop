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
            name: 'id',
            label: 'ID',
            filter: true,
        },
        {
            name: 'id_order',
            label: 'ID заказа',
            filter: true,
        },
        {
            name: 'old_state_name',
            label: 'Старый статус',
            filter: false,
        },
        {
            name: 'state_name',
            label: 'Новый статус',
            filter: true,
            association: 'id_order_state'
        },
        {
            name: 'comment',
            label: 'Причина изменения',
            filter: true,
            filter_condition: 'like',
        },
        {
            name: 'employee',
            label: 'Пользователь',
            filter: true,
            association: 'id_employee',
        },
        {
            name: 'date_add',
            label: 'Дата изменения',
            filter: true,
        },
    ],
    order_histories: [],
    total_order_histories: undefined,
    total_pages: undefined,
    current_page: 1,
    count: 20,
    sort: {
        orderby: 'id',
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
export const setOrdersHistoriesThunkCreator = (getParams) => async (dispatch) => {
    let response = await prestashopAPI.getOrdersHistories(getParams);
    if (response.order_histories) {
        for (let order_history of response.order_histories) {

            // получение данных по работнику
            let response_employee = await prestashopAPI.getOrderHistoryEmployee(order_history.id_employee);
            if (response_employee.employees) {
                order_history['employee'] = `${response_employee.employees[0]['firstname']} ${response_employee.employees[0]['lastname']}`;
            }
            else if (response_employee.shops) {
                order_history['employee'] = response_employee.shops[0]['name'];
            }

            // получение данных по старому статусу
            let response_previous_state = await prestashopAPI.getPreviousState(order_history.id_order_state);
            if (response_previous_state.order_histories) {
                order_history['id_old_state'] = response_previous_state.order_histories[0]['id_order_state'];

                let response_state_name = await prestashopAPI.getOrderStateName(order_history.id_order_state, order_history['id_old_state']);

                if (response_state_name.order_states) {
                    for (let state of response_state_name.order_states) {
                        if (parseInt(state.id) === parseInt(order_history.id_order_state))
                            order_history['state_name'] = state.name;
                        else if (parseInt(state.id) === parseInt(order_history['id_old_state']))
                            order_history['old_state_name'] = state.name;
                    }
                }
            }
        }
        dispatch(setOrdersHistoriesActionCreator(response.order_histories));
    }
}

export const setTotalOrderHistoriesThunkCreator = (count) => async (dispatch) => {
    let response_total_number = await prestashopAPI.getOrdersHistoriesCount();

    if (response_total_number.order_histories) {
        dispatch(setTotalOrderHistoriesActionCreator(response_total_number.order_histories.length));
        
        const total_pages = Math.ceil(response_total_number.order_histories.length / count);
        dispatch(setTotalPagesActionCreator(total_pages));
    }
}

export const updateOrderHistoriesThunkCreator = (page_num, count, sort) => async (dispatch) => {
    const offset = parseInt((page_num - 1) * count - 1);
    let getParams = {'limit': `${offset},${count}`}
    if (parseInt(page_num) === 1) {
        getParams = {'limit': `${count}`}
    }
    getParams['sort'] = `${sort.orderby}_${sort.orderway}`;
    dispatch(setIsFetchingActionCreator(true));

    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams));

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
    getParams['sort'] = `${sort.orderby}_${sort.orderway}`;
    dispatch(setIsFetchingActionCreator(true));

    let updateOrderHistories = dispatch(setOrdersHistoriesThunkCreator(getParams));

    Promise.all([updateOrderHistories]).then(() => {
        dispatch(setIsFetchingActionCreator(false));
        dispatch(onChangeCurrentPageActionCreator(page_num));
        dispatch(setSortActionCreator(sort));
    })
}
/** ------------- */

export const initializeApp = (getParams = {}, count) => async (dispatch) => {
    let setOrdersHistories =  dispatch(setOrdersHistoriesThunkCreator(getParams));
    let setTotalOrderHistories = dispatch(setTotalOrderHistoriesThunkCreator(count));

    Promise.all([setOrdersHistories, setTotalOrderHistories]).then(() => {
        dispatch(setInitializedCreator());
    })
}


