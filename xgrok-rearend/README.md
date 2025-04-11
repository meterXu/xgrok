# xgrok-rearend
> 可视化图表编辑器后端

说明：生产环境请使用mysql数据库，不要使用sqlite

## 一、环境要求
* node >= 14
* dotenv-cli
```shell
npm i -g dotenv-cli
```

## 二、开发
### 1、初始化数据库
```shell
npm run initDB:dev
```
其他环境的数据库初始化请指定环境变量

### 2、运行程序
```shell
npm run dev
```

### 3、swagger地址
```shell
http://localhost:11525/api/swagger-html
```

## 三、部署


### 1、修改配置文件.env.production
```shell
NODE_ENV = production
port=11525
enableSsl=false
ssl_key=''
ssl_cert=''
database_url="mysql://user:password@ip:port/database"
```

### 2、运行程序
```shell
npm run prod
```


## 四、oracle数据库支持说明
需要拷贝oracle客户端文件至`oracledb\oracledb\build\Release`
