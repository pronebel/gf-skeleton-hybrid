var DEBUG = window.DEBUG;

export default ($api, $httpBackend, $rootScope)=>{
  $rootScope.APIHOST = 'https://store.gf.com.cn'; // store, uat
  // @ifdef DEBUG
  $rootScope.APIHOST = 'http://t1.gf.com.cn';
  // @endif

  $api.config({
    login: 'POST /v1/login',
    addRcmds: 'POST /rcmds'
  }, {
    urlPrefix: $rootScope.APIHOST + '/rest'
  });

  $api.config({
    getRecommendProduct: 'GET /pages/home',
    getPageUserInfo: 'GET /pages/user-info'
  }, {
    urlPrefix: $rootScope.APIHOST + '/rest/app-invest/v1'
  });


  // Usage: 见 componnent/$mock.js

  // @ifdef DEBUG
  /*$httpBackend.whenGET(/product_regulatory/).respond(()=>{
    return [500, {}, {}];
  });*/

  /*$httpBackend.whenPOST(/reset_password/).respond(()=>{
    return [200, {
      "riskAssess":false,"bindingBankCard":false
    }, {
      // headers?
    }];
  });*/

  $httpBackend.whenGET(/.*/).passThrough();
  $httpBackend.whenPOST(/.*/).passThrough();
  $httpBackend.whenPUT(/.*/).passThrough();
  $httpBackend.whenDELETE(/.*/).passThrough();
  // @endif
};