-- 未更新
-- 为 refresh_token 添加唯一索引
CREATE UNIQUE INDEX `oauth_tokens_refresh_token_unique` ON `oauth_tokens`(`refresh_token`);
