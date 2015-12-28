'use strict';

export default (
  $rootScope, $compile, $animate, $timeout,
  $ionicTemplateLoader, $ionicPlatform, $ionicBody, IONIC_BACK_PRIORITY
)=>{
  return {
    show: modalPanel
  };

  function modalPanel(opts) {
    var noop = _.noop
      , jqLite = jQuery;

    var scope = opts.scope || $rootScope.$new(true);

    _.extend(scope, {
      cancel: noop,
      $deregisterBackButton: noop,
      cancelOnStateChange: true
    }, opts || {});


    // Compile the template
    var element = scope.element = $compile(
      '<modal-panel ng-class="cssClass">CONTENT</modal-panel>'.replace('CONTENT', opts.content)
    )(scope);

    // Grab the sheet element for animation
    var sheetEl = jqLite(element[0].querySelector('.action-sheet-wrapper'));

    var stateChangeListenDone = scope.cancelOnStateChange ?
      $rootScope.$on('$stateChangeSuccess', function() { scope.cancel(); }) :
      noop;

    // removes the actionSheet from the screen
    scope.removeSheet = function(done) {
      if (scope.removed) return;

      scope.removed = true;
      sheetEl.removeClass('action-sheet-up');
      $timeout(function() {
        // wait to remove this due to a 300ms delay native
        // click which would trigging whatever was underneath this
        $ionicBody.removeClass('action-sheet-open');
      }, 400);
      scope.$deregisterBackButton();
      stateChangeListenDone();

      $animate.removeClass(element, 'active').then(function() {
        scope.$destroy();
        element.remove();
        // scope.cancel.$scope is defined near the bottom
        scope.cancel.$scope = sheetEl = null;
        (done || noop)();
      });
    };

    scope.showSheet = function(done) {
      if (scope.removed) return;

      $ionicBody.append(element)
                .addClass('action-sheet-open');

      $animate.addClass(element, 'active').then(function() {
        if (scope.removed) return;
        (done || noop)();
      });
      $timeout(function() {
        if (scope.removed) return;
        sheetEl.addClass('action-sheet-up');
      }, 20, false);
    };

    // registerBackButtonAction returns a callback to deregister the action
    scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(
      function() {
        $timeout(scope.cancel);
      },
      IONIC_BACK_PRIORITY.actionSheet
    );

    // called when the user presses the cancel button
    scope.cancel = function() {
      // after the animation is out, call the cancel callback
      scope.removeSheet(opts.cancel);
    };

    scope.showSheet();

    // Expose the scope on $ionicActionSheet's return value for the sake
    // of testing it.
    scope.cancel.$scope = scope;

    return scope.cancel;
  }
};