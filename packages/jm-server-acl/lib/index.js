const MS = require('jm-ms-core')
const log = require('jm-log4js')
const error = require('jm-err')

const ms = new MS()
const logger = log.getLogger('server-acl')
const Err = error.Err

function t (doc, lng) {
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

  // 检查权限
  async function isAllowed ({ user = {}, headers, uri, type }) {
    const { id: userId, role } = user

    delete headers[aclUserKey]
    if (userId && !noAclUser) {
      headers[aclUserKey] = userId
    }

    delete headers[aclRoleKey]
    if (role && !noAclRole) {
      headers[aclRoleKey] = role
    }

    const resource = uri.toLowerCase()
    const permissions = type.toLowerCase()

    const data = {
      resource,
      permissions
    }

    let checkUser = true // 如果acl支持areAnyRolesAllowed，并且role有效，则不执行isAllowed
    if (role) {
      try {
        const doc = await app.router.get('/acl/areAnyRolesAllowed', { ...data, roles: role })
        if (doc && doc.ret) return true
        checkUser = false
        debug && (logger.info('Forbidden role: %s %s %s', role, permissions, resource))
      } catch (e) {}
    }

    if (checkUser) {
      const doc = await app.router.get('/acl/isAllowed', { ...data, user: userId })
      if (doc && doc.ret) return true
      debug && (logger.info('Forbidden user: %s %s %s', userId || 'guest', permissions, resource))
    }

    return false
  }

  const router = ms.router()
  app.root.use(prefix, router)
  router.use(async opts => {
    opts.headers || (opts.headers = {})
    const { user, headers, uri, type, lng } = opts
    if (headers['ignore_server_acl']) {
      delete headers['ignore_server_acl']
      return
    }

    const ret = await isAllowed({ user, headers, uri, type })
    if (ret) return

    let doc = user ? Err.FA_NOPERMISSION : Err.FA_NOAUTH
    doc = t(doc, lng)
    throw error.err(doc)
  })

  app.on('open', () => {
    const { http: { root } } = app.servers
    root.use(async (req, res, next) => {
      const { path: uri, method: type, user, headers, lng } = req

      const ret = await isAllowed({ user, headers, uri, type })
      if (ret) {
        headers['ignore_server_acl'] = '1'
        return next()
      }

      let doc = user ? Err.FA_NOPERMISSION : Err.FA_NOAUTH
      doc = t(doc, lng)
      const err = error.err(doc)
      res.status(err.status).send(doc)
    })
  })
}
