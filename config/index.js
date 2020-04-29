require('log4js').configure(require('./log4js'))
process.env.NODE_CONFIG_DIR = require('path').join(__dirname)
const config = require('config')

const { jaeger, no_server_sso: nosso, no_server_acl: noacl } = config
if (!jaeger) delete config.modules['jm-server-jaeger']
if (nosso) delete config.modules['jm-server-sso']
if (noacl) delete config.modules['jm-server-acl']

module.exports = config
