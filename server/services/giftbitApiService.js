const axios = require('axios');
const queryString = require('query-string');
const senderConfig = require('../config');

Date.prototype.yyyymmdd = function() {
    const mm = this.getMonth() + 1; // getMonth() is zero-based
    const dd = this.getDate();

    return [this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('-');
};

const headerConfig = { headers: {'Authorization': 'Bearer ' + senderConfig.token} };
const baseUrl = 'https://testbedapp.giftbit.com/papi/v1/';

const getRequest = function(endpoint, queryObject) {
    const url = baseUrl+endpoint+'?'+queryString.stringify(queryObject);
    console.log("Giftbit GET", url);
    return axios.get(url, headerConfig);
};
const giftbitApiService = {};

giftbitApiService.getBrands = function(req) {
    return getRequest('brands', req.query);
};

giftbitApiService.getGifts = function(req) {
    return getRequest('marketplace', req.query);
};

giftbitApiService.getRegions = function(req) {
    return getRequest('regions', req.query);
};

giftbitApiService.createCampaign = function(req) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const url = baseUrl+'campaign';
    const body = {
        gift_template: senderConfig.giftTemplate,
        delivery_type: 'GIFTBIT_EMAIL',
        contacts: [{email: 'demo@giftbit.com'}], /* all emails are redirected to your email in testbed */
        marketplace_gifts: req.body.marketplace_gifts,
        expiry: expiryDate.yyyymmdd(),
        id: Math.random().toString(36).substring(2)
    };
    console.log("Giftbit POST request", url, body);

    return axios.post(url, body, headerConfig);
};

module.exports = giftbitApiService;