module.exports = {
  config_root_server: 'config_root_server',
  config: 'config',
  sso: 'sso',
  acl: 'acl',
  gateway: 'gateway',
  no_server_sso: 'no_server_sso',
  no_server_acl: 'no_server_acl',
  service_name: 'service_name',
  modules: {
    'jm-server-jaeger': {
      config: {
        jaeger: 'jaeger'
      }
    }
  }
}
