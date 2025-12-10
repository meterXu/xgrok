-- 已更新
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, status, is_delete, created_time, modified_time) VALUES ('7e60fbd3444466a3e9022b76d2c0a97e', 'is_online', '1', '在线', 'online', 1, null, null, 1, 0, null, null);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, status, is_delete, created_time, modified_time) VALUES ('d4150ebad2ac6c8dd2d5b17301853fc4', 'is_online', '0', '离线', 'offline', 2, null, null, 1, 0, null, null);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, status, is_delete, created_time, modified_time) VALUES ('d0ec5df10e610046c2054445d70402cb', 'is_vip', '1', '付费使用', 'vip', 1, null, null, 1, 0, null, null);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, status, is_delete, created_time, modified_time) VALUES ('c2988f003403657ab8cb39b7ed882bf8', 'is_vip', '0', '免费使用', 'free', 2, null, null, 1, 0, null, null);

-- 已更新
CREATE INDEX idx_ng_order_pay_status ON ng_order (pay_status, is_delete, created_time);
CREATE INDEX idx_oauth_users_status ON oauth_users (status, is_delete, created_time);


create table xgrok.ng_permission
(
    id            varchar(32)              not null
        primary key,
    product_id    varchar(32)              not null,
    code          varchar(20)              null,
    value         varchar(20)              null,
    remark        varchar(20)              null,
    sort          int                      null,
    creator       varchar(50)              null,
    editor        varchar(50)              null,
    created_time  datetime default (now()) null,
    modified_time datetime                 null,
    status        int      default 1       null,
    is_delete     int      default 0       null
);

