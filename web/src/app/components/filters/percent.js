'use strict';

export default ()=>{
  return (p, type='length', len=2, omit=false)=>{
    if(p == 0) {
      return omit ? '0' : '0.00%';
    }
    if(!p) return '-';
    if(type === 'convert') {
      return (p*100).toFixed(len) + (omit ? '' : '%');
    }
    return p.toFixed(len);
  }
};