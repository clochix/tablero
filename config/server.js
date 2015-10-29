var configurable = require('../lib/configurable');
var configServer = {};

configServer.clientId = configurable.get('PX_CLIENT_ID') || 'https://github.com/login/oauth';
configServer.clientSecret = configurable.get('PX_CLIENT_SECRET');
configServer.oauthUrl = configurable.get('PX_OAUTH_URL');
configServer.redisUrl = process.env.REDISCLOUD_URL || '';


module.exports = configServer;
