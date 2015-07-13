
# 广发混合 App 技术选型和框架

## 介绍
混合 App 技术发展更迭快，但总体分为两种方案，通过是 WebUI 还是 HybridUI 来区分。 前者的代表有 ionic，twbs/ratchet，后者的代表有 fb/react-native, nativescript 等。 本项目选择 ionic 为基础库，使用[generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular) 作为 generator 生出初始项目目录结构， 整合 ionic/cordova 的相关命令到 gulp 中，依赖蒲公英作为 App 内测分发工具。

## 安装与使用
依赖： node, npm, ionic-cli, gulp-cli, sass

安装

```bash
git clone https://github.com/gf-web/hybrid-base
cd hybrid-base && rm .git
git init
cd web && npm install & bower install
```

开发

```bash
cd web
gulp serve
```

打包

```bash
ionic start cordova --appname "<AppName>" --id "<AppId>"
ionic platforms add android
ionic build ios --release
./tool.sh pgyer # 上传到蒲公英
```


## 目录设计

原则：相关性，控制在 7+-2 个文件或文件夹

```bash
tool.sh
  (含有 build, ci, release, upload 等命令)
container
  cordova containner (cordova 目录结构，如 platforms, www, plugins 等)
web 
  功能源码，包含 src, assets, vendors 等，是 gulp, node_modules 等存在的空间
config.js 
  配置项 如API地址
release
  发布目录， 包含生产的 apk/ipa/web 文件，和指引下载页
```


## 脚手架

- 集成 pyger 做内侧应用分发
- $mock service 的使用
- $indicator service 的使用
- $validator service 的使用
- $api service 的使用

## Todo

实现 pyger iOS/Android 的 cordova 插件 （实现日志上报，crash 统计，用户反馈，更新推送）
