// import React, { useRef, useState, useEffect } from 'react';
// import {
//     Dimensions,
//     StyleSheet,
//     Image,
//     View,
//     Platform,
//     TouchableOpacity,
//     Linking,
//     AppState,
//     ActivityIndicator,
//     Alert,
//     BackHandler,
//     Animated, Easing

// } from 'react-native';
// import { Text, } from 'react-native-elements';
// import MapView, { PROVIDER_GOOGLE, } from 'react-native-maps'
// import { Marker, AnimatedRegion, MarkerAnimated } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import HeaderHome from '../../containers/Header/HeaderHome'
// import Header from '../../containers/Header/Header';
// import { useRoute } from '@react-navigation/native';
// import BackgroundServices from '../../services/BackgroundServices';
// import * as Location from 'expo-location';
// import * as TaskManager from 'expo-task-manager';
// import { showSnackbarMessage, retrieveAsyncData, isConnected } from "../../common/ComonFunctionCall";
// // import SwipeButton from 'rn-swipe-button';
// import { API_URL, } from "../../common/APIs";
// import Geolocation from '@react-native-community/geolocation';
// import * as BackgroundFetch from 'expo-background-fetch';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getCurrentLocation, locationPermission } from '../../screens/helper/helperFunction';
// import { BlurView } from "@react-native-community/blur";
// import NetInfo from "@react-native-community/netinfo";
// import { useNetInfo } from "@react-native-community/netinfo";
// import { SwipeButton } from '@arelstone/react-native-swipe-button'; 

// const { width, height } = Dimensions.get('window');
// const LATITUDE_DELTA = 0.009;
// const LONGITUDE_DELTA = 0.009;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;
// let flag = 0;
// let vehicleid: any;
// let speed: any;
// let altitude: any;
// let timestamp: any;
// let latitude: any;
// let longitude: any;
// let stopDataArray: any;
// let startinPointName: any;
// let endingPointName: any;
// let nextStopPointName: any;
// var DATA = new Array();
// let location: any;
// let trippId: any;
// var coordinatesArray = new Array();
// let remainingStops: any;
// let header: any;

// // ******************** TaskManager function calling *****************
// const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';

// TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
//     const [locationn] = locations;

//     try {
//         fetch(API_URL.VehicleLocation, {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 "tripId": trippId ? trippId : '',
//                 "vehicleid": vehicleid ? vehicleid : '',
//                 "longitude": locations[0].coords.longitude,
//                 "latitude": locations[0].coords.latitude,
//                 "speed": locations[0].coords.speed,
//                 "altitude": locations[0].coords.altitude,
//                 "timestamp": locations[0].timestamp,
//                 "header": locations[0].coords.heading,
//                 "angle": 16.8544032
//             })
//         }).then((response) => response.json())
//             .then((ResponseJson) => {
//                 // console.log("ResponseJson------------", ResponseJson);

//             })
//             .catch((error) => {
//                 console.log(" AppState is currently in Driver Location Data sent faileddddd coz -->", error);
//             });

//         return BackgroundFetch.BackgroundFetchResult.NewData;

//     } catch (error) {
//         console.log("error------------", error);

//         return BackgroundFetch.BackgroundFetchResult.Failed;
//     }


// });


// export function MapComponent({ navigation }) {
//     const mapRef = useRef();
//     const markerRef = useRef(null);

//     const appState = useRef(AppState.currentState);
//     const [appStateVisible, setAppStateVisible] = useState(appState.current);
//     const route = useRoute();
//     const routeId = route?.params?.routeId;
//     const tripId = route?.params?.tripId;
//     trippId = route?.params?.tripId;
//     const routeTitle = route?.params?.routeTitle;
//     const Logo = route?.params?.logo;
//     const isTripStarted = route.params.isTripStarted;
//     const [tripStarted, setTripStarted] = useState(isTripStarted);
//     const [errorMsg, setErrorMsg] = useState(null);
//     const [dataOfPassengers, setPassengers] = useState([]);
//     const [numberOfPassengers, setNumberOfPassenger] = useState('');
//     const [noOfStops, setNoOfStops] = useState([]);
//     const [driverID, setDriverId] = useState('');
//     const [userID, setUserId] = useState('');
//     const [routeName, setRouteName] = useState('')
//     const [loding, setLoding] = useState(false)
//     const [heading, setHeading] = useState(0)
//     const [latLong, setLatLong] = useState({ latitude: 0, longitude: 0 })
//     const [stopData, setStopData] = useState([])
//     const [targetLocation, setTargetLocation] = useState({ latitude: 0, longitude: 0 })
//     const [counter, setCounter] = useState(1)
//     const [remainingStopData, setRemainingStopData] = useState(0)
//     const [loader, setLoader] = useState(false)
//     const [helperId, setHelperId] = useState('')
//     const [isLoadingg, setIsLoadingg] = useState(false)
//     const [newLoader, setNewLoader] = useState(true)
//     const [buttonEnabled, setButtonEnabled] = useState(true);
//     const [swipeLoader, setSwipeLoader] = useState(false);

