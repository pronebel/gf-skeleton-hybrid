'use strict';

var defaultOpt = {
  noBackdrop: true,
  duration: 2000,
  hideOnStateChange: true
};

var noticeElem;

// set global click to remove notice
// $document.on('click', clearTimer.bind(null, self.timer));

export default ($window, $ionicLoading, $ionicPopup, $rootScope) => {

  var show = _.curry((type, opt={}, msg) => {
    var Tpl = {
      error: `
        <i class="sprite icon-error-tip"></i>
        ${msg}
      `,
      info: `
        <i class="sprite icon-error-tip"></i>
        ${msg}
      `,
      succ: `
        <i class="sprite icon-succ-tip"></i>
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
    error: show('error', null),
    xinfo: show('error', {
      hideOnStateChange: false
    }),
    info: show('info', null),
    succ: show('succ', null),
    mega: show('mega', null),
    hide: ()=>{
      $ionicLoading.hide();
    },
    global: (text)=>{
      $ionicLoading.show({
        template: '<ion-spinner icon="ios"></ion-spinner>' + (text ? '<br>'+text : ''),
        animation: 'fade-in',
        showBackdrop: true // 通过黑透明遮罩，来模态
        // showDelay: 100
      });
    },
    alert: (msg) => {
      return $ionicPopup.alert({
        template: `
          <p class="title">
            <i class="sprite icon-error-tip"></i>${msg}
          </p>
        `,
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
