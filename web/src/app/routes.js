export default ($urlRouterProvider, $stateProvider)=>{
  var routeNames = `
    module1-about, module1-feedback
  `.split(',').map(_.trim);

  console.log('Routes Counts: '+routeNames.length);

  var routeParamStr = {
    'module1-about': '?type'
  };

  _.each(routeNames, (r)=>{
    var camelR, slashR;
    slashR = r.replace('-', '/'); // careful, just first one
    camelR = _.camelCase(r);
    $stateProvider.state(r, {
      url: '/' + r + (routeParamStr[r] ? routeParamStr[r] : ''),
      templateUrl: 'app/'+slashR + '.html',
      controller: camelR+'Ctrl'
    });
  });

  $urlRouterProvider.otherwise('/module1-about');
}
