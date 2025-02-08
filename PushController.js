import React from "react";
import { Platform } from "react-native";
import PushNotification, { PushNotificationIOS } from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
// var PushNotification = require("react-native-push-notification");

export default class PushController extends React.Component {

    componentWillReceiveProps() {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function async(token) {
                console.log("TOKEN:", token?.token);
                let finalToken = token?.token;
                AsyncStorage.setItem('@tokenKey', String(finalToken));
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: function (notification) {
                console.log("NOTIFICATION:->", notification);
                // process the notification here
                if (Platform.OS === 'ios') {
                    // required on iOS only 
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },
            // Android only
            messagingSenderId: "1090501687137",
            // iOS only
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true
        });
    }

    render() {
        return null;
    }
}