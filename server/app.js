const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const port = 3001;

const brands = require('./routes/brands');
const regions = require('./routes/regions');
const campaign = require('./routes/campaign');
const embedded = require('./routes/embedded');

const app = express();

// app.use(logger('dev')); /* uncomment for server URL logging */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/brands', brands);
app.use('/regions', regions);
app.use('/campaign', campaign);
app.use('/embedded', embedded);

app.listen(port);
console.log('listening on port ' + port);