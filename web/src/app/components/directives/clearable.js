'use strict';

export default ($parse) => {
    return {
      require: '?ngModel',
      link: (scope, elem, attrs, ngModel) => {
        // 1: use ngModelCtrl and watch, set ngmodel val
        // 2: listen focus/change event, and set elem's val.
        function toggleClearIcon(isShow) {
          var $input = $(elem);
          var $clear = $input.siblings('.js-clearable');
          var isExist = $clear.length;
          if(isShow) {
            if (!isExist) {
              // createEle And BindEvent
              $('<i class="icon ion-close-circled js-clearable"></i>')
                .insertAfter($input)
                .on('click touchstart', function() {
                  $parse(attrs.ngModel).assign(scope, '');
                  scope.$apply();
                }); // ontouch?
            }
            $clear.show();
          } else {
            if(isExist) $clear.hide();
          }
        }

        scope.$watch(() => ngModel.$modelValue, (newVal) => {
        	if(_.isUndefined(newVal)) return;
          toggleClearIcon(!!newVal)
        });

        // cleanup remove listener
        scope.$on('destroy', function() {
          // elem.removeListener()
        });
      }
    }
  }
