import axios from 'axios';

/**
 * prestashop web service API key
 */ 
//const api_key = 'LCVMKBTLRB8XP7NKT4C4QMP361IWKR8X';

/* const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://strategshop/api/',
    params: {
        ws_key: api_key,
        io_format: 'JSON',
    },
}); */

const instanceModule = axios.create({
    //withCredentials: true,
    baseURL: 'https://strategshop/module/pworderhistories/orderhistories',
})

export const prestashopAPI = {

    getOrdersHistories: async (getParams = {}) => {
        let params = {
            'method': 'getOrderHistories',
            'limit': getParams['limit'] ? getParams['limit'] : 20,
            'display': 'full',
            'sort': getParams['sort'] ? getParams['sort'] : '[main|id_order_history-DESC]',
            'filter[main|id_employee]': `![0]`
        };

        if (getParams['filter']) {
            params = {...params, ...getParams['filter']}
        }

        return instanceModule.get(``, {params: params}).then( response => {
            return response.data;
        });
    },

    updateComment: async (id_order_history, comment) => {
        let postParams = {
            'method': 'updateComment',
            'id_order_history': id_order_history,
            'comment': comment,
        }
        return instanceModule.put(``, postParams).then( response => {
            return response.data;
        });
    }
}