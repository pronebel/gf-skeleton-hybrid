'use strict';

// ngInject
export default ()=>{
  // send to sentry or save it to files

  return {
    log(msg) {
      if(window.DEBUG) {
        alert(msg);
        // $notice.info(msg); // Todo: not-interupt just print log..
      } else {
        console.log(msg);
      }
    }
  };
};