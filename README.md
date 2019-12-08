# jm-gateway

api gateway using jm-server

## 配置参数

基本配置 请参考 [jm-server] (https://github.com/jm-root/ms/packages/jm-server)

gateway 请参考 [jm-server-config] (https://github.com/jm-root/gateway/packages/jm-server-config)

如果配置了gateway，可以不配置config sso acl

config 请参考 [jm-server-config] (https://github.com/jm-root/gateway/packages/jm-server-config)

sso 请参考 [jm-server-sso] (https://github.com/jm-root/gateway/packages/jm-server-sso)

acl 请参考 [jm-server-acl] (https://github.com/jm-root/gateway/packages/jm-server-acl)

config_root_server ['gateway'] Config服务器root

no_server_sso 是否禁止SSO插件, 默认不禁止, 判断是否登录用户

no_server_acl 是否禁止ACL插件, 默认不禁止, 判断是否允许访问

serviceName ['gateway'] 链路追踪用的服务名称, 环境变量 trace_service_name 

jaeger jaeger服务器URI

## 工作流程

访问sso, 判断是否登录用户

访问acl, 判断是否允许访问

转发请求
