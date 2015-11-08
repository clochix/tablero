var express = require('express');
var XHR = require('xmlhttprequest').XMLHttpRequest;
var url = require('url');
var sass = require('node-sass');
var path = require('path');
var app = express();
var cookieParser = require('cookie-parser');
var configurable = require('./lib/configurable');
var fs = require('fs');
var basePath = process.env.APP_DATA || '/usr/local/var/cozy/tablero';

var configServer = require('./config/server.js');

var port;

function JsonDB(file) {
  'use strict';
  var database = {};
  if (typeof fs.access === 'function') {
    fs.access(file, fs.R_OK | fs.W_OK, function (err) {
      if (!err) {
        database = require(file);
      }
    });
  } else {
    fs.exists(file, function (exists) {
      if (exists) {
        database = require(file);
      }
    });
  }
  process.on('exit', function(code) {
    fs.writeFileSync(file, JSON.stringify(database, null, 2));
  });
  process.on('SIGINT', function() {
    fs.writeFileSync(file, JSON.stringify(database, null, 2));
    process.exit();
  });
  this.hgetall = function (key, cb) {
    cb(null, database[key]);
  };
  this.del = function (key) {
    delete database[key];
  };
  this.hset = function (key, field, value) {
    if (typeof database[key] === 'undefined') {
      database[key] = {};
    }
    database[key][field] = value;
    fs.writeFileSync(file, JSON.stringify(database, null, 2));
  };
}


app.use(sass.middleware({
  src: __dirname + '/app',
  debug: false
}));

app.use(express.static(path.join(__dirname, 'app')));

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cookieParser());

app.get('/config', function(req, res) {
  'use strict';
  function loadRepos() {
    var repos = {};
    configurable.get('REPOS', function (value) {
      var chunks = value.split(';');
      chunks.forEach(function (chunk) {
        if (chunk === 'local') {
          repos.local = 'local';
        } else {
          var val = chunk,
            nameRegex = /(https:\/\/api\.github\.com\/repos\/)?(.*)/,
            name = nameRegex.exec(val)[2],
            key = name.toLowerCase().replace('/', '_');

          var gitHubApiPrefix = 'https://api.github.com/repos/';
          repos[key] = gitHubApiPrefix + name;
        }
      });
      if (typeof repos.local === 'undefined') {
        repos.local = 'local';
      }
    });
    return repos;
  }
  res.send({
    clientId: configurable.get('PX_CLIENT_ID'),
    clientSecret: configurable.get('PX_CLIENT_SECRET'),
    repos: loadRepos()
  });
});

// Save configuration into config.json
app.post('/config', function(req, res) {
  'use strict';
  var data = {
    'PX_OAUTH_URL' : 'https://github.com/login/oauth',
    'REPOS' : req.body.repos.join(';'),
    'PX_CLIENT_SECRET' : req.body.clientSecret,
    'PX_CLIENT_ID' : req.body.clientId
  };
  configurable.set('REPOS', req.body.repos.join(';'));
  configurable.set('PX_CLIENT_ID', req.body.clientId);
  configurable.set('PX_CLIENT_SECRET', req.body.clientSecret);
  configServer.clientId = req.body.clientId;
  configServer.clientSecret = req.body.clientSecret;
  //@FIXME set repo in configClient. Duplicated code
  /*
  configClient.repos = {};
  req.body.repos.forEach(function (chunk) {
    if (key === 'local') {
      var nameRegex = /(https:\/\/api\.github\.com\/repos\/)?(.*)/,
        name = nameRegex.exec(chunk)[2],
        key = name.toLowerCase().replace('/', '_');

      var gitHubApiPrefix = 'https://api.github.com/repos/';
      configClient.repos[key] = gitHubApiPrefix + name;
    }
  });
  configClient.repos.local = 'local';
  */
  fs.writeFile(path.join(basePath, 'config.json'), JSON.stringify(data, null, 2), function (err) {
    res.send({res: err ? 'ko' : 'ok'});
  });
});

app.get('/request_auth_token', function(req, res) {
  'use strict';
  var getAuthTokenUrl = configServer.oauthUrl + '/access_token?' +
  'client_id=' + configServer.clientId +
  '&client_secret=' + configServer.clientSecret +
  '&code=' + req.query.code;

  var xhr = new XHR();
  xhr.open('POST', getAuthTokenUrl, false);
  xhr.send();

  if(xhr.responseText.indexOf('incorrect_client_credentials') > 0){
    console.log('ERROR -  Invalid clientID or clientSecret');
  }

  var fakeUrl = 'http://fake.uri/?' + xhr.responseText;
  var repositoryAccess = url.parse(fakeUrl, true).query.scope;

  res.send({token: url.parse(fakeUrl, true).query.access_token});
});

var client;
if (configServer.redisUrl) {
  var redisUrl = url.parse(configServer.redisUrl);
  client = require('redis').createClient(redisUrl.port, redisUrl.hostname);
  client.on('error', function (event) {
    'use strict';
    if (client) {
      console.error('[ERROR] Could NOT connect to Redis server');
    }
    client = undefined;
  });
  if (redisUrl.auth) {
    client.auth(redisUrl.auth.split(':')[1]);
  }
} else {
  client = new JsonDB(path.join(basePath, './database.json'));
}
require('./lib/priorization')(app, client);
require('./lib/columns')(app, client);
require('./lib/issues')(app, client);

port = process.env.PORT || 3000;
app.listen(port);
console.log('Server started. Running on port', port);
