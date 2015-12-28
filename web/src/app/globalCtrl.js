class Ctrl {
  // ngInject
  constructor ($scope, $api, $q, $injector, $filter,
    $state, $temp, $notice, $constant, $timeout,
    $ionicNavViewDelegate, $ionicHistory, $popup,
    $ionicPlatform, $ionicPopover, $update
  ) {
    var isAndroid = ionic.Platform.isAndroid();

    window.Plgs = null;
    if(window.cordova && window.cordova.plugins) {
      window.Plgs = window.cordova.plugins;
      // Plgs.Keyboard.disableScroll(true);
    }

    var scope = $scope.$root;
    scope.data = {};

    scope.__globalMethod1 = ()=>{

    };

    /*scope.$on('login:success', globalRun);
    globalRun();*/
  }
}

export default Ctrl;
