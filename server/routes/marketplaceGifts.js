const express = require('express');
const router = express.Router();
const giftbitApiService = require('../services/giftbitApiService');

router.get('/', function(req, res, next) {
    giftbitApiService.getGifts(req)
        .then(function(response) {
            res.json(response.data)
        })
        .catch(function(error) {
            res.json(error.response.data)
        })
});

module.exports = router;
