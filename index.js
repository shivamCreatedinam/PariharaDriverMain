/**
 * @format
 */

import BackgroundTimer from 'react-native-background-timer';
import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { firebase } from '@react-native-firebase/database';
import { enableLatestRenderer } from 'react-native-maps';
// import RNOtpVerify from 'react-native-otp-verify';
const Urls = require('./urls.json');

LogBox.ignoreAllLogs(true);
enableLatestRenderer();

let config = {
    apiKey: 'AIzaSyAyvE_mLR_PEBCmlOs4Se-g1NLahX1htLE',
    appId: '1:1070779167327:android:9df1f76b30ad9f048261ea',
    messagingSenderId: '1070779167327',
    databaseURL: Urls.firebaseUrl,
    projectId: Urls.appID,
};

firebase.initializeApp(config);

// RNOtpVerify.getHash()
//     .then(console.log)
//     .catch(console.log);
// Register the service
// ReactNativeForegroundService.register();
// ReactNativeForegroundService.add_task(() => 
//     console.log("I am Being Tested"), {
//     delay: 100,
//     onLoop: true,
//     taskId: "taskid",
//     onError: (e) => console.log(`Error logging:`, e),
// });
// ReactNativeForegroundService.start({
//     id: 144,
//     title: "Foreground Service",
//     message: "you are online!",
// });

BackgroundTimer.start(5000);

AppRegistry.registerComponent(appName, () => App);