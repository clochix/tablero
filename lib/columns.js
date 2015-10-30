var client,
    _ = require('underscore');

function setUp(app, options) {
  'use strict';
  app.get('/columns', retrieve);
  app.post('/columns', update);
  app.put('/columns', update);

  client = options.client;
}

function retrieve(req, res) {
  'use strict';
  var query = req.query;
  var project = query.project;

  if (client) {
    client.hgetall('columns', function (err, reply) {
      var answer = [];
      if (err) {
        console.log('[ERROR] Error while retrieving priorities: ' + err);
      }
      if (reply) {
        _.each(_.pairs(reply), function (value, key, list) {
          answer.push({
            order: value[1],
            column: value[0]
          });
        });
      }
      res
        .send({
          columns: answer
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
  if (client) {
    client.del('columns');
    _.each(body, function (column) {
      client.hset('columns', column.column, column.order);
    });
    res.send({}).status(201);
  } else {
    res.send({}).status(503);
  }
}

module.exports = setUp;
