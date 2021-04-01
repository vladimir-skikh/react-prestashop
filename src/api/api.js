import axios from 'axios';

/**
 * prestashop web service API key
 */ 
const api_key = 'LCVMKBTLRB8XP7NKT4C4QMP361IWKR8X';

const instance = axios.create({
    withCredentials: true,
    baseURL: 'http://strategshop/api/',
    params: {
        ws_key: api_key,
        io_format: 'JSON',
    },
});

export const prestashopAPI = {
    getOrdersHistories: async (getParams = {}) => {
        const params = {
            'limit': getParams['limit'] ? getParams['limit'] : 20,
            'display': 'full',
            'sort': getParams['sort'] ? getParams['sort'] : '[id_DESC]',
            'filter[id_employee]': `![0]`
        };

        return instance.get(`order_histories`, {params: params}).then( response => {
            return response.data;
        });
    },
    getOrdersHistoriesCount: async () => {
        const params = {
            'filter[id_employee]':  `![0]`
        };

        return instance.get(`order_histories`, {params: params}).then( response => {
            return response.data;
        });
    },
    getOrderHistoryEmployee: async (id_employee) => {
        let endpoint = 'employees';
        let params = {
            'display': '[firstname, lastname]',
            'filter[id]':  `[${id_employee}]`
        };
        
        if (parseInt(id_employee) === 0) {
            endpoint = 'shops';
            params = {
                'display': '[name]',
                'filter[id]':  `[1]`,
            };
        }

        return instance.get(endpoint, {params: params}).then( response => {
            return response.data;
        });        
    },
    getPreviousState: async (id_order_state) => {
        let params = {
            'display': '[id_order_state]',
            'limit': 1,
            'filter[id_order_state]':  `<[${id_order_state}]`,
            'sort': '[id_order_state_DESC]'
        };

        return instance.get(`order_histories`, {params: params}).then( response => {
            return response.data;
        }); 
    },
    getOrderStateName: async (id_order_state, id_old_state) => {
        let endpoint = 'order_states';
        let params = {
            'display': '[id,name]',
            'filter[id]':  `[${id_order_state}|${id_old_state}]`,
        };

        return instance.get(endpoint, {params: params}).then( response => {
            return response.data;
        }); 
    },
    getShopId: async () => {

    },
    /* updateComment: async (id_order_history = 165, comment = 'Новый коммент') => {
        let postParams = {
            "id": 165,
            "id_employee": "2",
            "id_order_state": "10",
            "id_order": "26",
            "comment": comment,
            "date_add": "2021-03-15 12:13:05"
        }
        return instance.put(`order_histories/${id_order_history}`, JSON.stringify(postParams)).then( response => {
            return response.data;
        });
    } */
}