//     const markerRef_new = useRef();
//     const mapRef_new = useRef();
//     const [latitude_new, setlatitude_new] = useState(LATITUDE);
//     const [longitude_new, setlongitude_new] = useState(LONGITUDE);
//     const [coordinate_new, setcoordinate_new] = useState( new AnimatedRegion({
//                         latitude: LATITUDE,
//                         longitude: LONGITUDE,
//                         latitudeDelta: 0,
//                         longitudeDelta: 0
//                     }));


//     const netInfo = useNetInfo();

//     let watchID:any;
//     useEffect(() => {
//          watchID = Geolocation.watchPosition(
//             position => {
//                 console.log("position==>",position);

//                 const { latitude_cords, longitude_cords, heading } = position.coords;
//                 const newCoordinate = {
//                     latitude_cords,
//                     longitude_cords
//                 };
//                     if (Platform.OS === "android") {
//                         if (markerRef_new) {
//                             markerRef_new?.current?.animateMarkerToCoordinate(
//                                 newCoordinate,
//                                 1200
//                             );

//                         }
//                     } else {
//                         coordinate_new.timing(newCoordinate).start();
//                     }

//                 setlatitude_new(latitude_cords);
//                 setlongitude_new(longitude_cords);
//                 setHeading(heading);
//             },
//             error => console.log(error),
//             {
//                 enableHighAccuracy: true,
//                 timeout: 20000,
//                 maximumAge: 1000,
//                 distanceFilter: 0
//             }
//         );
//         setInterval(() => {
//             console.log("call timeout");
//             onCenterNew(latitude_new, longitude_new)                    
//         }, 6000);
//       return () => {
//         Geolocation.clearWatch(watchID);
//       }
//     }, [])

//        const onCenterNew = (latitude: any, longitude: any) => {
//         mapRef_new?.current?.animateToRegion({
//             latitude_new: latitude,
//             longitude_new: longitude,
//             latitudeDelta: LATITUDE_DELTA,
//             longitudeDelta: LONGITUDE_DELTA
//         })
//     }

//     retrieveAsyncData('userId').then(async (res) => {

//         if (res) {
//             setUserId(res.replace('"', "").slice(0, -1));
//             try {
//                 const driverIDresponse = await fetch(
//                     API_URL.Driver + '?filters[uid]=' + userID,
//                 );
//                 const jsondriverIDresponse = await driverIDresponse.json();
//                 jsondriverIDresponse?.data != '' ? setDriverId(jsondriverIDresponse.data[0].id) : ''

//             } catch (error) {
//                 console.error("errorr------4", error);
//             }
//         }

//     });

//     const [coordinates, setCordinateState] = useState( new AnimatedRegion({
//         latitude: LATITUDE,
//         longitude: LONGITUDE
//        }));
//     const [prevLatLng,setprevLatLng]=useState({});
//     const [latitude,setlatitude] = useState(LATITUDE);
//     const [longitude,setlongitude] = useState(LONGITUDE);



//     const [state, setState] = useState({
//         curLoc: {
//             latitude: 0,
//             longitude: 0,
//         },
//         destinationCords: {},
//         isLoading: false,
//         coordinate: new AnimatedRegion({
//             latitude: LATITUDE,
//             longitude: LONGITUDE,
//             latitudeDelta: 0,
//             longitudeDelta: 0
//         }),
//         time: 0,
//         distance: 0,
//         // heading: 0

//     })
//     const { curLoc, coordinate } = state
//     const updateState = (data) => setState((state) => ({ ...state, ...data }));

