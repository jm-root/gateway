const log = require('jm-log4js')
const logger = log.getLogger('server-config')

module.exports = function (opts) {
  const app = this

  const {
    config,
    gateway,
    config_root_server: configRootServer = 'server'
  } = opts

  const doc = {
    ready: false
  }

  const loadProxy = async () => {
    let ready = true
    if (config) {
      app.use('config', { proxy: config })
      const uri = `/config/${configRootServer}/modules`
      try {
        const doc = await app.router.get(uri)
        if (doc && doc.ret) {
          app.uses(doc.ret)
        }
      } catch (err) {
        ready = false
        logger.warn(`读取配置信息失败 ${uri}\n`, err)
      }
    }
    if (gateway) app.use('gateway', { proxy: gateway, prefix: '/' })
    doc.ready = ready
  }
  app.on('uses', function () {
    loadProxy()
  })

  return doc
}
