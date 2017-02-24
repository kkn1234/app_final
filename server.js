'use strict';
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

require('./server/app')(app);

app.listen(8080, function () {
   console.log('Server running');
});