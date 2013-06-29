var Journeyman = require('journeyman');
var Rudder = require('./index');

var rudder = new Rudder();

function helper1(req, res, next) {
  var write = res.write;
  res.writeln = function() {
    write.apply(res, arguments);
    write.call(res, "\n");
  }
  next();
}

function mw1(req, res, next) {
  res.writeln("HERE COMES THE MIDDLEWARE");
  next();
}

var route = rudder.get(/^\/test\/(\d+)$/, mw1, function(req, res, number) {
  res.writeln(number);
  res.end();
});

console.log(route);

var server = new Journeyman(3000);

server.use(rudder.middleware());

server.use(function(req, res, next) {
  res.writeln(req.url);
  res.writeln(req.method);
  next();
});

server.use(helper1);

server.listen();
