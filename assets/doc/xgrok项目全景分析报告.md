# xgrok 项目全景分析报告

> 分析日期：2026-07-13

---

## 一、项目概述

**xgrok** 是一个内网穿透/代理穿透工具平台，让用户将本地服务通过安全隧道暴露到公网。项目采用 **GPL-3.0** 协议开源，官网为 [https://www.xdo.icu](https://www.xdo.icu/)，作者 isaac (meterXu)。

整个项目是一个包含 **7 个子项目** 的 monorepo（非 npm workspaces 管理，各子项目独立构建部署），统一使用 Node.js 22.21.1（Volta 管理）。

---

## 二、子项目总览

```
xgrok/                              # Monorepo 根目录
├── xgrok-client/                   # Electron 桌面客户端 + Vue 3 前端
├── xgrok-client-web/               # Koa Web 服务器（浏览器版客户端）
├── xgrok-manage/                   # Vue 3 + TS 后台管理系统
├── xgrok-portal/                   # SvelteKit 官网/落地页
├── xgrok-rearend/                  # Koa 后端 API 服务（核心）
├── xgrok-tool/                     # 独立工具脚本（违规通知邮件）
├── assets/                         # 静态资源（图标、SQL、文档）
├── Dockerfile                      # Docker 构建配置
├── xgrok.yml                       # docker-compose 配置
└── LICENSE                         # GPL-3.0
```

| 子项目 | 版本 | 技术栈 | 说明 |
|--------|------|--------|------|
| xgrok-client | 1.1.9 | Electron 31 + Vue 3 + Vite 5 | 桌面客户端 |
| xgrok-client-web | 1.1.6 | Koa 2 + Babel | Web 版客户端服务端 |
| xgrok-manage | 0.0.0 | Vue 3 + TypeScript + Vite 6 | 后台管理面板 |
| xgrok-portal | 0.0.1 | SvelteKit 2 + Svelte 5 | 官方网站 |
| xgrok-rearend | 1.0.2 | Koa 2 + Prisma 4 + MySQL | 核心后端 API |
| xgrok-tool | 1.0.0 | Node.js + Resend | 管理工具脚本 |

---

## 三、架构全景图

```
                          ┌──────────────────────┐
                          │    xgrok-portal       │
                          │  (SvelteKit 官网)      │
                          │  公开访问，无需认证     │
                          └──────────────────────┘

    ┌──────────────────────────────────────────────────────────────┐
    │                       xgrok-rearend                         │
    │                    (核心后端 API 服务)                        │
    │                                                              │
    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
    │  │ OAuth2   │  │ REST API │  │WebSocket │  │  Worker      │ │
    │  │ 认证服务 │  │ 业务接口 │  │ 实时推送 │  │  后台线程    │ │
    │  └──────────┘  └──────────┘  └──────────┘  └─────────────┘ │
    │                                                              │
    │  ┌──────────────────────────────────────────────────────┐   │
    │  │              MySQL (Prisma ORM)                      │   │
    │  │  用户/隧道/订单/服务器/端口范围/字典/权限             │   │
    │  └──────────────────────────────────────────────────────┘   │
    │                                                              │
    │  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
    │  │ Alipay   │  │  Email   │  │  GitHub Releases         │  │
    │  │ 支付宝   │  │ Resend   │  │  版本更新检查             │  │
    │  └──────────┘  └──────────┘  └──────────────────────────┘  │
    │                                                              │
    │  端口: 11525 (dev) / 3012 (prod)                             │
    └──────────────────────────────────────────────────────────────┘
           ▲                    ▲                    ▲
           │                    │                    │
    ┌──────┴──────┐    ┌───────┴───────┐    ┌──────┴──────┐
    │ xgrok-client │    │xgrok-client-  │    │ xgrok-manage│
    │  (Electron)  │    │    web        │    │  (Vue 3)    │
    │              │    │  (Koa Server) │    │  后台管理    │
    │ 调用后端API  │    │  端口: 8181   │    │  调用后端API │
    │ 管理本地隧道 │    │  管理本地隧道  │    │  部署到后端  │
    └──────┬───────┘    └──────┬────────┘    │  静态目录    │
           │                   │              └─────────────┘
           │  IPC              │  HTTP API
           ▼                   ▼
    ┌──────────────────────────────────────┐
    │           xgrok-core                 │
    │        (隧道核心可执行文件)            │
    │                                      │
    │  支持 ngrok 和 frp 两种隧道引擎       │
    │  通过 YAML 配置文件控制行为           │
    │  HTTP/HTTPS/TCP/UDP/STCP 代理        │
    └──────────────────────────────────────┘
```

### 数据流关系

1. **xgrok-rearend** 是中枢后端——所有其他组件都与其通信
2. **xgrok-client-web** 构建时依赖 xgrok-client：其 `build.js` 调用 xgrok-client 的 `build:brower`，将构建产物复制到 `web/` 目录
3. **xgrok-manage** 通过 `deploy` 脚本将构建产物复制到 `xgrok-rearend/static/web`，实现统一部署
4. **xgrok-portal** 独立部署，通过 SvelteKit adapter-node
5. **xgrok-tool** 独立脚本，不与其他项目关联

---

## 四、各子项目详细分析

### 4.1 xgrok-rearend（核心后端）

**定位**：整个平台的中央 API 网关和管理服务。

**技术栈**：Koa 2 + Prisma 4 (MySQL) + OAuth2 + WebSocket + Alipay SDK

**数据库表（16 张，`ng_` 前缀）：**

| 表名 | 用途 |
|------|------|
| ng_server | 隧道服务器节点 |
| ng_client | 注册客户端设备 |
| ng_tunnel_web | Web 隧道配置（HTTP/HTTPS） |
| ng_tunnel_service | 服务隧道配置（TCP/UDP） |
| ng_port_range | 服务器端口范围分配 |
| ng_product | 捐赠产品/套餐 |
| ng_order | 捐赠支付订单 |
| ng_assets | 上传文件资产 |
| ng_email | 邮箱验证码 |
| ng_permission | 权限记录 |
| oauth_users | 用户 |
| oauth_clients | OAuth2 客户端 |
| oauth_tokens | OAuth2 令牌 |
| oauth_user_role | 用户角色关联 |
| oauth_role | 角色定义 |
| SysDict | 系统字典 |

**API 控制器（14 个）：**

| 控制器 | 路由前缀 | 功能 |
|--------|----------|------|
| userController | /api/user/* | 用户隧道配置、名称检查、套餐查询、隧道计数、WebSocket 通知 |
| orderController | /api/order/* | 订单 CRUD、支付检查、退款 |
| gatewayController | /api/gateway/* | 支付宝支付网关与回调 |
| serverController | /api/server/* | 服务器节点管理 |
| clientController | /api/client/* | 客户端设备管理 |
| tunnelWebController | /api/tunnelWeb/* | Web 隧道 CRUD |
| tunnelServiceController | /api/tunnelService/* | 服务隧道 CRUD |
| productController | /api/product/* | 产品/套餐管理 |
| portRangeController | /api/portRange/* | 端口范围与空闲端口分配 |
| emailController | /api/email/* | 邮件记录管理 |
| systemController | /api/system/* | 仪表盘统计（销量、订单、用户、隧道、延迟、流量） |
| versionController | /api/version/* | 版本信息（从 GitHub Releases 获取） |
| sysDictController | /api/sysDict/* | 系统字典 |
| assetsController | /api/assets/* | 资产查询 |

**OAuth 认证端点（/oauth 前缀）：**

| 端点 | 方法 | 功能 |
|------|------|------|
| /oauth/authorize | POST | 密码模式获取 Token |
| /oauth/refreshToken | POST | 刷新 Token |
| /oauth/register | POST | 注册 |
| /oauth/sendValidateCode | GET | 发送邮箱验证码 |
| /oauth/validateCode | POST | 验证邮箱验证码 |
| /oauth/checkUserIsExist | GET | 检查用户是否存在 |
| /oauth/changePwd | POST | 修改密码 |

**核心特性：**

- **支付系统**：完整支付宝集成（预创建二维码、查询、关闭、退款）+ 每分钟轮询未支付订单（最多 5 次）
- **后台 Worker**：订单轮询调度（60s 循环）、套餐过期检查（30 分钟/次，过期前 24 小时邮件提醒）
- **WebSocket 实时推送**：挂载在 `/websockets`，支持按用户/设备/广播 4 种模式推送消息
- **免费用户限制**：1 个 Web 隧道 + 1 个服务隧道，捐赠后解锁无限数量
- **Token 有效期**：Access Token 7 天，Refresh Token 100 年（36500 天）
- **Token 签名机制**：生产环境使用 MD5(realToken + time + 'isaacxu') 增强安全性

---

### 4.2 xgrok-client（Electron 桌面客户端）

**定位**：完整的桌面客户端，直接管理 xgrok-core 进程和隧道。

**技术栈**：Electron 31 + Vue 3 + Vite 5 + Element Plus + Tailwind CSS 4 + Pinia

**Electron 主进程架构：**

```
src/main.js                     # Electron 入口
├── 单实例锁（防止重复启动）
├── 启动时清理孤儿 xgrok-core 进程
├── 窗口管理（1000x700，无边框）
├── 系统托盘（显示/隐藏/检查更新/退出）
├── 生命周期管理（退出时杀进程、保存配置）
│
├── src/ipc/preload.js          # contextBridge 暴露 window.electronAPI
│   ├── xgrok 通道: turnOn/Off/Restart, 窗口操作
│   └── system 通道: 系统信息, 端口检测, 日志, 更新, 配置
│
├── src/ipc/backend.js          # IPC 处理器注册
│   ├── xgrok → src/libs/backend/xgrok.js
│   └── system → src/libs/backend/system.js
│
├── src/libs/backend/xgrok.js   # ★ 隧道核心引擎
│   ├── turnOn: 生成 YAML → 启动代理 → 启动 xgrok-core → 验证状态
│   ├── turnOff: 删配置 → 停心跳 → 杀进程
│   ├── saveYamlConf: 支持 ngrok 和 frp 两种 YAML 格式
│   ├── 本地代理: HTTP 代理(http-proxy), TCP 代理(net.Server), UDP 代理(dgram)
│   └── 心跳监控: Worker 线程每 3 秒检测进程存活
│
├── src/libs/backend/system.js  # 系统工具
│   ├── getSystemInfo: 设备ID(node-machine-id) + 主机名 + OS 版本
│   ├── checkPort: TCP 端口可用性检测
│   ├── getLog: 日志文件分段读取
│   └── 配置管理: JSON 文件持久化, auto-launch 开机启动
│
├── src/libs/util.js            # 公共工具
│   ├── 进程管理: killPid, checkProcess, findProcessId
│   ├── 网络检测: checkServerOnline, checkTcpOnline, checkUrl
│   └── 自动更新: electron-updater 集成
│
└── src/works/heartBeat.js      # Worker 线程
    └── 每 3 秒检测 xgrok-core PID 存活，死亡则触发重启
```

**双模式运行：**

| 模式 | 数据源 | 判断条件 |
|------|--------|----------|
| Electron | `window.electronAPI`（IPC 通信） | `VITE_APP_mode === 'electron'` |
| Browser | Koa 后端 HTTP API | `VITE_APP_mode === 'browser'` |

**隧道引擎支持：**

| 引擎 | YAML 格式 | 支持协议 |
|------|-----------|----------|
| ngrok | server_addr + tunnels | HTTP, TCP |
| frp | serverAddr + proxies/visitors | HTTP, TCP, UDP, STCP |

**构建流程：**

```
src/ → (javascript-obfuscator) → frame/     # 代码混淆
view/ → (Vite) → dist/                       # 前端构建
frame/ + dist/ + execute/ + public/ → (electron-builder) → DMG/NSIS/AppImage
```

**发布目标**：macOS (DMG/ZIP, arm64)、Windows (NSIS)、Linux (AppImage)

---

### 4.3 xgrok-client-web（Web 版客户端服务端）

**定位**：为浏览器用户提供隧道管理能力的 Koa Web 服务器，Docker 部署。

**技术栈**：Koa 2 + OAuth2 + Swagger + Babel

**后端 API（Koa）：**

| 端点 | 方法 | 功能 |
|------|------|------|
| /api/config/appConfig | GET/PUT | 读写应用配置 |
| /api/system/info | GET | 系统信息 |
| /api/system/turnOn | PUT | 启动隧道 |
| /api/system/turnOff | PUT | 停止隧道 |
| /api/system/turnRestart | PUT | 重启隧道 |
| /api/system/log | GET | 获取日志 |
| /api/system/checkWeb | GET | Web 隧道在线检测 |
| /api/system/checkService | GET | 服务隧道在线检测 |

**架构特点**：服务代理模式——Controller → Service 不直接实现功能，而是代理调用 xgrok-client 中的 Node.js 模块。

**构建流程（build.js）：**

1. 清空 `web/` 目录
2. 在 `../xgrok-client/` 中执行 `npm run build:brower`
3. 将 xgrok-client 构建产物复制到 `web/`
4. Babel 编译 `src/` 到 `dist/`

**Docker 部署**：端口 8181，配置持久化 `/tmp/xgrok:/xgrok/conf`。

---

### 4.4 xgrok-manage（后台管理系统）

**定位**：管理员使用的后台管理面板，管理用户、订单、服务器。

**技术栈**：Vue 3 + TypeScript + Vite 6 + Element Plus 2 + ECharts 6 + Pinia 3

**路由与页面：**

| 路由 | 页面 | 功能 |
|------|------|------|
| /login | Login.vue | 邮箱密码登录（MD5 加密） |
| /dashboard | Dashboard.vue | 统计仪表盘（6 个图表） |
| /user | UserList.vue | 用户 CRUD、隧道查看、批量操作 |
| /order | OrderList.vue | 订单 CRUD、支付状态管理 |
| /server | ServerList.vue | 服务器 CRUD、端口范围管理 |
| /error/403 | NoPermission.vue | 403 无权限页 |
| /error/404 | NotFound.vue | 404 页面 |

**仪表盘图表（ECharts 6）：**

1. 销售额趋势图（折线图）
2. 产品销售占比（饼图）
3. 用户订单排行（横向柱状图）
4. 用户隧道排行（横向柱状图）
5. 隧道类型分布（环形图）
6. 服务器使用分布（环形图）

**部署**：`npm run deploy` 构建后复制到 `../xgrok-rearend/static/web`，由后端直接托管。

---

### 4.5 xgrok-portal（官方网站）

**定位**：公开的营销落地页，提供下载入口和文档。

**技术栈**：SvelteKit 2 + Svelte 5 + Vite 7 + Tailwind CSS 4

**路由：**

| 路由 | 功能 |
|------|------|
| / | 首页：Hero + 下载按钮（Windows/Mac/Docker）+ 版本号 |
| /document/termsOfService | 服务条款（Markdown 渲染） |
| /document/privacyAgreement | 隐私协议（Markdown 渲染） |

**特性**：
- SSR 服务端渲染，版本号从后端 API 动态获取
- 静态度极高（2 个主路由）
- GitHub Fork 彩带链接
- 百度统计集成

---

### 4.6 xgrok-tool（管理工具）

**定位**：独立的运维脚本，发送内容安全违规通知邮件。

**技术栈**：Node.js + Resend API

**功能**：向违规隧道用户发送中文邮件通知，告知账号已暂停 24 小时。收件人和 API Key 需手动填入，属于半自动化运维工具。

---

## 五、前端状态管理（Pinia）

全局 Store（`xgrok-client/view/store/index.js`）管理以下状态：

| 状态 | 类型 | 说明 |
|------|------|------|
| token / refreshToken | ref | OAuth2 令牌（自动从 localStorage 恢复） |
| userInfo | shallowRef | 用户信息 |
| pid | ref | xgrok-core 进程 ID |
| selectedServer | shallowReactive | 当前连接服务器 |
| clientId | ref | 客户端 ID |
| plan | reactive | 捐赠计划信息 |
| orderStatus | shallowReactive | 订单支付状态 |
| configIsLock | ref | 配置锁定标志 |
| percentage | ref | 服务启动进度 |
| systemInfo | shallowReactive | 系统信息 |
| appSetting | shallowReactive | 应用设置（主题、自动服务器等） |
| tunnelCount | reactive | 隧道计数（Web/Service） |
| systemTheme | ref | 系统主题 |

---

## 六、前端 API 实例设计

前端定义了 **5 个 Axios 实例**，按 API 域和认证策略分离：

| 实例 | 用途 | 认证 |
|------|------|------|
| axios (baseApi) | 主业务 API | Bearer Token |
| axiosNoToken | 主业务 API（公开接口） | 无 |
| axiosSSO | SSO 认证 API | Bearer Token |
| axiosSSONoToken | SSO 认证 API（公开接口） | 无 |
| axiosWebClient | 本地 WebClient API（Koa 后端） | 无（本地服务） |

---

## 七、安全机制

| 机制 | 说明 |
|------|------|
| OAuth2 密码模式 | 用户名密码换取 Access/Refresh Token |
| Token 签名 | 生产环境 Token = MD5(realToken + timestamp + 'isaacxu') |
| 密码加密 | 前端 MD5 哈希后传输 |
| 支付宝签名验证 | `alipaySdk.checkNotifySignV2()` 验证回调 |
| 代码混淆 | `javascript-obfuscator` 混淆 Electron 主进程代码 |
| 单实例锁 | `app.requestSingleInstanceLock()` 防止多开 |
| 孤儿进程清理 | 启动时自动清理残留的 xgrok-core 进程 |

---

## 八、外部依赖服务

| 服务 | 地址 | 用途 |
|------|------|------|
| 主 API | https://app.xdo.icu/service/api | 用户管理、隧道配置、支付 |
| SSO 认证 | https://app.xdo.icu/service/oauth | OAuth2 认证、注册 |
| WebSocket | wss://app.xdo.icu/ws | 实时推送（订单、通知） |
| 支付宝 | openapi.alipay.com / openapi-sandbox.dl.alipaydev.com | 支付 |
| 邮件 | Resend API | 验证码、通知邮件 |
| GitHub | api.github.com/repos/meterXu/xgrok | 版本更新检查 |
| 百度统计 | hm.baidu.com | 官网访问统计 |

---

## 九、端口映射

| 项目 | 开发端口 | 生产端口 |
|------|----------|----------|
| xgrok-rearend | 11525 | 3012 |
| xgrok-client-web | — | 8181 (Docker) |
| xgrok-client (Vite dev) | 5173 | — |
| xgrok-manage (Vite dev) | 4000 | — |
| xgrok-portal (SvelteKit dev) | 5173 | — |

---

## 十、部署架构

```
┌─────────────────────────────────────────────────┐
│                  Docker (xgrok.yml)              │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  meterxu/xgrok:latest                      │  │
│  │  (基于 node:22-bullseye-slim)              │  │
│  │                                            │  │
│  │  /xgrok/                                   │  │
│  │  ├── xgrok-client-web/   (Koa Server)      │  │
│  │  │   ├── web/            (前端静态文件)     │  │
│  │  │   └── dist/           (后端编译产物)     │  │
│  │  ├── xgrok-client/                         │  │
│  │  │   ├── src/            (Node.js 模块)    │  │
│  │  │   └── node_modules/                     │  │
│  │  └── conf/              ← 持久化挂载        │  │
│  │                                              │  │
│  │  端口: 8181                                 │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  Volumes: /tmp/xgrok → /xgrok/conf               │
│  Restart: always                                 │
└─────────────────────────────────────────────────┘

独立部署:
  xgrok-rearend    → 直接 Node.js 部署（含内置 xgrok-manage 静态文件）
  xgrok-portal     → SvelteKit adapter-node 独立部署
```

---

## 十一、构建流水线

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ xgrok-client │────▶│ xgrok-client-web │────▶│  Docker Image   │
│  build:brower│     │    build.js      │     │  meterxu/xgrok  │
│  (Vite 构建) │     │  复制前端产物     │     │  (端口 8181)    │
└──────────────┘     │  Babel 编译后端   │     └─────────────────┘
                     └──────────────────┘

┌──────────────┐     ┌──────────────────┐
│ xgrok-client │────▶│  Desktop 安装包   │
│    build     │     │  DMG/NSIS/AppImage│
│  (混淆+打包) │     │  (GitHub Release) │
└──────────────┘     └──────────────────┘

┌──────────────┐     ┌──────────────────┐
│ xgrok-manage │────▶│  xgrok-rearend   │
│   deploy     │     │  static/web/     │
│  (Vite 构建) │     │  (统一部署)       │
└──────────────┘     └──────────────────┘
```

---

## 十二、技术决策亮点

1. **双模式代码复用**：同一套 Vue 前端代码通过 `clientType` 切换 Electron IPC 和 HTTP API，最大化代码复用
2. **多引擎支持**：同时兼容 ngrok 和 frp 两种隧道引擎，通过 YAML 配置格式区分
3. **心跳监控**：Worker 线程每 3 秒检测进程存活，自动重启异常退出的 xgrok-core
4. **服务代理模式**：Web 端的 Koa 后端不重复实现功能，而是代理调用 xgrok-client 的已有模块
5. **5 个 Axios 实例**：清晰分离不同 API 域和认证策略
6. **代码混淆**：Electron 主进程源码通过 javascript-obfuscator 保护
7. **一体化部署**：管理后台构建后内嵌到后端静态目录，减少部署复杂度
