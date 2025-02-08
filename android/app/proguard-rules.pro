# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html
#GMapLib-v3
-keep, allowoptimization class com.google.android.libraries.maps.** { *; }
-keep, allowoptimization class com.google.android.apps.gmm.renderer.* { *; }
#GMapLib-v2
-keep, allowoptimization class com.google.android.gms.maps.* { *; }
-keep, allowoptimization interface com.google.android.gms.maps.* { *; }
# Add any project specific keep options here:
# [react-native-background-fetch]
-keep class com.transistorsoft.rnbackgroundfetch.HeadlessTask { *; }