//     // useEffect(() => {
//     //     const watchID = Geolocation.watchPosition(
//     //             position => {
//     //               const { latitude, longitude } = position.coords;
//     //               const newCoordinate = {
//     //                 latitude,
//     //                 longitude
//     //               };
//     //               if (Platform.OS === "android") {
//     //                 if (markerRef) {
//     //                     markerRef?.current?.animateMarkerToCoordinate(
//     //                     newCoordinate,
//     //                     500
//     //                   );
//     //                  }
//     //                } else {
//     //                  coordinate.timing(newCoordinate).start();
//     //                }
//     //                setlatitude(latitude)
//     //                setlongitude(longitude)
//     //              },
//     //              error => console.log(error),
//     //              { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 0 }
//     //           );
//     //     }, [])


//     // useEffect(() => {
//     //     if (loding) {
//     //         onCenter(latLong?.latitude, latLong?.longitude)
//     //     }
//     // }, [latLong?.latitude])

//     const enableGPS = () => {
//         Geolocation.setRNConfiguration({
//             skipPermissionRequests: false,
//             authorizationLevel: 'always',
//         });
//     };

//     const _handleAppStateChange = (nextAppState: any) => {
//         if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//             if (!tripStarted) {
//                 try {
//                     Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
//                         if (value) {
//                             Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
//                         }
//                     });
//                 } catch {

//                 }

//             }
//         }

//         appState.current = nextAppState;
//         setAppStateVisible(appState.current);


//         if (appState.current == "background") {

//         }
//     };

//     useEffect(() => {
//         AppState.addEventListener('change', _handleAppStateChange);
//         return () => {
//             AppState.removeEventListener('change', _handleAppStateChange);
//         };
//     }, []);


//     useEffect(() => {
//         (async () => {
//             if (driverID != '') {
//                 getAllData();
//             }

//             getCommutersData();
//         })();
//     }, [userID, driverID, routeId]);

//     useEffect(() => {
//         if (tripStarted) {
//             try {
//                 Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
//                     if (value) {
//                         Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
//                     }
//                 });
//                 Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {

//                     accuracy: Location.Accuracy.Highest,
//                     distanceInterval: 0,
//                     deferredUpdatesInterval: 5000,

//                     foregroundService: {
//                         notificationTitle: 'ArrivNow Using your location',
//                         notificationBody: 'To turn off, go back to the app.',
//                     },
//                 });
//             } catch {
//                 console.log("Catch block");

//             }

//         }
//     }, [userID, driverID, tripStarted, tripId, appState]);


//     const getCommutersData = async () => {

//         return fetch(API_URL.Driver + '/dd/' + userID)
//             .then((response) => response.json())
//             .then((json) => {

//                 // console.log("Passengers Response------", json.stops);
//                 json?.stops ? setStopData(json?.stops?.sort((a: any, b: any) => a?.order - b?.order)) : setStopData([]);
//                 json?.commuters ? setPassengers(json?.commuters) : setPassengers(null);
//                 json?.totalemployees ? setNumberOfPassenger(json?.totalemployees?.length) : setNumberOfPassenger('0')
//                 json?.stops ? setNoOfStops(json?.stops?.length) : setNoOfStops(null);
//                 json?.route ? setRouteName(json?.route?.name) : setRouteName('')
//                 json?.helper ? setHelperId(json?.helper?.id) : setHelperId(null)
//                 json?.stops ? setTargetLocation({ latitude: json?.stops[1]?.latitude, longitude: json?.stops[1]?.longitude }) : setTargetLocation({ latitude: 0, longitude: 0 })
//                 if (json?.currentTrip?.isstarted) {
//                     flag = 1;
//                 }
//                 else {
//                     flag = 0;
//                 }
//                 setLoader(true)

//             })
//             .catch((error) => {
//                 console.error("errr------3", error);
//             });
//     };



//     const getAllData = async () => {

//         fetch(API_URL.BusDrivers + '?filters[driver][id]=' + driverID + '&populate=%2A')
//             .then((response) => response.json())
//             .then((json) => {
//                 for (let busObject of json.data) {
//                     vehicleid = busObject.attributes.bus.data.id;
//                 }
//             })
//             .catch((error) => {
//                 console.error("errr------2", error);
//             });

