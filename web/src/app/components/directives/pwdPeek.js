'use strict';

export default () => {
  return {
    replace: true,
    scope: true,
    template: `
      <i class="icon" ng-class="{
        'ion-eye': peek,
        'ion-eye-disabled': !peek
      }" ng-click="toggle()">
    `,
    link: (scope, elem, attr)=>{
      scope.peek = false;
      scope.toggle = ()=>{
        scope.peek = !scope.peek;
        elem.parents('.item').find('input').attr('type', scope.peek?'text':'password');
      };
    }
  }
};