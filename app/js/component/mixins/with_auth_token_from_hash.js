define([
  'config/config_bootstrap'
  ],
  function (config) {
    'use strict';
    return function () {
      this.getCurrentAuthToken = function () {
        return config.get('token');
      };
    };
  }
);
