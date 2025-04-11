alter table ng_tunnel_web
    modify host varchar(200) not null;

alter table ng_tunnel_service
    modify host varchar(200) not null;

alter table ng_tunnel_web
    add is_remote int default 0 null comment '1:远程服务，0:本地服务';

alter table ng_tunnel_service
    add is_remote int default 0 null comment '1:远程服务，0:本地服务';

