'use strict';

export default ()=>{
  return (num)=>{
    if(!num) return '-';
    return num.slice(num.length-4);
  }
};