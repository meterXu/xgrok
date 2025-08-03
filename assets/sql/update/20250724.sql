-- 已更新
alter table oauth_users
    change nickName nickname varchar(50) null;

-- 已更新
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('07abd333cbb7e56177ae73317136ac21', 'host_type', '0', '本地', 'local', 1, null, null, null, null, default, default);
INSERT INTO xgrok.ng_sys_dict (id, `key`, code, chn_value, eng_value, sort, creator, editor, created_time, modified_time, status, is_delete) VALUES ('fa8b0494165c4422cce5d474a15d44a8', 'host_type', '1', '远程', 'remote', 2, null, null, null, null, default, default);

--待更新
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
