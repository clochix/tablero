var initDB = require('./db.js'),
    _ = require('underscore');
var options = {
  root: 'columns',
  getKey: function (req) {
    'use strict';
    return 'columns';
  },
  doUpdate: function (client, req) {
    'use strict';
    client.del('columns');
    _.each(req.body, function (column) {
      client.hset('columns', column.column, column.order);
    });
  }
};

module.exports = function (app, client) {
  'use strict';
  initDB(app, options, client);
};
