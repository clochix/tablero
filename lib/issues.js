var initDB = require('./db.js');
var options = {
  root: 'issues',
  getKey: function (req) {
    'use strict';
    return 'issues';
  },
  doUpdate: function (client, req) {
    'use strict';
    console.log(req.body);
    client.hset('issues', req.body.id, req.body);
  }
};
module.exports = function (app, client) {
  'use strict';
  initDB(app, options, client);
  app.patch('/issues', function (req, res) {
    if (client) {
      client.hgetall(options.getKey(req), function (err, reply) {
        var issue = reply[req.query.id];
        if (issue) {
          Object.keys(req.body).forEach(function (key) {
            issue[key] = req.body[key];
          });
          client.hset('issues', req.query.id, issue);
          res.status(200).send(issue);
        } else {
          res.send({}).status(404);
        }
      });
    } else {
      res.send({}).status(502);
    }
  });
};
