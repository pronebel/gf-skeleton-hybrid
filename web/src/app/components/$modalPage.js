'use strict';

export default ($rootScope, $ionicModal)=>{
  var $root = $rootScope;
  var modalLayout = `
    <ion-modal-view>
      <div class="bar-header bar bar-positive">
        <div class="buttons">
          <button class="button button-icon"
            ng-click="$modalPageColse()">
            <i class="icon ion-ios-arrow-left"></i>
          </button>
        </div>
        <h1 class="title">{{$modalPageTitle}}</h1>
      </div>
      <ion-content class="has-header" ng-class="$modalPageCss">
        TMP
      </ion-content>
    </ion-modal-view>
  `, modal;

  $root.$modalPageColse = function() {
    modal && modal.hide();
  };

  return {
    open: (opt)=> {
      // title, content, scope, css
      $root.$modalPageTitle = opt.title||'';
      $root.$modalPageCss = opt.css||'';
      modal = $ionicModal.fromTemplate(
        modalLayout.replace('TMP', opt.content // Todo: ng-bind-html
      ), {
        scope: opt.scope
      });
      modal.show();
      return modal;
    }
  }
};