//         fetch(API_URL.Stops + '/?filters[route][id]=' + routeId + "&sort[order]=asc")
//             .then((response) => response.json())
//             .then((json) => {
//                 stopDataArray = json.data.map(value => ({ longitude: value.attributes.longitude, latitude: value.attributes.latitude }));
//                 startinPointName = json.data[0].attributes.name;
//                 for (let stopsObject of json.data) {
//                     DATA.push(stopsObject.attributes);
//                 }
//                 endingPointName = json.data[json.data.length - 1].attributes.name;
//                 setCordinateState(stopDataArray);
//                 setNewLoader(false)
//             })
//             .catch((error) => {
//                 console.error("err----1", error);
//             });
//     }

//     const handleSwipe = () => {
//         setButtonEnabled(false);
//         setSwipeLoader(true);
//         startTrip()
//     };

//     const startTrip = async () => {


//         const locPermissionDenied = await locationPermission()
//         if (locPermissionDenied) {
//             const { latitude, longitude, heading, timestamp, altitude, speed } = await getCurrentLocation();
//             setLatLong({ latitude: latitude, longitude: longitude })
//             // animate(latitude, longitude);
//             const params = {
//                 method: 'PUT',
//                 headers: {
//                     'content-type': 'application/json'
//                 },
//                 body: JSON.stringify(
//                     {
//                         "isstarted": true
//                     }
//                 ),
//             };

//             let updateResource = await fetch(API_URL.Trips + "/starttrip/" + tripId,
//                 params
//             );
//             let updatedResponseJson = await updateResource.json();
//             console.log("updatedResponseJson---",updatedResponseJson);

//             setSwipeLoader(false);
//             setTripStarted(true);
//             flag = 1;
//             showSnackbarMessage('Trip has been started... ')
//         }

//     }

//     const stopTrip = async () => {
//         flag = 0;
//         const params = {
//             method: 'PUT',
//             headers: {
//                 'content-type': 'application/json'
//             },
//             body: JSON.stringify(
//                 {
//                     "isended": "true"
//                 }
//             ),
//         };

//         let updateResource = await fetch(API_URL.Trips + "/endtrip/" + filter[where][tripId],
//             params
//         );
//         let updatedResponseJson = await updateResource.json();


//         setTripStarted(false);
//         navigation.navigate('Trips')
//         showSnackbarMessage('Trip has been Stopped !!!')
//     }

//     // const updateTripStartTime = async () => {

//     //     const params = {
//     //         method: 'PUT',
//     //         headers: {
//     //             'content-type': 'application/json'
//     //         },
//     //         body: JSON.stringify(
//     //             {
//     //                 "isstarted": true
//     //             }
//     //         ),
//     //     };

//     //     let updateResource = await fetch(API_URL.Trips + "/starttrip/" + tripId,
//     //         params
//     //     );
//     //     let updatedResponseJson = await updateResource.json();
//     //     console.log("updatedResponseJson---",updatedResponseJson);

//     //     setSwipeLoader(false);
//     //     setTripStarted(true);
//     //     flag = 1;
//     //     showSnackbarMessage('Trip has been started... ')


//     // }

//     // useEffect(() => { getLiveLocation() }, [])

//     const getLiveLocation = async () => {

//         try {
//             setIsLoadingg(false)
//             const locPermissionDenied = await locationPermission()
//             if (locPermissionDenied) {
//                 const { latitude, longitude, heading, timestamp, altitude, speed } = await getCurrentLocation();
//                 fetch(API_URL.VehicleLocation, {
//                     method: 'POST',
//                     headers: {
//                         Accept: 'application/json',
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         "tripId": tripId,
//                         "vehicleid": vehicleid,
//                         "longitude": longitude,
//                         "latitude": latitude,
//                         "speed": speed,
//                         "altitude": altitude,
//                         "timestamp": timestamp,
//                         "header": heading,
//                         "angle": 16.8544032
//                     })
//                 }).then((response) => response.json())
//                     .then((json) => {
//                         console.log("json----->>>>>>>>>", json);

//                     })
//                     .catch((error) => {
//                         console.log("catch error-------", error);

//                     });

//                 setHeading(heading);

//                 setLatLong({ latitude: latitude, longitude: longitude })
//                 // animate(latitude, longitude);
//                 setIsLoadingg(true)
//             }
//         } catch {

//         }

//     }

//     useEffect(() => {

//         const interval = setInterval(async () => {
//             // getLiveLocation()
//         }, 6000);
//         return () => clearInterval(interval)

//     }, [])


//     useEffect(() => {
//         const interval = setInterval(async () => {
//             let isInternet = await isConnected();
//             if (isInternet) {

