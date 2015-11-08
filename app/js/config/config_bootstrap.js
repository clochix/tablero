define([],
  function () {
    'use strict';

    var config = {
      repos: {}
    };


    var getParameterByName = function (name) {
      var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };

    $.getJSON('config', function (data) {
      config = data || {
        repos: {
          local: 'local'
        }
      };

      if (getParameterByName('access') !== 'repo') {
        delete config.repos['project-issues'];
      }
    });

    return {
      getConfig: function () {
        return config;
      },
      getRepos: function () {
        return config.repos;
      },
      getReposNames: function () {
        return Object.keys(config.repos);
      },
      get: function (key) {
        return config[key];
      },
      set: function (key, value) {
        config[key] = value;
      }
    };

  }
);
