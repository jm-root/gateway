module.exports = {
  gateway: 'gateway',
  no_server_sso: 'no_server_sso',
  no_server_acl: 'no_server_acl',
  service_name: 'service_name',
  modules: {
    'jm-server-config': {
      config: {
        config: 'config',
        config_root_server: 'config_root_server'
      }
    },
    'jm-server-sso': {
      config: {
        sso: 'sso',
        sso_verify_path: 'sso_verify_path',
        sso_token_key: 'sso_token_key',
        sso_header_token_key: 'sso_header_token_key'
      }
    },
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
