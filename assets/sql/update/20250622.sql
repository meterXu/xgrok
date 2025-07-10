-- 已更新
alter table ng_server
    add type int default 1 not null comment '1:ngrok,2:frp';

INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('bd318ede6081df62e4c61f13f916d44d', 'server_type', '1', 'ngrok', 'ngrok', 1, 'admin', 'admin', null, null, 1, 0);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('297696c4ac0b2496211b93104afb95bb', 'server_type', '2', 'frp', 'frp', 2, 'admin', 'admin', null, null, 1, 0);


UPDATE xgrok.ng_sys_dict SET `key` = 'service_type' WHERE id = 'ccefcfeec0d411ee868e0242ac120002';
UPDATE xgrok.ng_sys_dict SET `key` = 'service_type' WHERE id = 'd0948f3fc0d411ee868e0242ac120002';


alter table ng_port_range
    add type int default 1 null comment '1:tcp,2:udp';


-- 已更新
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('06ca06c13f810e296c690cc92c15b179', 'pay_status', '0', '未交易', 'unPayment', null, null, null, default, null, default, default);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('81c0862810f92b3ed5e32f3b98df635e', 'pay_status', '1', '交易成功', 'paymentSuccess', null, null, null, default, null, default, default);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('da6bb51168cb054d0b447402ce4456f9', 'pay_status', '2', '交易失败,交易关闭', 'paymentClose', null, null, null, default, null, default, default);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('52bab9c71bb948e31a2108151e8973f2', 'pay_status', '3', '退款', 'paymentRefund', null, null, null, default, null, default, default);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('c5b6a3c4da4deca86563d8682dbc98bc', 'pay_status', '4', '交易完成', 'paymentFinished', null, null, null, default, null, default, default);

INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('1e32d4c3e54f74963be4cceac6f4819b', 'status', '0', '禁用', 'disable', 2, null, null, default, null, default, default);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('e8a015fa1a057e71780b700fb0534bbc', 'status', '1', '启用', 'enable', 1, null, null, default, null, default, default);

INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('5f3043f7da69c01c138a41313fb5d613', 'is_delete', '0', '未删除', 'unDelete', 1, null, null, default, null, default, default);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('7886aacd76bb26e8191eeb2d431f20ae', 'is_delete', '1', '已删除', 'delete', 2, null, null, default, null, default, default);
