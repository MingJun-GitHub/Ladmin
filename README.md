# vue-iview

使用vue-cli@3搭建的开发环境，使用iview组件库

___最近更新时间：2019年9月29日11:33:36___

### 相关组件插件列表

1. iview，组件库
2. axios，http工具，已添加到vue中，组件中使用方法: this.axios.get(url,{params:{}})
3. dayjs，时间处理工具
4. vue-photo-preview，图片放大工具

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