//             } else {
//                 showSnackbarMessage('Please check your internet connection')
//             }
//         }, 10000);
//         return () => clearInterval(interval)

//     }, [])

//     const markerPosition = new Animated.ValueXY({ x: 100, y: 200 });

//     // const animate = (latitude: any, longitude: any) => {
//     //     try {
//     //         const newCoordinate = {
//     //             latitude: latitude, longitude: longitude,
//     //             latitudeDelta: LATITUDE_DELTA,
//     //             longitudeDelta: LONGITUDE_DELTA,
//     //         };

//     //         if (Platform?.OS == 'android') {
//     //             if (markerRef?.current) {

//     //                 markerRef?.current?.animateMarkerToCoordinate(newCoordinate, 7000);
//     //                 // Animated.timing(markerPosition, {
//     //                 //     toValue: { x: newCoordinate?.latitude, y: newCoordinate?.longitude },
//     //                 //     duration: 7000,
//     //                 //     easing: Easing.linear,
//     //                 //     useNativeDriver: true,
//     //                 //   }).start();
//     //             }
//     //         } else {
//     //             coordinate.timing(newCoordinate).start();
//     //         }
//     //     } catch {

//     //     }

//     // }
//     // const onCenter = (latitude: any, longitude: any) => {
//     //     mapRef?.current?.animateToRegion({
//     //         latitude: latitude,
//     //         longitude: longitude,
//     //         latitudeDelta: LATITUDE_DELTA,
//     //         longitudeDelta: LONGITUDE_DELTA
//     //     })
//     // }


//     const targetRadius = 40;
//     const calculateDistance = (location1: any, location2: any) => {
//         const earthRadius = 6371; // Radius of the Earth in kilometers
//         const latDiff = toRad(location2.latitude - location1.latitude);
//         const lonDiff = toRad(location2.longitude - location1.longitude);
//         const a =
//             Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
//             Math.cos(toRad(location1.latitude)) *
//             Math.cos(toRad(location2.latitude)) *
//             Math.sin(lonDiff / 2) *
//             Math.sin(lonDiff / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const distance = earthRadius * c * 1000; // Convert to meters
//         // console.log("latDiff--", latDiff + '  lonDiff--- ' + lonDiff);

//         return distance;
//     };

//     const toRad = (angle: any) => (angle * Math.PI) / 180;

//     useEffect(() => {
//         if (latLong?.latitude) {
//             const distance = calculateDistance(latLong, targetLocation);
//             console.log("distance---", distance);
//             if (distance <= targetRadius) {
//                 console.log('User has reached the target location!');
//                 setCounter(counter + 1)
//                 let targetCount = stopData?.length

//                 if (counter !== targetCount) {
//                     setTargetLocation({ latitude: stopData[counter]?.latitude, longitude: stopData[counter]?.longitude });
//                     setRemainingStopData(targetCount - counter)
//                     coordinatesArray = [{ ...stopData[counter], flag: true }]

//                 }

//             }
//         }
//     }, [latLong?.latitude, loader]);

//     useEffect(() => {
//         const backAction = () => {
//             Alert.alert('Hold on!', 'Are you sure you want to go back?', [
//                 {
//                     text: 'Cancel',
//                     onPress: () => console.log("cancel pressed"),
//                     style: 'cancel',
//                 },
//                 {
//                     text: 'YES', onPress: () => navigation.goBack()
//                     // BackHandler.exitApp()
//                 },
//             ]);
//             return true;
//         };

//         const backHandler = BackHandler.addEventListener(
//             'hardwareBackPress',
//             backAction,
//         );

//         return () => backHandler.remove();
//     }, []);

//     return (
//         <View style={{ flex: 1, }}>

//             {newLoader ?
//                 <View style={{}}>
//                     <View style={{ position: 'absolute', top: Dimensions.get('screen').height / 2, alignItems: 'center', zIndex: 999, alignSelf: 'center', display: newLoader ? 'flex' : 'none' }}>
//                         <ActivityIndicator size={'large'}
//                             color={'black'}
//                         />
//                     </View>
//                 </View> :
//                 <View style={{ flex: 1, zIndex: 8 }}>
//                     <View style={{
//                         width: '100%',
//                         height: 90,
//                     }}>
//                         {
//                             tripStarted ? <HeaderHome /> : <Header />
//                         }
//                     </View>

//                     <BackgroundServices />

