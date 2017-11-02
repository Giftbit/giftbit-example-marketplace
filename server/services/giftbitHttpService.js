const axios = require('axios');
const queryString = require('query-string');
const senderConfig = require('../config');

const headerConfig = { headers: {'Authorization': 'Bearer ' + senderConfig.token} };
const baseUrl = 'https://testbedapp.giftbit.com/papi/v1/';

const getLogger = function(endpoint, request, response, status) {
    console.log("---", "Giftbit GET", endpoint, "request", "---");
    console.log("URL:", request);
    console.log("STATUS:", status);
    console.log("RESPONSE:", JSON.stringify(response, null, 2));
};

const postLogger = function(endpoint, requestUrl, requestBody, response, status) {
    console.log("---", "Giftbit POST", endpoint, "request", "---");
    console.log("POST URL:", requestUrl);
    console.log("POST BODY:", JSON.stringify(requestBody, null, 2));
    console.log("STATUS:", status);
    console.log("RESPONSE:", JSON.stringify(response, null, 2));
};

const getRequest = function(endpoint, queryObject) {
    const url = baseUrl+endpoint+'?'+queryString.stringify(queryObject);
    return new Promise(function(resolve, reject) {
        axios.get(url, headerConfig).then(function(response) {
            getLogger(endpoint, url, response.data, response.status);
            resolve(response.data)
        })
            .catch(function(error) {
                getLogger(endpoint, url, error.response.data, error.response.status);
                resolve(error.response.data)
            })
    })
};

const postRequest = function(endpoint, body) {
    const url = baseUrl+endpoint;
    return new Promise(function(resolve, reject) {
        axios.post(url, body, headerConfig).then(function(response) {
            postLogger(endpoint, url, body, response.data, response.status);
            resolve(response.data)
        })
            .catch(function(error) {
                postLogger(endpoint, url, body, error.response.data, error.response.status);
                resolve(error.response.data)
            })
    })
};

module.exports = {getRequest, postRequest};