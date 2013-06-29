var util         = require('util'),
    EventEmitter = require('events').EventEmitter,
    Route        = require('./route');

function Rudder() {
  this.routes = [];
}

util.inherits(Rudder, EventEmitter);

Rudder.prototype.parseUrl = function(req) {
  return req.url.split("?")[0];
}

Rudder.prototype.loopOver = function(req, res, path) {
  for(var index in this.routes) {
    var route = this.routes[index];
    if (route.didMatch(req.method, path)) {
      route.execute(req, res, path, this);
      return;
    }
  }
}

Rudder.prototype.middleware = function() {
  var self = this;
  return function(req, res, next) {
    self.loopOver(req, res, self.parseUrl(req));
    next();
    return;
  }
}

Rudder.prototype.addRoute = function(method, regex, middleware, func) {
  var route = new Route(method, regex, middleware, func);
  this.routes.unshift(route);
  return route;
}

Rudder.prototype.get = function(regex, middleware, func) {
  return this.addRoute("GET", regex, middleware, func);
}

Rudder.prototype.post = function(regex, middleware, func) {
  return this.addRoute("POST", regex, middleware, func);
}

module.exports = Rudder;
