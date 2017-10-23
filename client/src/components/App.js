import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import axios from 'axios';
import queryString from 'query-string';

import logo from '../res/giftbit.svg';
import Pagination from './Pagination';
import VendorCard from './VendorCard';

import '../styles/App.css';

const backendBaseUrl = 'http://localhost:3000';

class App extends Component {
    state = {
        selectedRegion: 2,
        regions: [],
        minPrice: 0,
        maxPrice: 1000,
        vendorSearch: "",
        vendors: [],
        selectedVendorId: null,
        vendorsPagination: { limit: 10, offset: 0 },
        gifts: [],
        selectedGiftPrice: 0
    };

    constructor(props) {
        super(props);
        this.getVendors = this.getVendors.bind(this);
        this.getRegions = this.getRegions.bind(this);
        this.getMarketplaceGifts = this.getMarketplaceGifts.bind(this);
        this.sendCampaign = this.sendCampaign.bind(this);
        this.setGiftPriceAndSendCampaign = this.setGiftPriceAndSendCampaign.bind(this);
        this.handleRegionChange = this.handleRegionChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePaginationNext = this.handlePaginationNext.bind(this);
        this.handlePaginationPrev = this.handlePaginationPrev.bind(this);
        this.handleVendorSelect = this.handleVendorSelect.bind(this);
        this.handleGiftsDialogClose = this.handleGiftsDialogClose.bind(this);
        this.handleSelectedGiftPriceChange = this.handleSelectedGiftPriceChange.bind(this);
        this.isGiftInPriceRange = this.isGiftInPriceRange.bind(this);

    }

    componentDidMount() {
        this.getVendors();
        this.getRegions();
    }

    getVendors() {
        const vendorParams = {
            region: this.state.selectedRegion,
            min_price_in_cents: this.state.minPrice,
            max_price_in_cents: this.state.maxPrice,
            search: this.state.vendorSearch,
            limit: this.state.vendorsPagination.limit,
            offset: this.state.vendorsPagination.offset
        };
        const queryParams = queryString.stringify(vendorParams);
        axios.get(`${backendBaseUrl}/vendors?${queryParams}`).then( (response) => {
            const vendors = response.data.vendors;
            const vendorsPagination = {};
            vendorsPagination.total = response.data.total_count;
            vendorsPagination.limit = response.data.limit;
            vendorsPagination.offset = response.data.offset;
            vendorsPagination.results = response.data.number_of_results;

            this.setState({ vendors, vendorsPagination });
        });
    }

    getMarketplaceGifts() {
        if (this.state.selectedVendorId) {
            const vendorParams = {
                region: this.state.selectedRegion,
                min_price_in_cents: this.state.minPrice,
                max_price_in_cents: this.state.maxPrice,
                vendor: this.state.selectedVendorId
            };
            const queryParams = queryString.stringify(vendorParams);
            axios.get(`${backendBaseUrl}/marketplaceGifts?${queryParams}`).then( (response) => {
                this.setState({ gifts: response.data.marketplace_gifts });
            });
        }
    }

    getRegions() {
        axios.get(`${backendBaseUrl}/regions`).then( (response) => {
            const regions = response.data.regions;
            this.setState({ regions });
        });
    }

    setGiftPriceAndSendCampaign(selectedGiftPrice, giftId) {
        this.setState({ selectedGiftPrice }, () => this.sendCampaign(giftId))
    }

    sendCampaign(giftId) {
        axios.post(`${backendBaseUrl}/campaign`, {
            marketplace_gifts: [{
                id: giftId,
                "price_in_cents": parseInt(this.state.selectedGiftPrice, 10)
            }]
        }).then((response) => {
            alert("campaign has been sent!");
        })
    }

    handleRegionChange(event, index, value) {
        this.setState({selectedRegion: value}, () => this.getVendors());
    }

    handleVendorSelect(selectedVendorId) {
        this.setState({ selectedVendorId }, () => this.getMarketplaceGifts() );
    }

    handlePaginationNext(){
        const vendorsPagination = this.state.vendorsPagination;
        const nextPageSizeExceedsTotalResults = Math.max(0, vendorsPagination.total - vendorsPagination.limit);
        const nextPageWithinResults = vendorsPagination.offset + vendorsPagination.limit;

        vendorsPagination.offset  = Math.min(nextPageSizeExceedsTotalResults, nextPageWithinResults);
        this.setState({ vendorsPagination }, () => this.getVendors());
    }

    handlePaginationPrev(){
        const vendorsPagination = this.state.vendorsPagination;
        const prevPageWithinResults = vendorsPagination.offset - vendorsPagination.limit;

        vendorsPagination.offset = Math.max(0, prevPageWithinResults);
        this.setState({ vendorsPagination }, () => this.getVendors());
    }