//                     <MapView
//                         ref={mapRef_new}
//                         provider={PROVIDER_GOOGLE}
//                         initialRegion={{
//                             latitude: LATITUDE,
//                             longitude: LONGITUDE,
//                             latitudeDelta: LATITUDE_DELTA,
//                             longitudeDelta: LONGITUDE_DELTA
//                         }}

//                         onMapReady={() => {
//                             setLoding(true)
//                         }}
//                         focusable={true}
//                         toolbarEnabled={true}
//                         showsMyLocationButton={true}
//                         style={{ flex: 1, marginBottom: -10, }}

//                     >

//                         {/* {coordinates.map((coordinate, index) =>
//                             <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate}
//                                 title={index == 0 ?
//                                     'Start point'
//                                     : index == coordinates.length - 1 ?
//                                         'End point'
//                                         : 'stops'}

//                             >

//                                 <Image source={
//                                     index == 0 ?
//                                         require('../../assets/tripstart.png')
//                                         : index == coordinates.length - 1 ?
//                                             require('../../assets/tripend.png')
//                                             : require('../../assets/stops.png')

//                                 }
//                                     style={{ height: 15, width: 15, resizeMode: 'contain' }} />

//                             </MapView.Marker>
//                         )} */}

//                             <MarkerAnimated
//                                 ref={markerRef_new}
//                                 anchor={{ x: 0.45, y: 0.6 }}
//                                 // coordinate={{
//                                 //     latitude: latLong?.latitude,
//                                 //     longitude: latLong?.longitude,
//                                 //     latitudeDelta: LATITUDE_DELTA,
//                                 //     longitudeDelta: LONGITUDE_DELTA
//                                 // }}
//                                 coordinate={coordinate_new}
//                             >
//                                 <Image
//                                     source={require('../../assets/frontbus.png')}
//                                     style={{
//                                         width: 35,
//                                         height: 35,
//                                         // flex:1,
//                                         resizeMode: 'contain',
//                                         transform: [{ rotate: `${heading}deg` }],
//                                         // backgroundColor: 'pink',
//                                     }}
//                                 />
//                             </MarkerAnimated>

//                         {(coordinate_new.length >= 2) && (
//                             <MapViewDirections
//                                 origin={coordinate_new[0]}
//                                 waypoints={coordinate_new.slice(1, -1)}
//                                 destination={coordinate_new[coordinate_new.length - 1]}
//                                 apikey={GOOGLE_MAPS_APIKEY}
//                                 strokeWidth={6}
//                                 strokeColor="#276EF1"
//                                 strokeColors={['#123456', '#345678']}
//                                 optimizeWaypoints={true}
//                                 precision="high"
//                                 onStart={(params) => { }}
//                                 onReady={result => {
//                                     mapRef_new?.current?.fitToCoordinates(result.coordinates, {
//                                         edgePadding: {
//                                             // right: (width / 20),
//                                             // bottom: (height / 20),
//                                             // left: (width / 20),
//                                             // top: (height / 20),
//                                         }
//                                     });
//                                 }}
//                                 onError={(errorMessage) => {
//                                     // console.log('GOT AN ERROR', errorMessage);
//                                 }}
//                                 mode={'DRIVING'}
//                                 resetOnChange={false}
//                             />
//                         )}
//                     </MapView>

//                     <TouchableOpacity
//                         style={{
//                             position: 'absolute',
//                             bottom: 360,
//                             right: 10
//                         }}
//                         onPress={() => {
//                             navigation.navigate('Stops', {
//                                 routeId: routeId,
//                                 tripId: tripId,
//                                 routeName: routeTitle,
//                                 logo: Logo,
//                                 helperId: helperId
//                             })
//                         }}
//                     >
//                         <Image source={require('../../assets/editIcon.png')}
//                             style={{
//                                 width: 55,
//                                 height: 55,
//                                 resizeMode: 'contain',

//                             }} />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={{
//                             position: 'absolute',
//                             bottom: 300,
//                             right: 10
//                         }}
//                         onPress={() => {
//                             onCenterNew(latitude_new, longitude_new)
//                         }}
//                     >
//                         <Image source={require('../../assets/location.png')}
//                             style={{
//                                 width: 55,
//                                 height: 55,
//                                 resizeMode: 'contain',

//                             }} />
//                     </TouchableOpacity>
//                     {
//                         tripStarted == false &&

