import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import NavigateNext from 'material-ui/svg-icons/image/navigate-next';
import NavigateBefore from 'material-ui/svg-icons/image/navigate-before';
import '../styles/App.css';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class Pagination extends Component {
    renderPagination() {
        const offset = this.props.pagination.offset;
        const results = this.props.pagination.results;
        const total = this.props.pagination.total;
        const limit = this.props.pagination.limit;
        return (
            <div className="Brand-pagination">
                <div>
                    <DropDownMenu value={limit} onChange={this.props.changeLimit}>
                        <MenuItem value={4} primaryText="4"/>
                        <MenuItem value={8} primaryText="8"/>
                        <MenuItem value={12} primaryText="12"/>
                        <MenuItem value={16} primaryText="16"/>
                    </DropDownMenu>
                </div>
                <div className="Brand-pagination-centered">
                    <span>{offset + 1} - {offset + results} / { total }</span>
                    <IconButton  onClick={this.props.next}>
                        <NavigateBefore/>
                    </IconButton>
                    <IconButton  onClick={this.props.prev}>
                        <NavigateNext/>
                    </IconButton>
                </div>
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
