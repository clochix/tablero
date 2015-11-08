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
};
