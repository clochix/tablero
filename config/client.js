var repos = {};
var configurable = require('../lib/configurable');

configurable.setSilentMode(true);

/*
function addRepo(name, key, label) {
  'use strict';
  if (configurable.get(key)) {
    repos[name]  = configurable.get(key);
    labels[name] = (label || repos[name]);
  }
}
addRepo('user-agent', 'PX_USER_AGENT', 'User Agent');
addRepo('dispatcher', 'PX_DISPATCHER', 'Dispatcher');
addRepo('platform', 'PX_PLATFORM', 'Platform');
addRepo('project-issues', 'PX_PROJECT_ISSUES', 'Project Issues');
addRepo('website', 'PX_PAGES', 'Website');

var maxDynaReposQuantity = 5;
for (var i = 0; i < maxDynaReposQuantity; i++) {
  addRepo(configurable.get('REPO_' + i + '_NAME') || i + 'th', 'REPO_' + i + '_URL');
}
*/

configurable.get('REPOS', function (value) {
  'use strict';
  var chunks = value.split(';');
  chunks.forEach(function (chunk) {
    var val = chunk,
      nameRegex = /(https:\/\/api\.github\.com\/repos\/)?(.*)/,
      name = nameRegex.exec(val)[2],
      key = name.toLowerCase().replace('/', '_');

    var gitHubApiPrefix = 'https://api.github.com/repos/';
    repos[key] = gitHubApiPrefix + name;
  });
});

module.exports = {
  repos: repos,
};
