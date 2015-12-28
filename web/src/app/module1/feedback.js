'use strict';

class Ctrl {
  // ngInject
  constructor ($scope, $api, $notice, $timeout, $state, $ionicHistory) {

    var meta = {};
    if(window.cordova) {
      cordova.getAppVersion.getVersionCode(function (code) {
          meta.appVersion = code;
      });
    }

    meta.platform = ionic.Platform.platform();
    meta.vendor = ionic.Platform.version();

    var vm = {};
    $scope.vm = vm;
    $scope.submit = (e)=>{
      if(!vm.content) return $notice.info('请填写反馈内容');
      if(vm.content.length < 10 || vm.content.length > 300) {
        return $notice.info('反馈内容10~300个字');
      }
      // Todo: add meta info
      $api('postFeedback', {
        content: vm.content
      }, {
        indicator: e.target
      }).then((r)=>{
        $notice.succ('意见提交成功!');
        $timeout(()=>{
          $ionicHistory.goBack(-1);
        }, 1000);
      });
    };
  }
}

export default Ctrl;