const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;

const brands = require('./routes/brands');
const marketplaceGifts = require('./routes/marketplaceGifts');
const regions = require('./routes/regions');
const campaign = require('./routes/campaign');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/brands', brands);
app.use('/marketplaceGifts', marketplaceGifts);
app.use('/regions', regions);
app.use('/campaign', campaign);

app.listen(port);

console.log('listening on port ' + port);