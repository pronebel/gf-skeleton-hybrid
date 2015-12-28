'use strict';
window.AssetsVersion = '1.1.0';

var updateVersionURL = 'http://ws.gf.com.cn/update/containerApp/checkVersion';
var appName = 'gfinvest';
var apkHostPath = 'https://cdn.gf.com.cn/gfopen/product/container';
var ipaHostPath = 'https://cdn.gf.com.cn/gfopen/product/container';
var todoVersionNum, AssetsVersion = window.AssetsVersion;

export default ($popup, $ionicLoading, $rootScope, $interval)=>{
  return {
    doUpdate: checkVersion
  };

  var isChecked;
  function checkVersion() {
    isChecked = false;
    var retryCount = 3, stop;

    var cancel = ()=>{
      $interval.cancel(stop);
    };

    stop = $interval(()=>{
      if(isChecked) return cancel();
      if(retryCount === 0) return cancel();
      inner();
      --retryCount;
    }, 2000); // every 2 secs to retry

    var json = {
      app: appName,
      containerVer: AssetsVersion,
      contentVer: '1.0.0'
    };

    if (ionic.Platform.isAndroid()) {
      json.container = 'android-container';
    }
    if (ionic.Platform.isIOS()) {
      json.container = 'ios-container';
    }

    function inner() {
      window.cordova && cordova.exec(
        checkVersionSuccess, ()=>{
          $ionicLoading.hide();
          $rootScope.$emit('$update', {
            type: 'failed'
          });
          console.log('[ModuleManager] checkVersion Err');
          console.log(arguments);
        },
        "ModuleManager", "checkVersion",
        [json, updateVersionURL]
      );
    }
  }

  function checkVersionSuccess(newInfo) {
    if(isChecked) return;
    isChecked = true;
    var container = newInfo.container; // content 升级先不管
    // Todo check version type
    todoVersionNum = container.version;
    var popupType;
    if(container.mustUpdate || container.update) {
      if(AssetsVersion != todoVersionNum) {
        // $ionicLoading.hide();
        popupType = container.mustUpdate ? 'alert' : 'confirm';
        $popup
          .showUpdate(popupType, container.text)
          .then(function (res) {
            if((popupType === 'confirm') && !res) return;
            if (ionic.Platform.isAndroid()) {
              updateAndroidVersion(container.urls);
            }
            if (ionic.Platform.isIOS()) {
              updateIOSVersion(container.urls);
            }
          });
      }
    } else {
      $rootScope.$emit('$update', {
        type: 'none'
      });
    }
  }

  function updateAndroidVersion(urls) {
    $ionicLoading.show({template: `
      正在下载最新版本...<br/>
      <ion-spinner icon="ios"></ion-spinner>
    `});
    cordova.exec(function () {
      $ionicLoading.hide();
    }, function () {
      $ionicLoading.hide();
    }, "ModuleManager", "openBrowser", urls);
    // [`${apkHostPath}/${todoVersionNum}.apk`]
  }

  function updateIOSVersion(urls) {
    $ionicLoading.show({template: `
      正在下载最新版本...<br/>
      <ion-spinner icon="ios"></ion-spinner>
    `});
    cordova.exec(function () {
      $ionicLoading.hide();
      cordova && cordova.exec(function () {
      }, function () {
      }, "ModuleManager", "exitApplication", []);
    }, function () {
      $ionicLoading.hide();
      // updateIOSVersion();
    },"ModuleManager", "openBrowser", urls); // +'.plist'
    // 'itms-services://?action=download-manifest&url='+urls[0] plist
    // itms-apps://itunes.apple.com/cn/app/guang-fa-li-cai-guang-fa-zheng/id1061910066
  }
}

