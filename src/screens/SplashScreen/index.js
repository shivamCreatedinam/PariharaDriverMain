/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    View,
    Text,
    BackHandler,
    Dimensions,
    Animated,
    Easing,
    ImageBackground,
    Alert,
    PermissionsAndroid
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import crashlytics from '@react-native-firebase/crashlytics';
import GetLocation from 'react-native-get-location';
import notifee,
{
    AndroidImportance,
    AndroidBadgeIconType,
    AndroidVisibility,
    AndroidColor,
    AndroidCategory,
    EventType
}
    from '@notifee/react-native';
import {
    INPUT_RANGE_START,
    INPUT_RANGE_END,
    OUTPUT_RANGE_START,
    OUTPUT_RANGE_END,
    ANIMATION_TO_VALUE,
    ANIMATION_DURATION,
} from '../../../common/constants';
import Global from '../../../common/env';
import { Image } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import RNRestart from 'react-native-restart';
import axios from 'axios';
const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

const SplashAppScreen = () => {

    const initialValue = 0;
    const translateValue = React.useRef(new Animated.Value(initialValue)).current;
    const AnimetedImage = Animated.createAnimatedComponent(ImageBackground);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            // whatever 
            getOneTimeLocation();
            setTimeout(() => {
                // setTimeout
                // loadSessionStorage();
            }, 3000);
        }, [])
    );

    // const handleDynamicLink = link => {
    //     // Handle dynamic link inside your own application
    //     console.log('handleDynamicLink-------------->', link);
    // };

    // React.useEffect(() => {
    //     const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    //     // When the component is unmounted, remove the listener
    //     return () => unsubscribe();
    // }, []);

    // React.useEffect(() => {
    //     dynamicLinks()
    //         .getInitialLink()
    //         .then(link => {
    //             console.log('handleDynamicLink-------------->', link);
    //         });
    // }, []);

    React.useEffect(() => {
        messageListener();
    }, []);

    const loadSessionStorage = async (latitude, longitude) => {
        // autoUserType
        try {
            const valueX = await AsyncStorage.getItem('@autoUserType');
            const valueXX = await AsyncStorage.getItem('@autoDriverGroup');
            const value = await AsyncStorage.getItem('@autoUserGroup');
            console.log('loadSessionStorage', valueX);
            console.log('y', JSON.parse(valueXX)?.id);
            console.log('x', JSON.parse(value));
            if (valueX === 'Driver') {
                if (valueXX !== null) {
                    let driver_id = JSON.parse(valueXX)?.id;
                    DriverLocationUpdate(driver_id, latitude, longitude);
                    // value previously stored UserBottomNavigation 
                }
            } else if (valueX === 'User') {
                // updateTokenProfile(); RatingAndReviewScreen
                checkCurrentTripDetails();
                // navigation.replace('UserBottomNavigation');
                // navigation.replace('RatingAndReviewScreen');
                // console.log('addEventListener2', JSON.parse(value));
                // // check current active trip first /// ---><><><<><><><><><><><><><>
                // const valueX = await AsyncStorage.getItem('@saveTripDetails');
                // let data = JSON.parse(valueX);
                // console.log('updateUserTokenProfile', JSON.stringify(data));
                // if (data?.tripEnable === true) {
                //     navigation.replace('DriverTrackToMapsScreen', data?.details);
                // } else {
                //     navigation.replace('UserBottomNavigation');
                // }
            } else {
                console.log('loadSessionStorage3', JSON.stringify(value));
                navigation.replace('ChangeLanguage');
            }
        } catch (e) {
            console.log('addEventListener4', JSON.stringify(e));
            // error reading value
        }
    }

    const checkCurrentTripDetails = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        const fcmToken = await messaging().getToken();
        let data = JSON.parse(valueX)?.token;
        crashlytics().log(data);
        var formdata = new FormData();
        formdata.append('token', fcmToken);
        var requestOptions = {
            method: 'GET',
            // body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        console.log('checkCurrentTripDetails', JSON.stringify(requestOptions))
        fetch(Global.API_BASE_URL + 'user-active-trip', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    console.log('checkCurrentTripDetailsX', JSON.stringify(result?.data));
                    navigation.replace('DriverTrackToMapsScreen', result?.data);
                } else {
                    console.log('checkCurrentTripDetailsY', JSON.stringify(result));
                    navigation.replace('UserBottomNavigation');
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
    }

    const DriverLocationUpdate = async (id, latitude, longitude) => {
        var authOptions = {
            method: 'POST',
            url: Global.API_BASE_URL + 'update-driver-lat-long',
            data: JSON.stringify({ 'driver_id': id, 'latitude': latitude, 'longitude': longitude }),
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions)
            .then((response) => {
                if (response.data?.status) {
                    console.log(JSON.stringify(response.data?.message));
                    // go with active trip
                    checkCurrentActiveDriverTrip(id)
                    // navigation.replace('HomeScreen');
                    // console.log('addEventListener1', JSON.parse(valueXX));
                } else {
                    console.log('location status update fails' + JSON.stringify(response.data));
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const checkCurrentActiveDriverTrip = async (id) => {
        var authOptions = {
            method: 'GET',
            url: Global.API_BASE_URL + `driver-active-trip?driver_id=${id}`,
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions)
            .then((response) => {
                console.log('checkCurrentActiveDriverTrip', response?.data);
                if (response.data.status) {
                    // setLoading(false);
                    navigation.replace('NotificationCenterScreen', response?.data?.data);
                } else {
                    console.log('checkCurrentActiveDriverTrip', response?.data?.data);
                    navigation.replace('HomeScreen');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const messageListener = async () => {
        // Assume a message-notification contains a "type" property in the data payload of the screen to open
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state_:', remoteMessage.data);
            navigation.replace('NotificationCenterScreen', remoteMessage.data);
        });
        // Quiet and Background State -> Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('Notification caused app to open from quit state:', remoteMessage.notification,);
                    navigate.replace('NotificationCenterScreen', remoteMessage.data);
                }
            })
            .catch(error => console.log('failed', error));

        // Foreground State
        messaging().onMessage(async remoteMessage => {
            console.log('foreground', remoteMessage);
            if (remoteMessage?.notification?.title === 'Dear user your trip has been completed.') {
                clearTripDataAndMoveToEndTrip(remoteMessage);
                onDisplayNotificationx(remoteMessage?.notification?.android?.channelId, remoteMessage?.notification?.title, remoteMessage?.notification?.body);
            } else if (remoteMessage?.notification?.title === 'Dear user your trip has been canceled.') {
                removeCancelTripItemValue('@saveTripDetails');
                onDisplayNotificationx(remoteMessage?.notification?.android?.channelId, remoteMessage?.notification?.title, remoteMessage?.notification?.body);
            } else if (remoteMessage?.notification?.title === 'Dear driver your trip has been canceled by user.') {
                removeCancelTripFromUser('@saveTripDetails');
                onDisplayNotificationx(remoteMessage?.notification?.android?.channelId, remoteMessage?.notification?.title, remoteMessage?.notification?.body);
            } else {
                onDisplayNotificationx(remoteMessage?.notification?.android?.channelId, remoteMessage?.notification?.title, remoteMessage?.notification?.body);
            }
        });
    }

    const removeCancelTripFromUser = async () => {
        console.log('removeCancelTripItemValue');
        let key0 = '@tripAddedKeys';
        let key1 = '@tripStartedStatusKeys';
        let key2 = '@tripAcceptStatusKeys';
        try {
            await AsyncStorage.removeItem(key0);
            await AsyncStorage.removeItem(key1);
            await AsyncStorage.removeItem(key2);
            navigation.replace('HomeScreen');
            console.log('DataDeleted');
            return true;
        }
        catch (exception) {
            console.log('ErrorDataDeleted');
            return false;
        }
    }
    // AsyncStorage.setItem('@tripAddedKeys', infoTrip_); // 

    async function onDisplayNotificationx(chids, title, body) {
        // Request permissions (required for iOS)
        if (Platform.OS === 'ios') {
            await notifee.requestPermission()
        }

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: chids,
            name: 'parihara_' + chids,
            sound: 'default',
            importance: AndroidImportance.HIGH,
            badge: true,
            vibration: true,
            vibrationPattern: [300, 700],
            lights: true,
            lightColor: AndroidColor.RED,
        });

        // Display a notification
        await notifee.displayNotification({
            title: title,
            body: body,
            android: {
                channelId,
                categoryId: 'trip_coming',
                smallIcon: 'ic_stat_directions', // optional, defaults to 'ic_launcher'.
                color: '#9c27b0',
                category: AndroidCategory.MESSAGE,
                badgeIconType: AndroidBadgeIconType.SMALL,
                importance: AndroidImportance.HIGH,
                visibility: AndroidVisibility.PUBLIC,
                vibrationPattern: [300, 700],
                ongoing: false,
                lights: [AndroidColor.RED, 300, 600],
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
            console.log('User pressed the notification.', detail.pressAction.id);
        }
    });

    const removeCancelTripItemValue = async (key) => {
        console.log('removeCancelTripItemValue');
        try {
            await AsyncStorage.removeItem(key);
            navigation.replace('UserBottomNavigation')
            console.log('DataDeleted');
            return true;
        }
        catch (exception) {
            console.log('ErrorDataDeleted');
            return false;
        }
    }

    const clearTripDataAndMoveToEndTrip = (info) => {
        // clear trip Data
        Alert.alert(
            'Trip End',
            'Please give your valuable feedback for your ride and Driver.',
            [
                { text: 'No', onPress: () => navigation.replace('UserBottomNavigation') },
                { text: 'Yes', onPress: () => removeItemValue('@saveTripDetails', info) },
            ]
        );
    }

    const removeItemValue = async (key, info) => {
        try {
            await AsyncStorage.removeItem(key);
            navigation.replace('RatingAndReviewScreen', info)
            console.log('DataDeleted');
            return true;
        }
        catch (exception) {
            console.log('ErrorDataDeleted');
            return false;
        }
    }

    // const updateDriverTokenProfile = async () => {
    //     const valueX = await AsyncStorage.getItem('@autoDriverGroup');
    //     const value = await AsyncStorage.getItem('@tokenKey');
    //     let data = JSON.parse(valueX)?.id;
    //     var formdata = new FormData();
    //     formdata.append('driver_id', data);
    //     formdata.append('token', value);
    //     var requestOptions = {
    //         method: 'POST',
    //         body: formdata,
    //         redirect: 'follow',
    //         headers: {
    //             'Authorization': 'Bearer ' + data,
    //         }
    //     };
    //     console.log('updateUserTokenProfilex', JSON.stringify(requestOptions))
    //     fetch(Global.API_BASE_URL + 'update-driver-fcm', requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             if (result.status) {
    //                 console.log('updateUserTokenProfile', result?.message);
    //             } else {
    //                 console.log('error', JSON.stringify(result));
    //             }
    //         })
    //         .catch((error) => {
    //             console.log('error', error);
    //         });
    // }

    // const updateTokenProfile = async () => {
    //     const valueX = await AsyncStorage.getItem('@autoUserGroup');
    //     const value = await AsyncStorage.getItem('@tokenKey');
    //     let data = JSON.parse(valueX)?.token;
    //     console.log('updateUserTokenProfilex', value);
    //     var formdata = new FormData();
    //     formdata.append('token', value);
    //     var requestOptions = {
    //         method: 'POST',
    //         body: formdata,
    //         redirect: 'follow',
    //         headers: {
    //             'Authorization': 'Bearer ' + data,
    //         }
    //     };
    //     fetch(Global.API_BASE_URL + 'update-user-fcm', requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             console.log('uploadProfileX', result);
    //             if (result.status) {
    //                 console.log('updateDriverTokenProfilex', result?.message);
    //             } else {
    //                 console.log('updateDriverTokenProfilex', result?.message);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log('error', error);
    //         });
    // }

    const getCurrentAddress = (currentLatitude, currentLongitude) => {
        console.log('getCurrentAddress')
        fetch(
            'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            currentLatitude +
            ',' +
            currentLongitude +
            '&key=' +
            Global.GOOGLE_MAPS_APIKEY_V2,
        )
            .then(response => response.json())
            .then(responseJson => {
                // console.log('Address Location', JSON.stringify(responseJson));
                loadSessionStorage(currentLatitude, currentLongitude);
                setAddressFieldAutoPopulate(responseJson);
            });
    };

    const setAddressFieldAutoPopulate = responseJson => {
        let getAddressInfo = responseJson?.results[0]?.formatted_address;
        let addressLength = getAddressInfo.split(',');
        let count = addressLength.length;
        let postcode = '';
        let address = '';
        let country = addressLength[count - 1];
        let state = addressLength[count - 2];
        let city = addressLength[count - 3];

        let formattedAddress = responseJson?.results[0]?.formatted_address;
        let formattedAddressLength = formattedAddress.split(',');
        if (formattedAddressLength.length > 3) {
            for (let i = 0; i < count - 3; i++) {
                address += addressLength[i] + ',';
            }
        } else {
            address = '';
        }
        var pos = address.lastIndexOf(','),
            withoutComma = '';
        address = address.slice(0, pos) + withoutComma + address.slice(pos + 1);

        for (const component of responseJson.results[1].address_components) {
            // @ts-ignore remove once typings fixed
            const componentType = component;

            switch (componentType.types[0]) {
                case 'postal_code': {
                    postcode = component.long_name;
                    break;
                }

                case 'locality': {
                    city = component.long_name;
                    break;
                }

                case 'administrative_area_level_1': {
                    state = component.long_name;
                    break;
                }

                case 'country': {
                    country = component.long_name;
                    break;
                }
            }
        }

        console.log('Info_location', JSON.stringify(address));
        // check city Validation
        // city = cityValidationCondition(city);

        // if (!this.cityExists(city)) {
        //   console.log(resources.strings.cityCannotBeDelivered);
        //   return false;
        // } else if (this.postalCodeExists(postcode)) {
        //   console.log(resources.strings.postalCodeCannotBeDelivered);
        //   return false;
        // } else {
        //   const locationInfo = {
        //     address: address,
        //     addressLine2: address,
        //     city: city,
        //     state: state,
        //     postalCode: postcode,
        //     addressDetails: responseJson,
        //     mapFlag: true,
        //   }
        // }
    };

    const checkUserWithLocationUpdate = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserType');
        const valueXX = await AsyncStorage.getItem('@autoDriverGroup');
        if (valueX === null) {
            let driver_id = JSON.parse(valueXX)?.id;
            checkCurrentActiveDriverTrip(driver_id)
            console.log('checkUserWithLocationUpdateV', JSON.stringify(valueX))
        } else {
            console.log('checkUserWithLocationUpdateX', JSON.stringify(valueX));
            checkCurrentTripDetails();
        }
    }

    const getOneTimeLocation = async () => {
        try {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: false,
                timeout: 60000,
            })
                .then(location => {
                    console.log('getOneTimeLocation', JSON.stringify(location))
                    getCurrentAddress(location.latitude, location.longitude);
                })
                .catch(error => {
                    const { code, message } = error;
                    console.warn(code, message);
                    checkUserWithLocationUpdate();
                })
        } catch (error) {
            console.error('getOneTimeLocationX', JSON.stringify(error))
        }
        // Geolocation.getCurrentPosition(
        //     //Will give you the current location
        //     position => {
        //         //getting the Longitude from the location json
        //         const currentLongitude = JSON.stringify(position.coords.longitude);

        //         //getting the Latitude from the location json
        //         const currentLatitude = JSON.stringify(position.coords.latitude);

        //         var region = {
        //             latitudeDelta,
        //             longitudeDelta,
        //             latitude: parseFloat(currentLatitude),
        //             longitude: parseFloat(currentLongitude),
        //         };
        //         console.log('getOneTimeLocation', JSON.stringify(region));
        //         // this.setState({
        //         //   showLoading: false,
        //         //   region: region,
        //         //   forceRefresh: Math.floor(Math.random() * 100),
        //         // });
        //         getCurrentAddress(currentLatitude, currentLongitude);
        //     },
        //     error => {
        //         console.log('We are not able to find you location, Please Enter Manually');
        //         // checkAgainLocationPermission();
        //         RNRestart.restart();
        //         // console.log('error.message', error.message);
        //     },
        //     {
        //         enableHighAccuracy: false,
        //         timeout: 5000,
        //         maximumAge: 10000,
        //     },
        // );
    };

    const checkAgainLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // getOneTimeLocation();
            } else {

            }
        } catch (err) {
            console.warn(err)
        }
    }

    const cityValidationCondition = city => {
        if (city.includes('Bangalore') || city.includes('Bengaluru')) {
            return 'Bangalore';
        } else if (city.includes('Delhi') || city.includes('New Delhi')) {
            return 'Delhi';
        } else if (city.includes('Gurgaon') || city.includes('Gurugram')) {
            return 'Gurgaon';
        } else if (city.includes('Bombay') || city.includes('Mumbai')) {
            return 'Mumbai';
        } else if (
            city.includes('Gautam Buddh Nagar') ||
            city.includes('Greater Noida')
        ) {
            return 'Noida';
        } else if (city.includes('Hyderabad') || city.includes('Secunderabad')) {
            return 'Hyderabad';
        } else {
            return city;
        }
    };

    React.useEffect(() => {
        const backAction = () => {
            // Handle the back button press here
            // You can perform any necessary actions or navigate to a different screen
            Alert.alert(
                'Close Application',
                'Are you sure, Close Go Ride?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => { } },
                ]
            );
            // Return true to prevent the default back button behavior
            return true;
        };

        // Add the event listener for the hardware back button press
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // Clean up the event listener when the component is unmounted
        return () => backHandler.remove();
    }, []);

    // React.useEffect(() => {
    //     const translate = () => {
    //         translateValue.setValue(initialValue);
    //         Animated.timing(translateValue, {
    //             toValue: ANIMATION_TO_VALUE,
    //             duration: ANIMATION_DURATION,
    //             easing: Easing.linear,
    //             useNativeDriver: true,
    //         }).start(() => translate());
    //     };
    //     translate();
    // }, [translateValue]);

    // const translateAnimation = translateValue.interpolate({
    //     inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
    //     outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
    // });

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <ActivityIndicator style={{ position: 'absolute', alignItems: 'center', bottom: 160, alignSelf: 'center' }} color={'#FAD323'} size={'large'} />
            <View style={{ marginTop: Dimensions.get('screen').height / 6, alignItems: 'center' }}>
                <Image style={{ height: 250, width: 250, resizeMode: 'contain' }} source={require('../../assets/ic_launcher_round.jpg')} />
                {/* <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 11 }} >Go Driving</Text> */}
            </View>
        </View>
    );
};


export default SplashAppScreen;