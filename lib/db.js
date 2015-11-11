var client,
    _ = require('underscore');

module.exports = function (app, options, client) {
  'use strict';
  app.get('/' + options.root, retrieve);
  app.put('/' + options.root, update);
  app.post('/' + options.root, update);

  function retrieve(req, res) {
    var query = req.query;

    if (client) {
      client.hgetall(options.getKey(req), function (err, reply) {
        var answer = [];
        if (err) {
          console.log('[ERROR] Error while retrieving ' + options.root + ':' + err);
        }
        if (reply) {
          _.each(_.pairs(reply), function (value, key, list) {
            answer.push(value);
          });
        }
        res
          .send({res: answer})
          .status(200);
      });
    } else {
      res.send({}).status(502);
    }

  }

  function update(req, res) {
    if (client) {
      options.doUpdate(client, req);
      res.send({}).status(200);
    } else {
      res.send({}).status(502);
    }
  }
};
