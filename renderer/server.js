var express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  handlebars = require('handlebars'),
  expressStatsd = require('express-statsd');

var app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
  req.statsdKey = 'renderer';
  next();
});

app.use(expressStatsd({
  host: process.env.METRICS_PORT_8125_UDP_ADDR,
  port: process.env.METRICS_PORT_8125_UDP_PORT
}));

var template;

fs.readFile('template.html', 'utf8', function(error, data) {
  template = handlebars.compile(data);
});

app.post('/render', function(req, res) {
  res.send(template(req.body));
});

app.listen(3000);
