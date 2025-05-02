-- 20250427 待更新
alter table ng_server
    add region varchar(50) null;

alter table ng_server
    add operator varchar(50) null;

-- 20250501 待更新
alter table ng_server
    add month_total_traffic int default 0 null comment '月总流量(MB)';

alter table ng_server
    add month_used_traffic int default 0 null comment '月已用流量(MB)';

update ng_server set month_total_traffic=0 where month_total_traffic is null;
update ng_server set month_used_traffic=0 where month_used_traffic is null;