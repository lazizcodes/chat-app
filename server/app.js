const express = require('express');
const morgan = require('morgan');
const path = require('path');

const publicPath = path.join(__dirname, '../public');
const app = express();

app.use(morgan('dev'));
app.use(express.static(publicPath));

module.exports = app;
