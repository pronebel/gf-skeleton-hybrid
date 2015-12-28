'use strict';

// ngInject
export default ()=>{
  var hash = {};
  return {
    get(name){
      if(!hash[name]) hash[name] = {};
      return hash[name];
    },
    set(name, d){
      hash[name] = d;
    }
  };
};