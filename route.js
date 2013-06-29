function Route(method, regex, middleware, func) {
  this.method = method;
  this.regex  = regex;
  if (func) {
    this.func   = func;
    this.setMiddleware(middleware);
  } else {
    this.func = middleware;
    this.setMiddleware([]);
  }
}

Route.prototype.setMiddleware = function(middleware) {
  if (Array.isArray(middleware)) {
    this.middleware = middleware;
  } else {
    this.middleware = [middleware];
  }
}

Route.prototype.didMatch = function(method, path) {
  return method == this.method && this.regex.test(path);
}

Route.prototype.runFunc = function(req, res, path, rudder) {
  var args = this.regex.exec(path).slice(1);
  args.unshift(res); args.unshift(req);
  this.func.apply(rudder, args);

}

Route.prototype.execute = function(req, res, path, rudder) {
  var curr = -1,
      self = this;
  function next() {
    curr += 1;
    if (curr == self.middleware.length) {
      self.runFunc(req, res, path, rudder);
    } else {
      self.middleware[curr](req, res, next);
    }
  }
  next();
}

module.exports = Route;
