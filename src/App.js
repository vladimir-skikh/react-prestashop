import React from 'react';
import store from "./redux/reduxStore";
import  { initializeApp } from './redux/reducers/indexReducer';
import { connect, Provider } from 'react-redux';
import HistoryTable from './componets/HistoryTable/HistoryTable';
import Preloader from "./componets/common/Preloader/Preloader";


class App extends React.Component {

    catchAllUnhandledErrors = (promiseRejectionEvent) => {
        alert(promiseRejectionEvent.reason);
    }

    componentDidMount() {
        const getParams = {
            'limit': this.props.count,
            'sort': `[${this.props.sort.orderby}_${this.props.sort.orderway}]`,
        }        

        this.props.initializeApp(getParams, this.props.count);
        window.addEventListener("unhandledrejection", this.catchAllUnhandledErrors);
    }

    componentWillUnmount() {
        window.removeEventListener("unhandledrejection", this.catchAllUnhandledErrors);
    }

    render() {
        if (!this.props.isInitialized) {
            return <Preloader />;
        }
        return (
            <div>
                <HistoryTable />
            </div>
        );
    }
}


let mapStateToProps = (state) => {
    return {
        isInitialized: state.indexReducer.initialized,
        count: state.indexReducer.count,
        sort: state.indexReducer.sort
    }
}

let actionCreators = {
    initializeApp: initializeApp,
}

const AppContainer =  connect(mapStateToProps, actionCreators)(App);

const MainApp = (props) => {
    return (
        <Provider store={store}>
            <AppContainer store={store} />
        </Provider>
    )
}

export default MainApp;
