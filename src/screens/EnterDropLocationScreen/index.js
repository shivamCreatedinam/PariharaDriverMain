/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    Platform,
    View,
    Dimensions,
    Animated,
    Easing,
    ImageBackground,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AddressPickup from '../../../common/AddressPickup';
// change language 
const coorg = require('../../../common/coorg.json');
const eng = require('../../../common/eng.json');
import Toast from 'react-native-toast-message';
import Geocoder from 'react-native-geocoder';
import globle from '../../../common/env';
import {
    ANIMATION_TO_VALUE,
    ANIMATION_DURATION,
} from '../../../common/constants';
setUpdateIntervalForType(SensorTypes.accelerometer, 15);
const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.012;
const LONGITUDE_DELTA = 0.012;

const EnterDropLocationScreen = () => {

    const routes = useRoute();
    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const navigate = useNavigation();
    const initialValue = 0;
    const [searchData, setSearchData] = React.useState(null);
    const [searchFavData, setSearchFavData] = React.useState([]);
    Geocoder.fallbackToGoogle(globle.GOOGLE_MAPS_APIKEY_V2);
    const translateValue = React.useRef(new Animated.Value(initialValue)).current;
    const numColumns = 2;
    const [formattedAddress, setformattedAddress] = React.useState(null);
    const [formattedToAddress, setformatteTodAddress] = React.useState(null);
    const [toformattedAddress, setToformattedAddress] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [selectedTrip, setSelectedTrip] = React.useState('');
    const [Destinationstate, setDestinationState] = React.useState({ destinationCords: {} });
    const [Pickupstate, setPickupState] = React.useState({ pickupCords: {} });
    const [Dropstate, setDropState] = React.useState({ dropCords: {} });
    const [markerLocation, serLocation] = React.useState({ latitude: null, longitude: null, additionDetails: null });
    const [marker, setMarker] = React.useState(false);
    const [saveDatatoFromBooking, setSaveDatatoFromBooking] = React.useState(null);
    const [selectedLanguage, setSelectedLanguage] = React.useState(null);

    useFocusEffect(
        React.useCallback(() => {
            getLanguageStatus();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const getLanguageStatus = async () => {
        const valueX = await AsyncStorage.getItem('@appLanguage');
        setSelectedLanguage(valueX);
        console.log('getLanguageStatus', valueX);
    }

    React.useEffect(() => {
        const translate = () => {
            translateValue.setValue(initialValue);
            Animated.timing(translateValue, {
                toValue: ANIMATION_TO_VALUE,
                duration: ANIMATION_DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => translate());
        };
        // translate();
    }, [translateValue]);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                console.log('just_focus');
                //each count lasts for a second
                getNearbyBars();
                //cleanup the interval on complete
            }
            fetchData();
        }, []),
    );

    const getCurrentAddress = (currentLatitude, currentLongitude) => {
        fetch(
            'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            currentLatitude +
            ',' +
            currentLongitude +
            '&key=' +
            globle.GOOGLE_MAPS_APIKEY_V2,
        )
            .then(response => response.json())
            .then(responseJson => {
                setAddressFieldAutoPopulate(responseJson, currentLatitude, currentLongitude);
            });
    };

    const setAddressFieldAutoPopulate = (responseJson, lat, long) => {
        let getAddressInfo = responseJson.results[0].formatted_address;
        let addressLength = getAddressInfo.split(',');
        let count = addressLength.length;
        let postcode = '';
        let address = '';
        let country = addressLength[count - 1];
        let state = addressLength[count - 2];
        let city = addressLength[count - 3];

        let formattedAddress = responseJson.results[0].formatted_address;
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

        setformattedAddress(address);
        console.log('Info_location--><><><>', JSON.stringify(address));
        const updateLocation = {
            latitude: lat,
            longitude: long,
            DropUp_formattedAddress: address,
        }
        setSaveDatatoFromBooking(updateLocation);
    };

    const shareLocation = async () => {
        console.log('saveDatatoFromBooking', JSON.stringify(saveDatatoFromBooking));
        if (saveDatatoFromBooking === null) {
            Toast.show({
                type: 'error',
                text1: 'Login Success',
                text2: 'Please select drop location',
            });
        } else {
            let sendDetails = {
                type: 'ToDestination',
                latitude: saveDatatoFromBooking?.latitude,
                longitude: saveDatatoFromBooking?.longitude,
                DropUp_formattedAddress: saveDatatoFromBooking?.DropUp_formattedAddress,
            }
            console.log(JSON.stringify(sendDetails));
            const jsonValue = JSON.stringify(sendDetails);
            await AsyncStorage.setItem('@autoEndTrip', jsonValue);
            console.log('save_end_trip');
            navigate.replace('TripCreateScreen', sendDetails);
        }
    }

    const AnimetedImage = Animated.createAnimatedComponent(ImageBackground);

    const fetchPickupCords = (locations) => {
        setDestinationState({
            ...Destinationstate,
            destinationCords: {
                latitude: locations?.geometry?.location?.lat,
                longitude: locations?.geometry?.location?.lng,
                name: locations?.name,
                icon: locations?.icon,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            }
        });
        mapRef.current.animateCamera({
            center: {
                latitude: locations?.geometry?.location?.lat,
                longitude: locations?.geometry?.location?.lng,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            },
            heading: 0,
            pitch: 90,
        });
        let additionDetails = {
            formatted_address: locations?.formatted_address,
            name: locations?.name,
        }
        getCurrentAddress(locations?.geometry?.location?.lat, locations?.geometry?.location?.lng);
        serLocation({ latitude: locations?.geometry?.location?.lat, longitude: locations?.geometry?.location?.lng, additionDetails: additionDetails });
        setMarker(true);
        // let locFrom = {
        //     latitude: locations?.geometry?.location?.lat,
        //     longitude: locations?.geometry?.location?.lng,
        // }
        // saveToStoragex(locFrom);
        // console.log('fetchPickupCords', 'save');
    }


    const saveToStoragex = async (info) => {
        const jsonValue = JSON.stringify(info);
        await AsyncStorage.setItem('@fromTrip', jsonValue);
        console.log('saveToStoragex', 'save');
    }

    const onMapPress = (e) => {
        let additionDetails = {
            formatted_address: '',
            name: '',
        }
        console.log('onMapPress', JSON.stringify(e.nativeEvent.coordinate));
        getCurrentAddress(e.nativeEvent.coordinate?.latitude, e.nativeEvent.coordinate?.longitude);
        animate(e.nativeEvent.coordinate?.latitude, e.nativeEvent.coordinate?.longitude);
        serLocation({ latitude: e.nativeEvent.coordinate?.latitude, longitude: e.nativeEvent.coordinate?.longitude, additionDetails: additionDetails });
        setMarker(true);
    }

    const getNearbyBars = async () => {
        Geolocation.getCurrentPosition(
            (position) => {
                let additionDetails = {
                    formatted_address: '',
                    name: '',
                }
                console.log('getNearbyBars--------><><><><>', JSON.stringify(position));
                getCurrentAddress(position.coords.latitude, position.coords.longitude);
                serLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, additionDetails: additionDetails });
                animate(position.coords.latitude, position.coords.longitude);
                setLoading(true);
                setMarker(true);
            },
            error => console.log('error--->', error),
            {
                enableHighAccuracy: false,
                timeout: 10000,
            },
        );
    };

    const animate = (latitude, longitude) => {
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                mapRef.current.animateCamera({
                    center: {
                        latitude: latitude,
                        longitude: longitude,
                    },
                });
            }
        } else {
            // coordinate.timing(newCoordinate).start();
        }
    }


    return (
        <View>
            <View style={{}}>
                <SafeAreaView style={{ position: 'absolute', top: 40, left: 22, zIndex: 9999, width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                    <AddressPickup
                        fetchDetails={true}
                        placheholderText={formattedAddress === '' ? 'Please Drop Enter Location' : formattedAddress}
                        fetchAddress={fetchPickupCords}
                        query={{
                            key: globle.GOOGLE_MAPS_APIKEY_V2,
                            language: 'en',
                        }}
                        currentLocation={true}
                        currentLocationLabel='Current location'
                    />
                </SafeAreaView>
                <View style={{ height: height, width: width }}>
                    {loading === true ?
                        <MapView
                            ref={mapRef}
                            style={{ height: height, width: width }}
                            mapType={MapView.MAP_TYPES.TERRIN}
                            // pitchEnabled={true}  
                            showsIndoors={true}
                            key={globle.GOOGLE_MAPS_APIKEY_V2}
                            minZoomLevel={1}
                            maxZoomLevel={18}
                            showsTraffic={false}
                            showsBuildings={false}
                            showsCompass={false}
                            showsUserLocation={false}
                            initialRegion={{
                                ...markerLocation,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                            onPress={(event) => onMapPress(event)}
                        >
                            {marker ? <Marker
                                ref={markerRef}
                                coordinate={markerLocation}
                                title={formattedAddress}
                                description={formattedAddress}
                            >
                                <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('../../assets/greenMarker.png')} />
                            </Marker> : null}
                        </MapView> : <ActivityIndicator style={{ alignItems: 'center', marginTop: width / 2.3 }} size={'large'} color={'red'} />}
                </View>
            </View>
            <View style={{ backgroundColor: '#000000', borderRadius: 10, padding: 10, flexGrow: 1, position: 'absolute', bottom: 30, left: 25, right: 25 }}>
                <TouchableOpacity style={{ padding: 10, backgroundColor: '#000000' }} onPress={() => shareLocation()}>
                    <Text style={{ color: '#fff', textAlign: 'center', textTransform: 'uppercase' }}>{selectedLanguage === 'Coorg' ? coorg.crg.create_ride : eng.en.create_ride}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => getNearbyBars()} style={{ position: 'absolute', bottom: 50, right: 0, zIndex: 9999 }}>
                    <Image style={{ width: 55, height: 55, resizeMode: 'contain' }} source={require('../../assets/greenIndicator.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EnterDropLocationScreen;