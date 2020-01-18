const MS = require('jm-ms-core')
const log = require('jm-log4js')
const error = require('jm-err')

const ms = new MS()
const logger = log.getLogger('server-acl')
const Err = error.Err

let t = function (doc, lng) {
  if (doc && lng && doc.err && doc.msg) {
    return Object.assign({}, doc, {
      msg: Err.t(doc.msg, lng) || doc.msg
    })
  }
  return doc
}

module.exports = function (opts) {
  let app = this
  let config = app.config
  let debug = config.debug

  const v = ['acl', 'no_acl_user', 'acl_user_key']
  v.forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key])
  })

  if (opts.acl) app.use('acl', { proxy: opts.acl })
  let noAclUser = opts.no_acl_user || false
  let aclUserKey = opts.acl_user_key || 'acl_user'

  let router = ms.router()
  app.root.use(config.prefix || '', router)
  router.use(async opts => {
    let userId = null
    if (opts.user && opts.user.id) {
      userId = opts.user.id
      if (!noAclUser) {
        opts.headers || (opts.headers = {})
        opts.headers[aclUserKey] = userId
      }
    }
    if (noAclUser && opts.headers && opts.headers[aclUserKey]) delete opts.headers[aclUserKey]
    let resource = opts.uri.toLowerCase()
    let method = opts.type
    let data = {
      resource: resource,
      permissions: method
    }
    userId && (data.user = userId)
    let doc = await app.router.get('/acl/isAllowed', data)
    if (doc && doc.ret) return
    debug && (logger.info('Forbidden: %s %s %s', userId || 'guest', method, resource))
    if (!opts.user) {
      doc = Err.FA_NOAUTH
    } else {
      doc = Err.FA_NOPERMISSION
    }
    doc = t(doc, opts.lng)
    throw error.err(doc)
  })
}
