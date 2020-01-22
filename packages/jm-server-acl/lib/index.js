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
  const app = this
  const { debug, prefix = '' } = app.config

  const {
    acl,
    no_acl_user: noAclUser = false,
    acl_user_key: aclUserKey = 'acl_user',
    no_acl_role: noAclRole = false,
    acl_role_key: aclRoleKey = 'acl_role'
  } = opts

  if (acl) app.use('acl', { proxy: acl })

  const router = ms.router()
  app.root.use(prefix, router)
  router.use(async opts => {
    let { id: userId, role } = opts.user || {}
    opts.headers || (opts.headers = {})
    const { headers } = opts

    delete headers[aclUserKey]
    if (userId && !noAclUser) {
      headers[aclUserKey] = userId
    }

    delete headers[aclRoleKey]
    if (role && !noAclRole) {
      headers[aclRoleKey] = role
    }

    const resource = opts.uri.toLowerCase()
    const permissions = opts.type

    const data = {
      resource,
      permissions
    }

    let checkUser = true // 如果acl支持areAnyRolesAllowed，并且role有效，则不执行isAllowed
    if (role) {
      try {
        const { ret } = await app.router.get('/acl/areAnyRolesAllowed', { ...data, roles: role })
        if (ret) return
        checkUser = false
        debug && (logger.info('Forbidden role: %s %s %s', role, permissions, resource))
      } catch (e) {}
    }

    if (checkUser) {
      const { ret } = await app.router.get('/acl/isAllowed', { ...data, user: userId })
      if (ret) return
      debug && (logger.info('Forbidden user: %s %s %s', userId || 'guest', permissions, resource))
    }

    let doc = opts.user ? Err.FA_NOPERMISSION : Err.FA_NOAUTH
    doc = t(doc, opts.lng)
    throw error.err(doc)
  })
}
