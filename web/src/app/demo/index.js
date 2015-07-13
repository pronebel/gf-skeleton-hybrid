'use strict';

function boot(app) {

  var PageList = 'signup,signup-verify,signup-succ,account-verify,account-agreement,account-paypwd,account-profile,locker-un,login,order-succ,order-confirm,order-payment,index,about,more,feedback,faq,messages,passwords,pwd-reset,pwd-reset-succ,my-bankcards,bankcard,bankcard-add,game-arena,collection,orders,my-info,assets-my,assets-overview,assets-earnings,invest,invest-zone,my,product-detail,_bank-list,experimental'.split(',');

  app.directive('globalTabs', function($compile, $timeout) {
    return {
      replace: true,
      template: `
        <div class="tabs global-tabs" ng-show="isShow">
          <a class="tab-item" ng-repeat="i in stateList"
            ui-sref="{{i.stateId}}"
            ng-class="{'active': $state.is('{{i.stateId}}')}">
            {{i.stateName}}
          </a>
        </div>
      `,
      link: function(scope, elem, attrs) {
        var isShow;
        scope.stateList = [{
          stateId: 'demo-index',
          stateName: '推荐'
        }, {
          stateId: 'demo-invest',
          stateName: '理财'
        }, {
          stateId: 'demo-assets-my',
          stateName: '资产'
        }, {
          stateId: 'demo-my',
          stateName: '我的'
        }];
        scope.$watch('$state.current.name', (v)=>{
          isShow = false;
          _.each(scope.stateList, (i)=>{
            if(i.stateId === v) {
              isShow = true;
            }
          });
          scope.isShow = isShow;
        });
        // $compile(elem.contents())(scope);
      }
    }
  });

  app.directive('msgEntry', function() {
    return {
      replace: true,
      template: `
        <ion-nav-buttons side="right">
            <a class="button button-link" ui-sref="demo-messages">
              <i class="icon ion-email"></i>
            </a>
        </ion-nav-buttons>
      `
    }
  });

  app.directive('fundRadarChart', ($timeout)=>{
    return {
      link: (scope, elem, attrs)=>{
        var data = {
            labels: ['风险', '规模', '风格', '经验', '收益'],
            datasets: [
                {
                    label: 'wtf',
                    fillColor: 'rgba(220,220,220,0.2)',
                    strokeColor: 'rgba(220,220,220,1)',
                    pointColor: 'rgba(220,220,220,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: [65, 59, 90, 81, 56]
                },
                {
                    label: 'wtf2',
                    fillColor: 'rgba(151,187,205,0.2)',
                    strokeColor: 'rgba(151,187,205,1)',
                    pointColor: 'rgba(151,187,205,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151,187,205,1)',
                    data: [28, 48, 40, 19, 96]
                }
            ]
        };
        var options = {};
        $timeout(()=>{
          var ctx = elem[0].getContext('2d');
          var myRadarChart = new Chart(ctx).Radar(data, options);
        });
      }
    }
  });

  app.directive('assetsDoughuntChart', ($timeout)=>{
    return (scope, elem, attrs)=>{
      var data = [
          {
              value: 300,
              color:'#F7464A',
              highlight: '#FF5A5E',
              label: 'Red'
          },
          {
              value: 50,
              color: '#46BFBD',
              highlight: '#5AD3D1',
              label: 'Green'
          },
          {
              value: 100,
              color: '#FDB45C',
              highlight: '#FFC870',
              label: 'Yellow'
          }
      ];
      var options = {};
      $timeout(()=>{
        var myDoughnutChart = new Chart(elem[0].getContext('2d')).Doughnut(data,options);
      });
    };
  });

  app.controller('demoCtrl', function($scope,
      $ionicPopup, $ionicActionSheet, $ionicModal,
      $notice, $state, $window, $timeout, $modalPage
    ) {
    $scope.$root.data = {};

    var agreementModal;
    $scope.popDemoList = function() {

      function buildTpl() {
        var allRoute = _.filter($state.get(), (i)=>{
          return !i.abstract;
        }).reverse();
        var tmp = allRoute.map(function(r) {
        return '<ion-item><a ui-sref="'+r.name+'">'+r.name+'</a></ion-item>';
        });

        return '<ion-list>'+tmp.join('')+'</ion-list>';
      }

      /*$modalPage.open({
        title: '跳转',
        content: buildTpl()
      });*/

      $scope.$root.demoPopup = $ionicPopup.show({
        template: buildTpl(),
        title: 'Demo List'
      });
    };

    $scope.signupConfirm = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: '<i class="ion-ios-help-outline"></i>确认手机号',
        template: '我们讲发送短信验证码至： <b class="alert">23213213213</b>',
        cancelText: '取消',
        okText: '确定'
      });
      confirmPopup.then(function() {
        $state.go('signup-verify');
      });
    };

    $scope.slideHasChanged = function(idx) {
      if(idx!=0) {
        $state.go('index');
      }
    };

    $scope.closeAgreementModal = function() {
      agreementModal && agreementModal.hide();
    };

    $scope.showAgreementSheet = function() {
      $ionicActionSheet.show({
        buttons: [
          { text: '产品风险提示书' },
          { text: '投资者声明与承诺' },
          { text: '产品电子合同' },
          { text: '产品说明书' },
          { text: '电子签名约定书' }
        ],
        cancelText: '取消',
        cancel: function() {
          // add cancel code..
          return false;
        },
        buttonClicked: function(index) {
          $ionicModal.fromTemplateUrl('../assets/test.html', {
            scope: $scope
          }).then(function(modal) {
            agreementModal = modal;
            agreementModal.show();
          });
          return true;
        }
      });
    };

    $scope.moreCheckUpdate = function(e) {
      $notice.mega('检查更新中...');
      $timeout(()=>{
        $notice.mega('已是最新版本');
      }, 3000);
    };

    $scope.delBankCard = function() {
      $notice.confirm({
        title: '确定操作',
        template: `
          <p>您确定要删除该卡：</p>
          <b class="alert">********33232</b>
        `
      });
    };

    $scope.delFav = ()=>{
      $notice.confirm({
        title: '确定操作',
        template: `
          <p>您确定要删除该收藏</p>
        `
      });
    };

    $scope.closeCalc = ()=> {
      $scope.calcPopup.close();
    };

    $scope.showCalc = ()=> {
      $scope.calcPopup = $ionicPopup.show({
        title: '理财计算器',
        cssClass: 'product-calc-popup',
        scope: $scope,
        template: `
          <i class="icon ion-ios-close-outline" ng-click="closeCalc()"></i>
          <label>
            现在投入
            <input type="text">
            <i>元</i>
          </label>
          <p>预计<b>2015-07-03</b>，收益<i>75.32</i>元，这笔投资可以让您和朋友一起看场大片！</p>
        `
      });
    }

    $(document).on('keyup', function(e) {
      if (e.keyCode == 27) {
        if($scope.$root.demoPopup) {
          $scope.$root.demoPopup.close();
        }
      } // escape key maps to keycode `27`
    });

    $scope.$root.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      if($scope.$root.demoPopup) {
        $scope.$root.demoPopup.close();
      }
    });
  }).config(function ($stateProvider) {
    var routeOpt, ctrlName;
    PageList.forEach(function(name) {
      routeOpt = {
        url: '/demo/'+name,
        templateUrl: 'app/demo/tpls/'+name+'.html'
      };
      $stateProvider.state('demo-'+name, routeOpt);
    });
  });
}

export default boot;
