require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
let config = {
  development: {
    debug: true,
    lng: 'zh_CN',
    port: 3000,
    config_root_server: 'gateway',
    // gateway: 'http://gateway.test.jamma.cn', // 可选 如果不填，必须设置config, sso
    config: 'http://gateway.test.jamma.cn/config', // 可选 如果不填，必须设置gateway
    sso: 'http://gateway.test.jamma.cn/sso', // 可选 如果不填，必须设置gateway
    acl: 'http://gateway.test.jamma.cn/acl',
    modules: {
      'jm-server-config': {},
      'jm-server-sso': {},
      'jm-server-acl': {}
    }
  },
  production: {
    lng: 'zh_CN',
    port: 80,
    config_root_server: 'gateway',
    modules: {
      'jm-server-config': {},
      'jm-server-sso': {},
      'jm-server-acl': {}
    }
  }
}

let env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env

if (process.env['no_server_sso']) delete config.modules['jm-server-sso']
if (process.env['no_server_acl']) delete config.modules['jm-server-acl']

// deprecated
if (process.env['disableSSO']) delete config.modules['jm-server-sso']
if (process.env['disableACL']) delete config.modules['jm-server-acl']

module.exports = config
