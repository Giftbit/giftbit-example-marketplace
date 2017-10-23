const express = require('express');
const router = express.Router();
const giftbitApiService = require('../services/giftbitApiService');

router.post('/', function(req, res, next) {
    giftbitApiService.createCampaign(req).then(function(response) {
        res.json(response.data)
    });
});

module.exports = router;
