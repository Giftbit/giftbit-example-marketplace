const senderConfig = require('../config');
const giftbitHttpService = require('./giftbitHttpService');

Date.prototype.yyyymmdd = function() {
    const mm = this.getMonth() + 1; // getMonth() is zero-based
    const dd = this.getDate();

    return [this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('-');
};

const getBrands = function(req) {
    return giftbitHttpService.getRequest('brands', req.query)
};

const getGifts = function(req) {
    return giftbitHttpService.getRequest('marketplace', req.query);
};

const getRegions = function(req) {
    return giftbitHttpService.getRequest('regions', req.query);
};

const createCampaign = function(req) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year from today
    const body = {
        gift_template: senderConfig.giftTemplate,
        delivery_type: 'GIFTBIT_EMAIL',
        contacts: [{email: 'demo@giftbit.com'}], /* all emails are redirected to your email in testbed */
        marketplace_gifts: req.body.marketplace_gifts,
        expiry: expiryDate.yyyymmdd(),
        id: Math.random().toString(36).substring(2)
    };

    return giftbitHttpService.postRequest('campaign', body);
};

const createEmbeddedCampaign = function(req) {
    const body = {
        marketplace_gift: req.body.marketplace_gift,
        id: Math.random().toString(36).substring(2)
    };

    return giftbitHttpService.postRequest('embedded', body);

}

module.exports = {getBrands, getGifts, getRegions, createCampaign, createEmbeddedCampaign};