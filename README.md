Rudder
=======

[![Build Status](https://travis-ci.org/bthesorceror/rudder.png?branch=master)](https://travis-ci.org/bthesorceror/rudder)

The simple little router for Journeyman

Example Usage
-------------

```javascript

var Journeyman = require('journeyman');
var Rudder = require('./index');

var rudder = new Rudder();

function mw1(req, res, next) {
  res.write("HERE COMES THE MIDDLEWARE\n");
  next();
}

rudder.get(/^\/test\/(\d+)$/, mw1, function(req, res, number) {
  res.write(number + "\n");
  res.end();
});

var server = new Journeyman(3000);

server.use(rudder.middleware());

server.use(function(req, res, next) {
  res.write(req.url + "\n");
  res.write(req.method + "\n");
  next();
});

server.listen();

```
