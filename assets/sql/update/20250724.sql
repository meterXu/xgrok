-- 已更新
alter table oauth_users
    change nickName nickname varchar(50) null;

-- 已更新
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('07abd333cbb7e56177ae73317136ac21', 'host_type', '0', '本地', 'local', 1, null, null, null, null, default, default);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('fa8b0494165c4422cce5d474a15d44a8', 'host_type', '1', '远程', 'remote', 2, null, null, null, null, default, default);

--待更新
-- ng_order
alter table ng_order add column _expired_time bigint;
alter table ng_order add column _payed_time bigint;
alter table ng_order add column _notify_time bigint;
alter table ng_order add column _will_expire_notify_time bigint;
alter table ng_order add column _expired_notify_time bigint;
alter table ng_order add column _created_time bigint;
alter table ng_order add column _refund_time bigint;
alter table ng_order add column _modified_time bigint;

update ng_order set _expired_time = unix_timestamp(expired_time)*1000;
update ng_order set _payed_time = unix_timestamp(payed_time)*1000;
update ng_order set _notify_time = unix_timestamp(notify_time)*1000;
update ng_order set _will_expire_notify_time = unix_timestamp(will_expire_notify_time)*1000;
update ng_order set _expired_notify_time = unix_timestamp(expired_notify_time)*1000;
update ng_order set _created_time = unix_timestamp(created_time)*1000;
update ng_order set _refund_time = unix_timestamp(refund_time)*1000;
update ng_order set _modified_time = unix_timestamp(modified_time)*1000;

alter table ng_order drop column expired_time;
alter table ng_order drop column payed_time;
alter table ng_order drop column notify_time;
alter table ng_order drop column will_expire_notify_time;
alter table ng_order drop column expired_notify_time;
alter table ng_order drop column created_time;
alter table ng_order drop column refund_time;
alter table ng_order drop column modified_time;

alter table ng_order change _expired_time expired_time bigint null;
alter table ng_order change _payed_time payed_time bigint null;
alter table ng_order change _notify_time notify_time bigint null;
alter table ng_order change _will_expire_notify_time will_expire_notify_time bigint null;
alter table ng_order change _expired_notify_time expired_notify_time bigint null;
alter table ng_order change _created_time created_time bigint null;
alter table ng_order change _refund_time refund_time bigint null;
alter table ng_order change _modified_time modified_time bigint null;

-- ng_client
alter table ng_client add column _created_time bigint;
alter table ng_client add column  _modified_time bigint;
update ng_client set _created_time = unix_timestamp(created_time)*1000;
update ng_client set _modified_time = unix_timestamp(modified_time)*1000;
alter table ng_client drop column created_time;
alter table ng_client drop column modified_time;
alter table ng_client change _created_time created_time bigint null;
alter table ng_client change _modified_time modified_time bigint null;

-- ng_email
alter table ng_email add column _created_time bigint;
alter table ng_email add column  _modified_time bigint;
alter table ng_email add column  _expire_time bigint;
update ng_email set _created_time = unix_timestamp(created_time)*1000;
update ng_email set _modified_time = unix_timestamp(modified_time)*1000;
update ng_email set _expire_time = unix_timestamp(expire_time)*1000;
alter table ng_email drop column created_time;
alter table ng_email drop column modified_time;
alter table ng_email drop column expire_time;
alter table ng_email change _created_time created_time bigint null;
alter table ng_email change _modified_time modified_time bigint null;
alter table ng_email change _expire_time expire_time bigint null;

-- ng_port_range
alter table ng_port_range add column _created_time bigint;
alter table ng_port_range add column _modified_time bigint;
update ng_port_range set _created_time = unix_timestamp(created_time)*1000;
update ng_port_range set _modified_time = unix_timestamp(modified_time)*1000;
alter table ng_port_range drop column created_time;
alter table ng_port_range drop column modified_time;
alter table ng_port_range change _created_time created_time bigint null;
alter table ng_port_range change _modified_time modified_time bigint null;

