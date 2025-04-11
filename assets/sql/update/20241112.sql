-- add column
alter table ng_order
    add is_will_expire_notify int default 0 null after is_notify;
alter table ng_order
    add is_expired_notify int default 0 null after is_will_expire_notify;
alter table ng_order
    add will_expire_notify_time datetime null after notify_time;
alter table ng_order
    add expired_notify_time datetime null after will_expire_notify_time;