/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
  AppState,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import PushController from './PushController';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Urls = require('./urls.json');
import StackNavigation from './navigation'
import { TailwindProvider } from 'tailwind-rn';
import utilities from './tailwind.json';
import data from './package.json';
import { firebase } from '@react-native-firebase/database';
import NotificationCenter from './NotificationCenter';
import BackgroundTimer from "react-native-background-timer";
import Geolocation from '@react-native-community/geolocation';
// version check
import VersionCheck from 'react-native-version-check';

const App = () => {

  const [isupdated, setisupdated] = React.useState(false);
  const appState = React.useRef(AppState.currentState);
  const [initialRoute, setInitialRoute] = React.useState('PermissionScreenMain');
  // PermissionScreenMain / SplashAppScreen
  const [appStateVisible, setAppStateVisible] = React.useState(appState.current);
  const [authenticated, setAuthenticated] = React.useState(true);

  let config = {
    apiKey: 'AIzaSyAyvE_mLR_PEBCmlOs4Se-g1NLahX1htLE',
    appId: '1:1070779167327:android:9df1f76b30ad9f048261ea',
    messagingSenderId: '1070779167327',
    databaseURL: Urls.firebaseUrl,
    projectId: Urls.appID,
  };

  firebase.initializeApp(config);

  React.useEffect(() => {
    // checkPermission();
    setLongRunTimer();
    // checkAppVersion();
  }, []);

  const handleDeepLink = async url => {
    const newUrl = url.url;
    const waId = newUrl.slice(newUrl.indexOf('=') + 1);

    var myHeaders = new Headers();
    myHeaders.append('clientId', strings.clientId);
    myHeaders.append('clientSecret', strings.clientSecret);
    myHeaders.append('Content-Type', 'application/json');

    console.log('handleDeepLink', JSON.stringify(myHeaders));
  };

  React.useEffect(() => {
    const linkingEvent = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    return () => null;
  }, [handleDeepLink]);

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      getFcmToken();
    } else {
      requestPermission();
    }
  }

  const setLongRunTimer = async () => {
    BackgroundTimer.setInterval(() => {
      LocationTracking();
    }, 10000);
  }

  const LocationTracking = async () => {
    const valuex = await AsyncStorage.getItem('@autoUserType');
    const valueX = await AsyncStorage.getItem('@autoDriverGroup');
    let data = JSON.parse(valueX);
    if (valuex === 'Driver') {
      Geolocation.watchPosition(
        (position) => {
          let currentLocation = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            heading: position.coords.heading,
            speed: position.coords.speed
          };
          // console.log('location_status_update----->>', currentLocation);
          TrackingDriverLocation(position?.coords?.latitude, position?.coords?.longitude, position?.coords?.heading, position.coords.speed, data?.id);
          // var authOptions = {
          //   method: 'POST',
          //   url: url_driver_location_update,
          //   data: JSON.stringify({ 'driver_id': data?.id, 'latitude': position?.coords?.latitude, 'longitude': position?.coords?.longitude }),
          //   headers: { 'Content-Type': 'application/json' },
          //   json: true,
          // };
          // axios(authOptions)
          //   .then((response) => {
          //     if (response.data?.status) {
          //     } else {
          //       console.log('location status update fails' + JSON.stringify(response.data));
          //     }
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //   });
        },
        (error) => console.log(error),
        {
          showLocationDialog: true,
          enableHighAccuracy: true,
          accuracy: {
            android: "high",
            ios: "bestForNavigation",
          },
          fastestInterval: 100,
          distanceFilter: 0.01,
          interval: 1500,
        }
      );
    } else {

    }

  }

  const TrackingDriverLocation = async (lattitude, longitude, header, speed, d_ids) => {
    let reff = '/tracking/' + d_ids + '';
    const driverData = {
      lattitude: lattitude,
      longitude: longitude,
      heading: header,
      speed: speed,
    }
    database()
      .ref(reff)
      .set({
        time: new Date().getTime(),
        timeUTC: new Date(),
        location: driverData,
      })
      .then(() => { });
  }

  const getFcmToken = async () => {
  }

  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
    } catch (error) {
      console.log("call error", error);
      // User has rejected permissions
    }
  }

  const forceUpdate = async () => {
    try {
      // let updateNeeded = await VersionCheck.needUpdate();
      // console.log('updateNeeded------------->', JSON.stringify(updateNeeded));
      const PlayStoreUrl = await VersionCheck.getPlayStoreUrl();
      VersionCheck.needUpdate({
        currentVersion: VersionCheck.getCurrentVersion(),
        latestVersion: data.version
      }).then((res) => {
        if (res.isNeeded) {
          console.log('updateNeeded------------->' + PlayStoreUrl, JSON.stringify(res));
        }
      })
      // const currentVersion = DeviceInfo.getVersion();
      // const latestVersion = await VersionCheck.getCurrentVersion();
      // const PlayStoreUrl = await VersionCheck.getPlayStoreUrl();
      // console.log('updateNeeded------------->' + PlayStoreUrl + ' -> ' + currentVersion, JSON.stringify(latestVersion));
      // if (false) {
      //   setisupdated(false)
      //   Alert.alert('Please update', 'You have to update the app to continue using',
      //     [{
      //       text: 'Update',
      //       onPress: () => {
      //         Linking.openURL(updateNeeded.storeUrl)
      //         BackHandler.exitApp()
      //       }
      //     }
      //     ], { cancelable: false })
      // }
      // else {
      //   setisupdated(true)
      // }
    }
    catch (err) {
      console.log(err);
    }
  }

  const checkAppVersion = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion({
        packageName: 'com.mapilocator', // Replace with your app's package name
        ignoreErrors: true,
      });

      const currentVersion = VersionCheck.getCurrentVersion();

      if (latestVersion > currentVersion) {
        Alert.alert(
          'Update Required',
          'A new version of the app is available. Please update to continue using the app.',
          [
            {
              text: 'Update Now',
              onPress: () => {
                Linking.openURL(
                  Platform.OS === 'ios'
                    ? VersionCheck.getAppStoreUrl({ appID: 'com.mapilocator' })
                    : 'https://play.google.com/store/apps/details?id=com.mapilocator&hl=en&gl=US'
                );
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        // App is up-to-date, proceed with the app
        setisupdated(false);
        console.log(' App is up-to-date, proceed with the app');
      }
    } catch (error) {
      // Handle error while checking app version
      console.error('Error checking app version:', error);
    }
  };


  if (isupdated) {
    return <ImageBackground
      style={{ flex: 1 }}
      source={require('./src/assets/background.jpeg')}
      resizeMode={'repeat'}>
      <Image
        style={{ width: 300, height: 300, resizeMode: 'contain', alignSelf: 'center', marginTop: 150, tintColor: 'rgb(131,24,28)' }}
        source={require('./src/assets/updateImage.png')} />
      <TouchableOpacity
        style={{ alignSelf: 'center', top: -50, backgroundColor: 'rgb(131,24,28)', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10, elevation: 5 }}
        onPress={() => forceUpdate()}>
        <Text style={{ color: '#ffffff', textTransform: 'uppercase', fontWeight: 'bold' }}>Update Now {data?.version}</Text>
      </TouchableOpacity>
    </ImageBackground>
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MenuProvider>
          <TailwindProvider utilities={utilities}>
            <StatusBar backgroundColor='black' barStyle='light-content' translucent />
            <NotificationCenter />
            <StackNavigation initialRouts={initialRoute} />
            <PushController />
            <Toast />
          </TailwindProvider>
        </MenuProvider>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  imageMarker: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  }
});

export default App;
