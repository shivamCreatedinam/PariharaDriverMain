/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    Image,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    Pressable,
    SafeAreaView
} from 'react-native';
import globle from '../../../common/env';
import { useNavigation } from '@react-navigation/native';
import AddressPickup from '../../../common/AddressPickup';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
import styles from './styles';

const SearchDestinationScreen = () => {

    const navigate = useNavigation();
    const [Destinationstate, setDestinationState] = React.useState({ destinationCords: {} });
    const [Dropstate, setDropState] = React.useState({ dropCords: {} });


    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);


    const fetchDropCords = (locations) => {
        setDropState({
            ...Dropstate,
            dropCords: {
                latitude: locations?.geometry?.location?.lat,
                longitude: locations?.geometry?.location?.lng,
                name: locations?.name,
                icon: locations?.icon,
            }
        })
        getCurrentAddress(locations?.geometry?.location?.lat, locations?.geometry?.location?.lng);
    }

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

        console.log('Info_location--><><><>', JSON.stringify(address));
        const updateLocation = {
            latitude: lat,
            longitude: long,
            DropUp_formattedAddress: address,
        }
        ShareLocation(updateLocation);
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

    const ShareLocation = async (locations) => {
        let sendDetails = {
            type: 'ToDestination',
            latitude: locations?.latitude,
            longitude: locations?.longitude,
            DropUp_formattedAddress: locations?.DropUp_formattedAddress,
        }
        console.log(JSON.stringify(sendDetails));
        const jsonValue = JSON.stringify(sendDetails);
        await AsyncStorage.setItem('@autoEndTrip', jsonValue);
        console.log('save_end_trip');
        navigate.replace('TripCreateScreen', sendDetails);
    }


    return (
        <View style={styles.container}>
            <View style={{ padding: 10, borderBottomColor: '#b4b4b4', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{}} onPress={() => navigate.goBack()}>
                    <Image style={{ height: 40, width: 20, resizeMode: 'contain', }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1, color: '#000' }}>Pick Drop Location</Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', zIndex: 9999 }}>
                <SafeAreaView style={{ height: 260, width: Dimensions.get('screen').width - 10, zIndex: 999, right: 0, padding: 10 }}>
                    <AddressPickup
                        fetchDetails={true}
                        placheholderText={"Enter Drop Location"}
                        fetchAddress={fetchDropCords}
                        query={{
                            key: globle.GOOGLE_MAPS_APIKEY_V2,
                            language: 'en',
                        }}
                        currentLocation={true}
                        currentLocationLabel={'Enter Drop Location'}
                    />
                    {Object.keys(Dropstate.dropCords).length > 0 ?
                        <Pressable onPress={() => console.log('click drop')} style={{ position: 'absolute', right: 25, top: 45, zIndex: 9999 }}>
                            <Image style={{ height: 20, width: 20, resizeMode: 'contain', }} source={require('../../assets/red_cross.png')} />
                        </Pressable> : null}
                </SafeAreaView>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Image style={{ width: width, height: width / 1.5, resizeMode: 'contain' }} source={require('../../assets/How_to_Fix_No_LocationFound.jpeg')} />
            </View>
        </View>
    );
};

export default SearchDestinationScreen;