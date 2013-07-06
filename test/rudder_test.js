var tape   = require('tape'),
    Rudder = require('../index');

(function() {

  tape('parses url correctly', function(t) {
    t.plan(1);

    var req = { url: '/test?name=brandon' };
    var result = (new Rudder()).parseUrl(req);

    t.equals(result, '/test');
  });

})();

(function() {

  tape('can add a new route', function(t) {
    t.plan(3);

    var method = 'GET',
        regex = 'regex',
        middleware = null,
        func = function() { };

    var rudder = new Rudder();

    rudder.addRoute(method, regex, middleware, func);

    t.equals(rudder.routes.length, 1);
    t.equals(rudder.routes[0].method, 'GET');
    t.equals(rudder.routes[0].regex, 'regex');
  });

})();

(function() {

  tape('loops over all the routes and finds a route', function(t) {
    t.plan(7);

    var rudder = new Rudder();

    var route1 = rudder.get('route1', null, {});
    var route2 = rudder.get('route2', null, {});

    var req = { method: 'GET' },
        res = 'response',
        path = 'path';

    route2.didMatch = function(m, p) {
      t.equals(m, 'GET');
      t.equals(p, 'path');
      return false;
    }

    route1.didMatch = function() { return true; }

    route1.execute = function(request, response, p, c) {
      t.deepEqual(request, req);
      t.equal(response, res);
      t.equal(p, path);
      t.equal(c, rudder);
    }

    t.ok(rudder.loopOver(req, res, path));
  });

  tape('loops over all the routes and does not a route', function(t) {
    t.plan(1);

    var rudder = new Rudder();

    var route1 = rudder.get('route1', null, {});
    var route2 = rudder.get('route2', null, {});

    var req = { method: 'GET' },
        res = 'response',
        path = 'path';

    route2.didMatch = function(m, p) { return false; }
    route1.didMatch = function() { return false; }


    t.notOk(rudder.loopOver(req, res, path));
  });

})();

(function() {

  tape('middleware continue', function(t) {
    t.plan(4);

    var rudder = new Rudder();

    var req = { url: '/test?name=brandon' },
        res = 'response';

    rudder.loopOver = function(request, response, path) {
      t.deepEqual(request, req);
      t.equals(response, 'response');
      t.equals(path, '/test');
      return false;
    };

    var next = function() {
      t.ok(true);
    }

    var middleware = rudder.middleware();

    middleware(req, res, next);
  });

  tape('middleware does not continue', function(t) {
    t.plan(1);

    var rudder = new Rudder();
    var called = false;

    var req = { url: '/test?name=brandon' },
        res = 'response';

    rudder.loopOver = function(request, response, path) {
      return true;
    };

    var next = function() {
      called = true;
    }

    var middleware = rudder.middleware();
    middleware(req, res, next);

    t.notOk(called);
  });

})();

(function() {

  tape('get adds proper route', function(t) {
    t.plan(4);

    var rudder = new Rudder();

    var regex      = 'regex',
        middleware = null,
        func       = function() { };

    rudder.addRoute = function(m, r, mw, f) {
      t.equals(m, "GET");
      t.equals(r, regex);
      t.equals(mw, middleware);
      t.equals(f, func);
    }

    rudder.get(regex, middleware, func);
  });

  tape('post adds proper route', function(t) {
    t.plan(4);

    var rudder = new Rudder();

    var regex      = 'regex',
        middleware = null,
        func       = function() { };

    rudder.addRoute = function(m, r, mw, f) {
      t.equals(m, "POST");
      t.equals(r, regex);
      t.equals(mw, middleware);
      t.equals(f, func);
    }

    rudder.post(regex, middleware, func);
  });
})();