    handleInputChange(field, event) {
        const stateToUpdate = {};
        stateToUpdate[field] = event.target.value;
        this.setState(stateToUpdate);
    }

    handleSelectedGiftPriceChange(event) {
        const selectedGiftPrice = event.target.value;
        if (this.isGiftInPriceRange(selectedGiftPrice)) {
            this.setState({ selectedGiftPrice });
        }
    }

    handleGiftsDialogClose(){
        this.setState({gifts: [], selectedVendorId: null})
    }


    renderVendorList() {
        return (
            <div className="Grid">
                {
                    this.state.vendors.map( (vendor) => {
                        return <VendorCard vendor={vendor} onSelect={this.handleVendorSelect} key={vendor.id}/>
                    })
                }
            </div>
        );
    }


    renderParameterOptions() {
        return (
            <div className="Parameters">
                <DropDownMenu value={this.state.selectedRegion} onChange={this.handleRegionChange} style={{width: 150}}>
                    {this.state.regions.map( (region) => {
                        return (
                            <MenuItem key={region.id} value={region.id} primaryText={region.name} />
                        )
                    })}
                </DropDownMenu>
                <TextField
                    floatingLabelText="Min Price In Cents"
                    onBlur={this.getVendors}
                    onChange={_.partial(this.handleInputChange, "minPrice")}
                    value={this.state.minPrice}
                    style={{width: 150}}
                />
                <TextField
                    floatingLabelText="Max Price In Cents"
                    onBlur={this.getVendors}
                    onChange={_.partial(this.handleInputChange, "maxPrice")}
                    value={this.state.maxPrice}
                    style={{width: 150}}
                />
                <TextField
                    floatingLabelText="Search"
                    onBlur={this.getVendors}
                    onChange={_.partial(this.handleInputChange, "vendorSearch")}
                    value={this.state.vendorSearch}
                />

            </div>
        )
    }

    isGiftInPriceRange(priceInCents) {
        return (this.state.minPrice <= priceInCents) && (priceInCents <= this.state.maxPrice)
    }

    renderGiftPriceOptions(gift){
        const buttonStyle = {margin: 12};
        if (gift.prices_in_cents) {
            return (
                <div>
                    {
                        gift.prices_in_cents
                            .filter(this.isGiftInPriceRange)
                            .map( (priceInCents, index) => {
                                return <RaisedButton key={index} label={priceInCents} style={buttonStyle} onClick={_.partial(this.setGiftPriceAndSendCampaign, priceInCents, gift.id)}/>
                            })
                    }
                </div>
            )
        }
        else {
            return (
                <div>
                    <TextField
                        floatingLabelText={`${gift.min_price_in_cents} - ${Math.min(gift.max_price_in_cents, this.state.maxPrice)}`}
                        onChange={this.handleSelectedGiftPriceChange}
                        value={this.state.selectedGiftPrice}
                        style={{width: 100}}
                    />
                    <FlatButton label="Send Gift" style={buttonStyle} onClick={_.partial(this.sendCampaign, gift.id)}/>
                </div>
            )
        }
    }

    renderGiftsDialog(){
        return (
            <Dialog
                title="Select a Gift"
                open={this.state.gifts.length > 0}
                onRequestClose={this.handleGiftsDialogClose}
                autoScrollBodyContent={true}
            >
                <div className="Grid">
                    {
                        this.state.gifts.map( (gift) => {
                            return (
                                <div className="Card Wide" key={gift.id}>
                                    <div className="Brand-image-wrapper">
                                        <img className="Brand-image"  src={gift.image_url} alt="Brand"/>
                                    </div>
                                    <h4>{gift.name}</h4>
                                    <hr/>
                                    Select Gift In Cents
                                    <div className="Grid">
                                        {this.renderGiftPriceOptions(gift)}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Dialog>
        )
    }

    render() {
        return (
            <MuiThemeProvider>

                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="Logo" />
                        <h1 className="App-title">Giftbit Interactive Marketplace Example</h1>
                    </header>
                    <div className="Container">
                        <div className="App-section">
                            <h3>Parameters (blur to update)</h3>
                            <hr/>
                            {this.renderParameterOptions()}
                        </div>
                        <div className="App-section">
                            <h3>Vendors</h3>
                            <hr/>
                            <Pagination next={this.handlePaginationPrev} prev={this.handlePaginationNext} pagination={this.state.vendorsPagination}/>
                            { this.renderVendorList() }
                        </div>
                        {this.renderGiftsDialog()}
                    </div>

                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
