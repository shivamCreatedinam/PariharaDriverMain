/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    Linking,
    View,
    Alert,
    Text,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native';
import axios from 'axios';
import globle from '../../../common/env';
import info from '../../../package.json';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import { showMessage } from "react-native-flash-message";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
// change language 
const coorg = require('../../../common/coorg.json');
const eng = require('../../../common/eng.json');

const ProfileScreen = () => {

    const navigate = useNavigation();
    const [data, setData] = React.useState({});
    const [WalletData, setWalletData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
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

    function trackMaps(data) {
        navigate.navigate('TrackingMapsScreen', data);
    }

    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
            loadWalletProfile();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const loadProfile = async () => {
        setLoading(true)
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
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setData(response.data);
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const loadWalletProfile = async () => {
        setLoading(true)
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
                setLoading(false)
                setWalletData(response.data);
                console.log('wallet', JSON.stringify(response.data));
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const logoutX = () => {
        Alert.alert(
            selectedLanguage === 'Coorg' ? coorg.crg.logged_out : eng.en.logged_out,
            selectedLanguage === 'Coorg' ? coorg.crg.logged_out_alert : eng.en.logged_out_alert,
            [
                { text: selectedLanguage === 'Coorg' ? coorg.crg.no : eng.en.no, onPress: () => console.log('cancel') },
                { text: selectedLanguage === 'Coorg' ? coorg.crg.yes : eng.en.yes, onPress: () => loggoutUser() },
            ]
        );
    }

    const showSuccessToast = (msg) => {
        // Toast.show({
        //     type: 'success',
        //     text1: 'Login Success',
        //     text2: msg,
        // });
        Linking.openURL(msg);
        // navigate.replace('UserEditProfileScreen', { screenType: 'OldUser' });
    }

    const loggoutUser = async () => {
        let keys = [];
        try {
            keys = await AsyncStorage.getAllKeys();
            console.log(`Keys: ${keys}`)
            // Just to see what's going on
            await AsyncStorage.multiRemove(keys);
            showMessage({
                message: selectedLanguage === 'Coorg' ? coorg.crg.loggout_successfull : eng.en.loggout_successfull,
                description: selectedLanguage === 'Coorg' ? coorg.crg.congratulations_loggout_successfully : eng.en.congratulations_loggout_successfully,
                type: "success",
            });
            navigate.replace('SplashAppScreen');
            navigate.reset();
        } catch (e) {
            console.log(e)
        }
        console.log('Done')
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => trackMaps(item)} style={{ padding: 5, borderWidth: item.trip_activate === true ? 1 : 0, borderColor: item.trip_activate === true ? 'green' : 'red', marginBottom: 5, margin: 5, borderRadius: 5 }}>
                <Text>{JSON.stringify(item.driver_location)}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>{item.pick_point}</Text>
                    <Text>{item.drop_point}</Text>
                </View>
                <View>
                    <Text>{item.driver_Name}</Text>
                    <Text>{item.drop_point}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const onPayPress = () => {
        navigate.navigate('PurchasePackageList');
    }

    const onPayRazorPayPress = () => {
        var options = {
            description: 'Credits towards consultation',
            image: globle.IMAGE_BASE_URL + data?.user?.user_image,
            currency: 'INR',
            key: 'rzp_test_ab2tkx2iprYBt8',
            amount: (Number(45) * 100),
            name: 'foo',
            prefill: {
                email: data?.user?.email,
                contact: data?.user?.mobile,
                name: data?.user?.name,
            },
            theme: {
                color: '#0066cc',
            }
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            Alert.alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            Alert.alert(`Error: ${error.code} | ${error.description}`);
        });
    }

    return (
        <ScrollView style={styles.container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={styles.headerContainer}>
                <Image
                    style={[styles.coverPhoto, { resizeMode: 'cover' }]}
                    source={require('../../assets/user_profile_bg.jpg')}
                />
            </View>
            <View
                style={[styles.profileContainer, { borderTopLeftRadius: 20, maxBodyLength: 10, borderTopRightRadius: 20, }]}>
                <Image
                    style={[styles.profilePhoto, { backgroundColor: '#fff', borderRadius: 150 }]}
                    source={{ uri: globle.IMAGE_BASE_URL + data?.user?.user_image }}
                />
                <Text style={styles.nameText}>{data?.user?.name}</Text>
            </View>
            <View style={styles.bioContainer}>
                <Text style={styles.bioText}>{data?.user?.email}</Text>
            </View>
            <View style={{ padding: 20, backgroundColor: '#0066cc', margin: 20, marginBottom: 0, borderRadius: 15, flexDirection: 'row', alignItems: 'center', elevation: 5 }}>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain', marginRight: 10, tintColor: '#ffffff' }} source={require('../../assets/wallet_icon.png')} />
                    <Text style={{ fontSize: 15, color: '#ffffff', fontWeight: 'bold', flex: 1 }}>₹ {JSON.stringify(WalletData?.user?.wallet_amount)}.00</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPayPress()} style={{ width: 25, height: 25, borderRadius: 150, backgroundColor: '#ffffff', elevation: 5, padding: 5 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, marginTop: -4, fontWeight: 'bold', color: '#0066cc' }} >+</Text>
                </TouchableOpacity>
            </View>
            <View style={{ padding: 20, alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigate.navigate('UserEditProfileScreen')}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 5 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/driver_profile.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.edit_profile : eng.en.edit_profile}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showSuccessToast('Coming soon!')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/badge.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.reward_offer : eng.en.reward_offer}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate.navigate('TransactionHistoryScreen')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/history.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.transaction_history : eng.en.transaction_history}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate.navigate('BookingTripHistoryScreen')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/history.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.booking_history : eng.en.booking_history}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate.navigate('SettingScreen')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/setting.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.settings : eng.en.settings}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showSuccessToast('https://theparihara.com/privacy_policy.html')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/privacy.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.privacy_policy : eng.en.privacy_policy}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showSuccessToast('https://theparihara.com/privacy_policy.html')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/home_shield.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.term_sconditions : eng.en.term_sconditions}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { width: '100%', borderRadius: 50, marginTop: 15, padding: 15, elevation: 5 }]} onPress={() => logoutX()}>
                    <Text style={styles.buttonText}>{selectedLanguage === 'Coorg' ? coorg.crg.log_out : eng.en.log_out}</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'black', marginTop: 30, fontWeight: 'bold', marginBottom: 50 }}>v {info.version}</Text>
        </ScrollView>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        alignItems: 'center',
    },
    coverPhoto: {
        width: '100%',
        height: 250,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: -50,
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    bioContainer: {
        padding: 5,
    },
    bioText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '900'
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },
    statContainer: {
        alignItems: 'center',
        flex: 1,
    },
    statCount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 16,
        color: '#999',
    },
    button: {
        with: '100%',
        backgroundColor: '#0066cc',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 20,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
};

export default ProfileScreen;