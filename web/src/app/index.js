'use strict';

require('./components/global.js');
window.onerror = function(e) {
  // debugger;
  // alert("Error caught");
};

var App = angular.module('gfInvest', [
  'ionic', 'ngAnimate', 'ngTouch',// 'ngMockE2E',
  'ngSanitize', 'ngResource', 'ui.router',
  'ngStorage'
]);

// when debug mode
// angular.module('SuperApp').requires.push('ngMockE2E');

/* Controllers bind */
import globalCtrl from './globalCtrl';
import signupCtrl from './signup/index';
import signupVerifyCtrl from './signup/verify';
import signupSuccessCtrl from './signup/success';
import loginCtrl from './login/index';
import loginLockUnCtrl from './login/lock-un';
import loginLockSetCtrl from './login/lock-set';
import accountVerifyCtrl from './account/verify';
import accountPaypwdCtrl from './account/paypwd';
import accountResultCtrl from './account/result';
App.controller('globalCtrl', globalCtrl)
  .controller('signupCtrl', signupCtrl)
  .controller('signupVerifyCtrl', signupVerifyCtrl)
  .controller('signupSuccessCtrl', signupSuccessCtrl)
  .controller('loginCtrl', loginCtrl)
  .controller('loginLockUnCtrl', loginLockUnCtrl)
  .controller('loginLockSetCtrl', loginLockSetCtrl)
  .controller('accountVerifyCtrl', accountVerifyCtrl)
  .controller('accountPaypwdCtrl', accountPaypwdCtrl)
  .controller('accountResultCtrl', accountResultCtrl);

/* Todo: service related */
import $api from './components/$api';
import $validator from './components/$validator';
import indicator from './components/$indicator';
import $modalPage from './components/$modalPage';
import $notice from './components/$notice';
import $signup from './signup/service';
App.factory('$api', $api)
  .factory('$validator', $validator)
  .factory('indicatorInterceptor', indicator)
  .factory('$modalPage', $modalPage)
  .factory('$notice', $notice)
  .factory('$signup', $signup)
  .config(function($httpProvider) {
    // $httpProvider.defaults.timeout = 5000;
    $httpProvider.interceptors.push('indicatorInterceptor');
  });

/* Todo: move to components/directives using macro batch import and bind to angular app */
import {
  styleText,
  gfFundSmsVcode,
  patternLock
} from './components/directives/misc';
import clearable from './components/directives/clearable';
import captcha from './components/directives/captcha';
import {SignupSmsSend} from './signup/directive';
App.directive('clearable', clearable)
  .directive('signupSmsSend', SignupSmsSend)
  .directive('captcha', captcha)
  .directive('patternLock', patternLock)
  .directive('styleText', styleText)
  .directive('gfFundSmsVcode', gfFundSmsVcode);

  // $httpBackend
App.run(function($api, $rootScope, $state, $localStorage, $timeout) {
  $rootScope.APIHOST = 'http://10.2.110.203'; //'http://test.gf.com.cn';
  $rootScope.$storage = $localStorage;

  /*$rootScope.$on('$ionicView.loaded', function() {
    ionic.Platform.ready( function() {
      if(navigator && navigator.splashscreen) navigator.splashscreen.hide();
    });
  });*/

  $api.config({
    login: 'POST /v1/login',

    // isPhoneUsed: 'POST /rest/user/portal/info',
    isPhoneUsed: 'GET /register/check_mobile_exists',
    sendSignupSms: 'POST /v1/mobile_verify_code', // send sms
    submitRegForm: 'POST /v1/register',

    isIdCardUsed: 'GET /rest/user/is_id_no_used?id_no',
    isBankCardUsed: 'GET /rest/user/can_bank_card_be_used?bank_card_no=6214837555557796&bank_no=9003&identity_no=320723199010210094&name=ddd',
    getBankList: 'GET /rest/info/data_exports?name=gffund_bank_list',
    sendAccountSms: 'POST /rest/user/gffund/send_sms_key',
    bindBankCard: 'POST /rest/user/gffund/bind_bank_card',
    openFastPay: 'POST /rest/user/acct/consume/open_fast_pay',
    setInvestPwd: 'POST /rest/user/acct/invest/open'
  }, {
    urlPrefix: $rootScope.APIHOST
  });

  $rootScope.$state = $state;
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      // $rootScope._pageClass = toState.name.replace(/\./g, '-');
  });

  /* Todo */
  /*$httpBackend.whenGET(/tpls\//).passThrough();
  $httpBackend.whenGET(/html/).passThrough();*/

  if($rootScope.$storage.patternLockCode) {
    $timeout(()=>{
      $state.__beforeLockState = $state.current.name; // params restore?
      $state.go('login-lock-un');
    }, 200);
  }

  /*$rootScope.__enablePatternLock = $rootScope.$storage.patternLockCode ? true : false;
  $rootScope.$watch('__enablePatternLock', (v, old)=>{
    // if(_.isUndefined(old)) return;
    if(!v) {
      $rootScope.$storage.patternLockCode = null;
    } else {
      $state.go('login-lock-set');
    }
  });*/
});

import demoify from './demo/index';
demoify(App);

App.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  var routeNames = `
    signup-index,signup-verify,signup-success,
    login-index,login-lock-un,login-lock-set,
    account-verify, account-paypwd
  `.split(',').map(_.trim); // String.protoype.trim.call not work

  _.each(routeNames, (r)=>{
    var isIdx = false, camelR, slashR;
    if(_.endsWith(r, 'index')) {
      isIdx = true;
      r = r.replace(/-index$/g, '');
    }
    slashR = r.replace('-', '/'); // careful, just first one
    camelR = _.camelCase(r);
    $stateProvider.state(r, {
      url: '/'+r,
      templateUrl: 'app/'+slashR + (isIdx ? '/index.html' : '.html'),
      controller: camelR+'Ctrl'
    });
  });
  $stateProvider.state('account-result', {
    url: '/account-result?status',
    templateUrl: 'app/account/result.html',
    controller: 'accountResultCtrl'
  });

  $urlRouterProvider.otherwise('/login');
  var ionic = $ionicConfigProvider
  ionic.navBar.alignTitle('center')
  ionic.tabs.position('top')
  ionic.tabs.style('striped')
  ionic.backButton.previousTitleText(false).text('');
});

angular.element(document).ready(function() {
  angular.bootstrap(document, ['gfInvest']);
});
