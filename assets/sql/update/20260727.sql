--  已更新
alter table ng_tunnel_web
    add is_real int default 1 null comment '获取客户真实IP';

-- 待更新
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, status, is_delete, created_time, modified_time) VALUES ('9b9fe4dec37fcc3243d7a0b6c8f68bd0', 'coupon_type', '1', '活动优惠券', 'activity', 1, null, null, 1, 0, null, null);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, status, is_delete, created_time, modified_time) VALUES ('6b2740bd462cd924aa58fd3e24b047e7', 'coupon_type', '2', '补偿优惠券', 'compensate', 2, null, null, 1, 0, null, null);


create table ng_coupon
(
    id                  varchar(32)   not null
        primary key,
    name                varchar(100)  not null comment '名称',
    discount            float   not null comment '折扣',
    code                varchar(100)  not null comment '优惠码',
    end_time          bigint   not null comment '开始时间',
    start_time          bigint   not null comment '结束时间',
    type                int   default 1        not null  comment  '优惠类型',
    sort                int           null,
    creator             varchar(50)   null,
    editor              varchar(50)   null,
    status              int default 1 null,
    is_delete           int default 0 null,
    created_time        bigint        null,
    modified_time       bigint        null
)  comment '优惠券表';

create index ng_coupon_code_index
    on ng_coupon (code);


create table ng_coupon_order
(
    id                  varchar(32)  not null primary key,
    coupon_id           varchar(32)  not null comment '优惠券id',
    order_id            varchar(32)  not null comment '订单id',
    creator             varchar(50)   null,
    editor              varchar(50)   null,
    status              int default 1 null,
    is_delete           int default 0 null,
    created_time        bigint        null,
    modified_time       bigint        null
)  comment '优惠券订单关联表';

create index ng_coupon_order_index
    on ng_coupon_order (coupon_id,order_id);

create table ng_coupon_order
(
    id                  varchar(32)  not null primary key,
    coupon_id           varchar(32)  not null comment '优惠券id',
    order_id            varchar(32)  not null comment '订单id',
    creator             varchar(50)   null,
    editor              varchar(50)   null,
    status              int default 1 null,
    is_delete           int default 0 null,
    created_time        bigint        null,
    modified_time       bigint        null
)  comment '优惠券订单关联表';

create index ng_coupon_order_index
    on ng_coupon_order (coupon_id,order_id);

