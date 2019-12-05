require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
process.env.NODE_CONFIG_DIR = __dirname
const config = require('config')

if (process.env['no_server_sso']) delete config.modules['jm-server-sso']
if (process.env['no_server_acl']) delete config.modules['jm-server-acl']

module.exports = config
