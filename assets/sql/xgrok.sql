-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: xgrok
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('10eaf7dd-aced-4741-9c7a-fec6b40d59fa','f504b03d2533d1d226242a08a358225d074b95a00ee28a08cd10f4c7f6549e0e','2024-10-29 01:41:51.589','0_init','',NULL,'2024-10-29 01:41:51.589',0);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ng_client`
--

DROP TABLE IF EXISTS `ng_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ng_client` (
  `id` varchar(32) NOT NULL,
  `hostname` varchar(100) NOT NULL,
  `osVersion` varchar(200) NOT NULL,
  `sort` int DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ng_client_hostname_index` (`hostname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ng_email`
--

DROP TABLE IF EXISTS `ng_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ng_email` (
  `id` varchar(32) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `expire_time` datetime NOT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ng_email_email_code_index` (`email`,`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ng_order`
--

DROP TABLE IF EXISTS `ng_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ng_order` (
  `id` varchar(32) NOT NULL,
  `trade_no` varchar(100) NOT NULL,
  `product_id` varchar(32) NOT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `pay_total_amount` varchar(20) NOT NULL,
  `pay_price` varchar(20) NOT NULL,
  `pay_num` int NOT NULL DEFAULT '1',
  `payed_time` datetime DEFAULT NULL,
  `pay_status` int DEFAULT '0',
  `refund_amount` varchar(20) DEFAULT NULL,
  `refund_reason` varchar(100) DEFAULT NULL,
  `out_request_no` varchar(100) DEFAULT NULL,
  `refund_time` datetime DEFAULT NULL,
  `is_notify` int DEFAULT '0',
  `is_will_expire_notify` int DEFAULT '0',
  `is_expired_notify` int DEFAULT '0',
  `notify_time` datetime DEFAULT NULL,
  `will_expire_notify_time` datetime DEFAULT NULL,
  `expired_notify_time` datetime DEFAULT NULL,
  `alipay_qrCode` varchar(100) DEFAULT NULL,
  `alipay_traceId` varchar(100) DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  `expired_time` datetime NOT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ng_order_trade_no_alipay_traceId_index` (`trade_no`,`alipay_traceId`),
  KEY `ng_order_ng_product_id_fk` (`product_id`),
  CONSTRAINT `ng_order_ng_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `ng_product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ng_port_range`
--

DROP TABLE IF EXISTS `ng_port_range`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ng_port_range` (
  `id` varchar(32) NOT NULL,
  `server_id` varchar(32) NOT NULL,
  `min_port` int NOT NULL,
  `max_port` int NOT NULL,
  `sort` int DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ng_port_range_ng_server_id_fk` (`server_id`),
  CONSTRAINT `ng_port_range_ng_server_id_fk` FOREIGN KEY (`server_id`) REFERENCES `ng_server` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ng_port_range`
--

LOCK TABLES `ng_port_range` WRITE;
/*!40000 ALTER TABLE `ng_port_range` DISABLE KEYS */;
INSERT INTO `ng_port_range` VALUES ('a6cd1eb4c0d811ee868e0242ac120002','267acdacce3e48699b13baa22c498d6e',18000,18100,NULL,NULL,NULL,'2024-02-01 16:07:38',NULL,1,0);
/*!40000 ALTER TABLE `ng_port_range` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ng_product`
--

DROP TABLE IF EXISTS `ng_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ng_product` (
  `id` varchar(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` int DEFAULT NULL,
  `price` varchar(20) NOT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ng_product`
--

LOCK TABLES `ng_product` WRITE;
/*!40000 ALTER TABLE `ng_product` DISABLE KEYS */;
INSERT INTO `ng_product` VALUES ('5dc210d792834b82af0d8e7e56ccf052','季付计划',2,'24.9','高速服务器\n隧道数不受限\n专属域名',3,NULL,NULL,'2024-09-14 14:14:05',NULL,1,0),('6c2abc85204a47af858ddeff42234a10','月付计划',1,'9.9','高速服务器\n隧道数不受限\n专属域名',2,NULL,NULL,'2024-09-14 14:14:05',NULL,1,0),('7064c22fa5e94cb89793d36d5c28c9e6','年付计划',3,'99.9','高速服务器\n隧道数不受限\n专属域名',4,NULL,NULL,'2024-09-14 14:14:05',NULL,1,0),('98c1705616374261b651e2ad40193d7e','免费计划',0,'0','普通服务器\n一个网页隧道\n一个服务隧道',1,NULL,NULL,'2024-09-30 09:58:16',NULL,1,0);
/*!40000 ALTER TABLE `ng_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ng_server`
--

DROP TABLE IF EXISTS `ng_server`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ng_server` (
  `id` varchar(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `domain` varchar(50) NOT NULL,
  `port` int NOT NULL,
  `http_port` int DEFAULT NULL,
  `https_port` int DEFAULT NULL,
  `has_ssl` int NOT NULL,
  `ssl_expired_time` datetime NOT NULL,
  `up_speed` varchar(50) NOT NULL,
  `down_speed` varchar(50) NOT NULL,
  `sort` int DEFAULT NULL,
  `is_vip` int NOT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  `is_online` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `ng_server_domain_port_index` (`domain`,`port`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ng_server`
--

LOCK TABLES `ng_server` WRITE;
/*!40000 ALTER TABLE `ng_server` DISABLE KEYS */;
INSERT INTO `ng_server` VALUES ('267acdacce3e48699b13baa22c498d6e','app','xxx.xxx.xxx',9999,80,443,1,'2024-05-01 01:00:00','6Mbps','100Mbps',99,1,NULL,NULL,'2024-02-01 15:58:24',NULL,1,0,1);
/*!40000 ALTER TABLE `ng_server` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ng_sys_dict`
--

DROP TABLE IF EXISTS `ng_sys_dict`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ng_sys_dict` (
  `id` varchar(32) NOT NULL,
  `key` varchar(50) NOT NULL,
  `code` varchar(50) NOT NULL,
  `chn_value` varchar(100) DEFAULT NULL,
  `eng_value` varchar(100) DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ng_sys_dict_key_code_index` (`key`,`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ng_sys_dict`
--

LOCK TABLES `ng_sys_dict` WRITE;
/*!40000 ALTER TABLE `ng_sys_dict` DISABLE KEYS */;
INSERT INTO `ng_sys_dict` VALUES ('6d5994d2e9d451e2677f0e1e44f72a51','tunnel_type','1','服务','service',2,'admin','admin','2024-03-13 14:59:45',NULL,1,0),('851a53613775e0fc53200391bb9d1dd6','tunnel_type','0','站点','web',1,'admin','admin','2024-03-13 14:59:45',NULL,1,0),('a05b5009c0d411ee868e0242ac120002','http_type','http','http','http',1,'admin','admin','2024-02-01 15:36:52',NULL,1,0),('a7888ce8c0d411ee868e0242ac120002','http_type','https','https','https',2,'admin','admin','2024-02-01 15:36:52',NULL,1,0),('ccefcfeec0d411ee868e0242ac120002','service_type','tcp','tcp','tcp',1,'admin','admin','2024-02-01 15:38:01',NULL,1,0),('d0948f3fc0d411ee868e0242ac120002','service_type','udp','udp','udp',2,'admin','admin','2024-02-01 15:38:01',NULL,1,0);
/*!40000 ALTER TABLE `ng_sys_dict` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ng_tunnel_service`
--

DROP TABLE IF EXISTS `ng_tunnel_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ng_tunnel_service` (
  `id` varchar(32) NOT NULL,
  `server_id` varchar(32) NOT NULL,
  `client_id` varchar(32) NOT NULL,
  `name` varchar(50) NOT NULL,
  `host` varchar(50) NOT NULL,
  `type` int NOT NULL,
  `port` int NOT NULL,
  `remote_port` int NOT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ng_tunnel_service_ng_client_id_fk` (`client_id`),
  KEY `ng_tunnel_service_ng_server_id_fk` (`server_id`),
  CONSTRAINT `ng_tunnel_service_ng_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `ng_client` (`id`),
  CONSTRAINT `ng_tunnel_service_ng_server_id_fk` FOREIGN KEY (`server_id`) REFERENCES `ng_server` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ng_tunnel_web`
--

DROP TABLE IF EXISTS `ng_tunnel_web`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ng_tunnel_web` (
  `id` varchar(32) NOT NULL,
  `server_id` varchar(32) NOT NULL,
  `client_id` varchar(32) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `host` varchar(50) NOT NULL,
  `type` int NOT NULL,
  `port` int NOT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ng_tunnel_web_ng_client_id_fk` (`client_id`),
  KEY `ng_tunnel_web_ng_server_id_fk` (`server_id`),
  CONSTRAINT `ng_tunnel_web_ng_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `ng_client` (`id`),
  CONSTRAINT `ng_tunnel_web_ng_server_id_fk` FOREIGN KEY (`server_id`) REFERENCES `ng_server` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_clients`
--

DROP TABLE IF EXISTS `oauth_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_clients` (
  `id` varchar(32) NOT NULL,
  `client_id` varchar(50) NOT NULL,
  `client_secret` varchar(200) NOT NULL,
  `redirect_uri` varchar(200) NOT NULL,
  `created_time` datetime DEFAULT (now()),
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `oauth_clients_client_id_client_secret_index` (`client_id`,`client_secret`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_clients`
--

LOCK TABLES `oauth_clients` WRITE;
/*!40000 ALTER TABLE `oauth_clients` DISABLE KEYS */;
INSERT INTO `oauth_clients` VALUES ('0c07a0474684162f9751adb748ad33e1','app','app','http://localhost','2023-09-18 11:54:42',1,0),('d8b2c39afe43bcbabfd8580c9d4a8cfb','web','web','http://localhost','2023-09-28 20:34:27',1,0);
/*!40000 ALTER TABLE `oauth_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_role`
--

DROP TABLE IF EXISTS `oauth_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_role` (
  `id` varchar(32) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` int NOT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  `sort` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_role`
--

LOCK TABLES `oauth_role` WRITE;
/*!40000 ALTER TABLE `oauth_role` DISABLE KEYS */;
INSERT INTO `oauth_role` VALUES ('307d59c7a8cf3ee67dd0f43a16e3e532','管理员',1,'2023-10-13 14:13:31',NULL,NULL,NULL,1,0,NULL),('44c0a18278ccedea22e6ed095f7782a0','普通用户',2,'2023-10-13 14:13:31',NULL,NULL,NULL,1,0,NULL);
/*!40000 ALTER TABLE `oauth_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_tokens`
--

DROP TABLE IF EXISTS `oauth_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_tokens` (
  `id` varchar(32) NOT NULL,
  `access_token` varchar(300) NOT NULL,
  `access_token_expires_at` datetime NOT NULL,
  `client_id` varchar(50) NOT NULL,
  `refresh_token` varchar(300) NOT NULL,
  `refresh_token_expires_at` datetime NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `created_time` datetime DEFAULT (now()),
  `modified_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_tokens_access_token_index` (`access_token`),
  KEY `oauth_tokens_client_id_user_id_index` (`client_id`,`user_id`),
  CONSTRAINT `oauth_tokens_oauth_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `oauth_clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;


-- Table structure for table `oauth_user_role`
--

DROP TABLE IF EXISTS `oauth_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_user_role` (
  `id` varchar(32) NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `role_id` varchar(32) NOT NULL,
  `created_time` datetime DEFAULT (now()),
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `oauth_user_role_user_id_index` (`user_id`),
  KEY `oauth_user_role_oauth_role_id_fk` (`role_id`),
  CONSTRAINT `oauth_user_role_oauth_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `oauth_role` (`id`),
  CONSTRAINT `oauth_user_role_oauth_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `oauth_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_users`
--

DROP TABLE IF EXISTS `oauth_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_users` (
  `id` varchar(32) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `created_time` datetime DEFAULT (now()),
  `nickName` varchar(50) DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `editor` varchar(50) DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `status` int DEFAULT '1',
  `is_delete` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `oauth_users_pk` (`username`),
  KEY `users_username_password` (`username`,`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