//                         <View
//                             style={{
//                                 flexDirection: 'column',
//                                 elevation: 5,
//                                 borderTopLeftRadius: 20,
//                                 borderTopRightRadius: 20,
//                                 padding: 15,
//                                 zIndex: 10,
//                             }}>
//                             <View style={{
//                                 width: '100%',
//                                 flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
//                                 padding: 10
//                             }}>
//                                 <View style={{ width: '15%', alignItems: 'center' }}>
//                                     <Image
//                                         resizeMode={'contain'}
//                                         style={{
//                                             width: 30,
//                                             height: 30,
//                                             borderRadius: 30
//                                         }}
//                                         source={require('../../assets/grey.png')}
//                                     />
//                                 </View>
//                                 <View></View>

//                                 <View style={{ width: '85%', }}>
//                                     <Text
//                                         numberOfLines={1}
//                                         style={{
//                                             fontFamily: 'Lato',
//                                             fontWeight: '500',
//                                             fontSize: 16,
//                                             lineHeight: 20,
//                                             color: '#000000',
//                                         }}>{startinPointName}</Text>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '300',
//                                         fontSize: 12,
//                                         lineHeight: 15,
//                                         color: '#78829D',
//                                     }}>Start</Text>
//                                 </View>
//                             </View>

//                             <View style={{ width: '100%', }}>
//                                 <Image
//                                     resizeMode={'contain'}
//                                     style={{
//                                         width: 70,
//                                         tintColor: '#78829d'
//                                     }}
//                                     source={require('../../assets/Line.png')}
//                                 />
//                             </View>

//                             <View style={{
//                                 width: '100%',
//                                 padding: 10,
//                                 flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
//                             }}>
//                                 <View style={{ width: '15%', alignItems: 'center', }}>
//                                     <Image
//                                         resizeMode={'contain'}
//                                         style={{
//                                             width: 30,
//                                             height: 30,
//                                             borderRadius: 30
//                                         }}
//                                         source={require('../../assets/greenIcon.png')}
//                                     />
//                                 </View>

//                                 <View style={{ width: '85%', }}>
//                                     <Text
//                                         numberOfLines={1}
//                                         style={{
//                                             fontFamily: 'Lato',
//                                             fontWeight: '500',
//                                             fontSize: 16,
//                                             lineHeight: 20,
//                                             color: '#000000',
//                                         }}>{endingPointName}</Text>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '300',
//                                         fontSize: 12,
//                                         lineHeight: 15,
//                                         color: '#78829D',
//                                     }}>Finish</Text>
//                                 </View>
//                             </View>

//                             <View
//                                 style={{
//                                     width: '100%', height: 50, padding: 5,
//                                     justifyContent: 'center', alignItems: 'center', marginTop: 10
//                                 }}
//                             >
//                                 <SwipeButton
//                                     // disabled={false}
//                                     disabled={!buttonEnabled}
//                                     // swipeSuccessThreshold={80}
//                                     completeThresholdPercentage={80}
//                                     height={50}
//                                     width={300}
//                                     title={"Swipe to Start"}
//                                     circleBackgroundColor='#FFC20F'

//                                     onComplete={() => {
//                                         handleSwipe()

//                                     }}
//                                     titleStyle={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '600',
//                                         fontSize: 16,
//                                         lineHeight: 20,
//                                         color: '#000000',
//                                     }}
//                                     containerStyle={{
//                                         backgroundColor: '#fff',
//                                         borderRadius: 10,
//                                         borderWidth: 1,
//                                         borderColor: '#FFC20F',

//                                     }}
//                                     underlayStyle={{
//                                         backgroundColor: '#E1B084',
//                                         borderColor: '#FFC20F',
//                                         borderBottomLeftRadius: 23,
//                                         borderTopLeftRadius: 23
//                                     }}

//                                 />
//                                 <View style={{ position: 'absolute', alignItems: 'center', alignSelf: 'center', }}>
//                                     {swipeLoader ? <ActivityIndicator size={'large'}
//                                         color={'#FFC20F'}
//                                     /> : null}
//                                 </View>
//                             </View>
//                         </View>
//                     }

//                     {tripStarted == true &&
//                         <View
//                             style={{
//                                 flexDirection: 'column',
//                                 elevation: 5,
//                                 borderTopLeftRadius: 20,
//                                 borderTopRightRadius: 20,
//                                 padding: 15,
//                                 zIndex: 10,
//                             }}
//                         >
//                             <View style={{
//                                 width: '90%',
//                                 justifyContent: 'center', alignItems: 'center',
//                                 padding: 10,
//                                 flexDirection: 'row'
//                             }}>

