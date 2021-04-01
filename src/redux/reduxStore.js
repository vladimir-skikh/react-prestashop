import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from 'redux-thunk';
import indexReducer from './reducers/indexReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

let rootReducer = combineReducers({
    indexReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export default store;
