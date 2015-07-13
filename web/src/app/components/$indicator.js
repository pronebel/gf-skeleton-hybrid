'use strict';

// ngInject
var indicator = ($injector, $timeout, $q, $rootScope) => {
  var $ionicLoading, $notice, $compile;

  function tplMethod(yes, no, span) {
    var time, delta
    return function(bool) {
      var args = _.toArray(arguments)
      args.shift();
      if(bool) {
        time = new Date().getTime();
        yes.apply(null, args);
      } else {
        delta = new Date().getTime() - time;
        $timeout(()=>{
          no.apply(null, args); // why not Fn.bind
        }, span - delta);
      }
    }
  }
  var toggleGlobalIndicator = tplMethod(()=> {
    $ionicLoading.show({
      template: '加载中...',
      animation: 'fade-in',
      showBackdrop: true
      // showDelay: 100
    });
  }, ()=>{
    $ionicLoading.hide()
  }, 800);

  var toggleBtnIndicator = tplMethod((target)=>{
    $compile = $injector.get('$compile');
    $(target).prepend($compile('<ion-spinner icon="ios-small"></ion-spinner>')($rootScope));
    target.disabled = true;
  }, (target)=>{
    if(!target) return;
    target.disabled = false;
    $(target).find('ion-spinner').remove();
  }, 3000);

  function handleRequest(conf) {
    if(!_.isUndefined(conf.indicator)) {
      conf.timeout = 10000; // default timeout
    }
    if(_.isUndefined(conf.indicator)) return;
    conf.indicator === 'global'
      ? toggleGlobalIndicator(true)
      : toggleBtnIndicator(true, conf.indicator);
    // whether post/delete auto set global indicator
    // check conf.method POST DELETE
  }

  function handleResponse(r) {
    if (!r.config) return;
    if(_.isUndefined(r.config.indicator)) return;
    r.config.indicator === 'global'
      ? toggleGlobalIndicator(false)
      : toggleBtnIndicator(false, r.config.indicator);
  }

  return {
    request: function(conf) {
      $ionicLoading = $injector.get('$ionicLoading');
      handleRequest(conf);
      return conf || $q.when(conf);
    },
    response: function(response) {
      $ionicLoading = $injector.get('$ionicLoading');
      handleResponse(response);
      return response;
    },
    responseError: function(rejection) {
      handleResponse(rejection);
      // check rejection.config.ignoreErr
      if(rejection.data && rejection.data.error) {
        if(!rejection.config.ignoreErr) {
          $notice = $injector.get('$notice');
          $notice.error(rejection.data.error);
        }
      }
      return $q.reject(rejection);
    }
  }
};
export default indicator;
