### 安装依赖
```shell script
npm install
```

### 开发环境启动
```shell script
npm run start
```

### 编译打包

提供两个打包命令
1. build:staging用于与后台对接接口时测试，这里的publicPath通常是本地
2. build:prod用于发布，这里的publicPath可能是远程CDN服务器，这对于解决入门级服务器发布项目访问过慢问题有显著效果
```shell script
npm run build:staging

npm run build:prod
```
