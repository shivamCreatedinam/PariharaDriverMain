/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Pressable,
    View,
    Alert,
    Text,
    Image,
    Linking
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogFooter, DialogButton, } from 'react-native-popup-dialog';
import { CountdownCircleTimer, useCountdown } from 'react-native-countdown-circle-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapViewDirections from 'react-native-maps-directions';
import notifee, { AndroidColor } from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import MapView, {
    Camera,
    Marker,
    Circle
} from 'react-native-maps';
import io from 'socket.io-client';
import globle from '../../../common/env';
// change language 
const coorg = require('../../../common/coorg.json');
const eng = require('../../../common/eng.json');
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0012;
const LONGITUDE_DELTA = 0.0012;

// socket server
const SOCKET_SERVER_URL = 'https://nodeadmin.createdinam.com/';

const TripCreateScreen = () => {

    const navigate = useNavigation();
    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const [name, setName] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const [gender, setGender] = React.useState(null);
    const [number, setNumber] = React.useState(null);
    const [TaxPrice, setTaxPrice] = React.useState(7);
    const [visible, setVisible] = React.useState(false);
    const [BookingVisible, setBookingVisible] = React.useState(false);
    const [message, setMessage,] = React.useState(null);
    const [tripPrice, setTripPrice] = React.useState(0);
    const [Endname, setEndName] = React.useState([]);     // React.useState(route.params.location?.pickup?.destinationCords.name);
    const [StartName, setStartName] = React.useState([]); //React.useState(route.params.location?.drop?.dropCords.name);
    const [Time, setTime] = React.useState('');
    const [eventPrice, setEventPrice] = React.useState(0);
    const [eventTaxPrice, setEventTaxPrice] = React.useState(0);
    const [eventFinalPrice, setEventFinalPrice] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [Distance, setDistance] = React.useState('');
    const [Destinationstate, setDestinationState] = React.useState(null);
    const [wallet_balance, setWalletData] = React.useState(null);
    const [Pickupstate, setPickupState] = React.useState(null);
    const [selectedLanguage, setSelectedLanguage] = React.useState(null);

    useFocusEffect(
        React.useCallback(() => {
            getLanguageStatus();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    React.useEffect(() => {
        // Establish socket connection
        const socket = io(SOCKET_SERVER_URL);
        console.log('SocketConnectd:', socket);
        // Listen for 'new_booking' event
        socket.on('acceptBooking', (acceptBooking) => {
            console.log('Accept Booking received:', JSON.stringify(acceptBooking));
            navigate.replace('DriverTrackToMapsScreen');
            // Update the bookings list with the new booking
        });

        socket.on('submitOtpBooking', (acceptBooking) => {
            console.log('Booking OTP submit:', JSON.stringify(acceptBooking));
            // Update the bookings list with the new booking
        });

        socket.on('BookingEnd', (acceptBooking) => {
            console.log('Booking End:', JSON.stringify(acceptBooking));
            // Update the bookings list with the new booking
        });

        // Clean up the socket connection on unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const getLanguageStatus = async () => {
        const valueX = await AsyncStorage.getItem('@appLanguage');
        setSelectedLanguage(valueX);
        console.log('getLanguageStatus', valueX);
    }

    React.useEffect(() => {
        const unsubscribe = messaging().onMessage((remoteMessage) => {
            if (remoteMessage.notification) {
                setBookingVisible(false);
                saveOrStartTripTracking(remoteMessage.data);
                return () => {
                    setMessage(null);
                };
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const saveOrStartTripTracking = async (remoteMessage) => {
        setMessage(remoteMessage);
        let saveTripDetails = {
            tripEnable: true,
            details: remoteMessage,
        }
        await AsyncStorage.setItem('@saveTripDetails', JSON.stringify(saveTripDetails));
        // Go To Navigate
        navigate.replace('DriverTrackToMapsScreen', remoteMessage);
    }

    const {
        path,
        pathLength,
        stroke,
        strokeDashoffset,
        remainingTime,
        elapsedTime,
        size,
        strokeWidth,
    } = useCountdown({ isPlaying: true, duration: 7, colors: '#abc' });

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                //each count lasts for a second
                loadWalletProfile();
                getAllTripData();
                //cleanup the interval on complete
            }
            fetchData();
        }, []),
    );

    const loadWalletProfile = async () => {
        setLoading(false);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'my-wallet',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                setLoading(true);
                setWalletData(response.data?.user?.wallet_amount);
                loadProfile();
                console.log('loadWalletProfile', JSON.stringify(response.data?.user?.wallet_amount));
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    const getAllTripData = async () => {
        setLoading(false);
        const valueX = await AsyncStorage.getItem('@autoEndTrip');
        const valueXX = await AsyncStorage.getItem('@fromTrip');
        let to_location = JSON.parse(valueX);
        let from_location = JSON.parse(valueXX);

        console.log('to_location', to_location);
        console.log('from_location', from_location);

        const pickup_point = {
            latitude: from_location?.latitude,
            longitude: from_location?.longitude,
        }
        const drop_point = {
            latitude: to_location?.latitude,
            longitude: to_location?.longitude,
        }
        setPickupState(pickup_point);
        setDestinationState(drop_point);
        console.log('getAllTripData_F', pickup_point);
        console.log('getAllTripData_T', drop_point);
        getPriceFromWeb();
    }

    const getPriceFromWeb = () => {
        // Optionally the request above could also be done as
        setLoading(true);
        var authOptions = {
            method: 'GET',
            url: globle.API_BASE_URL + 'getPrice',
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        console.log('getPriceFromWeb', JSON.stringify(authOptions))
        axios(authOptions).then((resp) => {
            console.log('getPriceFromWeb', JSON.stringify(resp.data))
            setTripPrice(resp.data.data?.value);
        }).catch((e) => console.log(e));
    }

    const loadProfile = async () => {
        console.log('loadProfile');
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'my-profile',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response.data.status) {
                    setName(response.data?.user?.name);
                    setGender(response.data?.user?.gender);
                    setImage(response.data?.user?.user_image);
                    setNumber(response.data?.user?.mobile);
                    console.warn(response.data?.user);
                } else {
                    setData(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const calculateDistance = (dis) => {

        return mePrice;
    }

    React.useEffect(() => {
        let distance = Distance;
        let price = tripPrice;
        const mePrice = Number(parseFloat(distance)) * Number(price);
        console.warn('price', mePrice);
        console.warn('distance', Number(parseFloat(distance)));
        if (Number(parseFloat(distance)) < 2) {
            setEventPrice(40);
        } else {
            setEventPrice(mePrice);
        }
    }, [Distance]);

    React.useEffect(() => {
        const percentage = (eventPrice / 100) * Number(TaxPrice);
        setEventTaxPrice(percentage);
        let final_amt = Number(percentage) + Number(eventPrice);
        console.warn('EventFinalPrice-> ', Number(percentage) + '  --  ' + Number(eventPrice))
        setEventFinalPrice(final_amt)
    }, [eventPrice]);

    const displaytime = (time) => {
        var value = time;
        // value = value.toFixed(2);
        return value
    }

    function goBackEndTrip() {
        Alert.alert(
            selectedLanguage === 'Coorg' ? coorg.crg.end_trip : eng.en.end_trip,
            selectedLanguage === 'Coorg' ? coorg.crg.end_trip_now : eng.en.end_trip_now,
            [
                { text: selectedLanguage === 'Coorg' ? coorg.crg.no : eng.en.no, onPress: () => console.log('cancel') },
                { text: selectedLanguage === 'Coorg' ? coorg.crg.yes : eng.en.yes, onPress: () => navigate.replace('UserBottomNavigation') },
            ]
        );
    }

    const fetchTime = (d, t) => {
        setTime(t);
        setDistance(d);
        // calculateDistance(d);
    }

    function StartTripTypeTrip() {
        Alert.alert(
            selectedLanguage === 'Coorg' ? coorg.crg.payment_method : eng.en.payment_method,
            selectedLanguage === 'Coorg' ? coorg.crg.choose_your_payment_options : eng.en.choose_your_payment_options,
            [
                { text: selectedLanguage === 'Coorg' ? coorg.crg.wallet : eng.en.wallet, onPress: () => createNewTripForCustomer('wallet') },
                { text: selectedLanguage === 'Coorg' ? coorg.crg.cash : eng.en.cash, onPress: () => createNewTripForCustomer('cash') },
            ]
        );
    }

    const openLinkToAnotherTabs = (info) => {
        Linking.canOpenURL(info).then(supported => {
            if (supported) {
                Linking.openURL(info);
            } else {
                console.log("Don't know how to open URI: " + info);
            }
        });
    }

    const createNewTripForCustomer = async (type_pay) => {
        const autoUserGroup = await AsyncStorage.getItem('@autoUserGroup');
        console.log('purchasePackage', JSON.stringify(autoUserGroup));
        let data = JSON.parse(autoUserGroup)?.token;
        let booking_user_name = JSON.parse(autoUserGroup)?.name;
        let booking_user_id = JSON.parse(autoUserGroup)?.id;
        console.log('______________________________', booking_user_id + ' | ' + booking_user_name);
        const valueX = await AsyncStorage.getItem('@autoEndTrip');
        const valueXX = await AsyncStorage.getItem('@fromTrip');
        let to_location = JSON.parse(valueX);
        let from_location = JSON.parse(valueXX);
        const pickup_point = {
            latitude: from_location?.latitude,
            longitude: from_location?.longitude,
            Pickup_formattedAddress: from_location?.Pickup_formattedAddress
        }
        const drop_point = {
            latitude: to_location?.latitude,
            longitude: to_location?.longitude,
            DropUp_formattedAddress: to_location?.DropUp_formattedAddress,
        }
        console.log('purchasePackageX', to_location?.DropUp_formattedAddress);
        console.log('purchasePackageY', from_location?.Pickup_formattedAddress);
        console.log('purchasePackage', pickup_point);
        console.log('purchasePackage', drop_point);
        setLoading(true)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'travel-request',
            data: {
                'from_address': from_location?.Pickup_formattedAddress,
                'to_address': to_location?.DropUp_formattedAddress,
                'from_state': name,
                'from_city': gender,
                'to_state': number,
                'to_city': image === null ? 'uploads/user_image/user.png' : image,
                'to_pincode': 110084,
                'from_pincode': 110009,
                'trip_type': type_pay,
                'to_lat': to_location?.latitude,
                'to_long': to_location?.longitude,
                'from_lat': from_location?.latitude,
                'from_long': from_location?.longitude,
                'price': Number(eventFinalPrice),
                'distance': Distance === '' ? 10 : Distance,
            },
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        console.log('purchasePackage', config);
        axios.request(config)
            .then((response) => {
                // setLoading(false)
                console.log('purchasePackageX', response.data?.id);
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
                    console.log('SearchingForAutoDriver', JSON.stringify(response.data))
                    Toast.show({
                        type: 'success',
                        text1: 'Trip Requested, Searching for Auto Driver!',
                        text2: response.data?.message,
                    });
                    const data = {
                        pickup_latitude: from_location?.latitude,
                        pickup_longitude: from_location?.longitude,
                        pickup_location_name: from_location?.Pickup_formattedAddress,
                        drop_latitude: to_location?.latitude,
                        drop_longitude: to_location?.longitude,
                        drop_location_name: to_location?.DropUp_formattedAddress,
                        distance: Number(Distance).toFixed(2),
                        discount_amount: "",
                        price: eventFinalPrice,
                        user_id: booking_user_id,
                        booking_user: booking_user_name,
                        profile_image: "",
                        trip_otp: "",
                        trip_type: "Standard",
                        driver_cancel_desc: "",
                        accept_at: "",
                        cancel_at: "",
                        booking_id: response.data?.id,
                    }
                    BookedBookingForDriver(data);
                    // setBookingVisible(true);
                }
                console.log('purchasePackage', JSON.stringify(response.data));
            })
            .catch((error) => {
                // setLoading(false)
                console.log(error);
            });
    }

    const BookedBookingForDriver = async (data) => {
        setLoading(true);
        console.log('BookedBookingForDriver:', JSON.stringify(data));
        const bookingData = {
            pickup_latitude: data?.pickup_latitude,
            pickup_longitude: data?.pickup_longitude,
            pickup_location_name: data?.pickup_location_name,
            drop_latitude: data?.drop_latitude,
            drop_longitude: data?.drop_longitude,
            drop_location_name: data?.drop_location_name,
            distance: data?.distance,
            discount_amount: data?.discount_amount,
            price: data?.price,
            user_id: data?.user_id,
            booking_user: data?.booking_user,
            profile_image: "",
            trip_otp: data?.trip_otp,
            trip_type: data?.trip_type,
            driver_cancel_desc: data?.driver_cancel_desc,
            accept_at: data?.accept_at,
            cancel_at: data?.cancel_at,
            booking_id: data?.booking_id
        };

        try {
            const response = await fetch('https://nodeadmin.createdinam.com/create-booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();
            console.log('BookedBookingForDriver:', JSON.stringify(result));
            if (response.ok) {
                console.log('BookedBookingForDriver:', JSON.stringify(response));
                setBookingVisible(true);
                // setLoading(false);
            } else {
                Alert.alert('Error', result.error ? result.error : 'Failed to create booking.', [{ text: 'OK' }]);
                // setLoading(false);
            }
        } catch (error) {
            // Alert.alert('Error', error.message || 'An error occurred while creating the booking.', [{ text: 'OK' }]);
            console.error('Error while creating booking:', error);
            // setLoading(false);
        } finally {
            // setLoading(false);
        }
    }

    const applyCouponCode = () => {
        Toast.show({
            type: 'success',
            text1: 'Comming Soon',
            text2: 'Apply Coupons & Promocode Comming Soon.',
        });
    }

    const getTimercomplete = () => {
        console.log('getTimercomplete');
        setBookingVisible(false);
        setBookingVisible(false);
        setBookingVisible(false);
        setBookingVisible(false);
        setBookingVisible(false);
        setTimeout(() => {
            // resend trip
            Toast.show({
                type: 'success',
                text1: 'Driver Not Available',
                text2: 'Please Book Auto Again',
            });
        }, 3000);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.containerX}>
            <View style={{ flex: 1 }}>
                <Pressable
                    onPress={() => goBackEndTrip()}
                    style={{ position: 'absolute', top: 45, left: 10, zIndex: 9999 }} >
                    <Image
                        style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: 'green' }}
                        source={require('../../assets/previous.png')} />
                </Pressable>
                {loading ? <View>
                    <MapView
                        ref={mapRef}
                        // customMapStyle={mapStyle}
                        style={{ height: height - 0, width: width }}
                        pitchEnabled={true}
                        initialRegion={{
                            ...Pickupstate,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                        onLayout={() => { }}
                    >
                        {Object.keys(Destinationstate) !== null && (<MapViewDirections
                            origin={Pickupstate}
                            destination={Destinationstate}
                            apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                            strokeWidth={4}
                            strokeColor="green"
                            optimizeWaypoints={true}
                            onStart={(params) => {
                                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
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
                                console.log('GOT AN ERROR', JSON.stringify(errorMessage));
                                Toast.show({
                                    type: 'error',
                                    text1: 'Something went wrong!',
                                    text2: errorMessage,
                                });
                            }}
                        />)}
                        <Marker key={1} draggable tracksViewChanges coordinate={Pickupstate} >
                            <Image style={{ height: 30, width: 30, resizeMode: 'contain', marginRight: 10 }} source={{ uri: 'https://www.pngkey.com/png/full/13-137571_map-marker-png-hd-marker-icon.png' }} />
                        </Marker>
                        <Marker key={2} draggable tracksViewChanges coordinate={Destinationstate} >
                            <Image style={{ height: 30, width: 30, resizeMode: 'contain', marginRight: 10, tintColor: 'green' }} source={{ uri: 'https://www.pngkey.com/png/full/13-137571_map-marker-png-hd-marker-icon.png' }} />
                        </Marker>
                    </MapView>
                </View> : <ActivityIndicator style={{ alignItems: 'center', marginTop: width / 1.5 }} size={'large'} color={'red'} />}
                <View style={styles.innerContainer}>
                    <View style={{}}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{selectedLanguage === 'Coorg' ? coorg.crg.booking_details : eng.en.booking_details}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <Image style={{ width: 40, height: 40, resizeMode: 'contain', marginRight: 20 }} source={require('../../assets/auto_icon.png')} />
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginRight: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.auto : eng.en.auto}</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'grey' }}>{Number(Time).toFixed(2)} mins</Text>
                        <View style={{ flex: 1 }} />
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginRight: 5 }}>₹{Number(eventFinalPrice).toFixed(2)}</Text>
                                <TouchableOpacity onPress={() => setVisible(true)}>
                                    <Image style={{ width: 14, height: 14, resizeMode: 'contain' }} source={require('../../assets/info_circle_icon.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginRight: 5, color: 'green' }}>₹{Number(wallet_balance).toFixed(2)}</Text>
                                <TouchableOpacity onPress={() => setVisible(true)}>
                                    <Image style={{ width: 14, height: 14, resizeMode: 'contain', tintColor: 'green' }} source={require('../../assets/wallet_icon.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => applyCouponCode()} style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'grey', padding: 5 }}>
                        <Image style={{ height: 70, width: 70, resizeMode: 'contain' }} source={require('../../assets/promocode.png')} />
                        <Text style={{ textAlign: 'left', fontWeight: 'bold', marginRight: 10, marginLeft: 10, flex: 1 }}>{selectedLanguage === 'Coorg' ? coorg.crg.apply_coupon_code : eng.en.apply_coupon_code}</Text>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../../assets/next.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => StartTripTypeTrip()} style={styles.buttonContainer}>
                        {BookingVisible === true ? <ActivityIndicator color={'#ffffff'} /> : <Text style={styles.buttonText}>{selectedLanguage === 'Coorg' ? coorg.crg.book_auto : eng.en.book_auto}</Text>}
                    </TouchableOpacity>
                </View>
                <Dialog
                    visible={visible}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    dialogStyle={{ width: Dimensions.get('screen').width - 60, backgroundColor: '#fff' }}
                    dialogTitle={<DialogTitle title={selectedLanguage === 'Coorg' ? coorg.crg.fare_price_information : eng.en.fare_price_information} />}
                    footer={
                        <DialogFooter>
                            <DialogButton
                                text={selectedLanguage === 'Coorg' ? coorg.crg.got_it : eng.en.got_it}
                                onPress={() => setVisible(false)}
                            />
                        </DialogFooter>
                    }
                >
                    <DialogContent>
                        <View>
                            <View>
                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    <View style={{ padding: 20, backgroundColor: '#FFFF00', alignItems: 'center', borderRadius: 150 }}>
                                        <Image style={{ width: 35, height: 35, resizeMode: 'contain' }} source={require('../../assets/auto_icon.png')} />
                                    </View>
                                </View>
                                <View style={{ padding: 20 }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 18 }}>₹ {Number(eventPrice).toFixed(2)} *</Text>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 18 }}>KMs {Number(Distance).toFixed(2)}</Text>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center', padding: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.total_estimated_fare_price_including_taxes : eng.en.total_estimated_fare_price_including_taxes}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#b4b4b4', }}>
                                        <Text style={{ fontWeight: 'bold', flex: 1 }}>{selectedLanguage === 'Coorg' ? coorg.crg.ride_fare : eng.en.ride_fare}</Text>
                                        <Text style={{ fontWeight: 'bold' }}>₹ {Number(eventPrice).toFixed(2)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#b4b4b4', }}>
                                        <Text style={{ fontWeight: 'bold', flex: 1 }}>{selectedLanguage === 'Coorg' ? coorg.crg.tax_or_charges : eng.en.tax_or_charges}</Text>
                                        <Text style={{ fontWeight: 'bold' }}>₹ {Number(eventTaxPrice).toFixed(2)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#b4b4b4', }}>
                                        <Text style={{ fontWeight: 'bold', flex: 1 }}>{selectedLanguage === 'Coorg' ? coorg.crg.final_ride_cost : eng.en.final_ride_cost}</Text>
                                        <Text style={{ fontWeight: 'bold' }}>₹ {Number(eventFinalPrice).toFixed(2)}</Text>
                                    </View>
                                    <Text style={{ fontSize: 16, textAlign: 'center', fontWeight: 'bold', letterSpacing: 1.5 }}>*<Text style={{ fontWeight: 'bold' }}>{selectedLanguage === 'Coorg' ? coorg.crg.price_may_toll_area : eng.en.price_may_toll_area}</Text>
                                        {selectedLanguage === 'Coorg' ? coorg.crg.cost_details : eng.en.cost_details}<Text style={{ fontWeight: 'bold' }}></Text>
                                        <Text style={{ fontWeight: 'bold' }}>{selectedLanguage === 'Coorg' ? coorg.crg.cost_details_part : eng.en.cost_details_part}</Text>{selectedLanguage === 'Coorg' ? coorg.crg.cost_details_part_one : eng.en.cost_details_part_one}</Text>
                                </View>
                                <TouchableOpacity onPress={() => openLinkToAnotherTabs('https://theparihara.com/privacy_policy.html')} style={{ paddingHorizontal: 20 }}>
                                    <Text style={{ fontWeight: 'bold', color: '#3944bc' }}>{`https://theparihara.com/en/charges -->`}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </DialogContent>
                </Dialog>
                <Dialog
                    visible={BookingVisible}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    dialogStyle={{ width: Dimensions.get('screen').width - 60, backgroundColor: '#fff' }}
                    dialogTitle={<DialogTitle title={selectedLanguage === 'Coorg' ? coorg.crg.waiting_for_driver : eng.en.waiting_for_driver} />}
                >
                    <DialogContent>
                        <View>
                            <View>
                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    <TouchableOpacity onPress={() => setBookingVisible(false)} style={{ padding: 20, backgroundColor: '#FFFF00', alignItems: 'center', borderRadius: 150 }}>
                                        <Image style={{ width: 35, height: 35, resizeMode: 'contain' }} source={require('../../assets/auto_icon.png')} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ padding: 20, alignItems: 'center', alignSelf: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 18, marginBottom: 20 }}>{selectedLanguage === 'Coorg' ? coorg.crg.waiting_time : eng.en.waiting_time}</Text>
                                    <CountdownCircleTimer
                                        isPlaying
                                        duration={40}
                                        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                        colorsTime={[300, 250, 200, 100]}
                                        onComplete={() => getTimercomplete()}
                                    >
                                        {({ remainingTime }) => <Text>{remainingTime} sec</Text>}
                                    </CountdownCircleTimer>
                                </View>
                            </View>
                        </View>
                    </DialogContent>
                </Dialog>
            </View>
        </KeyboardAvoidingView>
    );
};

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
    },
    container: {
        flex: 1,
    },
    textInputContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    textInput: {
        marginLeft: 0,
        marginRight: 0,
        height: 38,
        color: '#5d5d5d',
        fontSize: 16,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        marginLeft: 20,
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 18,
        marginTop: 10,
        backgroundColor: 'black',
        borderRadius: 5,
        elevation: 6,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    containerX: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    innerContainer: {
        padding: 20,
        height: 280,
        width: Dimensions.get('screen').width,
        backgroundColor: 'white',
        flexGrow: 1,
        borderRadius: 10,
        elevation: 5,
        marginBottom: 20,
        position: 'absolute',
        bottom: 0,
        zIndex: 999,
    }, item: {
        flex: 1,
        aspectRatio: 1,
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        elevation: 5,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    }, circle: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        backgroundColor: 'red',
    },
    pinText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
    },
});
//    console.log(data.name)
export default TripCreateScreen;