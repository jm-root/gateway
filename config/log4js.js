module.exports = {
  appenders: {
    console: { type: 'console' },
    gateway: {
      type: 'dateFile',
      filename: 'logs/gateway',
      pattern: 'yyyyMMdd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    gateway: { appenders: [ 'console', 'gateway' ], level: 'info' },
    server: { appenders: [ 'console', 'gateway' ], level: 'info' },
    'server-config': { appenders: [ 'console', 'gateway' ], level: 'info' },
    'server-acl': { appenders: [ 'console', 'gateway' ], level: 'info' },
    default: { appenders: [ 'console' ], level: 'info' }
  }
}
