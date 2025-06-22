-- 待更新
alter table ng_server
    add type int default 1 not null comment '1:ngrok,2:frp';

INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('bd318ede6081df62e4c61f13f916d44d', 'server_type', '1', 'ngrok', 'ngrok', 1, 'admin', 'admin', 'default', null, 1, 0);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('297696c4ac0b2496211b93104afb95bb', 'server_type', '2', 'frp', 'frp', 2, 'admin', 'admin', 'default', null, 1, 0);

UPDATE xgrok.ng_sys_dict SET `key` = 'service_type' WHERE id = 'ccefcfeec0d411ee868e0242ac120002';
UPDATE xgrok.ng_sys_dict SET `key` = 'service_type' WHERE id = 'd0948f3fc0d411ee868e0242ac120002';

