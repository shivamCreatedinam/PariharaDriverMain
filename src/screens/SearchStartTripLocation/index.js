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
    FlatList,
    Linking,
    SafeAreaView
} from 'react-native';
import { setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import AddressPickup from '../../../common/AddressPickup';
import getDistance from 'geolib/es/getPreciseDistance';
import globle from '../../../common/env';
import Geocoder from 'react-native-geocoder';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
// change language 
const coorg = require('../../../common/coorg.json');
const eng = require('../../../common/eng.json');
import {
    ANIMATION_TO_VALUE,
    ANIMATION_DURATION,
} from '../../../common/constants';
setUpdateIntervalForType(SensorTypes.accelerometer, 15);
const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.012;
const LONGITUDE_DELTA = 0.012;

const StartTripSearchingScreen = () => {

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
                console.log(`getCurrentAddress_______________, ${JSON.stringify(responseJson)}`);
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
            Pickup_formattedAddress: address,
        }
        saveToStoragex(updateLocation);
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

    const AnimetedImage = Animated.createAnimatedComponent(ImageBackground);

    const fetchPickupCords = (locations) => {
        console.log('fetchPickupCords', 'save' + JSON.stringify(locations));
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
        let locFrom = {
            latitude: locations?.geometry?.location?.lat,
            longitude: locations?.geometry?.location?.lng,
        }
        saveToStoragex(locFrom);
        console.log('fetchPickupCords', 'save');
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

    const handleOnPress = () => {
        if (Platform.OS === 'ios') {
            //  Linking.openURL('maps://app?saddr=' + startinPointName + '&daddr=' + endingPointName+'&travelmode=car')
            // startTrip();
            Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + DATA[1].name + DATA[2].name)
        }
        if (Platform.OS === 'android') {
            // startTrip();
            Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + DATA[1].name + DATA[2].name)
        }
    }


    return (
        <View>
            <View style={{}}>
                <SafeAreaView style={{ position: 'absolute', top: 40, left: 22, zIndex: 9999, width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                    <AddressPickup
                        fetchDetails={true}
                        placheholderText={formattedAddress === '' ? 'Please enter Location' : formattedAddress}
                        fetchAddress={fetchPickupCords}
                        query={{
                            key: globle.GOOGLE_MAPS_APIKEY_V2,
                            language: 'en',
                        }}
                        currentLocation={true}
                        currentLocationLabel='Current location'
                    />
                </SafeAreaView>
                <View style={{ height: height / 2, width: width }}>
                    {loading === true ?
                        <MapView
                            ref={mapRef}
                            style={{ height: height / 2, width: width }}
                            // mapType={MapView.MAP_TYPES.TERRIN}
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
                    <TouchableOpacity onPress={() => getNearbyBars()} style={{ position: 'absolute', bottom: 5, right: 5, zIndex: 9999 }}>
                        <Image style={{ width: 55, height: 55, resizeMode: 'contain' }} source={require('../../assets/greenIndicator.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, flexGrow: 1 }}>
                <TouchableOpacity onPress={() => navigate.replace('EnterDropLocationScreen')} style={{ marginTop: 0, width: '100%', height: 45, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ left: 25, width: 10, height: 10, backgroundColor: 'red', borderRadius: 150, zIndex: 9999, marginTop: 3 }} />
                    <Text numberOfLines={1} style={{ height: 50, borderRadius: 50, borderWidth: 1, borderColor: '#F1F6F9', paddingLeft: 30, backgroundColor: '#F1F6F9', elevation: 3, paddingTop: 17, fontWeight: 'bold', flex: 1, paddingRight: 40 }}>{toformattedAddress === null ? selectedLanguage === 'Coorg' ? coorg.crg.enter_drop_location : eng.en.enter_drop_location : toformattedAddress}</Text>
                    <View style={{ position: 'absolute', right: 10, top: 12 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', }} source={require('../../assets/next.png')} />
                    </View>
                </TouchableOpacity>
                <View style={{ padding: 5, marginTop: 5, marginLeft: 10 }}>
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>{selectedLanguage === 'Coorg' ? coorg.crg.search_destination : eng.en.search_destination}</Text>
                </View>
                <View style={{}}>
                    {searchFavData.length > 0 ?
                        <FlatList
                            style={{ height: width / 2, width: width - 20, }}
                            data={searchData}
                            keyExtractor={(id) => id}
                            renderItem={(items) => <Text style={{ fontSize: 22 }}>xx{JSON.stringify(items)}</Text>}
                        /> : <View style={{ alignItems: 'center' }}>
                            <Image style={{ width: 220, height: 220, resizeMode: 'contain', }} source={require('../../assets/search_result_not_found.png')} />
                        </View>}

                </View>
            </View>
        </View>
    );
};

export default StartTripSearchingScreen;