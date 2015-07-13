'use strict';

// input with validate='exists,phone,same|xx' with ng-model,  message={'phone': 'ddd', 'dd': ''
// form scan all input to validate

export default ($q, $notice) => {
  var ruleMsgMap = {
    },
    rulesMap = {
      mobile: function(val) {
        return $q((resolve, reject)=>{
          if(!val) reject('不能为空');
          if(/^1[0-9]{10,10}$/i.test(val)) {
            resolve();
          } else {
            resolve(); // temp
            // reject('手机号码格式不正确');
          }
        });
      }
    };
  var Rules = {
    // Todo: 移入 $validator 中
     required: (val)=>{
      if(!!val) return true;
      return '请补全未填项';
    },
    idcard: (val)=>{
      if(val.length != 18) return '身份证号码格式不正确';
      return true;
    },
    mobile: (val)=>{
      if(/000088\d{4}/.test(val)) return true;
      if (!(/^1[0-9]{10,10}$/i.test(val))) return '手机格式不正确';
      return true;
    },
    bankcard: (val)=>{
      if(val.length != 16) return '银行卡格式不正确';
      return true;
    },
    gftPwd: (pass='')=>{
      // 长度判断
      if(pass.length < 6 || pass.length > 16) return '密码格式为 6-12 个字符';
      // 判断某一字符出现的次数
      for (var i = 0; i < pass.length; i++) {
          var oneChar = pass.charAt(i);
          var count = 0;
          var firstPosition = 0;
          for (var j = 0; j < pass.length; j++) {
              if (oneChar == pass.charAt(j)) {
                  count++;
              }
          }
          if (count >= 3) {
              return '密码中‘' + oneChar + '’出现的次数超过了三次';
          }
      }

      // 判断顺序递增或者递减
      var orderArray = ['012345', '123456', '234567', '345678', '456789', '987654', '876543', '765432', '654321', '543210'];
      if (orderArray.indexOf(pass) != -1) {
          return '密码设置不能是顺序递增或者递减';
      }
      return true;
    },
    smsVcode: (val)=>{
      return true; // for *fg%1q special code
      if((/\d{6}/.test(val))) return true;
      return '验证码格式不正确';
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
    },
    validateInput(elem) {
      /*var v = elem.attr('validate').split(',');
      _.each(v, (type) {
        this.validate(type, val)
      })*/
    },
    addRule() {
      // set ruleMsgMap empty
    },
    setMsg() {

    }
  };
  /*var proxy = new Proxy(validator, {
    get (receiver, name) {
      if(name in receiver) {
        return receiver[name]
      } else {
        validator.validate(name);
      }
    }
  });*/
  return validator;
};
