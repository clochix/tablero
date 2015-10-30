var client,
    _ = require('underscore');

function setUp(app, options) {
  'use strict';
  app.get('/priorities', retrieve);
  app.put('/priorities', update);
  app.post('/priorities', update);

  client = options.client;
}

function retrieve(req, res) {
  'use strict';
  var query = req.query;
  var project = query.project;

  if (client) {
    client.hgetall('priority:' + project, function (err, reply) {
      var answer = [];
      if (err) {
        console.log('[ERROR] Error while retrieving priorities: ' + err);
      }
      if (reply) {
        _.each(_.pairs(reply), function (value, key, list) {
          answer.push({
            id: value[0],
            priority: value[1]
          });
        });
      }
      res
        .send({
          issues: answer
        })
        .status(200);
    });
  } else {
    res.send({}).status(503);
  }

}

function update(req, res) {
  'use strict';
  var body = req.body;
  var project = body.project;
  var issue = body.issue;
  var priority = body.priority;
  if (client) {
    client.hset('priority:' + project, issue, priority);
    res
      .send({})
      .status(201);
  } else {
    res.send({})
      .status(503);
  }
}

module.exports = setUp;
