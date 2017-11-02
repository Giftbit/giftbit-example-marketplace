const express = require('express');
const router = express.Router();
const giftbitApiService = require('../services/giftbitApiService');

router.get('/', function(req, res, next) {
    giftbitApiService.getRegions(req).then(function(responseData) {
            res.json(responseData)
        })
});

module.exports = router;
