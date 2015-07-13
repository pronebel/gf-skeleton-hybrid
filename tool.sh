#!/usr/bin/env bash

set -o errexit # Exit on error

cd ./cordova/
version=$(node -pe 'JSON.parse(process.argv[1]).version' "$(cat package.json)")
echo "app version: $version"

if [[ $1 = 'help' ]]; then
    printf $"$(basename "$0") [help] [bump] [build dev|release] [release]
    program related to hybrid app build/deploy at gf security
    where:

        help: cmd help for this cli bash script
        bump: bump up alpha version code
        build: build release/dev version android/ios apk/ipa
        relese: upload build apk/ipa to cdn for test"
fi

if [[ $1 = 'bump' ]]; then
    # major, beta 两者的变更代表大版本升级，手动更改 package.json
    # version code 配置 在 package.json's version
    echo $(perl -pe 's/^((\d+\.)*)(\d+)$/$1.($3+1)/e' $version)
    # echo inc($version)
    # num=$(echo "$version" | awk '{split($0,a,"."); print a[3]+1}')
    # echo ${$version/\\d/}
    # echo $num
    # newVer="0.0.$num"
    # echo "next version: $newVer"
    # sed -i "" "s/$version/$newVer/g" ./version.ini

    # rm                                              ./App/config.xml
    # cp ./publish/template/config.xml                ./App/config.xml
    # sed -i "" "s/VERSION_NUMBER/$version/g"         ./App/config.xml
    # sed -i "" "s/VERSION_NUMBER/$version/g"         ./App/www/index.html
fi

apkOut = "platforms/android/build/outputs/apk/android-debug.apk";
ipaOut = ''
pygUKey = "0e5fe9c73946e67627b0210209eeb617";
pgyApiKey = "39ef26f4bcdc8561c803a9e22a9d9f70";

if [[ $1 = 'pgy' ]]; then
  curl -F "file=@{$apkOut}" -F "uKey={$uKey}" -F "_api_key={$apiKey}" -F "publishRange=2" http://www.pgyer.com/apiv1/app/upload
fi


if [[ $1 = 'build' ]]; then
    if [[ $2 = 'dev' ]]; then
        # Android build
        # ionic build android --debug || { echo "building android apk failed"; exit 1; }
        # mv ./platforms/android/build/outputs/apk/android-debug.apk ../release/android_$version.apk
        # # iOS build
        ionic build ios --debug --device || { echo "building ios app failed"; exit 1; }
        xcrun -sdk iphoneos PackageApplication -v ./platforms/ios/build/device/理财账户.app -o ../release/iphone_$version.ipa
    else
        # Android release
        ionic build android --release || { echo "building android apk failed"; exit 1; }
        mv ./platforms/android/build/outputs/apk/android-release-unsigned.apk ../publish/android_unsigned_$version.apk
        jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass 20150501 -keystore ../sign/account-app-release-key.keystore ../publish/android_unsigned_$version.apk account_app
        /Users/ghlndsl/bin/sdk/build-tools/22.0.1/zipalign -v 4 ../publish/android_unsigned_$version.apk  ../publish/android_$version.apk
        rm ../publish/android_unsigned_$version.apk
        # iOS release
        ionic build ios --release --device || { echo "building ios app failed"; exit 1; }
        xcrun -sdk iphoneos PackageApplication -v ./platforms/ios/build/device/App.app -o `pwd`/iphone.ipa
        mv ./iphone.ipa ../publish/iphone_$version.ipa
    fi
fi

# ios encode
# xcrun -sdk iphoneos PackageApplication -v ./platforms/ios/build/device/App.app -o `pwd`/iphone.ipa
# mv ./iphone.ipa ../publish/iphone_$version.ipa

if [[ $1 = 'upload' ]]; then
    exit
    # verbose!!!
    # cp ./publish/template/index.html   ./publish/index.html
    # cp ./publish/template/iphone.plist ./publish/iphone_$version.plist

    # sed -i "" "s/VERSION_NUMBER/$version/g"         ./publish/index.html
    # sed -i "" "s/BUILD_DATETIME/`date`/g"           ./publish/index.html
    # sed -i "" "s/VERSION_NUMBER/$version/g"         ./publish/iphone_$version.plist

    # if [[ $1 = 'dev' ]]; then
    #     sed -i "" "s/PATH/dev/g"                    ./publish/index.html
    #     sed -i "" "s/PATH/dev/g"                    ./publish/iphone_$version.plist
    # else
    #     sed -i "" "s/PATH/product/g"                ./publish/index.html
    #     sed -i "" "s/PATH/product/g"                ./publish/iphone_$version.plist
    # fi


    # cd ./App/platforms/
    # zip -r android.zip android
    # zip -r ios.zip ios
    # mv *zip ../../publish/
    # cd ..
    # cd ..

    # cd ./publish/
    # pwd
    # if [[ $1 = 'dev' ]]; then
    #     ftp -u ftp://gfopen:gfopen2015@10.2.89.182/dev/container/ *apk
    #     ftp -u ftp://gfopen:gfopen2015@10.2.89.182/dev/container/ *ipa
    #     #ftp -u ftp://gfopen:gfopen2015@10.2.89.182/dev/content/ *zip
    #     ftp -u ftp://gfopen:gfopen2015@10.2.89.182/dev/container/ *plist
    #     ftp -u ftp://gfopen:gfopen2015@10.2.89.182/dev/ *html
    #     ftp -u ftp://gfopen:gfopen2015@10.2.89.182/dev/ *css
    #     ftp -u ftp://gfopen:gfopen2015@10.2.89.182/dev/ *zip
    # else
    #     # ftp -u ftp://gfopen:gfopen2015@10.2.89.182/product/container/ *apk
    #     ftp -u ftp://gfopen:gfopen2015@10.2.89.182/product/container/ *ipa
    #     #ftp -u ftp://gfopen:gfopen2015@10.2.89.182/product/content/ *zip
    #     ftp -u ftp://gfopen:gfopen2015@10.2.89.182/product/container/ *plist
    #     ftp -u ftp://gfopen:gfopen2015@10.2.89.182/product/ *html
    #     ftp -u ftp://gfopen:gfopen2015@10.2.89.182/product/ *css
    #     # ftp -u ftp://gfopen:gfopen2015@10.2.89.182/product/ *zip
    # fi
    # cd ..
fi
