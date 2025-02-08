/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useEffect } from 'react';
import {
    Alert,
    Animated,
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from 'react-native';
import {
    setUpdateIntervalForType,
    SensorTypes,
} from 'react-native-sensors';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';
import MapView, {
    Camera,
    Marker,
    AnimatedRegion
} from 'react-native-maps';
import ToggleSwitch from 'toggle-switch-react-native'
import { useNavigation, useRoute } from '@react-navigation/native';
import imagePath from '../../../common/imagePath';
import { locationPermission, getCurrentLocation } from '../../../common/helperFunction';
import Loader from '../../../common/Loader';
import globle from '../../../common/env';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

setUpdateIntervalForType(SensorTypes.accelerometer, 15);

const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION'; 
const TIMERREFRESH = 5000;
const TIMERREFRESHANIMATE = 8000;
const LATITUDE_DELTA = 0.012;
const LONGITUDE_DELTA = 0.012;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let location = null;

const MapsScreens = () => {

    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const navigate = useNavigation();
    const routs = useRoute();
    const markerAnimation = React.useRef(new Animated.Value(0)).current;
    const [state, setState] = React.useState({
        curLoc: {
            latitude: 28.7003405,
            longitude: 77.1830238,
        },
        destinationCords: {
            latitude: 28.7003405,
            longitude: 77.1830238,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        },
        isLoading: false,
        coordinate: new AnimatedRegion({
            latitude: 28.7003405,
            longitude: 77.1830238,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }),
        time: 0,
        distance: 0,
        heading: 0,
    });

    const { curLoc, time, distance, destinationCords, isLoading, coordinate, heading } = state
    const updateState = (data) => setState((state) => (
        { ...state, ...data }
    ));

    function generateRandomCharacter() {
        const length = 10;
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    };


    // useEffect(() => {
    //     if (mapRef) {
    //         mapRef.animateToViewingAngle(45, 2000);
    //     }
    // }, [mapRef]);

    const startMarkerAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(markerAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(markerAnimation, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    React.useEffect(() => {
        getLiveLocation()
    }, []);

    const getLiveLocation = async () => {
        const locPermissionDenied = await locationPermission()
        if (locPermissionDenied) {
            Geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const heading = position.coords.heading;
                    const speed = position.coords.speed;
                    if (stopTripEvent) {
                        saveLoation(latitude, longitude, heading);
                    }
                    console.log("get live location after 4 second", latitude);
                    updateState({
                        heading: heading,
                        curLoc: { latitude, longitude },
                        coordinate: new AnimatedRegion({ latitude: latitude, longitude: longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }),
                    });
                },
                error => console.log(error),
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 500,
                }
            );
            // const { latitude, longitude, heading } = await getCurrentLocation()
            // animate(latitude, longitude);
            // updateState({
            //     heading: heading,
            //     curLoc: { latitude, longitude },
            //     coordinate: new AnimatedRegion({
            //         latitude: latitude,
            //         longitude: longitude,
            //         latitudeDelta: LATITUDE_DELTA,
            //         longitudeDelta: LONGITUDE_DELTA
            //     })
            // })
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getLiveLocation();
        }, 1000);
        return () => clearInterval(interval)
    }, [])

    const onPressLocation = () => {
        // navigation.navigate('chooseLocation', { getCordinates: fetchValue })
    }

    const fetchValue = (data) => {
        console.log("this is data", data)
        updateState({
            destinationCords: {
                latitude: data.destinationCords.latitude,
                longitude: data.destinationCords.longitude,
            }
        })
    }

    const animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                markerRef.current.animateMarkerToCoordinate(newCoordinate, 8000);
            }
        } else {
            coordinate.timing(newCoordinate).start();
        }
    }

    const onCenter = () => {
        // mapRef.current.animateToRegion({
        //     latitude: curLoc.latitude,
        //     longitude: curLoc.longitude,
        //     latitudeDelta: LATITUDE_DELTA,
        //     longitudeDelta: LONGITUDE_DELTA
        // })
    }

    const fetchTime = (d, t) => {
        updateState({
            distance: d,
            time: t
        })
    }

    const randomCharacter = generateRandomCharacter();

    // const appState = React.useRef(AppState.currentState);
    // const [appStateVisible, setAppStateVisible] = React.useState(appState.current);
    const [distancex, setDistance] = React.useState(0);
    // const [duration, setDuration] = React.useState(0);
    const [REX, setRex] = React.useState(randomCharacter);
    // const [magnetometerx, setMagnetometer] = React.useState({ x: 0, y: 0, z: 0 });
    const [compassSpeed, setCompassSpeed] = React.useState(0);
    // const [center, setCenter] = React.useState({ latitude: 0, longitude: 0, heading: 0 });
    const [isTraffic, setTraffic] = React.useState(false); // initialize marker rotation to 0 degrees
    const [curLatLong, setLatLong] = React.useState({ latitude: 28.7003405, longitude: 77.1830238, heading: 0 });
    // const [tripStarted, setTripStarted] = React.useState(true);
    // const [stopArray, setStopArray] = React.useState([
    //     {
    //         "order": 1,
    //         "id": 38,
    //         "name": "Sector 36A, Gurugram, Haryana, India",
    //         "longitude": 76.9779875,
    //         "latitude": 28.4146508,
    //         "createdAt": "2023-04-17T08:22:33.277Z",
    //         "updatedAt": "2023-04-17T08:22:33.277Z",
    //         "publishedAt": "2023-04-17T08:22:33.251Z",
    //         "passengers": 0
    //     },
    //     {
    //         "order": 2,
    //         "id": 39,
    //         "name": "Reja Tayar Panchar, near M3m, Sector 73, Gurugram, Haryana, India",
    //         "longitude": 77.0099803,
    //         "latitude": 28.4011338,
    //         "createdAt": "2023-04-17T08:22:34.140Z",
    //         "updatedAt": "2023-04-17T08:22:34.140Z",
    //         "publishedAt": "2023-04-17T08:22:34.138Z",
    //         "passengers": 1
    //     },
    //     {
    //         "order": 3,
    //         "id": 42,
    //         "name": "Cristiane, Golf Course Extension Road, Sector 65, Gurugram, Haryana, India",
    //         "longitude": 77.0593244,
    //         "latitude": 28.4065643,
    //         "createdAt": "2023-04-17T08:22:34.825Z",
    //         "updatedAt": "2023-04-17T08:22:34.825Z",
    //         "publishedAt": "2023-04-17T08:22:34.810Z",
    //         "passengers": 1
    //     },
    //     {
    //         "order": 4,
    //         "id": 41,
    //         "name": "M3M Urbana, Golf Course Ext Rd, Ramgarh, Sector 67, Gurugram, Haryana, India",
    //         "longitude": 77.074099,
    //         "latitude": 28.412066,
    //         "createdAt": "2023-04-17T08:22:34.691Z",
    //         "updatedAt": "2023-04-17T08:22:34.691Z",
    //         "publishedAt": "2023-04-17T08:22:34.689Z",
    //         "passengers": 1
    //     },
    //     {
    //         "order": 5,
    //         "id": 40,
    //         "name": "Sector 55 Bus Station, Golf Course Extension Road, Block A, Sushant Lok III, Sector 57, Gurugram, Haryana, India",
    //         "longitude": 77.08203429999999,
    //         "latitude": 28.4147081,
    //         "createdAt": "2023-04-17T08:22:33.359Z",
    //         "updatedAt": "2023-04-17T08:22:33.359Z",
    //         "publishedAt": "2023-04-17T08:22:33.357Z",
    //         "passengers": 2
    //     },
    //     {
    //         "order": 6,
    //         "id": 44,
    //         "name": "Rajesh Pilot Gurjar Chowk, Sector 61, Gurugram, Haryana",
    //         "longitude": 77.0912036,
    //         "latitude": 28.4172983,
    //         "createdAt": "2023-04-17T08:22:35.437Z",
    //         "updatedAt": "2023-04-17T08:22:35.437Z",
    //         "publishedAt": "2023-04-17T08:22:35.348Z",
    //         "passengers": 3
    //     },
    //     {
    //         "order": 7,
    //         "id": 45,
    //         "name": "The HUDA CGHS, Shushant Lok 2, Vigyan Vihar, Sector 56, Gurugram, Haryana, India",
    //         "longitude": 77.1012531,
    //         "latitude": 28.4186979,
    //         "createdAt": "2023-04-17T08:22:35.552Z",
    //         "updatedAt": "2023-04-17T08:22:35.552Z",
    //         "publishedAt": "2023-04-17T08:22:35.551Z",
    //         "passengers": 2
    //     },
    //     {
    //         "order": 8,
    //         "id": 46,
    //         "name": "MAGNUM TOWERS, Golf Course Extension Road, Sector 58, Gurugram, Haryana, India",
    //         "longitude": 77.1083994,
    //         "latitude": 28.4120119,
    //         "createdAt": "2023-04-17T08:22:35.666Z",
    //         "updatedAt": "2023-04-17T08:22:35.666Z",
    //         "publishedAt": "2023-04-17T08:22:35.662Z",
    //         "passengers": 0
    //     },
    //     {
    //         "order": 9,
    //         "id": 43,
    //         "name": "MAGNUM TOWERS, Golf Course Extension Road, Sector 58, Gurugram, Haryana, India",
    //         "longitude": 77.1083994,
    //         "latitude": 28.4120119,
    //         "createdAt": "2023-04-17T08:22:35.322Z",
    //         "updatedAt": "2023-04-17T08:22:35.322Z",
    //         "publishedAt": "2023-04-17T08:22:35.277Z",
    //         "passengers": 0
    //     }
    // ]);
    const [stopTripEvent, setStopTripEvent] = React.useState(true);
    const [userTargetDistance, setTargetDistance] = React.useState(0);
    const targetLocation = { latitude: 28.5563204, longitude: 77.0362189 };
    const targetRadius = 100; // Radius in meters
    // const [CurrentMarkerPosition, setMarkerPosition] = React.useState(new AnimatedRegion({
    //     latitude: routs.params.location.drop.destinationCords?.latitude,
    //     longitude: routs.params.location.drop.destinationCords?.longitude,
    //     heading: 0,
    //     latitudeDelta: LATITUDE_DELTA,
    //     longitudeDelta: LONGITUDE_DELTA
    // }));
    const [loading, setLoading] = React.useState(false);
    let RevertCxtUser = '/users/' + REX;
    // Geolocation.setRNConfiguration({
    //     skipPermissionRequests: false,
    //     authorizationLevel: 'always',
    // });

    // React.useEffect(() => {
    //     // AppState.addEventListener('change', _handleAppStateChange);
    //     console.log('', routs.params.location.drop.destinationCords?.latitude);
    //     return () => {
    //         // console.log('addEventListener');
    //     };
    // }, [appState, tripStarted]);

    // const _handleAppStateChange = nextAppState => {
    //     if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
    //         // console.log('App has come to the foreground!');
    //         if (tripStarted) {
    //             // Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
    //             //   if (value) {
    //             //     Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
    //             //   }
    //             // });
    //             (async () => {
    //                 location = await Location.getCurrentPositionAsync({});
    //                 console.log("CurrentLocationOfDriver", location);
    //                 // console.log("Trip Started OR Not -->", tripStarted + " ---> Speed of Driver", location.coords.speed);
    //             })
    //         }
    //     }
    //     appState.current = nextAppState;
    //     setAppStateVisible(appState.current);
    //     if (appState.current == "background") {
    //         if (tripStarted) {
    //             Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
    //                 accuracy: Location.Accuracy.Highest,
    //                 distanceInterval: 0,
    //                 deferredUpdatesInterval: 5000,
    //                 foregroundService: {
    //                     notificationTitle: 'ArrivNow Using your location',
    //                     notificationBody: 'To turn off, go back to the app.',
    //                 },
    //             });
    //         }
    //     }
    // };

    // const calculateDistance = (location1, location2) => {
    //     const earthRadius = 6371; // Radius of the Earth in kilometers
    //     const latDiff = toRad(location2.latitude - location1.latitude);
    //     const lonDiff = toRad(location2.longitude - location1.longitude);
    //     const a =
    //         Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    //         Math.cos(toRad(location1.latitude)) *
    //         Math.cos(toRad(location2.latitude)) *
    //         Math.sin(lonDiff / 2) *
    //         Math.sin(lonDiff / 2);
    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     const distance = earthRadius * c * 1000; // Convert to meters
    //     return distance;
    // };

    // const toRad = angle => (angle * Math.PI) / 180;

    // React.useEffect(() => {
    //     if (userLocation) {
    //         const distance = calculateDistance(userLocation, targetLocation);
    //         let tgdc = Math.round(distance);
    //         setTargetDistance(tgdc);
    //         if (distance <= targetRadius) {
    //             console.log('User has reached the target location!');
    //             // Perform actions when user reaches the target location
    //         }
    //     }
    // }, [userLocation]);

    // React.useEffect(() => {
    //     if (loading) {
    //         centerLocation();
    //     }
    // }, [center]);

    // const animateMarker = (latitude, longitude) => {
    //     const newCordnate = { latitude, longitude };
    //     if (Platform.OS === 'android') {
    //         markerRef.current.animateMarkerToCoordinate(newCordnate, TIMERREFRESHANIMATE);
    //     }
    // }


    // React.useEffect(() => {
    //     getLocation();
    // }, [false]);

    // React.useEffect(() => {
    //     let count = 0;
    //     const interval = setInterval(() => {
    //         count = count + 1;
    //         // console.log('setInterval', count);
    //         getLocationRepeat();
    //     }, TIMERREFRESH)
    //     return () => clearInterval(interval);
    // }, [false]);

    // //rest of code will be performing for iOS on background too
    // // BackgroundTimer.runBackgroundTimer(() => {
    // //   //code that will be called every 3 seconds 
    // //   getLocation();
    // // }, TIMERREFRESH);
    // // BackgroundTimer.stopBackgroundTimer(); // After this call all code on background stop run.


    // async function getLocationRepeat() {
    //     // Get current location
    //     Geolocation.getCurrentPosition(
    //         position => {
    //             const latitude = position.coords.latitude;
    //             const longitude = position.coords.longitude;
    //             const heading = position.coords.heading;
    //             const speed = position.coords.speed;
    //             setUserLocation({ latitude, longitude });
    //             if (appState.current !== "background") {
    //                 // setCompassSpeed(speed);
    //                 // setCenter({ latitude: latitude, longitude: longitude, heading: heading });
    //                 // animateMarker(latitude, longitude);
    //                 // saveLoation(latitude, longitude);
    //             }
    //         },
    //         error => console.log(error),
    //         {
    //             enableHighAccuracy: true,
    //             timeout: 15000,
    //             maximumAge: 500,
    //         }
    //     );
    // }


    // async function getLocation() {
    //     try {
    //         // Request location permission
    //         if (Platform.OS === 'android') {
    //             await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    //         }
    //         // Get current location
    //         Geolocation.getCurrentPosition(
    //             position => {
    //                 const latitude = position.coords.latitude;
    //                 const longitude = position.coords.longitude;
    //                 const heading = position.coords.heading;
    //                 // console.log('getCurrentPosition', position); // speed
    //                 // setLongitude(longitude);
    //                 // setLatLong({ latitude: latitude, longitude: longitude, heading: heading });
    //                 // saveLoation(latitude, longitude);
    //                 setLoading(true);
    //             },
    //             error => console.log(error),
    //             {
    //                 enableHighAccuracy: true,
    //                 timeout: 10000,
    //                 maximumAge: 1000
    //             }
    //         );
    //     } catch (err) {
    //         console.warn(err);
    //     }
    // }

    const fatchDistanceDuration = (dis, dur) => {
        setDistance(dis);
        setDuration(dur);
    }


    async function saveLoation(latitude, longitude, headingx) {

        let userDetails = {
            name: 'Noida To Gurgoan',
            last_update: new Date().getTime(),
            driver_Name: 'Mohit Tahk',
            pick_point_lat: curLatLong.latitude,
            pick_point_lng: curLatLong.longitude,
            drop_point_lat: destinationCords.latitude,
            drop_point_lng: destinationCords.longitude,
            trip_activate: true,
            driver_location: {
                name: REX,
                role: 'Driver',
                latitude: latitude,
                longitude: longitude,
                header: headingx
            }
        }

        database()
            .ref(RevertCxtUser)
            .set(userDetails)
            .then(() => {
                console.log('saveLoation', true);
            });
    }

    React.useEffect(() => {
        onCenter()
    }, [state]);

    function goBackEndTrip() {
        setStopTripEvent(!stopTripEvent);
        console.log('goBackEndTrip', stopTripEvent);
        Alert.alert(
            'End Trip',
            'Are you sure, want end the trip?',
            [
                { text: 'Cancel', onPress: () => setStopTripEvent(true) },
                { text: 'OK', onPress: () => endTrip() },
            ]
        );
    }

    function endTrip() {
        const endTrip = {
            trip_activate: false,
        }
        database()
            .ref(RevertCxtUser)
            .update(endTrip)
            .then(() => {
                console.log('endTrip', true);
                navigate.goBack();
            });
    }

    // const centerLocation = () => {
    //     mapRef.current.animateCamera(90, TIMERREFRESHANIMATE);
    // mapRef.current.animateToRegion({
    //     latitude: center.latitude,
    //     longitude: center.longitude,
    //     latitudeDelta: LATITUDE_DELTA,
    //     longitudeDelta: LONGITUDE_DELTA
    // })
    // }

    // return (
    //     <View style={{}}>
    //         <TouchableOpacity style={{ position: 'absolute', top: 10, left: 10, zIndex: 9999 }}>
    //             <Image style={{ width: 35, height: 35, resizeMode: 'contain' }} source={require('../../assets/previous.png')} />
    //         </TouchableOpacity>
    //         {loading === false ?
    //             <View style={{ alignItems: 'center', marginTop: width }}>
    //                 <ActivityIndicator />
    //                 <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 10, color: '#000000', marginTop: 5 }}>Loading Routes......</Text>
    //             </View> :
    //             <MapView
    //                 ref={mapRef}
    //                 scrollEnabled={true}
    //                 style={{ height: height - 20, width: width }}
    //                 provider={PROVIDER_GOOGLE}
    //                 mapType={'terrain'}
    //                 // showUserLocation
    //                 // followUserLocation
    //                 // loadingEnabled
    //                 // initialCamera={{ center: 45 }}
    //                 // showsUserLocation={true}
    //                 // showsMyLocationButton={true}
    //                 showsBuildings={true}
    //                 pitchEnabled={true}
    //                 pitch={45}
    //                 showsTraffic={isTraffic}
    //                 minZoomLevel={20}
    //                 initialRegion={{
    //                     ...curLatLong,
    //                     latitudeDelta: LATITUDE_DELTA,
    //                     longitudeDelta: LONGITUDE_DELTA,
    //                 }}
    //                 // onRegionChange={(region) => {
    //                 //   console.log('onRegionChange', JSON.stringify(region))
    //                 // }}
    //                 // onLayout={handleMapLayout}
    //                 onMapReady={() => console.log('onMapReady', 'MapReady')} >
    //                 <MapViewDirections
    //                     origin={curLatLong}
    //                     destination={{ longitude: routs.params.location.pickup.destinationCords?.latitude, latitude: routs.params.location.pickup.destinationCords?.longitude }}
    //                     apikey={API_KEYS}
    //                     strokeWidth={4}
    //                     strokeColor={"#008000"}
    //                     // optimizeWaypoints={true}
    //                     mode={'DRIVING'}
    //                     onReady={result => { fatchDistanceDuration(result.distance, result.duration) }}
    //                 />
    //                 <Marker.Animated
    //                     key={0}
    //                     ref={markerRef}
    //                     coordinate={CurrentMarkerPosition}
    //                     anchor={{ x: 0.5, y: 0.5 }}
    //                     title={"Employee ETA : " + duration.toFixed(0) + " Min"} >
    //                     <Image
    //                         source={require('../../assets/car_pointer.png')}
    //                         style={{ height: 50, width: 50, transform: [{ rotate: `${center.heading}deg` }], zIndex: 9999 }} />
    //                 </Marker.Animated>
    //                 {stopArray.map((items) =>
    //                     <Marker
    //                         key={items.id}
    //                         style={{ backgroundColor: '#ccc', }}
    //                         image={require('../../assets/pin_start.png')}
    //                         coordinate={{ latitude: items.latitude, longitude: items.longitude }}
    //                         title={"Employee ETA : " + duration.toFixed(0) + " Min"}
    //                     />
    //                 )}
    //                 <Marker
    //                     key={1}
    //                     style={{ backgroundColor: '#ccc', }}
    //                     image={require('../../assets/pin_start.png')}
    //                     coordinate={curLatLong}
    //                     title={"Employee ETA : " + duration.toFixed(0) + " Min"}
    //                 />
    //                 <Marker
    //                     key={2}
    //                     image={require('../../assets/pin_stop.png')}
    //                     coordinate={{ longitude: 77.186016, latitude: 28.554948 }}
    //                     title={"Car Speed " + Math.round(compassSpeed) + "Kmph"}
    //                 />
    //                 {/* <Marker
    //           coordinate={center}
    //           image={require('./src/assets/car_pointer.png')}
    //           rotation={compassHeading} > distance
    //         </Marker> */}
    //             </MapView>
    //         }
    // <TouchableOpacity onPress={() => centerLocation()} style={{ position: 'absolute', bottom: 10, right: 10, display: loading === false ? 'none' : 'flex' }}>
    //     <Image style={{ height: 55, width: 55, resizeMode: 'contain' }} source={require('../../assets/pointer_picker.png')} />
    // </TouchableOpacity>
    // <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, elevation: 4, display: loading === false ? 'none' : 'flex' }}>
    //     <View style={{ backgroundColor: '#000000', width: 40, height: 40, borderRadius: 100 }}>
    //         <Text style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', marginTop: 8 }}>{Math.round(compassSpeed)}</Text>
    //         <Text style={{ fontSize: 6, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Kmph</Text>
    //     </View>
    // </TouchableOpacity>
    // <TouchableOpacity style={{ position: 'absolute', top: 55, right: 10, elevation: 4, display: loading === false ? 'none' : 'flex' }}>
    //     <View style={{ backgroundColor: '#008000', width: 40, height: 40, borderRadius: 100 }}>
    //         <Text style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', marginTop: 6, fontSize: 15 }}>{Math.round(distance)}</Text>
    //         <Text style={{ fontSize: 7, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Km</Text>
    //     </View>
    // </TouchableOpacity>
    // <View style={{ position: 'absolute', top: 96, right: 10, elevation: 4, display: loading === false ? 'none' : 'flex' }}>
    //     <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'center', color: '#000000' }}>Traffic {userTargetDistance}</Text>
    //     <ToggleSwitch
    //         isOn={isTraffic}
    //         onColor={'#634fc9'}
    //         offColor={'#cc5500'}
    //         size={'small'}
    //         onToggle={isOn => setTraffic(!isTraffic)}
    //     />
    // </View>
    //     </View>
    // );

    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', right: 0, top: 0 }}>
                <TouchableOpacity onPress={() => centerLocation()} style={{ position: 'absolute', bottom: 10, right: 10, display: loading === false ? 'none' : 'flex' }}>
                    <Image style={{ height: 55, width: 55, resizeMode: 'contain' }} source={require('../../assets/pointer_picker.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, elevation: 4, display: loading === false ? 'none' : 'flex' }}>
                    <View style={{ backgroundColor: '#000000', width: 40, height: 40, borderRadius: 100 }}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', marginTop: 8 }}>{Math.round(compassSpeed)}</Text>
                        <Text style={{ fontSize: 6, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Kmph</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ position: 'absolute', top: 55, right: 10, elevation: 4, display: loading === false ? 'none' : 'flex' }}>
                    <View style={{ backgroundColor: '#008000', width: 40, height: 40, borderRadius: 100 }}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', marginTop: 6, fontSize: 15 }}>{Math.round(distance)}</Text>
                        <Text style={{ fontSize: 7, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Km</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ position: 'absolute', top: 96, right: 10, elevation: 4, display: loading === false ? 'none' : 'flex' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'center', color: '#000000' }}>Traffic {userTargetDistance}</Text>
                    <ToggleSwitch
                        isOn={isTraffic}
                        onColor={'#634fc9'}
                        offColor={'#cc5500'}
                        size={'small'}
                        onToggle={isOn => setTraffic(!isTraffic)}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => goBackEndTrip()} style={{ position: 'absolute', top: 10, left: 10, zIndex: 9999 }}>
                <Image style={{ width: 35, height: 35, resizeMode: 'contain' }} source={require('../../assets/previous.png')} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                {/* <MapView
                    ref={mapRef}
                    style={{ height: height - 0, width: width }}
                    pitchEnabled={true}
                    // initialRegion={{
                    //     ...curLoc,
                    //     latitudeDelta: LATITUDE_DELTA,
                    //     longitudeDelta: LONGITUDE_DELTA,
                    // }}
                    initialCamera={{
                        center: {
                            latitude: curLoc.latitude,
                            longitude: curLoc.longitude,
                        },
                        pitch: 45, // Tilt
                        heading: 90, // Bearing
                        zoom: 10,
                    }}
                    onLayout={() => {
                        mapRef.current.animateCamera({
                            center: {
                                latitude: curLoc.latitude,
                                longitude: curLoc.longitude,
                            },
                            heading: 0,
                            pitch: 90,
                        });
                    }}
                >
                    <Marker.Animated
                        ref={markerRef}
                        coordinate={coordinate}
                        anchor={{ x: 0.5, y: 0.5 }}
                        style={{
                            transform: [
                                {
                                    rotate: markerAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg'],
                                    }),
                                },
                            ],
                        }}
                    >
                        <Image
                            source={imagePath.icBike}
                            style={{
                                width: 40,
                                height: 40,
                                transform: [{ rotate: `${heading}deg` }]
                            }}
                            resizeMode="contain"
                        />
                    </Marker.Animated>

                    {Object.keys(destinationCords).length > 0 && (<Marker
                        coordinate={destinationCords}
                        image={imagePath.icGreenMarker}
                    />)}

                    {Object.keys(destinationCords).length > 0 && (<MapViewDirections
                        origin={curLoc}
                        destination={destinationCords}
                        apikey={GOOGLE_MAP_KEY}
                        strokeWidth={6}
                        strokeColor="red"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            fetchTime(result.distance, result.duration),
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: 30,
                                        bottom: 300,
                                        left: 30,
                                        top: 100,
                                    },
                                });
                        }}
                        onError={(errorMessage) => {
                            // console.log('GOT AN ERROR');
                        }}
                    />)}
                </MapView> */}
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0
                    }}
                    onPress={onCenter}
                >
                    <Image source={imagePath.greenIndicator} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomCard}>
                {distance !== 0 && time !== 0 && (<View style={{ alignItems: 'center', marginVertical: 6 }}>
                    <Text>Time left: {time} </Text>
                    <Text>Distance left: {distance}</Text>
                    <Text style={{ fontWeight: 'bold' }}>Trip Id: {REX}</Text>
                </View>)}
            </View>
            <Loader isLoading={isLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomCard: {
        backgroundColor: 'white',
        width: '95%',
        padding: 30,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24,
        borderBottomEndRadius: 24,
        borderBottomStartRadius: 24,
        marginBottom: 50,
        left: 10,
        elevation: 5,
    },
    inpuStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        height: 48,
        justifyContent: 'center',
        marginTop: 16
    }
});

// const styles = StyleSheet.create({
//     sectionContainer: {
//         marginTop: 32,
//         paddingHorizontal: 24,
//     },
//     sectionTitle: {
//         fontSize: 24,
//         fontWeight: '600',
//     },
//     sectionDescription: {
//         marginTop: 8,
//         fontSize: 18,
//         fontWeight: '400',
//     },
//     highlight: {
//         fontWeight: '700',
//     },
//     imageMarker: { width: 40, height: 40, resizeMode: 'contain' }
// });

export default MapsScreens;