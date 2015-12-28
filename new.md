# 广发混合 App 技术选型和框架

## 介绍
混合 App 技术发展更迭快，但总体分为两种方案，通过是 WebUI 还是 HybridUI 来区分。 前者的代表有 ionic，twbs/ratchet，后者的代表有 fb/react-native, nativescript 等。 本项目选择 ionic 为基础库，基于[generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular) 作为 generator 生出初始项目目录结构，参考[generator-m-ionic](https://github.com/mwaylabs/generator-m-ionic)的一些优点， 整合 ionic/cordova 的相关命令到 gulp 中，加入版本号管理等。

## 目录结构
原则是：相关性，控制在 7+-2 个文件或文件夹。从而在web目录下是传统的前端开发相关的文件，而单独的cordova目录是cordova项目为基础的目录（如plugins, platforms, hooks等），这样有利于分离关注度和保持独立性。

### 总目录
- cordova/
- web/
- app/(ln -s web/src/app)
- gulp/
- node_modules/
- gulpfile.js
- .gitignore
- package.json
- README.md

### 客户端容器目录(cordova 下)：
- hooks/
- platforms/
- plugins/
- resources/
- www/
- config.xml
- ionic.project
- xxApp.mobileprovision
- android.key

### Web容器目录(www下)：
www 下：
- .tmp/
- bower_components/
- src/
- e2e/
- bower.json
- .bowerrc
- karma.conf.js
- .editorconfig
- .eslintrc
- eslintignore

### 业务代码目录(www/app 下)：
- components/
- - direcctives
- - fitlers
- - services
- - scss
- <module>/
- - all.scss
- - <view>.html(模板文件)
- - <view>.js（controller 代码)
- api.js
- routes.js
- routes.scss
- bundle.scss
- globalCtl.js
- index.js

## 功能集成
eslint 集成
cordova 命令集成进入 gulp 中
版本管理（命令行改cordova/config.xml中的版本号等）


## todo
更详细的目录说明： https://github.com/mwaylabs/generator-m-ionic/blob/master/docs%2Fstart%2F1_file_structure.md

详细的使用（开发和模拟器真机调试）：https://github.com/mwaylabs/generator-m-ionic/blob/master/docs%2Fstart%2F2_development_intro.md

脚手架：yo add <biz> <view> <ctrl>等

## 使用步骤：
git clone
git init -am "init"

npm install
gulp prepare(bower install)
gulp prepare(添加platform？！)

gulp serve(开搞) --no-open, --no-build 等

gulp deploy test


### 关于精灵图片
在 images/sprites 加入，命名规范：
gulp sprites (生成了 sprites.scss 在 app/，并且会导入到bundle.scss中)

如何安装bower代码

## 其他链接：
检查 cordova 安装依赖（包括原生）
http://cordova.apache.org/docs/en/dev/guide/platforms/index.html
