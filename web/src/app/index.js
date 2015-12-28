'use strict';

var App = angular.module('gfInvest', [
  'ionic', 'ngAnimate', 'ngTouch',
  'ngSanitize', 'ngResource', 'ui.router',
  'ngStorage'
]);

// @ifdef DEBUG
App.requires.push('ngMockE2E');
// @endif


import globalCtrl from './globalCtrl';
App.controller('globalCtrl', globalCtrl);

if(!String.prototype.includes) {
  String.prototype.includes = function(str) {
    return this.indexOf(str) > -1;
  };
}


/*
  inject biz module controller
  inject component module's factories, filters, directives
*/

// injector
// endinjector

import apiBootstrap from './api';
  // $httpBackend
App.run(function(
  $api, $rootScope, $state, $timeout,
  $httpBackend, $localStorage, $notice
) {
  if(window.StatusBar) {
    try{
      StatusBar.overlaysWebView(true);
      StatusBar.style(1); //Light
    }catch(e) {
      console.log('App Run: cordova');
      console.log(e);
    }
  }

  $rootScope.$storage = $localStorage;

  apiBootstrap($api, $httpBackend, $rootScope);

  $rootScope.$state = $state;
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    // $ionHistory 结合起来
    $rootScope.__stateFrom = fromState;
    $rootScope.__stateTo = toState;
  });

});

import routeBootstrap from './routes';
App.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $sceDelegateProvider) {
  routeBootstrap($urlRouterProvider, $stateProvider);

  /* add indicaotr for api */
  $httpProvider.interceptors.push('$indicator');

  /* config ionic framework */
  var ionic = $ionicConfigProvider
  ionic.navBar.alignTitle('center');
  ionic.tabs.position('top');
  ionic.tabs.style('striped');
  ionic.backButton.previousTitleText(false).text('');
  ionic.views.swipeBackEnabled(false);

  /* sce config for gf link */
  $sceDelegateProvider.resourceUrlWhitelist([
   'self',
   'http://*.gf.com.cn/**',
   'https://*.gf.com.cn/**'
  ]);

});

App.config(function($provide, $httpProvider) {
  // @ifdef DEBUG
  // add delay for $httpBackend when mocking
  // for webpack sourcemap to load devtools to debug...
  $provide.decorator('$httpBackend', function($delegate) {
    var proxy = function(method, url, data, callback, headers) {
      var interceptor = function() {
        var _this = this,
            _arguments = arguments;
        setTimeout(function() {
            callback.apply(_this, _arguments);
        }, 700);
      };
      return $delegate.call(this, method, url, data, interceptor, headers);
    };
    for(var key in $delegate) {
      proxy[key] = $delegate[key];
    }
    return proxy;
  });
  // @endif

  /* add uncaught exception handler here */
  $provide.decorator('$exceptionHandler', function($debug, $delegate) {
    return function(exception, cause) {
      $debug.log('Ooops..: ' + cause);
      $delegate(exception, cause);
    };
  });

});

/* Bootstrap ionic app when platform ready */
// https://github.com/driftyco/ionic/issues/1751
ionic.Platform.ready(function(){
  angular.bootstrap(document, ['gfInvest']);

  /*window.addEventListener('native.keyboardshow', function(){
    document.body.classList.add('keyboard-open');
  });*/
});
