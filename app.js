
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  FacebookClient = require("facebook-client").FacebookClient;

var app = module.exports = express();

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

var app_id = "389710287795440";
var facebook_client = new FacebookClient(
    app_id, // configure like your fb app page states
    "57f02c87927967b10e6750f51431d7a9", // configure like your fb app page states
    {
        "timeout": 10000 // modify the global timeout for facebook calls (Default: 10000)
    }
);
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
app.get('/hello', function(request, response) {

facebook_client.getSessionByRequestHeaders(request.headers)(function(facebook_session) {
        if (!facebook_session)
        {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write([
                '<html>',
                '<head><title>node-facebook-client example</title></head><body>',
                '<p>Login please</p> <fb:login-button autologoutlink="true"></fb:login-button>',
                '<div id="fb-root"></div>',
                '<script type="text/javascript">',
                  'window.fbAsyncInit = function() {',

                  '    FB.init({appId: "' + app_id +'", logging:false, status: true, cookie: true, xfbml: true});',
                  '    FB.Event.subscribe(\'auth.sessionChange\', function(response) {',
                  '        document.location = document.location.href;',
                  '    });',
                  '};',
                  '(function() {',
                  '  var e = document.createElement(\'script\'); e.async = true;',
                  '  e.src = document.location.protocol +',
                  '    \'//connect.facebook.net/en_US/all.js\';',
                  '  document.getElementById(\'fb-root\').appendChild(e);',
                  '}());',
                  '</script>',
                  '</body>',
                  '</html>'
            ].join("\n"));
            response.end();
            return ;
        }
});
});

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
