import React from 'react';
import { Text, View, RefreshControl, Image, ActivityIndicator, ScrollView, Dimensions, Alert, StatusBar, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import globle from '../../../../common/env';

const AddAddressScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const [UserName, setUserName] = React.useState('');
    const [UserMobile, setUserMobile] = React.useState('');
    const [UserHouseNo, setUserHouseNo] = React.useState('');
    const [UserAddress, setUserAddress] = React.useState('');
    const [UserPincode, setUserPincode] = React.useState('');
    const [UserState, setUserState] = React.useState('');
    const [Latitude, setLatitude] = React.useState('');
    const [Longitude, setLongitude] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            GetGeoLocation();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const GetGeoLocation = async () => {
        Geolocation.getCurrentPosition(info => {
            console.log(info?.coords?.latitude, info?.coords?.longitude);
            setLatitude(info?.coords?.latitude);
            setLongitude(info?.coords?.longitude);
            getCurrentAddress(info?.coords?.latitude, info?.coords?.longitude);
        });
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
                // console.log('Address Location', JSON.stringify(responseJson));
                // loadSessionStorage(currentLatitude, currentLongitude);
                setAddressFieldAutoPopulate(responseJson);
            });
    };

    const setAddressFieldAutoPopulate = responseJson => {
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
        setUserAddress(address);
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

    const AddNewAddressValidation = async () => {
        if (UserName === '') {
            Toast.show({
                type: 'error',
                text1: 'Enter Name',
                text2: 'Please Enter Name',
            })
            return false;
        } else if (UserMobile === '') {
            Toast.show({
                type: 'error',
                text1: 'Enter Mobile',
                text2: 'Please Enter Mobile Number',
            })
            return false;
        }
        else if (UserHouseNo === '') {
            Toast.show({
                type: 'error',
                text1: 'Enter House No',
                text2: 'Please Enter House No',
            })
            return false;
        }
        else if (UserAddress === '') {
            Toast.show({
                type: 'error',
                text1: 'Enter Address',
                text2: 'Please Valid Enter Address',
            })
            return false;
        }
        else if (UserPincode === '') {
            Toast.show({
                type: 'error',
                text1: 'Enter Pincode',
                text2: 'Please Enter Pincode',
            })
            return false;
        }
        else if (UserState === '') {
            Toast.show({
                type: 'error',
                text1: 'Enter Remark',
                text2: 'Please Enter Remark',
            })
            return false;
        } else {
            AddNewAddress();
        }
    }

    const AddNewAddress = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);
        const formdata = new FormData();
        formdata.append('user_id', userId);
        formdata.append('mobile', UserMobile);
        formdata.append('full_name', UserName);
        formdata.append('house_no', UserHouseNo);
        formdata.append('appartment', UserAddress);
        formdata.append('city', 1);
        formdata.append('state', 1);
        formdata.append('pincode', UserPincode);
        formdata.append('address_type', UserState);
        formdata.append('latitude', Latitude);
        formdata.append('longitude', Longitude);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        console.log('loadProducts', JSON.stringify(requestOptions));
        fetch(globle.API_BASE_URL + 'add-address', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('loadProducts', JSON.stringify(result));
                if (result.status) {
                    Toast.show({
                        type: 'success',
                        text1: result?.message,
                        text2: result?.message,
                    });
                    navigate.goBack();
                    setLoading(false);
                } else {
                    setLoading(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Error Address',
                        text2: 'Something went wrong!',
                    });
                }
            })
            .catch(error => setLoading(false));
    }


    return (
        <View>
            <View style={{ padding: 20, marginTop: StatusBar.currentHeight, flexDirection: 'row', alignItems: 'center', elevation: 5, backgroundColor: '#ffffff' }}>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Image style={{ width: 25, height: 25 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ flex: 1, fontWeight: 'bold', marginLeft: 20, fontSize: 16 }}>Add New Address</Text>
            </View>
            <View style={{ padding: 20 }}>
                <View style={{ paddingTop: 5, paddingBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Name</Text>
                    <View style={{ backgroundColor: '#ffffff', elevation: 5, borderWidth: 1, borderRadius: 10 }}>
                        <TextInput defaultValue={UserName} onChangeText={(e) => setUserName(e)} placeholder='Enter Name' style={{ paddingLeft: 15 }} />
                    </View>
                </View>
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Mobile</Text>
                    <View style={{ backgroundColor: '#ffffff', elevation: 5, borderWidth: 1, borderRadius: 10 }}>
                        <TextInput maxLength={10} defaultValue={UserMobile} onChangeText={(e) => setUserMobile(e)} placeholder='Enter Mobile' keyboardType='phone-pad' style={{ paddingLeft: 15 }} />
                    </View>
                </View>
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>House No</Text>
                    <View style={{ backgroundColor: '#ffffff', elevation: 5, borderWidth: 1, borderRadius: 10 }}>
                        <TextInput defaultValue={UserHouseNo} onChangeText={(e) => setUserHouseNo(e)} placeholder='Enter House No' style={{ paddingLeft: 15 }} />
                    </View>
                </View>
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Full Address</Text>
                    <View style={{ backgroundColor: '#ffffff', elevation: 5, borderWidth: 1, borderRadius: 10 }}>
                        <TextInput defaultValue={UserAddress} onChangeText={(e) => setUserAddress(e)} placeholder='Enter Full Address' style={{ paddingLeft: 15 }} />
                    </View>
                </View>
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Pincode</Text>
                    <View style={{ backgroundColor: '#ffffff', elevation: 5, borderWidth: 1, borderRadius: 10 }}>
                        <TextInput defaultValue={UserPincode} keyboardType='phone-pad' onChangeText={(e) => setUserPincode(e)} placeholder='Enter Pincode' style={{ paddingLeft: 15 }} />
                    </View>
                </View>
                <View style={{ paddingBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Remark</Text>
                    <View style={{ backgroundColor: '#ffffff', elevation: 5, borderWidth: 1, borderRadius: 10 }}>
                        <TextInput defaultValue={UserState} onChangeText={(e) => setUserState(e)} placeholder='Enter Remark`s  { Home, Office }' style={{ paddingLeft: 15 }} />
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity onPress={() => AddNewAddressValidation()} style={{ backgroundColor: '#000000', paddingHorizontal: 20, paddingVertical: 18, borderRadius: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#ffffff', textAlign: 'center' }}>Add New Address</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AddAddressScreen

const styles = StyleSheet.create({})