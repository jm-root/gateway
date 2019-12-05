const MS = require('jm-ms-core')
const ms = new MS()

module.exports = function (opts = {}) {
  let app = this
  let config = app.config;

  ['sso', 'sso_verify_path', 'sso_token_key', 'sso_header_token_key'].forEach(function (key) {
    process.env[key] && (opts[key] = process.env[key])
  })

  opts.sso_verify_path || (opts.sso_verify_path = '/sso/verify')
  opts.sso_token_key || (opts.sso_token_key = 'token')
  opts.sso_header_token_key || (opts.sso_header_token_key = 'authorization')

  if (opts.sso) app.use('sso', { proxy: opts.sso })

  let verifyPath = opts.sso_verify_path
  let tokenKey = opts.sso_token_key
  let headerTokenKey = opts.sso_header_token_key
  let router = ms.router()
  app.root.use(config.prefix || '', router)
  router.use(async opts => {
    opts.data || (opts.data = {})
    let token = opts.data[tokenKey]
    if (opts.headers && opts.headers[headerTokenKey] && (token = opts.headers[headerTokenKey])) {
      const parts = token.split(' ')
      if (parts.length === 2) {
        const scheme = parts[0]

        const credentials = parts[1]

        if (/^Bearer$/i.test(scheme)) {
          token = credentials
        }
      }
    }
    if (!token) return
    let data = {}
    data[tokenKey] = token
    try {
      let doc = await app.router.get(verifyPath, data)
      doc && !doc.err && (opts.user = doc)
      if (opts.uri === verifyPath && opts.type === 'get') return doc
    } catch (e) {}
  })
}
