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
import BrandCard from './BrandCard';

import '../styles/App.css';

const backendBaseUrl = 'http://localhost:3000';
const redemptionOptions = {EMBEDDED: 1, EMAIL: 2};

class App extends Component {
    state = {
        selectedRegion: 2,
        regions: [],
        minPrice: 0,
        maxPrice: 10000,
        brandSearch: "",
        brands: [],
        selectedBrandId: null,
        brandsPagination: { limit: 4, offset: 0 },
        gifts: [],
        selectedGiftPrice: 0,
        redemptionOption: redemptionOptions.EMBEDDED,
        embeddedGiftLink: null
    };

    constructor(props) {
        super(props);
        this.getBrands = this.getBrands.bind(this);
        this.getRegions = this.getRegions.bind(this);
        this.getMarketplaceGifts = this.getMarketplaceGifts.bind(this);
        this.sendCampaign = this.sendCampaign.bind(this);
        this.sendEmbeddedCampaign = this.sendEmbeddedCampaign.bind(this);
        this.setGiftPriceAndSendCampaign = this.setGiftPriceAndSendCampaign.bind(this);
        this.handleRegionChange = this.handleRegionChange.bind(this);
        this.handleRedemptionOptionChange = this.handleRedemptionOptionChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePaginationNext = this.handlePaginationNext.bind(this);
        this.handlePaginationPrev = this.handlePaginationPrev.bind(this);
        this.handlePaginationLimitChange = this.handlePaginationLimitChange.bind(this);
        this.handleBrandSelect = this.handleBrandSelect.bind(this);
        this.handleGiftsDialogClose = this.handleGiftsDialogClose.bind(this);
        this.handleEmbeddedRedemptionDialogClose = this.handleEmbeddedRedemptionDialogClose.bind(this);
        this.handleSelectedGiftPriceChange = this.handleSelectedGiftPriceChange.bind(this);
        this.isGiftInPriceRange = this.isGiftInPriceRange.bind(this);
    }

    componentDidMount() {
        this.getBrands();
        this.getRegions();
    }

    alertError(endpoint){
        alert(`${endpoint} ERROR! check console to see giftbit's response`)
    }

    isErrorResponse(response) {
        return response.data.error || response.data.status >= 400
    }

    getBrands() {
        const brandParams = {
            region: this.state.selectedRegion,
            min_price_in_cents: this.state.minPrice,
            max_price_in_cents: this.state.maxPrice,
            search: this.state.brandSearch,
            limit: this.state.brandsPagination.limit,
            offset: this.state.brandsPagination.offset
        };
        const queryParams = queryString.stringify(brandParams);
        const url = `${backendBaseUrl}/brands?${queryParams}`;
        console.log("GET", url);
        axios.get(url).then( (response) => {
            console.log("RESPONSE /brands", response.data);
            if (!response.data.error) {
                const brands = response.data.brands;
                const brandsPagination = {};
                brandsPagination.total = response.data.total_count;
                brandsPagination.limit = response.data.limit;
                brandsPagination.offset = response.data.offset;
                brandsPagination.results = response.data.number_of_results;

                this.setState({brands, brandsPagination});
            } else {
                this.alertError("BRANDS")
            }
        });
    }

    getMarketplaceGifts() {
        if (this.state.selectedBrandId) {
            const brandParams = {
                region: this.state.selectedRegion,
                min_price_in_cents: this.state.minPrice,
                max_price_in_cents: this.state.maxPrice,
                brand: this.state.selectedBrandId
            };
            const queryParams = queryString.stringify(brandParams);
            const url = `${backendBaseUrl}/marketplaceGifts?${queryParams}`;
            console.log("GET", url);
            axios.get(url).then( (response) => {
                console.log("RESPONSE /marketplaceGifts", response.data);
                if (!this.isErrorResponse(response)) {
                    this.setState({ gifts: response.data.marketplace_gifts });
                } else {
                    this.alertError("MARKETPLACEGIFTS")
                }
            });
        }
    }

    getRegions() {
        const url = `${backendBaseUrl}/regions`;
        console.log("GET", url);
        axios.get(url).then( (response) => {
            console.log("RESPONSE /regions", response.data);
            if (!this.isErrorResponse(response)) {
                const regions = response.data.regions;
                this.setState({regions});
            } else {
                this.alertError("REGIONS")
            }
        });
    }

    setGiftPriceAndSendCampaign(selectedGiftPrice, giftId) {
        this.setState({ selectedGiftPrice }, () => this.sendCampaign(giftId))
    }

    sendCampaign(giftId) {
        this.handleGiftsDialogClose()
        if (this.state.redemptionOption === redemptionOptions.EMBEDDED) {
            this.sendEmbeddedCampaign(giftId)
        } else {
            const url = `${backendBaseUrl}/campaign`;
            const body = {
                marketplace_gifts: [{
                    id: giftId,
                    "price_in_cents": parseInt(this.state.selectedGiftPrice, 10)
                }]
            };
            console.log("POST", url, body);
            console.log("more parameters are appended by backend before being sent to giftbit");
            axios.post(url, body).then((response) => {
                console.log("RESPONSE /marketplace", response.data);
                if (!this.isErrorResponse(response)) {
                    alert("campaign has been sent!");
                } else {
                    this.alertError("CAMPAIGN")
                }
            })
        }
    }

