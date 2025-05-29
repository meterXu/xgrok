# xgrok
![tag](https://img.shields.io/github/tag/meterXu/xgrok.svg)
![license](https://img.shields.io/github/license/meterXu/xgrok.svg)

> 应用代理访问工具

官网：https://www.xdo.icu/

## 一、安装
### Windows
直接官网下载exe文件进行安装。
### MacOS
直接官网下载dmg文件进行安装，如果打开程序遇到“已损坏，无法打开”的问题，则执行如下命令：
```bash
sudo xattr -r -d com.apple.quarantine /Applications/xgrok.app
```
然后再次打开即可。

**相关参考**
1. “Apple无法验证“xgrok”是否包含可能危害Mac安全或泄露隐私的恶性软件。”。解决方案👉[解决MacOS遇到“无法打开xxx，因为...恶意软件.md](assets%2Fdoc%2F%E8%A7%A3%E5%86%B3MacOS%E9%81%87%E5%88%B0%E2%80%9C%E6%97%A0%E6%B3%95%E6%89%93%E5%BC%80xxx%EF%BC%8C%E5%9B%A0%E4%B8%BA...%E6%81%B6%E6%84%8F%E8%BD%AF%E4%BB%B6.md) 
2. “xgrok已损坏，无法打开。你🇬应该将它移到废纸篓。” 。解决方案👉[解决Mac安装软件的“已损坏，无法打开.md](assets%2Fdoc%2F%E8%A7%A3%E5%86%B3Mac%E5%AE%89%E8%A3%85%E8%BD%AF%E4%BB%B6%E7%9A%84%E2%80%9C%E5%B7%B2%E6%8D%9F%E5%9D%8F%EF%BC%8C%E6%97%A0%E6%B3%95%E6%89%93%E5%BC%80.md)
### Linux
*待开发*

## 二、软件截图

![c0.png](assets%2F%E8%BD%AF%E4%BB%B6%E7%95%8C%E9%9D%A2%2Fc0.png)

![c1.png](assets%2F%E8%BD%AF%E4%BB%B6%E7%95%8C%E9%9D%A2%2Fc1.png)

![c2.png](assets%2F%E8%BD%AF%E4%BB%B6%E7%95%8C%E9%9D%A2%2Fc2.png)

![c3.png](assets%2F%E8%BD%AF%E4%BB%B6%E7%95%8C%E9%9D%A2%2Fc3.png)

![c4.png](assets%2F%E8%BD%AF%E4%BB%B6%E7%95%8C%E9%9D%A2%2Fc4.png)


## 三、计划清单

- [x] 支付界面优化
- [x] 订阅页面优化
- [x] 删除界面优化
- [x] 增加隧道修改
- [x] 增加密码修改
- [x] 编译优化
- [x] 登录过期优化
- [x] 登录过期优化-前端
- [x] 订阅过期优化-前端
- [x] 服务网络状态检测
- [x] 错误提示优化
- [x] 隐私策略
- [x] 开发反向代理
- [x] 应用打开检测进程是否在运行
- [ ] 开发开机自启动
- [x] 开发使用proxy进行代理访问
- [ ] UI重构，默认深色模式
- [x] 开发穿透状态
- [ ] 开发linux版本
- [ ] 开发web管理端
- [ ] Windows Server 2008 R2客户端编译