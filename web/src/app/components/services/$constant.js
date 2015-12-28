'use strict';

// ngInject
export default ($rootScope)=>{
  $rootScope.C = {
    userRisk: {
      0: '未做风险测评',
      1: '保守型',
      2: '谨慎型',
      3: '稳健型',
      4: '积极型',
      5: '进取型'
    },
    prodRisk: {
      1: '低风险',
      2: '较低风险',
      3: '中风险',
      4: '较高风险',
      5: '高风险'
    },
    prodType: {
      0: '固定收益类、权益类、期货、融资融券、信托、复杂或高风险金融产品及其他产品',
      1: '固定收益类',
      2: '固定收益类、权益类',
      3: '固定收益类、权益类以及期货、融资融券、信托等产品',
      4: '固定收益类、权益类、期货、融资融券、信托以及复杂或高风险金融产品'
    },
    prodPeriod: {
      0: '期限不限',
      1: '短期——1年以内',
      2: '中期——3年以内',
      3: '中长期——在5年以内'
    }
  };

  return null;
};