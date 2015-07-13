'use strict';

var defaultOpt = {
  noBackdrop: true,
  duration: 2000
  // hideOnStateChange
};

var noticeElem;

// set global click to remove notice
// $document.on('click', clearTimer.bind(null, self.timer));

export default ($window, $ionicLoading, $ionicPopup, $rootScope) => {

  var show = _.curry((type, msg, opt={}) => {
    var Tpl = {
      error: `
        <i class="icon ion-ios-information-outline error"></i>
        ${msg}
      `,
      info: `
        <i class="icon ion-ios-information-outline info"></i>
        ${msg}
      `,
      mega: `
        <div class="mega-text">
          ${msg}
        </div>
      `
    };
    noticeElem = $ionicLoading.show(_.extend(defaultOpt, opt, {
      template: Tpl[type]
    }));
  });

  /*$(document).on('click', ()=>{
    noticeElem && $ionicLoading.hide();
  });*/

  return {
    error: show('error'),
    info: show('info'),
    mega: show('mega'),
    alert: (msg) => {
      return $ionicPopup.alert({
        template: `<i class="ion-ios-information-outline"></i>${msg}`,
        cssClass: 'popup-notitle',
        okText: '知道了'
      });
    },
    alert2: (msg) => {
      return $ionicPopup.alert({
        template: msg,
        cssClass: 'popup-notitle',
        okText: '确定'
      });
    },
    confirm: (opts) => {
      return $ionicPopup.confirm({
        title: `<i class="ion-ios-help-outline"></i>${opts.title}`,
        template: opts.template,
        scope: opts.scope ? opts.scope : $rootScope,
        cancelText: '取消',
        okText: '确定'
      });
    }
  };
}
