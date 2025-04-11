-- CreateTable
CREATE TABLE `ng_port_range` (
    `id` VARCHAR(32) NOT NULL,
    `server_id` VARCHAR(32) NOT NULL,
    `min_port` INTEGER NOT NULL,
    `max_port` INTEGER NOT NULL,
    `sort` INTEGER NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified_time` DATETIME(0) NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    INDEX `ng_port_range_ng_server_id_fk`(`server_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ng_server` (
    `id` VARCHAR(32) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `domain` VARCHAR(50) NOT NULL,
    `port` INTEGER NOT NULL,
    `http_port` INTEGER NULL,
    `https_port` INTEGER NULL,
    `has_ssl` INTEGER NOT NULL,
    `ssl_expired_time` DATETIME(0) NOT NULL,
    `up_speed` VARCHAR(50) NOT NULL,
    `down_speed` VARCHAR(50) NOT NULL,
    `sort` INTEGER NULL,
    `is_vip` INTEGER NOT NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified_time` DATETIME(0) NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ng_sys_dict` (
    `id` VARCHAR(32) NOT NULL,
    `key` VARCHAR(50) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `chn_value` VARCHAR(100) NULL,
    `eng_value` VARCHAR(100) NULL,
    `sort` INTEGER NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified_time` DATETIME(0) NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    INDEX `ng_sys_dict_key_code_index`(`key`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ng_tunnel_service` (
    `id` VARCHAR(32) NOT NULL,
    `server_id` VARCHAR(32) NOT NULL,
    `client_id` VARCHAR(32) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `host` VARCHAR(50) NOT NULL,
    `type` INTEGER NOT NULL,
    `port` INTEGER NOT NULL,
    `remote_port` INTEGER NOT NULL,
    `remark` VARCHAR(100) NULL,
    `sort` INTEGER NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified_time` DATETIME(0) NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    INDEX `ng_tunnel_service_ng_client_id_fk`(`client_id`),
    INDEX `ng_tunnel_service_ng_server_id_fk`(`server_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ng_tunnel_web` (
    `id` VARCHAR(32) NOT NULL,
    `server_id` VARCHAR(32) NOT NULL,
    `client_id` VARCHAR(32) NOT NULL,
    `name` VARCHAR(50) NULL,
    `host` VARCHAR(50) NOT NULL,
    `type` INTEGER NOT NULL,
    `port` INTEGER NOT NULL,
    `remark` VARCHAR(100) NULL,
    `sort` INTEGER NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified_time` DATETIME(0) NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    INDEX `ng_tunnel_web_ng_client_id_fk`(`client_id`),
    INDEX `ng_tunnel_web_ng_server_id_fk`(`server_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_clients` (
    `id` VARCHAR(32) NOT NULL,
    `client_id` VARCHAR(50) NOT NULL,
    `client_secret` VARCHAR(200) NOT NULL,
    `redirect_uri` VARCHAR(200) NOT NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    INDEX `oauth_clients_client_id_client_secret_index`(`client_id`, `client_secret`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_tokens` (
    `id` VARCHAR(32) NOT NULL,
    `access_token` VARCHAR(300) NOT NULL,
    `access_token_expires_at` DATETIME(0) NOT NULL,
    `client_id` VARCHAR(50) NOT NULL,
    `refresh_token` VARCHAR(300) NOT NULL,
    `refresh_token_expires_at` DATETIME(0) NOT NULL,
    `user_id` VARCHAR(32) NOT NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified_time` DATETIME(0) NULL,

    INDEX `oauth_tokens_access_token_index`(`access_token`),
    INDEX `oauth_tokens_client_id_user_id_index`(`client_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_users` (
    `id` VARCHAR(32) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `nickName` VARCHAR(50) NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `modified_time` DATETIME(0) NULL,
    `sort` INTEGER NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `oauth_users_pk`(`username`),
    INDEX `users_username_password`(`username`, `password`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_user_role` (
    `id` VARCHAR(32) NOT NULL,
    `user_id` VARCHAR(32) NOT NULL,
    `role_id` VARCHAR(32) NOT NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `modified_time` DATETIME(0) NULL,
    `sort` INTEGER NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    INDEX `oauth_user_role_user_id_index`(`user_id`),
    INDEX `oauth_user_role_oauth_role_id_fk`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_role` (
    `id` VARCHAR(32) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `type` INTEGER NOT NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified_time` DATETIME(0) NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,
    `sort` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ng_client` (
    `id` VARCHAR(32) NOT NULL,
    `hostname` VARCHAR(100) NOT NULL,
    `osVersion` VARCHAR(200) NOT NULL,
    `sort` INTEGER NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified_time` DATETIME(0) NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    INDEX `ng_client_user_id_name_index`(`hostname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ng_email` (
    `id` VARCHAR(32) NOT NULL,
    `email` VARCHAR(100) NULL,
    `code` VARCHAR(20) NULL,
    `sort` INTEGER NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `expire_time` DATETIME(0) NOT NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified_time` DATETIME(0) NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    INDEX `ng_email_email_code_index`(`email`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ng_order` (
    `id` VARCHAR(32) NOT NULL,
    `trade_no` VARCHAR(100) NOT NULL,
    `product_id` VARCHAR(32) NOT NULL,
    `remark` VARCHAR(100) NULL,
    `pay_total_amount` VARCHAR(20) NOT NULL,
    `pay_price` VARCHAR(20) NOT NULL,
    `pay_num` INTEGER NOT NULL DEFAULT 1,
    `payed_time` DATETIME(0) NULL,
    `pay_status` INTEGER NULL DEFAULT 0,
    `refund_time` DATETIME(0) NULL,
    `is_notify` INTEGER NULL DEFAULT 0,
    `notify_time` DATETIME(0) NULL,
    `alipay_qrCode` VARCHAR(100) NULL,
    `alipay_traceId` VARCHAR(100) NULL,
    `sort` INTEGER NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `created_time` DATETIME(0) NULL DEFAULT (now()),
    `modified_time` DATETIME(0) NULL,
    `expired_time` DATETIME(0) NOT NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    INDEX `ng_order_ng_product_id_fk`(`product_id`),
    INDEX `ng_order_orderId_alipay_traceId_index`(`trade_no`, `alipay_traceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ng_product` (
    `id` VARCHAR(32) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` INTEGER NULL,
    `price` VARCHAR(20) NOT NULL,
    `remark` VARCHAR(100) NULL,
    `sort` INTEGER NULL,
    `creator` VARCHAR(50) NULL,
    `editor` VARCHAR(50) NULL,
    `created_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `modified_time` DATETIME(0) NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_delete` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ng_port_range` ADD CONSTRAINT `ng_port_range_ng_server_id_fk` FOREIGN KEY (`server_id`) REFERENCES `ng_server`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ng_tunnel_service` ADD CONSTRAINT `ng_tunnel_service_ng_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `ng_client`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ng_tunnel_service` ADD CONSTRAINT `ng_tunnel_service_ng_server_id_fk` FOREIGN KEY (`server_id`) REFERENCES `ng_server`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ng_tunnel_web` ADD CONSTRAINT `ng_tunnel_web_ng_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `ng_client`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ng_tunnel_web` ADD CONSTRAINT `ng_tunnel_web_ng_server_id_fk` FOREIGN KEY (`server_id`) REFERENCES `ng_server`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `oauth_tokens` ADD CONSTRAINT `oauth_tokens_oauth_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `oauth_clients`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `oauth_user_role` ADD CONSTRAINT `oauth_user_role_oauth_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `oauth_role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `oauth_user_role` ADD CONSTRAINT `oauth_user_role_oauth_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `oauth_users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ng_order` ADD CONSTRAINT `ng_order_ng_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `ng_product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

