const log = require('jm-log4js')
let logger = log.getLogger('server-config')

module.exports = function (opts) {
  let app = this

  // ---- deprecated begin ----
  const o = {
    sdk: 'gateway'
  }
  Object.keys(o).forEach(function (key) {
    let bWarn = false
    if (opts[key] !== undefined) {
      opts[o[key]] = opts[key]
      delete opts[key]
      bWarn = true
    }
    if (process.env[key]) {
      opts[o[key]] = process.env[key]
      bWarn = true
    }
    bWarn && (logger.warn('%s deprecated, please use %s', key, o[key]))
  })
  // ---- deprecated end ----

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
