module.exports = {
  config_root_server: 'config_root_server',
  config: 'config',
  sso: 'sso',
  gateway: 'gateway',
  no_server_sso: 'no_server_sso',
  no_server_acl: 'no_server_acl',
  service_name: 'service_name',
  modules: {
    'jm-server-acl': {
      config: {
        acl: 'acl',
        no_acl_user: 'no_acl_user',
        acl_user_key: 'acl_user_key',
        no_role_user: 'no_role_user',
        acl_role_key: 'acl_role_key'
      }
    },
    'jm-server-jaeger': {
      config: {
        jaeger: 'jaeger'
      }
    }
  }
}
