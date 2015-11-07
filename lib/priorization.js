var initDB = require('./db.js');
var options = {
  root: 'priorities',
  getKey: function (req) {
  'use strict';
    return 'priorities:' + (req.method === 'GET' ? req.query.project : req.body.project);
  },
  doUpdate: function (client, req) {
  'use strict';
    client.hset('priorities:' + req.body.project, req.body.issue, req.body.priority);
  }
};
module.exports = function (app, client) {
  'use strict';
  initDB(app, options, client);
};
