module.exports = {
  debug: true,
  port: 3000,
  gateway: 'http://gateway.test.jamma.cn' // 可选 如果配置了gateway, config sso acl 都可以不配置
  // config: 'http://gateway.test.jamma.cn/config', // 可选 如果不填，必须设置gateway
  // sso: 'http://gateway.test.jamma.cn/sso', // 可选 如果不填，必须设置gateway
  // acl: 'http://gateway.test.jamma.cn/acl',
}
