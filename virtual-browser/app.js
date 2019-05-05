const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const createPdfRouter = require('./routes/create-pdf');
const groupPageRouter = require('./routes/group-page');
const sizeRouter = require('./routes/size');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/create-pdf', createPdfRouter);
app.use('/group-page', groupPageRouter);
app.use('/size', sizeRouter);

module.exports = app;
