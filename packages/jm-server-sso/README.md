# jm-server-sso

sso plugin for jm-server using jm-sso

拦截所有请求，取 opts.headers.authorization 或者 opts.data.token 做为 token ，访问sso服务器，获取用户信息，如果存在就保存到 opts.user 中

## 依赖

jm-sso@2.0.0 及以上版本

## config

sso SSO服务器URI

sso_verify_path ['/sso/verify'] sso服务器验证token的请求路径，默认/sso/verify

sso_token_key ['token'] token的键名

sso_header_token_key ['authorization'] headers中的token的键名
