-- 已更新
alter table ng_tunnel_service
    add secret_key varchar(100) null comment '隧道密码';

alter table ng_tunnel_service
    add server_name varchar(50) null comment '对方服务名称';
