'use strict';

export default ($notice) => {
  return (scope, elem)=>{
    elem.on('click', (e)=>{
      $notice.info('Not Implemented');
      return false;
    });
  }
};