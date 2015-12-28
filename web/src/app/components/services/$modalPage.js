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
      <ion-content class="has-header" ng-class="$modalPageCss"
        overflow-scroll="$modalPageNative">
        TMP
      </ion-content>
    </ion-modal-view>
  `;

  return {
    open: (opt)=> {
      if(Plgs) Plgs.Keyboard.close();
      var modal = $ionicModal.fromTemplate(
        modalLayout
          .replace('TMP', opt.content)
          .replace('$modalPageNative', opt.ofscroll?'true':'false'), {
        scope: _.extend(opt.scope.$new(), {
          $modalPageTitle: opt.title||'',
          $modalPageCss: opt.css||'',
          $modalPageColse() {
            modal && modal.hide();
          }
        })
      });
      modal.show();
      return modal;
    }
  }
};