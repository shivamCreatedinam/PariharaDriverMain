/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useRef } from 'react';
import {
    Image,
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import globle from '../../../common/env';
import axios from 'axios';
// change language 
const coorg = require('../../../common/coorg.json');
const eng = require('../../../common/eng.json');

const LoginScreen = () => {

    const navigation = useNavigation();
    const [initializing, setInitializing] = React.useState(true);
    const [secure, setSecure] = React.useState(true);
    const [loader, setLoader] = React.useState(false);
    const [user, setUser] = React.useState();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState('');
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
        Toast.show({
            type: 'success',
            text1: msg,
            text2: msg,
        });
        setTimeout(() => {
            // setTimeout
            navigation.navigate('OTPSubmitScreen', { mobileNumber: email });
        }, 2000);
    }

    const setUserData = async () => {

    }

    const showErrorToast = () => Toast.show({ type: 'error', text1: 'Invalid Mobile Number', });

    const showPasswordToast = () => Toast.show({ type: 'error', text1: 'Invalid Password!', });

    const validation = () => {
        console.log('validation3');
        if (email.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !(email.match(/0{5,}/))) {
            console.log('validation4');
            loggedUsingMobileIn();
        }
        else {
            console.log('validation7');
            showErrorToast();
        }
    }

    const loggedUsingMobileIn = () => {
        var authOptions = {
            method: 'post',
            url: globle.API_BASE_URL + 'requesting_for_otp',
            data: JSON.stringify({ "mobile": email }),
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
        setLoader(true);
        console.log('loggedUsingMobileIn', JSON.stringify(authOptions));
        axios(authOptions)
            .then((response) => {
                console.log('loggedUsingMobileIn', JSON.stringify(response.data));
                if (response?.data?.status) {
                    showSuccessToast(response.data.message);
                    setLoader(false);
                } else {
                    setLoader(false);
                    console.log(response.data);
                }
            })
            .catch((error) => {
                alert(error)
                setLoader(false);
            });
    }

    const loggedIn = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                showSuccessToast();
            })
            .catch(error => {
                if (error.code === 'auth/user-not-found') {
                    setErrors('There is no user record corresponding to this identifier. The user may have been deleted.')
                }
            });
    }

    const registerUser = () => {
        auth()
            .createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }
                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }
                console.error(error);
            });
    };

    const logOut = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
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

    const moveToLogin = () => {
        navigation.navigate('RegisterScreen');
    }

    return (
        <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={{
                flexGrow: 1,
            }}
            style={{ padding: 20, flex: 1 }}>
            <View style={{ elevation: 5, flex: 1, padding: 20, backgroundColor: '#FFEEBB', borderRadius: 10, marginBottom: 100, top: 55 }}>
                <View style={{ padding: 20, flex: 1, alignItems: 'center' }}>
                    <Image style={{ height: 200, width: 200, resizeMode: 'cover', marginBottom: 20, borderRadius: 150 }} source={require('../../assets/ic_launcher_round.jpg')} />
                </View>
                <View>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>{selectedLanguage === 'Coorg' ? coorg.crg.mobile : eng.en.mobile}</Text>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        inputMode='tel'
                        maxLength={10}
                        placeholder={selectedLanguage === 'Coorg' ? coorg.crg.enter_digit_mobile_number : eng.en.enter_digit_mobile_number}
                        style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10, fontWeight: 'bold' }} onChangeText={(e) => setEmail(e)} />
                </View>
                {/* <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Password</Text>
                    <TextInput placeholder='Enter user password' secureTextEntry={secure} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setPassword(e)} />
                    <Pressable onPress={() => setSecure(!secure)} style={{ position: 'absolute', right: 15, top: 15 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/icons_eye.png')} />
                    </Pressable>
                </View> */}
                <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ tintColor: 'green', width: 20, height: 20, marginRight: 5 }} source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/8atour/check-box-4.png' }} />
                    <Text style={{ fontSize: 12, letterSpacing: 1.5 }} >{selectedLanguage === 'Coorg' ? coorg.crg.button_you_agree_with_the : eng.en.button_you_agree_with_the} <TouchableOpacity style={{}} onPress={() => openLinkToAnotherTabs('https://theparihara.com/privacy_policy.html')}><Text style={{ fontWeight: 'bold', fontSize: 12, letterSpacing: 1.5 }}>{selectedLanguage === 'Coorg' ? coorg.crg.button_you_agree_with_the : eng.en.button_you_agree_with_the}</Text></TouchableOpacity></Text>
                </View>
                <TouchableOpacity
                    disabled={loader}
                    style={{
                        width: '100%',
                        marginTop: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 14,
                        backgroundColor: 'black',
                        borderRadius: 5,
                        elevation: 6,
                    }} onPress={validation}>
                    {loader === true ? <ActivityIndicator style={{ alignSelf: 'center' }} color={'white'} /> :
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                        }}>{selectedLanguage === 'Coorg' ? coorg.crg.send_OTP : eng.en.send_OTP}</Text>}
                </TouchableOpacity>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#FE0000', fontWeight: 'bold', fontSize: 10 }}>{errors}</Text>
                </View>
                <View style={{ marginTop: 20, alignSelf: 'center', marginRight: 10, flexDirection: 'row', alignItems: 'center', }}>
                    <TouchableOpacity style={{ alignItems: 'center', marginRight: 5 }} onPress={() => moveToLogin()}>
                        <Text
                            style={{ fontWeight: 'bold', fontSize: 12, color: '#000000' }}>{selectedLanguage === 'Coorg' ? coorg.crg.partner_with_us : eng.en.partner_with_us}</Text>
                    </TouchableOpacity>
                    <Image style={{ width: 12, height: 12, resizeMode: 'contain' }} source={require('../../assets/driver_icon.png')} />
                </View>
            </View>
        </ScrollView>
    );
};


export default LoginScreen;