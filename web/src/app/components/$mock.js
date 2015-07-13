'use strict';

export default ($httpBackend, $api)=>{
  var scenarioList = []
    , current = {}
    , getS;

  /*// returns the current list of phones
  $httpBackend.whenGET('/phones').respond(phones);

  // adds a new phone to the phones array
  $httpBackend.whenPOST('/phones').respond(function(method, url, data) {
    var phone = angular.fromJson(data);
    phones.push(phone);
    return [200, phone, {}];
  });*/

  return {
    // proxy to $httpBackend
    scenario: (name)=>{
      current = {
        name: name,
        mocks: []
      };
    },
    end: ()=>{
      scenarioList.push(_.clone(current)); // deep clone?
    },
    enable: (name)=>{
      var scenario = _.find(scenarioList, (i)=>{
        return i.name === name;
      });
      _.each(scenario.mocks, function(mock) {
        $httpBackend[mock.method](mock.rule).respond(mock.res);
      });
    },
    disable: (name)=>{
      var scenario = _.find(scenarioList, (i)=>{
        return i.name === name;
      });
      _.each(scenario.mocks, function(mock) {
        $httpBackend[mock.method](mock.rule).passThrough();
      });
    },
    whenPOST: (rule, res)=>{

    },
    whenGET: (rule, res)=>{
      current.mocks.push({
        method: 'whenGET',
        rule: rule,
        res: res
      });
    },
    ctrl: ($scope)=>{

      $scope.$watch()
    }
  }
};

/*
$mock
  .scenario('注册 模拟手机号被注册')
  .whenPOST($api.get('xxx'), data)
  .whenGET()
  .end();

$mock scenario list
[{
  name: '',
  rules: [fn.toString],
  isEnable: true/false // can toggle
}] // render at modalPage
*/

