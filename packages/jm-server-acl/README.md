# jm-server-acl

acl plugin for jm-server using jm-acl

## config

acl ACL服务器URI

no_acl_user 禁止添加acl_user变量到opts.headers, 默认不禁止

acl_user_key ['acl_user'] 鉴权成功后附加到headers中的key, 例如 headers.acl_user