//                                 <View style={{ width: !isLoadingg ? '35%' : '100%' }}>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '500',
//                                         fontSize: 16,
//                                         lineHeight: 20,
//                                         color: '#000000',
//                                     }}>In Progress</Text>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '300',
//                                         fontSize: 12,
//                                         lineHeight: 15,
//                                         color: '#78829D',
//                                     }}> Trip Status</Text>
//                                 </View>
//                                 <View style={{ width: !isLoadingg ? '65%' : '0%', display: !isLoadingg ? 'flex' : 'none', alignItems: 'flex-start' }}>
//                                     <ActivityIndicator size={'small'}
//                                         color={'black'}
//                                         style={{ marginRight: !isLoadingg ? 20 : 0 }}
//                                     />
//                                 </View>
//                             </View>
//                             <View style={{
//                                 width: '90%',
//                                 padding: 10,
//                                 flexDirection: 'row',
//                                 justifyContent: 'center', alignItems: 'center',
//                             }}>
//                                 <View style={{ width: '50%' }}>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '500',
//                                         fontSize: 16,
//                                         lineHeight: 20,
//                                         color: '#000000',
//                                     }}>{loader ? noOfStops : 0}</Text>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '300',
//                                         fontSize: 12,
//                                         lineHeight: 15,
//                                         color: '#78829D',
//                                     }}>Total Stops</Text>
//                                 </View>

//                                 <View
//                                     style={{
//                                         width: "50%",
//                                     }}>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '500',
//                                         fontSize: 16,
//                                         lineHeight: 20,
//                                         color: '#000000',
//                                     }}>{loader && stopData?.length > 0 && stopData?.length - counter > 0 ? stopData?.length - counter : 0}</Text>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '300',
//                                         fontSize: 12,
//                                         lineHeight: 15,
//                                         color: '#78829D',
//                                     }}>Remaining Stops</Text>
//                                 </View>
//                             </View>
//                             <View style={{
//                                 width: '90%',
//                                 justifyContent: 'center', alignItems: 'center',
//                                 padding: 10
//                             }}>
//                                 <View style={{ width: '100%', }}>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '500',
//                                         fontSize: 16,
//                                         lineHeight: 20,
//                                         color: '#000000',
//                                     }}>
//                                         {loader && stopData?.length > 0 && stopData?.length - counter > 0 ? stopData[counter]?.name : null}
//                                     </Text>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '300',
//                                         fontSize: 12,
//                                         lineHeight: 15,
//                                         color: '#78829D',
//                                     }}>Next Stop</Text>
//                                 </View>
//                             </View>
//                             <View style={{
//                                 width: '90%',
//                                 padding: 10,
//                                 flexDirection: 'row',
//                                 justifyContent: 'center', alignItems: 'center',
//                             }}>
//                                 <View style={{ width: '50%' }}>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '500',
//                                         fontSize: 16,
//                                         lineHeight: 20,
//                                         color: '#000000',
//                                     }}>{loader ? numberOfPassengers : null}</Text>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '300',
//                                         fontSize: 12,
//                                         lineHeight: 15,
//                                         color: '#78829D',
//                                     }}>Total Passengers</Text>
//                                 </View>

//                                 <View
//                                     style={{
//                                         width: "50%",
//                                     }}>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '500',
//                                         fontSize: 16,
//                                         lineHeight: 20,
//                                         color: '#000000',
//                                     }}>{15}</Text>
//                                     <Text style={{
//                                         fontFamily: 'Lato',
//                                         fontWeight: '300',
//                                         fontSize: 12,
//                                         lineHeight: 15,
//                                         color: '#78829D',
//                                     }}>Next Stop Passengers</Text>
//                                 </View>
//                             </View>
//                         </View>
//                     }
//                 </View>}
//         </View>

//     );

// }

// const styles = StyleSheet.create({
//     header: {
//         flex: 1,
//         height: 20,
//         padding: 50,
//         justifyContent: "space-between",
//         backgroundColor: "black",
//         flexDirection: 'row',
//     },
//     map: {
//         width: Dimensions.get('window').width,
//         height: Dimensions.get('window').height - 250,
//     },
// });
// export default MapComponent;