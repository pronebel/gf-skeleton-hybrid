'use strict';

export default ($state) => {
    return function(scope, elem, attrs) {
      elem.on('click', (e)=>{
        if(scope.__needLogin()) return;
        $state.go(attrs.authSref);
      });
    }
  }
