const { ms } = require('jm-server')

module.exports = function (opts = {}) {
  const app = this
  const { prefix = '' } = app.config

  const v = ['sso', 'sso_verify_path', 'sso_token_key', 'sso_header_token_key']
  v.forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key])
  })

  const {
    sso,
    sso_verify_path: verifyPath = '/sso/verify',
    sso_token_key: tokenKey = 'token',
    sso_header_token_key: headerTokenKey = 'authorization'
  } = opts

  sso && (app.use('sso', { proxy: opts.sso }))

  // 解析请求头传递的token，支持Bearer token
  function getToken (data, headers) {
    let token = data[tokenKey]
    if (headers[headerTokenKey]) {
      token = headers[headerTokenKey]
      const parts = token.split(' ')
      if (parts.length === 2) {
        const scheme = parts[0]
        const credentials = parts[1]
        if (/^Bearer$/i.test(scheme)) {
          token = credentials
        }
      }
    }
    return token
  }

  async function checkToken (token) {
    let data = {}
    data[tokenKey] = token
    return app.router.get(verifyPath, data)
  }

  const router = ms.router()
  app.root.use(prefix, router)
  router.use(async opts => {
    const { data = {}, headers = {}, uri, type } = opts
    if (headers['ignore_server_sso']) return
    const token = getToken(data, headers)
    if (token) {
      try {
        const doc = await checkToken(token)
        doc && !doc.err && (opts.user = doc)
        if (uri === verifyPath && type === 'get') return doc
      } catch (e) {}
    }
  })

  app.on('open', () => {
    const { http: { root } } = app.servers
    root.use(async (req, res, next) => {
      const { path: uri, method: type, query, body, headers } = req
      const data = { ...query, ...body }
      const token = getToken(data, headers)
      if (token) {
        try {
          const doc = await checkToken(token)
          doc && !doc.err && (req.user = doc)
          if (uri === verifyPath && type === 'GET') return res.send(doc)
        } catch (e) {}
      }
      headers['ignore_server_sso'] = '1'
      next()
    })
  })
}
