require('log4js').configure(require('./log4js'))
process.env.NODE_CONFIG_DIR = require('path').join(__dirname)
const config = require('config')

if (config.no_server_sso) delete config.modules['jm-server-sso']
if (config.no_server_acl) delete config.modules['jm-server-acl']

module.exports = config
