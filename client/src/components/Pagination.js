import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import NavigateNext from 'material-ui/svg-icons/image/navigate-next';
import NavigateBefore from 'material-ui/svg-icons/image/navigate-before';
import '../styles/App.css';

class Pagination extends Component {
    renderPagination() {
        const offset = this.props.pagination.offset;
        const results = this.props.pagination.results;
        const total = this.props.pagination.total;
        return (
            <div className="Vendor-pagination">
                <span>{offset + 1} - {offset + results} / { total }</span>
                <IconButton  onClick={this.props.next}>
                    <NavigateBefore/>
                </IconButton>
                <IconButton  onClick={this.props.prev}>
                    <NavigateNext/>
                </IconButton>
            </div>
        );
    }
    render() {
        if (this.props.pagination.results ) {
            return this.renderPagination();
        }
        return <div></div>;
    }
}

export default Pagination;
