/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    Alert,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    Image,
    ActivityIndicator,
    Linking,
    Platform,
    StyleSheet,
    Pressable,
    BackHandler,
    NativeModules
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import BottomSheet from "react-native-gesture-bottom-sheet";
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import Toast from 'react-native-toast-message';
import Modal from "react-native-modal";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import globle from '../../../common/env';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = 0.002;

// PIP Setup
const { PipModule } = NativeModules;

const DriverTrackToMapsScreen = () => {


    const navigate = useNavigation();
    const routes = useRoute();
    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const [loading, setLoading] = React.useState(false);
    const [CurrentTripData, setCurrentTripData] = React.useState('');
    const [PickupPoint, setPickupPoint] = React.useState(null);
    const [DropPoint, setDropPoint] = React.useState(null);
    // distanceTravelled
    const [TripID, setTripID] = React.useState(routes?.params?.id);
    const [driverID, setDriverID] = React.useState(routes?.params?.driver_id);
    const [DistanceTravelled, setDistanceTravelled] = React.useState(0);
    const [TripOtp, setTripOtp] = React.useState(routes?.params?.trip_otp);
    const [DriverName, setDriverName] = React.useState(routes?.params?.drivername);
    const [DriverImage, setDriverImage] = React.useState(routes?.params?.drv_image);
    const [DriverVehicleNo, setDriverVehicleNo] = React.useState(routes?.params?.vehicle_no);
    const [Speed, setSpeed] = React.useState(0.0);
    const [otpVerified, setOtpVerifyed] = React.useState(routes?.params?.otp_verified);
    const [Distance, setDistance] = React.useState(null);
    const [Duration, setDuration] = React.useState(null);
    const [Headings, setHeadings] = React.useState(0);
    const [isCancelPopup, setCancelPopup] = React.useState(false);

    // PIP Init
    const enterPiPMode = () => {
        PipModule.enterPipMode();
    };


    useFocusEffect(
        React.useCallback(() => {
            // whatever
            // console.error('DriverTrackToMapsScreen', JSON.stringify(routes?.params))
            CurrentTripDetails();
            setTimeout(() => {
                // setTimeout

            }, 500);
        }, [])
    );

    React.useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
        };
    }, [backButtonHandler]);

    // React.useEffect(() => {
    //     const unsubscribe = messaging().onMessage((remoteMessage) => {
    //         console.error('called...........................................');
    //         checkCurrentTripDetails()
    //     });
    //     return () => {
    //         unsubscribe();
    //     };
    // }, []);

    const CurrentTripDetails = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var requestOptions = {
            method: 'GET',
            // body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        console.log('checkCurrentTripDetails', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'user-active-trip', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    console.log('checkCurrentTripDetails', JSON.stringify(result?.data));
                    setCurrentTripData(result?.data);
                    // setLoading(true);
                } else {
                    console.log('checkCurrentTripDetails', JSON.stringify(result));
                    // setLoading(true);
                }
            })
            .catch((error) => {
                console.log('error', error);
                // setLoading(true);
            });
    }


    const backButtonHandler = () => {
        PipModule.enterPipMode();
    }

    const cancelUserCurrentTrip = () => {
        // CancelUserCurrentTrip
        Alert.alert(
            'Cancel Current Trip',
            'Are you sure, you want cancel current active trip?',
            [
                { text: 'No', onPress: () => console.warn('close') },
                { text: 'Yes', onPress: () => setCancelPopup(!isCancelPopup) },
            ]
        );
    }

    const cancelUserCurrentTripHit = async () => {
        const autoUserGroup = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(autoUserGroup)?.token;
        // api/user-cancel-trip
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'user-cancel-trip',
            data: {
                'trip_id': TripID,
            },
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        console.log('cancelUserCurrentTripHit', config);
        axios.request(config)
            .then((response) => {
                console.log('cancelUserCurrentTripHit', response.data);
                if (response.data?.status === false) {
                    Toast.show({
                        type: 'error',
                        text1: 'Something went wrong!',
                        text2: response.data?.message,
                    });
                } else if (response.data?.error) {
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: response.data?.error,
                    });
                } else {
                    Toast.show({
                        type: 'success',
                        text1: '"Trip canceled successfully.',
                        text2: response.data?.message,
                    });
                    ClearAllDataEndTrip();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const ClearAllDataEndTrip = async () => {
        // ClearAllDataEndTrip
        // clear trip, send to home page.
        let key = '@saveTripDetails';
        try {
            await AsyncStorage.removeItem(key);
            setCancelPopup(!isCancelPopup);
            navigate.navigate('UserBottomNavigation');
            return true;
        }
        catch (exception) {
            return false;
        }
    }


    const startTracking = async () => {
        // Set up a listener for your Firebase database reference
        // const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        // let data = JSON.parse(valueX);
        // console.log(data?.id);
        // // const driverData = {
        // //     lattitude: lattitude,
        // //     longitude: longitude,
        // // }
        let reff = '/tracking/' + Number(driverID) + '';
        database().ref(reff).on('value', (snapshot) => {
            // Update the component state with the fetched data
            let data = snapshot.val();
            // console.log('------>', JSON.stringify(data));
            animateMarker(data?.location?.lattitude, data?.location?.longitude);
            setHeadings(data?.location?.heading);
            setDistanceTravelled(data?.location?.speed);
            // this.setState({
            //     coordinate: new AnimatedRegion({
            //         latitude: data?.location?.lattitude,
            //         longitude: data?.location?.longitude,
            //         latitudeDelta: LATITUDE_DELTA,
            //         longitudeDelta: LONGITUDE_DELTA,
            //     });
            // });
            console.log('location_has_been_update', JSON.stringify(data?.location?.longitude));
        });
    }

    const animateMarker = (Lt, Ln) => {
        const newCoordinate = {
            latitude: Lt,
            longitude: Ln,
        };
        // console.log('animateMarker----------->', JSON.stringify(newCoordinate));
        if (Platform.OS === 'android') {
            if (mapRef.current)
                mapRef.current.animateCamera(
                    {
                        center: newCoordinate,
                    },
                    {
                        duration: 200,
                    }
                );
            if (markerRef?.current) {
                markerRef?.current?.animateMarkerToCoordinate(newCoordinate, 600);
            }
        } else {
            // coordinate.timing(newCoordinate).start();
        }
    };

    const checkCurrentTripDetails = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        console.log('checkCurrentTripDetails', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'user-active-trip', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    console.log('checkCurrentTripDetailsX', JSON.stringify(result?.data));

                } else {
                    console.log('checkCurrentTripDetailsY', JSON.stringify(result));

                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }

    const getTripDetails = async () => {
        // @tripOtpKeys
        const trip_otp = await AsyncStorage.getItem('@tripOtpKeys');
        setTripOtp(trip_otp)
        const pickup_point = {
            latitude: parseFloat(routes?.params?.from_lat),
            longitude: parseFloat(routes?.params?.from_long)
        }
        const drop_point = {
            latitude: parseFloat(routes?.params?.to_lat),
            longitude: parseFloat(routes?.params?.to_long)
        }
        setPickupPoint(pickup_point);
        setDropPoint(drop_point);
        setLoading(true);
        startTracking();
    }

    const handleOnMapsPress = () => {
        if (Platform.OS === 'ios') {
            //  Linking.openURL('maps://app?saddr=' + startinPointName + '&daddr=' + endingPointName+'&travelmode=car')
            // startTrip();
            // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + 'Office to Home ')
        }
        if (Platform.OS === 'android') {
            // startTrip();
            // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + DATA[1].name + DATA[2].name)
        }
    }

    const goBackEndTrip = () => {
        Alert.alert(
            'Go To Background',
            'Are you sure, want go Background, Tracking enable in background.',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => checkOrBack() },
            ]
        );
    }

    const checkOrBack = async () => {
        const autoUserGroup = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(autoUserGroup);
        console.log('checkOrBack', JSON.stringify(data));
        navigate.navigate('UserHomeScreen');
    }

    const callToDriver = async (number) => {
        Alert.alert(
            'Call Driver',
            'Are you sure, you want to call Driver?',
            [
                { text: 'No', onPress: () => console.log('cancel', JSON.stringify(routes?.params?.mobile)) },
                { text: 'Yes', onPress: () => Linking.openURL(`tel:${routes?.params?.drivermobile}`) },
            ]
        );
    }

    return (<View style={styles.container}>
        <Pressable onPress={() => goBackEndTrip()} style={{ position: 'absolute', top: 50, left: 10, zIndex: 9999 }} >
            <Image style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: 'white' }} source={require('../../assets/previous.png')} />
        </Pressable>
        {loading === true ?
            <MapView
                ref={mapRef}
                style={styles.map}
                mapType={MapView.MAP_TYPES.TERRIN}
                followUserLocation
                initialRegion={{
                    latitude: parseFloat(CurrentTripData?.from_lat),
                    longitude: parseFloat(CurrentTripData?.from_long),
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }}>
                <MapViewDirections
                    origin={{ latitude: CurrentTripData?.from_lat, longitude: CurrentTripData?.from_long }}
                    destination={{ latitude: CurrentTripData?.to_lat, longitude: CurrentTripData?.to_long }}
                    apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                    mode={'DRIVING'}
                    strokeWidth={6}
                    strokeColor="green"
                    optimizeWaypoints={true}
                    onStart={(params) => {
                        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                    }}
                    onReady={result => {
                        setDistance(result.distance)
                        setDuration(result.duration)
                    }}
                    onError={(errorMessage) => {
                        console.log('GOT_AN_ERROR', JSON.stringify(errorMessage));
                    }}
                />
                {/* <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} strokeColor="green" /> */}
                <Marker coordinate={{ latitude: CurrentTripData?.from_lat, longitude: CurrentTripData?.from_long }}>
                    <Image style={{
                        width: 55,
                        height: 55,
                    }} source={require('../../assets/user_icon.png')} />
                </Marker>
                <Marker coordinate={{ latitude: CurrentTripData?.to_lat, longitude: CurrentTripData?.to_long }}>
                    <Image style={{
                        width: 55,
                        height: 55,
                    }} source={require('../../assets/end_icon.png')} />
                </Marker>
                <Marker.Animated
                    ref={markerRef}
                    coordinate={{ latitude: CurrentTripData?.from_lat, longitude: CurrentTripData?.from_long }}
                    anchor={{ x: 0.5, y: 0.5 }}>
                    <Image
                        source={require('../../assets/data/auto_rickshaw.png')}
                        style={{
                            width: 45,
                            height: 45,
                            resizeMode: 'contain',
                            transform: [{ rotate: `${Headings}deg` }],
                        }}
                    />
                </Marker.Animated>
            </MapView> : <ActivityIndicator style={{ alignItems: 'center', marginTop: width / 2.3 }} size={'large'} color={'red'} />}
        <View style={{ position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#ffffff', borderRadius: 10, elevation: 5 }}>
            {Number(otpVerified) === 0 ?
                <View style={{ padding: 20, alignItems: 'flex-end', flexDirection: 'row', }}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ flex: 1, alignItems: 'center', marginBottom: 10, fontWeight: 'bold', color: 'grey' }}>X SHARE OTP WITH DRIVER TO START TRIP</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, borderColor: 'grey', borderWidth: 1, padding: 7, borderRadius: 5, letterSpacing: 5, elevation: 5, backgroundColor: '#fff' }}>{TripOtp}</Text>
                </View> : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginLeft: 10, marginRight: 10 }}>
                <View style={{ marginBottom: 2 }}>
                    <Image style={{ height: 50, width: 50, borderRadius: 150, resizeMode: 'contain', marginLeft: 7 }} source={{ uri: globle.IMAGE_BASE_URL + DriverImage }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>{CurrentTripData?.drivername}</Text>
                        <TouchableOpacity style={{ marginLeft: 5, paddingTop: 0, marginTop: 1 }}
                            onPress={() => callToDriver()} >
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain' }} source={require('../../assets/call.png')} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontWeight: 'bold' }}>{CurrentTripData?.vehicle_no}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 20, elevation: 10, backgroundColor: '#fff', padding: 8, borderRadius: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'left' }}>Payment Type: <Text style={{ textTransform: 'uppercase' }}>{CurrentTripData?.trip_type}</Text></Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'left' }}>Distance: {CurrentTripData?.distance}Km</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'left' }}>Paid Amount: ₹ {CurrentTripData?.price}/-</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'left' }}>Drop Location: {CurrentTripData?.to_address}</Text>
                </View>
            </View>
        </View>
        {/* <TouchableOpacity style={{ position: 'absolute', top: 150, right: 10, backgroundColor: '#fff', padding: 10, borderRadius: 150 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                {parseFloat(DistanceTravelled).toFixed(2)} km
            </Text>
        </TouchableOpacity> */}
        <Modal isVisible={isCancelPopup}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
                <TouchableOpacity onPress={() => setCancelPopup(!isCancelPopup)} style={{ padding: 5, borderRadius: 150, width: 30, height: 30, position: 'absolute', top: -40, right: 1, }}>
                    <Image style={{ width: 35, height: 35, resizeMode: 'contain' }} source={require('../../assets/close_app.png')} />
                </TouchableOpacity>
                <View style={{ alignSelf: 'center', paddingVertical: 15 }}>
                    <Text style={{ textAlign: 'center', fontWeight: '600' }}>Please Choose once of the reason for cancel current trip, you trip deduction amount will be transfer within 12 hours After successfully trip cancel.</Text>
                </View>
                <TouchableOpacity onPress={() => cancelUserCurrentTripHit()} style={{ padding: 15, elevation: 5, backgroundColor: '#fff', borderRadius: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 15, width: 15, resizeMode: 'contain', tintColor: 'grey', marginRight: 10 }} source={require('../../assets/cancel_icon.png')} />
                    <Text>Wrong pick up location.</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cancelUserCurrentTripHit()} style={{ padding: 15, elevation: 5, backgroundColor: '#fff', borderRadius: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 15, width: 15, resizeMode: 'contain', tintColor: 'grey', marginRight: 10 }} source={require('../../assets/cancel_icon.png')} />
                    <Text>Wrong drop location.</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cancelUserCurrentTripHit()} style={{ padding: 15, elevation: 5, backgroundColor: '#fff', borderRadius: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 15, width: 15, resizeMode: 'contain', tintColor: 'grey', marginRight: 10 }} source={require('../../assets/cancel_icon.png')} />
                    <Text>Plan changed.</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cancelUserCurrentTripHit()} style={{ padding: 15, elevation: 5, backgroundColor: '#fff', borderRadius: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 15, width: 15, resizeMode: 'contain', tintColor: 'grey', marginRight: 10 }} source={require('../../assets/cancel_icon.png')} />
                    <Text>Driver denied ride.</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cancelUserCurrentTripHit()} style={{ padding: 15, elevation: 5, backgroundColor: '#fff', borderRadius: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 15, width: 15, resizeMode: 'contain', tintColor: 'grey', marginRight: 10 }} source={require('../../assets/cancel_icon.png')} />
                    <Text>Waiting time too long.</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cancelUserCurrentTripHit()} style={{ padding: 15, elevation: 5, backgroundColor: '#fff', borderRadius: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 15, width: 15, resizeMode: 'contain', tintColor: 'grey', marginRight: 10 }} source={require('../../assets/cancel_icon.png')} />
                    <Text>Health Emergency.</Text>
                </TouchableOpacity>
            </View>
        </Modal>
        <Menu style={{ zIndex: 999, position: 'absolute', top: 60, right: 20, }}>
            <MenuTrigger>
                <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/see_more.png')} />
            </MenuTrigger>
            <MenuOptions>
                {Number(otpVerified) === 0 ?
                    <MenuOption onSelect={() => cancelUserCurrentTrip()} >
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel Trip</Text>
                    </MenuOption> : null}
                <MenuOption onSelect={() => callToDriver()} >
                    <Text style={{ color: 'black' }}>Call Driver</Text>
                </MenuOption>
                <MenuOption onSelect={() => enterPiPMode()} >
                    <Text style={{ color: 'black', }}>Close App</Text>
                </MenuOption>
            </MenuOptions>
        </Menu>
    </View>)

}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    bubble: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.7)",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20
    },
    latlng: {
        width: 200,
        alignItems: "stretch"
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10
    },
    buttonContainer: {
        position: 'absolute',
        width: '90%',
        zIndex: 9999,
        bottom: 120,
        left: 20,
    }
});

export default DriverTrackToMapsScreen; 