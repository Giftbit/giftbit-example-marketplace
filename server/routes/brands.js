const express = require('express');
const router = express.Router();
const giftbitApiService = require('../services/giftbitApiService');

router.get('/', function(req, res, next) {
    return giftbitApiService.getBrands(req).then(function(responseData) {
            res.json(responseData)
        })
});

router.get('/:brandCode', function(req, res, next) {
    return giftbitApiService.getBrand(req).then(function(responseData) {
        res.json(responseData)
    })
});

module.exports = router;
