// import BackgroundGeolocation from 'react-native-background-geolocation';

// BackgroundGeolocation.configure({
//     desiredAccuracy: 10,
//     stationaryRadius: 50,
//     distanceFilter: 50,
//     notificationTitle: 'Background tracking',
//     notificationText: 'enabled',
//     debug: true,
//     startOnBoot: false,
//     stopOnTerminate: false,
//     locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
//     interval: 10000,
//     fastestInterval: 5000,
//     activitiesInterval: 10000,
//     stopOnStillActivity: false,
//     startForeground: true,
// });

// BackgroundGeolocation.on('location', (location) => {
//     // Handle the location update here
//     console.log(JSON.stringify(location))
// });

// BackgroundGeolocation.on('error', (error) => {
//     console.log('[ERROR]', error);
// });

// BackgroundGeolocation.start();