const express = require('express');
const router = express.Router();
const giftbitApiService = require('../services/giftbitApiService');

router.get('/', function(req, res, next) {
    giftbitApiService.getRegions(req).then(function(response) {
        res.json(response.data)
    });
});

module.exports = router;
