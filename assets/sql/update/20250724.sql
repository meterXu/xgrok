-- 已更新
alter table oauth_users
    change nickName nickname varchar(50) null;

-- 待更新
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('07abd333cbb7e56177ae73317136ac21', 'host_type', '0', '本地', 'local', 1, null, null, 'default', null, default, default);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('fa8b0494165c4422cce5d474a15d44a8', 'host_type', '1', '远程', 'remote', 2, null, null, 'default', null, default, default);