-- ng_product
alter table ng_product add column _created_time bigint;
alter table ng_product add column _modified_time bigint;
update ng_product set _created_time = unix_timestamp(created_time)*1000;
update ng_product set _modified_time = unix_timestamp(modified_time)*1000;
alter table ng_product drop column created_time;
alter table ng_product drop column modified_time;
alter table ng_product change _created_time created_time bigint null;
alter table ng_product change _modified_time modified_time bigint null;

-- ng_server
alter table ng_server add column _created_time bigint;
alter table ng_server add column _modified_time bigint;
alter table ng_server add column _ssl_expired_time bigint;
update ng_server set _created_time = unix_timestamp(created_time)*1000;
update ng_server set _modified_time = unix_timestamp(modified_time)*1000;
update ng_server set _ssl_expired_time = unix_timestamp(ssl_expired_time)*1000;
alter table ng_server drop column created_time;
alter table ng_server drop column modified_time;
alter table ng_server drop column ssl_expired_time;
alter table ng_server change _created_time created_time bigint null;
alter table ng_server change _modified_time modified_time bigint null;
alter table ng_server change _ssl_expired_time ssl_expired_time bigint null;

-- ng_sys_dict
alter table ng_sys_dict add column _created_time bigint;
alter table ng_sys_dict add column _modified_time bigint;
update ng_sys_dict set _created_time = unix_timestamp(created_time)*1000;
update ng_sys_dict set _modified_time = unix_timestamp(modified_time)*1000;
alter table ng_sys_dict drop column created_time;
alter table ng_sys_dict drop column modified_time;
alter table ng_sys_dict change _created_time created_time bigint null;
alter table ng_sys_dict change _modified_time modified_time bigint null;

-- ng_tunnel_service
alter table ng_tunnel_service add column _created_time bigint;
alter table ng_tunnel_service add column _modified_time bigint;
update ng_tunnel_service set _created_time = unix_timestamp(created_time)*1000;
update ng_tunnel_service set _modified_time = unix_timestamp(modified_time)*1000;
alter table ng_tunnel_service drop column created_time;
alter table ng_tunnel_service drop column modified_time;
alter table ng_tunnel_service change _created_time created_time bigint null;
alter table ng_tunnel_service change _modified_time modified_time bigint null;

-- ng_tunnel_web
alter table ng_tunnel_web add column _created_time bigint;
alter table ng_tunnel_web add column _modified_time bigint;
update ng_tunnel_web set _created_time = unix_timestamp(created_time)*1000;
update ng_tunnel_web set _modified_time = unix_timestamp(modified_time)*1000;
alter table ng_tunnel_web drop column created_time;
alter table ng_tunnel_web drop column modified_time;
alter table ng_tunnel_web change _created_time created_time bigint null;
alter table ng_tunnel_web change _modified_time modified_time bigint null;

-- oauth_clients
alter table oauth_clients add column _created_time bigint;
update oauth_clients set _created_time = unix_timestamp(created_time)*1000;
alter table oauth_clients drop column created_time;
alter table oauth_clients change _created_time created_time bigint null;

-- oauth_role
alter table oauth_role add column _created_time bigint;
alter table oauth_role add column _modified_time bigint;
update oauth_role set _created_time = unix_timestamp(created_time)*1000;
update oauth_role set _modified_time = unix_timestamp(modified_time)*1000;
alter table oauth_role drop column created_time;
alter table oauth_role drop column modified_time;
alter table oauth_role change _created_time created_time bigint null;
alter table oauth_role change _modified_time modified_time bigint null;

