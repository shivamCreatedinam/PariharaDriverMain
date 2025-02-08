import React from "react";
import axios from 'axios';
import globle from '../../../common/env';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

const DriverEditScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const [data, setData] = React.useState({});
    let [verified, setVerified] = React.useState('No');
    const [loading, setLoading] = React.useState(false);
    let [driverData, setDriverData] = React.useState(null);
    let [Name, setName] = React.useState(null);
    let [Email, setEmail] = React.useState(null);
    let [Mobile, setMobile] = React.useState(null);
    let [AddVehicleNo, setAddVehicleNo] = React.useState(null);
    let [AddAddress, setAddAddress] = React.useState(null);
    let [currentLatitude, setCurrentLatitude] = React.useState(null);
    let [currentLongitude, setCurrentLongitude] = React.useState(null);

    useFocusEffect(
        React.useCallback(() => {
            // whatever
            getOneTimeLocation();
            getProfileDriverData();
            setTimeout(() => {
                // setTimeout
                // loadSessionStorage();
            }, 3000);
        }, [])
    );

    const getOneTimeLocation = () => {
        console.log('Getting Location. Please Wait.');
        Geolocation.getCurrentPosition(
            //Will give you the current location
            position => {
                //getting the Longitude from the location json
                const currentLongitude = JSON.stringify(position.coords.longitude);

                //getting the Latitude from the location json
                const currentLatitude = JSON.stringify(position.coords.latitude);

                var region = {
                    latitudeDelta,
                    longitudeDelta,
                    latitude: parseFloat(currentLatitude),
                    longitude: parseFloat(currentLongitude),
                };
                console.log('getOneTimeLocation', JSON.stringify(region));
                // this.setState({
                //   showLoading: false,
                //   region: region,
                //   forceRefresh: Math.floor(Math.random() * 100),
                // });
                setCurrentLatitude();
                setCurrentLongitude();
            },
            error => {
                console.log('We are not able to find you location, Please Enter Manually');
                // console.log('error.message', error.message);
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 10000,
            },
        );
    };

    const getProfileDriverData = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX);
        let url_driverProfile = globle.API_BASE_URL + 'driver-profile?driver_id=' + data?.id;
        setLoading(true);
        var authOptions = {
            method: 'GET',
            url: url_driverProfile,
            headers: {
                'Content-Type': 'application/json',
            },
            json: true,
        };
        axios(authOptions)
            .then((response) => {
                if (response.data.status) {
                    console.log('getProfileDriverData---->>', JSON.stringify(response.data));
                    setDriverData(response.data.driver);
                    setName(response.data.driver?.name);
                    setEmail(response.data.driver?.email);
                    setMobile(response.data.driver?.mobile);
                    setAddVehicleNo(response.data.driver?.vehicle_no);
                    setAddAddress(response.data.driver?.address);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const UpdateDriverProfle = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX);
        var formdata = new FormData();
        formdata.append('driver_id', data?.id);
        formdata.append('name', Name);
        formdata.append('email', Email);
        formdata.append('mobile', Mobile);
        formdata.append('vehicle_no', AddVehicleNo);
        formdata.append('address', AddAddress);
        formdata.append('latitude', currentLatitude);
        formdata.append('longitude', currentLongitude);
        console.log('uploadProfile', valueX)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('uploadProfile', requestOptions)
        fetch(globle.API_BASE_URL + 'update-driver-profile', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('uploadProfileX', result)
                if (result.status) {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                } else {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            })
            .catch((error) => {
                console.log('error', error);
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
            });
    }

    return (
        <View style={{ flex: 1, paddingTop: 25, padding: 15 }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: .5 }}>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Edit Profile</Text>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <TextInput style={{ marginLeft: 15 }} defaultValue={Name} placeholder='Enter User Name' onChangeText={(e) => setName(e)} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <TextInput editable={false} style={{ marginLeft: 15 }} defaultValue={Email} placeholder='Enter User Email' onChangeText={(e) => setEmail(e)} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <TextInput style={{ marginLeft: 15 }} defaultValue={AddVehicleNo} placeholder='Enter User vehicle No' onChangeText={(e) => setAddVehicleNo(e)} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <TextInput style={{ marginLeft: 15 }} defaultValue={AddAddress} placeholder='Home Address' onChangeText={(e) => setAddAddress(e)} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <TextInput editable={false} style={{ marginLeft: 15 }} defaultValue={Mobile} placeholder='Enter User Mobile' />
                </View>
                <TouchableOpacity style={[{ width: '100%', borderRadius: 50, marginTop: 15, backgroundColor: '#000', padding: 8 }]} onPress={() => UpdateDriverProfle()}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', padding: 10, textTransform: 'uppercase' }}>Update</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DriverEditScreen;