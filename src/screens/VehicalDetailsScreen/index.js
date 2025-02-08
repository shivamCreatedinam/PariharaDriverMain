import React from "react";
import axios from 'axios';
import globle from '../../../common/env';
import { View, Text, TouchableOpacity, TextInput, Image, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

const VehicalDetailsScreen = () => {

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
    let [PollusionNo, setAddPollusionNo] = React.useState(null);
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
                    setName(response.data.driver?.aadhar_front);
                    setEmail(response.data.driver?.drv_licence);
                    setMobile(response.data.driver?.aadhar_back);
                    setAddVehicleNo(response.data.driver?.vehicle_no);
                    setAddPollusionNo(response.data.driver?.insurance_file);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <View style={{ flex: 1, paddingTop: 25 }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: .5 }}>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Vehicle Details</Text>
            </View>
            <ScrollView style={{ flex: 1, }}>
                <Image style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').width, resizeMode: 'cover' }} source={require('../../assets/autorickshaw.jpeg')} />
                <View style={{ padding: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                        <TextInput style={{ marginLeft: 15 }} defaultValue={AddVehicleNo} placeholder='Enter User vehicle No' onChangeText={(e) => setAddVehicleNo(e)} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 5, marginTop: 15 }}>
                        <View style={{ padding: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 10 }}>Driving Licence</Text>
                            <Image style={{ height: 110, width: Dimensions.get('screen').width / 2 - 30, resizeMode: 'cover' }} source={{ uri: globle.IMAGE_BASE_URL + '' + Name }} />
                        </View>
                        <View style={{ padding: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 10 }}>Vehicle (RC)</Text>
                            <Image style={{ height: 110, width: Dimensions.get('screen').width / 2 - 30, resizeMode: 'cover' }} source={{ uri: globle.IMAGE_BASE_URL + '' + Mobile }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, padding: 0, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 5, marginTop: 15 }}>
                        <View style={{ padding: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 10 }}>Pollusion Certificate (PC)</Text>
                            <Image style={{ height: 110, width: Dimensions.get('screen').width / 2 - 30, resizeMode: 'cover' }} source={{ uri: globle.IMAGE_BASE_URL + '' + PollusionNo }} />
                        </View>
                        <View style={{ padding: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 10 }}>Vehicle Insurance</Text>
                            <Image style={{ height: 110, width: Dimensions.get('screen').width / 2 - 30, resizeMode: 'cover' }} source={{ uri: globle.IMAGE_BASE_URL + '' + Email }} />
                        </View>
                    </View>
                    {/* <TouchableOpacity style={[{ width: '100%', borderRadius: 50, marginTop: 15, backgroundColor: '#000', padding: 8 }]} onPress={() => UpdateDriverProfle()}>
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', padding: 10, textTransform: 'uppercase' }}>Update</Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
        </View>
    )
}

export default VehicalDetailsScreen;