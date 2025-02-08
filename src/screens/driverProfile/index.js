/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Alert,
    Image,
    Dimensions,
    Linking,
    ScrollView,
    StatusBar
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { showMessage } from "react-native-flash-message";
import ImagePicker from 'react-native-image-crop-picker';
import RNRestart from 'react-native-restart';
import info from '../../../package.json';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import styles from './styles';
// change language 
const coorg = require('../../../common/coorg.json');
const eng = require('../../../common/eng.json');

const DriverProfileScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const [loading, setLoading] = React.useState(false);
    let [driverData, setDriverData] = React.useState(false);
    const [uploadProfile, setuploadProfile] = React.useState(null);
    const [walletInfo, setWalletInfo] = React.useState(null);
    let [verified, setVerified] = React.useState('No');
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

    const showSuccessToast = (msg) => {
        navigate.navigate('DriverProfileScreen');
        Toast.show({
            type: 'success',
            text1: 'Login Success',
            text2: msg,
        });
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

    useFocusEffect(
        React.useCallback(() => {
            // whatever
            getProfileBalanceData();
            getProfileDriverData();
            setTimeout(() => {
                // setTimeout
                // loadSessionStorage();
            }, 3000);
        }, [])
    );

    const getProfileBalanceData = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX);
        let url_driverProfile = globle.API_BASE_URL + 'get-driver-trip-amount?driver_id=' + data?.id;
        setLoading(true);
        var authOptions = {
            method: 'GET',
            url: url_driverProfile,
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions)
            .then((response) => {
                console.log('getProfileDriverData', response.data);
                if (response.data.status) {
                    setWalletInfo(response.data);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getProfileDriverData = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX);
        let url_driverProfile = globle.API_BASE_URL + 'driver-profile?driver_id=' + data?.id;
        setLoading(true);
        var authOptions = {
            method: 'GET',
            url: url_driverProfile,
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions)
            .then((response) => {
                console.log('getProfileDriverData', response.data.driver?.duty_status);
                if (response.data.status) {
                    setDriverData(response.data.driver);
                    setVerified(response.data.driver.verified);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function goBackEndTrip() {
        Alert.alert(
            selectedLanguage === 'Coorg' ? coorg.crg.driver_logged_out : eng.en.driver_logged_out,
            selectedLanguage === 'Coorg' ? coorg.crg.logged_out_alert : eng.en.logged_out_alert,
            [
                { text: selectedLanguage === 'Coorg' ? coorg.crg.no : eng.en.no, onPress: () => console.log('cancel') },
                { text: selectedLanguage === 'Coorg' ? coorg.crg.yes : eng.en.yes, onPress: () => loggoutUser() },
            ]
        );
    }

    const loggoutUser = async () => {
        let keys = [];
        try {
            keys = await AsyncStorage.getAllKeys();
            console.log(`Keys: ${keys}`) // Just to see what's going on
            await AsyncStorage.multiRemove(keys);
            await AsyncStorage.multiRemove(keys);
            // navigate.replace('SplashAppScreen');
            showMessage({
                message: "Loggout Successfull!",
                description: "Congratulations, Loggout successfully!",
                type: "success",
            });
            RNRestart.restart();
            navigate.reset();
        } catch (e) {
            console.log(e)
        }
        console.log('Done');
    }

    const updateUserProfile = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX)?.id;
        var formdata = new FormData();
        formdata.append("image", { uri: uploadProfile, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        formdata.append("driver_id", data);
        console.log('uploadProfile', valueX)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
        };
        console.log('uploadProfile', requestOptions)
        fetch(globle.API_BASE_URL + 'driver-profile-image', requestOptions)
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
                    getProfileDriverData();
                } else {
                    // setLoading(false);
                    updateUserProfile();
                    // Toast.show({
                    //     type: 'success',
                    //     text1: 'Something went wrong!',
                    //     text2: result?.message,
                    // });
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

    const uplodProfilePhotoCard = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setuploadProfile(image.path);
            updateUserProfile();
        });
    }

    return (
        <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={{
                flexGrow: 1,
            }}
            style={[styles.container, { marginTop: StatusBar.currentHeight }]}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 9999 }}>
                <TouchableOpacity style={{ paddingLeft: 15, paddingRight: 15 }} onPress={() => navigate.goBack()}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', padding: 10 }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold', marginLeft: -20, color: 'black', fontSize: 18 }} >{selectedLanguage === 'Coorg' ? coorg.crg.profile : eng.en.profile}</Text>
                <TouchableOpacity onPress={() => goBackEndTrip()}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/power_off.png')} />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 20, alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => uplodProfilePhotoCard()}
                    style={{ paddingTop: 20 }}>
                    <Image
                        style={{ width: 110, height: 110, resizeMode: 'contain', borderRadius: 150, elevation: 5 }}
                        source={{ uri: globle.IMAGE_BASE_URL + driverData?.drv_image }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {verified === 'Yes' ? <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 4 }} source={require('../../assets/verified.png')} /> : null}
                    <Text>{driverData?.name}</Text>
                </View>
                <View style={{ padding: 10, backgroundColor: '#ffffff', borderRadius: 20, marginTop: 35, elevation: 5 }}>
                    <View style={{ width: Dimensions.get('screen').width - 100, height: 80, }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 1, marginLeft: 10, marginRight: 10 }}>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>{selectedLanguage === 'Coorg' ? coorg.crg.total_balance : eng.en.total_balance}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>₹ {Number(walletInfo?.wallet_Amount) + Number(walletInfo?.cash_Amount)}.00</Text>
                        </View>
                        <View style={{ backgroundColor: 'grey', height: 1, margin: 10 }} />
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 1, marginLeft: 10, marginRight: 10 }}>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>{selectedLanguage === 'Coorg' ? coorg.crg.details_balance : eng.en.details_balance}</Text>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{selectedLanguage === 'Coorg' ? coorg.crg.wallet : eng.en.wallet} ₹ {Number(walletInfo?.wallet_Amount)}.00</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{selectedLanguage === 'Coorg' ? coorg.crg.cash : eng.en.cash} ₹ {Number(walletInfo?.cash_Amount)}.00</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigate.navigate('DriverEditScreen')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 15 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/driver_profile.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.profile : eng.en.profile}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate.navigate('VehicalDetailsScreen')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/support.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.vehicle_details : eng.en.vehicle_details}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate.navigate('EarningHistoryScreen')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/activity_history.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.earning_history : eng.en.earning_history}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate.navigate('BookingHistoryScreen')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/history.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.booking_history : eng.en.booking_history}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate.navigate('SettingScreen')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/setting.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.settings : eng.en.settings}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLinkToAnotherTabs('https://theparihara.com/privacy_policy.html')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/privacy.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.privacy_policy : eng.en.privacy_policy}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLinkToAnotherTabs('https://theparihara.com/privacy_policy.html')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/home_shield.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.term_sconditions : eng.en.term_sconditions}</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'black', marginTop: 30, fontWeight: 'bold' }}>v {info.version}</Text>
        </ScrollView>
    )
};

export default DriverProfileScreen;  //drv_image