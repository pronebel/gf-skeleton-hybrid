'use strict';

export default ($ionicPopup)=>{

  return {
    confirm(opt) {
      var defaultOPt = {
        cancelText: '取消',
        okText: '确定'
      }, opt;
      opt = _.extend({}, defaultOPt, opt);

      if(opt.needPayPwd || opt.needCaptcha) {
        var $scope = opt.scope;
        opt.buttons = [
          { text: opt.cancelText },
          {
            text: `${opt.okText}`,
            type: 'button-positive',
            onTap: function(e) {
              if(opt.needPayPwd) {
                if (!$scope.vm.paypwd) {
                  e.preventDefault();
                } else {
                  return $scope.vm.paypwd;
                }
              }
              if(opt.needCaptcha) {
                opt.needCaptcha.call($scope, e);
              }
            }
          }
        ]
      }
      var cls = opt.cssClass;
      if(cls && cls.indexOf('popup-embed-buttons') > -1) {
        opt.cancelText = null;
        opt.okText = null;
      }

      return $ionicPopup.confirm(opt);
    },
    showSmsVcode($scope, smsType) {
      var self = this;
      $scope.vm.verifycode = '';
      return self.confirm({
        template: `
          <div class="real-body">
            <p class="title">
              请输入<b>{{form.mobilephone}}</b><br/>
              收到的短信验证码
            </p>
            <input keyboard="integer" autofocus
              ng-model="vm.verifycode">
          </div>
          <div class="popup-buttons">
            <button class="button" ng-click="$buttonTapped({'text': '取消'}, $event)">取消</button>
            <${smsType} />
          </div>
        `,
        scope: $scope,
        cssClass: 'popup-embed-buttons'
      });
    },
    showCaptcha($scope, cb) {
      var self = this;
      $scope.vm.popupCaptcha = '';
      return self.confirm({
        template: `
          <p class="title">
            我们将发送短信验证码至：<b>{{data.mobile}}</b>
          </p>
          <div class="captcha-input">
            <input autofocus keyboard="integer"
              placeholder="请输入右侧验证码"
              ng-model="vm.popupCaptcha">
            <captcha>
          </div>
        `,
        scope: $scope,
        needCaptcha: cb
      });
    },
    showUpdate(type, text) {
      return $ionicPopup[type]({
        // title: '发现新版本: ' + todoVersionNum,
        template: text,
        okType: 'button-positive',
        okText: '体验新版',
        cancelText: '放弃机会'
      });
    }
  }
};