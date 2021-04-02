import React from 'react';
import { connect } from 'react-redux';
import HistoryTable from './HistoryTable';
import { updateOrderHistoriesThunkCreator, setSortThunkCreator } from '../../redux/reducers/indexReducer';

class HistoryTableApiContainer extends React.Component {

    onChangeSort = (sort,current_page,count) => {
        this.props.changeSort(sort, current_page, count);
    }

    render() {
        return(
            <HistoryTable 
                table_columns={this.props.table_columns}
                order_histories={this.props.order_histories}
                current_page={this.props.current_page}
                total_pages={this.props.total_pages}
                count={this.props.count}
                sort={this.props.sort}
                isFetching={this.props.isFetching}
                changeSort={this.onChangeSort}
                updateData={this.props.updateData}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        table_columns: state.indexReducer.table_columns,
        order_histories: state.indexReducer.order_histories,
        current_page: state.indexReducer.current_page,
        total_pages: state.indexReducer.total_pages,
        count: state.indexReducer.count,
        sort: state.indexReducer.sort,
        isFetching: state.indexReducer.isFetching,
    }
}
const actionCreators = {
    updateData: updateOrderHistoriesThunkCreator,
    changeSort: setSortThunkCreator,
}

export default connect(mapStateToProps, actionCreators)(HistoryTableApiContainer);