
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  qs = require('querystring'),
  request = require('request');

var app = module.exports = express();
var accessKey = null;
/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
// Use Hogan.js as view template.
app.set('view engine', 'hjs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// fb config stuff
var app_id = "389710287795440";
var app_secret = "57f02c87927967b10e6750f51431d7a9";

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// Get the access code
app.get('/api/fb', function(req, res) {
  var url = "https://www.facebook.com/dialog/oauth?"+
  "client_id=389710287795440&"+
  "redirect_uri=http://localhost:3000/api/fb/callback";
  res.redirect(url);
});

// Get the access token
app.get('/api/fb/callback', function(req, res) {
  var code = req.param('code');

  var url = "https://graph.facebook.com/oauth/access_token?"+
    "client_id=389710287795440&redirect_uri="+
    "http://localhost:3000/api/fb/callback&"+
    "client_secret=57f02c87927967b10e6750f51431d7a9&code=" + code;

  request.get(url, function (error, response, body) {
    if(response.statusCode == 200) {
      console.log("Setting key");
      accessKey = qs.parse(body).access_token;
    } else {
      console.log("Sorry, error getting access token");
    }
  });
});

// Get fb friends
app.get('/fb/friends', function(req, res) {
  // Get limit
  var limit = req.param('limit') || 10;
  var url = "https://graph.facebook.com/me/friends?access_token=" +
    accessKey + "&limit=" + limit;
      request.get(url, function(err, res, body) {
        var json = JSON.parse(body);
        console.log(json);
      });
});

// DB calls
app.get('/users/add', api.addUser);
app.get('/users', api.getAllUsers);
app.get('/requests/add', api.addRequest);
app.get('/requests', api.getAllRequests);
app.get('/responses/add', api.addResponse);
app.get('/responses', api.getAllResponses);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
