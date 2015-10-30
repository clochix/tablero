define([],
  function () {
    'use strict';

    var config = {
      repos: {},
      labels: []
    };


    var getParameterByName = function (name) {
      var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };

    $.getJSON('config', function (data) {
      config = data || {
        repos: [],
        labels: []
      };

      if (getParameterByName('access') !== 'repo') {
        delete config.repos['project-issues'];
        delete config.labels['project-issues'];
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
      getLabels: function () {
        return config.labels;
      },
      set: function (key, value) {
        config[key] = value;
      }
    };

  }
);
