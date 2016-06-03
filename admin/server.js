var express = require('express'),
  proxy = require('express-http-proxy'),
  expressStatsd = require('express-statsd');

var app = express();

app.use(express.static('public'));

app.use(function(req, res, next) {
  req.statsdKey = 'admin';
  next();
});

app.use(expressStatsd({
  host: process.env.METRICS_PORT_8125_UDP_ADDR,
  port: process.env.METRICS_PORT_8125_UDP_PORT
}));

app.use('/api', proxy(
  process.env.API_PORT_3000_TCP_ADDR + ':' + process.env.API_PORT_3000_TCP_PORT,
  {
    forwardPath: function(req, res) {
      return require('url').parse(req.url).path;
    }
  }
));

app.use('/renderer', proxy(
  process.env.RENDERER_PORT_3000_TCP_ADDR + ':' + process.env.RENDERER_PORT_3000_TCP_PORT,
  {
    forwardPath: function(req, res) {
      return require('url').parse(req.url).path;
    }
  }
));

app.listen(3000);
