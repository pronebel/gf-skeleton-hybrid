'use strict';

// ngInject
export default ($modalPage, $rootScope)=>{
  var modal, scope;
  scope = $rootScope.$new();
  return {
    show(__retry){
      scope.retry = ()=>{
        __retry();
        modal.hide();
        return false;
      };
      modal = $modalPage.open({
        title: '出错啦',
        scope: scope,
        content: `
          <div class="x-hero-status x-retry-page">
            <i class="sprite icon-hero-sign"></i>
            <p>
              啊哦~信息获取失败，再试一次吧~
            </p>
          </div>
          <div class="padding">
            <button ng-click="retry()"
              class="button button-block button-positive">
              重试
            </button>
          </div>
        `
      });
    }
  };
};