-- oauth_tokens
alter table oauth_tokens add column _created_time bigint;
alter table oauth_tokens add column _modified_time bigint;
alter table oauth_tokens add column _access_token_expires_at bigint;
alter table oauth_tokens add column _refresh_token_expires_at bigint;
update oauth_tokens set _created_time = unix_timestamp(created_time)*1000;
update oauth_tokens set _modified_time = unix_timestamp(modified_time)*1000;
update oauth_tokens set _access_token_expires_at = unix_timestamp(access_token_expires_at)*1000;
update oauth_tokens set _refresh_token_expires_at = unix_timestamp(refresh_token_expires_at)*1000;
alter table oauth_tokens drop column created_time;
alter table oauth_tokens drop column modified_time;
alter table oauth_tokens drop column access_token_expires_at;
alter table oauth_tokens drop column refresh_token_expires_at;
alter table oauth_tokens change _created_time created_time bigint null;
alter table oauth_tokens change _modified_time modified_time bigint null;
alter table oauth_tokens change _access_token_expires_at access_token_expires_at bigint null;
alter table oauth_tokens change _refresh_token_expires_at refresh_token_expires_at bigint null;

-- oauth_users
alter table oauth_users add column _created_time bigint;
alter table oauth_users add column _modified_time bigint;
update oauth_users set _created_time = unix_timestamp(created_time)*1000;
update oauth_users set _modified_time = unix_timestamp(modified_time)*1000;
alter table oauth_users drop column created_time;
alter table oauth_users drop column modified_time;
alter table oauth_users change _created_time created_time bigint null;
alter table oauth_users change _modified_time modified_time bigint null;

-- oauth_user_role
alter table oauth_user_role add column _created_time bigint;
alter table oauth_user_role add column _modified_time bigint;
update oauth_user_role set _created_time = unix_timestamp(created_time)*1000;
update oauth_user_role set _modified_time = unix_timestamp(modified_time)*1000;
alter table oauth_user_role drop column created_time;
alter table oauth_user_role drop column modified_time;
alter table oauth_user_role change _created_time created_time bigint null;
alter table oauth_user_role change _modified_time modified_time bigint null;

INSERT INTO ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, status, is_delete, created_time, modified_time) VALUES ('b70a9b952c2a138456bf82f793d87894', 'is_notify', '0', '未通知', 'Not notified', 1, null, null, default, default, null, null);
INSERT INTO ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, status, is_delete, created_time, modified_time) VALUES ('43a7a47100826bfaf245f9da9b7b1334', 'is_notify', '1', '已通知', 'Already notified', 2, null, null, default, default, null, null);

--ng_assets
create table ng_assets
(
    id                      varchar(32)   not null
        primary key,
    name                varchar(100)  not null,
    type              varchar(32)   not null,
    size                  varchar(32)  not null,
    path        varchar(100)   not null,
    sort                    int           null,
    creator                 varchar(50)   null,
    editor                  varchar(50)   null,
    status                  int default 1 null,
    is_delete               int default 0 null,
    created_time            bigint        null,
    modified_time           bigint        null
);

create index ng_assets_name_index
    on ng_assets (name);

INSERT INTO ng_assets (id, name, type, size, path, sort, creator, editor, status, is_delete, created_time, modified_time) VALUES ('58a29e4f73a1635c42f1369e3c6b6dc6', 'qq_group_qr', 'webp', '30.857', 'https://webspace1.oss-cn-hangzhou.aliyuncs.com/xgrok-client/qq_group_qr.webp', 1, null, null, 1, 0, null, null);
INSERT INTO ng_assets (id, name, type, size, path, sort, creator, editor, status, is_delete, created_time, modified_time) VALUES ('d1737e18d4cbcdf93219f81c3c0f0119', 'wx_group_qr', 'webp', '53.29', 'https://webspace1.oss-cn-hangzhou.aliyuncs.com/xgrok-client/wx_group_qr.webp', 2, null, null, 1, 0, null, null);


alter table ng_tunnel_web
    add is_online int default -1 null comment '是否在线';

alter table ng_tunnel_service
    add is_online int default -1 null comment '是否在线';