    sendEmbeddedCampaign(giftId) {
        const url = `${backendBaseUrl}/embedded`;
        const body = {
            marketplace_gift: {id: giftId, "price_in_cents": parseInt(this.state.selectedGiftPrice, 10)}
        };
        console.log("POST", url, body);
        axios.post(url, body).then((response) => {
            console.log("RESPONSE /embedded", response.data);
            if (!this.isErrorResponse(response)) {
                const embeddedGiftLink = response.data.gift_link;
                this.setState({embeddedGiftLink});
            } else {
                this.alertError("EMBEDDED")
            }
        })
    }

    handleRegionChange(event, index, value) {
        this.setState({selectedRegion: value}, () => this.getBrands());
    }

    handleRedemptionOptionChange(event, index, value) {
        this.setState({redemptionOption: value});
    }

    handleBrandSelect(selectedBrandId) {
        this.setState({ selectedBrandId }, () => this.getMarketplaceGifts() );
    }

    handlePaginationNext(){
        const brandsPagination = this.state.brandsPagination;
        const nextPageSizeExceedsTotalResults = Math.max(0, brandsPagination.total - brandsPagination.limit);
        const nextPageWithinResults = brandsPagination.offset + brandsPagination.limit;

        brandsPagination.offset  = Math.min(nextPageSizeExceedsTotalResults, nextPageWithinResults);
        this.setState({ brandsPagination }, () => this.getBrands());
    }

    handlePaginationPrev(){
        const brandsPagination = this.state.brandsPagination;
        const prevPageWithinResults = brandsPagination.offset - brandsPagination.limit;

        brandsPagination.offset = Math.max(0, prevPageWithinResults);
        this.setState({ brandsPagination }, () => this.getBrands());
    }

    handlePaginationLimitChange(event, index, value) {
        const brandsPagination = this.state.brandsPagination;
        brandsPagination.limit = value;
        console.log(value);
        this.setState({ brandsPagination }, () => this.getBrands());

    }

    handleInputChange(field, event) {
        const stateToUpdate = {};
        stateToUpdate[field] = event.target.value;
        this.setState(stateToUpdate);
    }

    handleSelectedGiftPriceChange(event) {
        const selectedGiftPrice = event.target.value;
        this.setState({ selectedGiftPrice });
    }

    handleGiftsDialogClose(){
        this.setState({gifts: [], selectedBrandId: null})
    }

    handleEmbeddedRedemptionDialogClose(){
        this.setState({embeddedGiftLink: null})
    }

    isGiftInPriceRange(priceInCents) {
        return (this.state.minPrice <= priceInCents) && (priceInCents <= this.state.maxPrice)
    }

    renderBrandList() {
        return (
            <div className="Grid">
                {
                    this.state.brands.map( (brand) => {
                        return <BrandCard brand={brand} onSelect={this.handleBrandSelect} key={brand.brand_code}/>
                    })
                }
            </div>
        );
    }


    renderParameterOptions() {
        return (
            <div className="Parameters">
                <DropDownMenu value={this.state.redemptionOption} onChange={this.handleRedemptionOptionChange} style={{width: 240}}>
                    <MenuItem value={redemptionOptions.EMBEDDED} primaryText="Embedded Redemption"/>
                    <MenuItem value={redemptionOptions.EMAIL} primaryText="Email Redemption"/>
                </DropDownMenu>
                <DropDownMenu value={this.state.selectedRegion} onChange={this.handleRegionChange} style={{width: 150}}>
                    {this.state.regions.map( (region) => {
                        return (
                            <MenuItem key={region.id} value={region.id} primaryText={region.name} />
                        )
                    })}
                </DropDownMenu>
                <TextField
                    floatingLabelText="Min Price In Cents"
                    onBlur={this.getBrands}
                    onChange={_.partial(this.handleInputChange, "minPrice")}
                    value={this.state.minPrice}
                    style={{width: 150}}
                />
                <TextField
                    floatingLabelText="Max Price In Cents"
                    onBlur={this.getBrands}
                    onChange={_.partial(this.handleInputChange, "maxPrice")}
                    value={this.state.maxPrice}
                    style={{width: 150}}
                />
                <TextField
                    floatingLabelText="Search"
                    onBlur={this.getBrands}
                    onChange={_.partial(this.handleInputChange, "brandSearch")}
                    value={this.state.brandSearch}
                />

            </div>
        )
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
                                    Select Gift In Cents`
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

    renderEmbeddedRedemptionDialog(){
        return (
            <Dialog
                title="Your Gift"
                open={this.state.embeddedGiftLink !== null}
                onRequestClose={this.handleEmbeddedRedemptionDialogClose}
                autoScrollBodyContent={true}
            >
                <div className="Centered">
                    <iframe src={this.state.embeddedGiftLink} width="400" height="550" title="embedded redemption"/>
                </div>
            </Dialog>
        )
    }

    renderStateForDebugging() {
        return (
            <pre>
                {JSON.stringify(this.state, null, 2)}
            </pre>
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
                            <h3>Brands</h3>
                            <hr/>
                            <Pagination next={this.handlePaginationPrev} prev={this.handlePaginationNext} changeLimit={this.handlePaginationLimitChange} pagination={this.state.brandsPagination}/>
                            { this.renderBrandList() }
                        </div>
                        {this.renderGiftsDialog()}
                        {this.renderEmbeddedRedemptionDialog()}
                        <div className="App-section State-debugging"> {/* comment this out to remove state on screen */}
                            <h3>Current React State (for debugging)</h3>
                            <hr/>
                            {this.renderStateForDebugging()}
                        </div>
                    </div>

                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
