import React, { Component } from 'react';
import _ from 'lodash';
import '../styles/App.css';

class VendorCard extends Component {
    render() {
        const vendor = this.props.vendor;
        return (
            <div className="Card" onClick={_.partial(this.props.onSelect, vendor.id)}>
                <div className="Brand-image-wrapper">
                    <img className="Brand-image" src={vendor.image_url} alt="Brand" />
                </div>
                <h4>{vendor.name}</h4>
            </div>
        );
    }
}

export default VendorCard;
