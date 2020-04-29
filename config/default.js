module.exports = {
  lng: 'zh_CN',
  service_name: 'gateway',
  modules: {
    'jm-server-config': {
      config: {
        config_root_server: 'gateway'
      }
    },
    'jm-server-jaeger': {},
    'jm-server-sso': {},
    'jm-server-acl': {}
  }
}
