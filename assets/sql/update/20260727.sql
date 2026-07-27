--  未更新
alter table ng_tunnel_web
    add is_real int default 1 null comment '获取客户真实IP';
