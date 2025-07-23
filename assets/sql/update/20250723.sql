create table ng_version
(
    `id`      varchar(32) not null,
    `node_id` varchar(32) not null,
    `name` varchar(20) not null,
    `tag_name` varchar(20) not null,
    `html_url` varchar(200) not null,
    `body` varchar(500) not null,
    `draft` int DEFAULT '1'  not null ,
    `immutable` int DEFAULT '1' not null ,
    `prerelease` int DEFAULT '1' not null ,
    primary key (id),
    `sort` int DEFAULT NULL,
    `creator` varchar(50) DEFAULT NULL,
    `editor` varchar(50) DEFAULT NULL,
    `created_time` datetime DEFAULT (now()),
    `published_time` datetime not null,
    `modified_time` datetime DEFAULT NULL,
    `status` int DEFAULT '1',
    `is_delete` int DEFAULT '0'
);

