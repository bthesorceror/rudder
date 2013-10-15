var Route = require('../route'),
    tape  = require('tape');

// Initialization
(function() {
  var method = 'method',
  regex      = 'regex',
  middleware = 'middleware';
  func       = 'func';

  tape('allows for only 3 arguments', function(t) {
    t.plan(2);

    var route = new Route(method, regex, func);

    t.equals(route.func, func);
    t.deepEqual(route.middleware, []);
  });

  tape('allows for a single middleware', function(t) {
    t.plan(1);

    var route = new Route(method, regex, middleware, func);

    t.deepEqual(route.middleware, [middleware]);
  });

  tape('allows for multiple middleware', function(t) {
    t.plan(1);

    var mw1 = 'mw1',
        mw2 = 'mw2';

    var route = new Route(method, regex, [mw1, mw2], func);

    t.deepEqual(route.middleware, [mw1, mw2]);
  });
})();

// Did Match
(function() {
  var method = 'GET',
      regex = /^\/test\/(\d+)$/
      func = function() { };

  var route = new Route(method, regex, func);

  tape('route is a match and correct method', function(t) {
    t.plan(1);

    t.ok(route.didMatch('GET', '/test/20'));
  });

  tape('route is a match and incorrect method', function(t) {
    t.plan(1);

    t.notOk(route.didMatch('POST', '/test/20'));
  });

  tape('route is not a match and correct method', function(t) {
    t.plan(1);

    t.notOk(route.didMatch('GET', '/test/20/goober'));
  });

  tape('route is not a match and incorrect method', function(t) {
    t.plan(1);

    t.notOk(route.didMatch('POST', '/test/20/goober'));
  });
})();

(function() {
  var method = 'GET',
      regex = "/test.html"
      func = function() { };

  var route = new Route(method, regex, func);

  tape('route is a match and correct method', function(t) {
    t.plan(2);

    t.ok(route.didMatch('GET', '/test.html'));
    t.notOk(route.didMatch('GET', '/test.html2'));
  });
})();

(function() {
  var method = null,
      regex = "/test.html"
      func = function() { };

  var route = new Route(method, regex, func);

  tape('route is a match and no method', function(t) {
    t.plan(2);

    t.ok(route.didMatch('GET', '/test.html'));
    t.notOk(route.didMatch('GET', '/test.html2'));
  });
})();

// Run Function

(function() {
  var method = 'GET',
      regex = /^\/test\/(\d+)\/(\d+)$/;
      path = '/test/10/20';

  tape('function is called with all arguments', function(t) {
    t.plan(4);
    var func = function(request, response, arg1, arg2) {
      t.equals(request, 'request');
      t.equals(response, 'response');
      t.equals(arg1, '10');
      t.equals(arg2, '20');
    }
    var route = new Route(method, regex, func);
    var res = 'response',
        req = 'request';

    route.runFunc(req, res, path, {});

  });

  tape('function is called with correct context', function(t) {
    t.plan(1);
    var context = { context: true };
    var func = function() {
      t.equals(this, context);
    };
    var route = new Route(method, regex, func);

    route.runFunc(null, null, path, context);
  });
})();

// Execute

(function() {
  var method = 'GET',
      regex  = /^\/test\/(\d+)\/(\d+)$/;
      path   = '/test/10/20',
      res    = 'response',
      req    = 'request';

  tape('function and middleware are called in order', function(t) {
    t.plan(1);
    var seq = "";

    var mw1  = function(req, res, next) { seq = seq + "a"; next();},
        mw2  = function(req, res, next) { seq = seq + "b"; next();};

    var route = new Route(method, regex, [mw1, mw2], {});
    route.runFunc = function() { t.equal(seq, "ab"); }
    route.execute(req, res, path, {});
  });

  tape('runFunc called with correct parameters', function(t) {
    t.plan(4);
    var context = { context: true };
    var route = new Route(method, regex, function() {});

    route.runFunc = function(request, response, p, c) {
      t.equals(request, req);
      t.equals(response, res);
      t.equals(p, path);
      t.equals(c, context);
    }

    route.execute(req, res, path, context);
  });

  tape('middleware called with correct parameters', function(t) {
    t.plan(3);
    var context = { context: true };

    var mw1  = function(request, response, next) {
      t.equals(request, req);
      t.equals(response, res);
      t.equals(this, context);
    }

    var route = new Route(method, regex, mw1, function() {});
    route.execute(req, res, path, context);
  });
})();
