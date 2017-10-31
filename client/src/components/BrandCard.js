import React, { Component } from 'react';
import _ from 'lodash';
import '../styles/App.css';

class BrandCard extends Component {
    render() {
        const brand = this.props.brand;
        return (
            <div className="Card" onClick={_.partial(this.props.onSelect, brand.brand_code)}>
                <div className="Brand-image-wrapper">
                    <img className="Brand-image" src={brand.image_url} alt="Brand" />
                </div>
                <h4>{brand.name}</h4>
            </div>
        );
    }
}

export default BrandCard;
