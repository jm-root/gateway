const log = require('jm-log4js')
let logger = log.getLogger('server-config')

module.exports = function (opts) {
  const app = this

  const v = ['config', 'gateway', 'config_root_server']
  v.forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key])
  })

  let loadProxy = async () => {
    if (opts.config) {
      app.use('config', { proxy: opts.config })
      let configRootServer = opts.config_root_server || 'server'
      try {
        let doc = await app.router.get('/config/' + configRootServer + '/modules')
        if (doc && doc.ret) {
          app.uses(doc.ret)
        }
      } catch (err) {
        logger.warn('读取配置信息失败\nget /config/%s/modules\n%s', configRootServer, err.stack)
      }
    }
    let gateway = opts.gateway || opts.sdk
    if (gateway) app.use('gateway', { proxy: gateway, prefix: '/' })
  }
  app.on('uses', function () {
    loadProxy()
  })
}
