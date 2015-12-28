'use strict';

export default ($q, $notice) => {
  var Rules = {
    required: (val)=>{
      if(!!val) return true;
      return '请补全未填项';
    },
    integer: (val)=>{
      var v = parseInt(val, 10);
      if((val == v) && (v >= 0)) return true;
      return '输入不是整数';
    },
    numeric: (val)=>{
      var v = parseFloat(val, 10);
      if((val == v) && (v >= 0)) return true;
      return '输入不是数字';
    },
    mobile: (val)=>{
      if(/000088\d{4}/.test(val)) return true;
      if (!(/^1[0-9]{10,10}$/i.test(val))) return '手机格式不正确';
      return true;
    },
    bankcard: (val)=>{
      if(/[\d]{16}/.test(val)) return true;
      if(/[\d]{19}/.test(val)) return true;
      return '银行卡格式不正确';
    }
  };
  var validator = {
    validate(type, val) {
      return rulesMap[type](val);
    },
    validateForm(id) {
      // default scan current ion-content
      var deferred = $q.defer()
        , $form = $('#'+id)
        , formScope = angular.element($form).scope()
        , $elem, validates, messages, fieldVal, vResult
        , msgMap = {
          required: '请补全未填项'
        };
      if(_.every($form.find('[validate]'), (elem)=> {
        $elem = $(elem);
        validates = $elem.attr('validate').split(',');
        fieldVal = eval('formScope.'+$elem.attr('ng-model'));
        messages = $elem.attr('message');
        _.extend(msgMap, messages ? JSON.parse(messages) : {});
        return _.every(validates, (v)=>{
          vResult = Rules[v](fieldVal);
          if(_.isBoolean(vResult) && vResult) {
            console.log('Validate Field Ok');
            return true;
          } else {
            $notice.error(msgMap[v] || vResult);
            // elem add error css
            console.log('Validate Field, broken');
            return false;
          }
        });
      })){
        deferred.resolve();
      };
      return deferred.promise;
    }
  };
  return validator;
};
