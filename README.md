
## 目录设计

原则：相关性，控制在 7+-2 个文件或文件夹

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


## 依赖
node, npm
ionic-cli
gulp-cli
sass
