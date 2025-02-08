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
    Pressable,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native-elements';
import globle from '../../../common/env';
import OTPInput from 'react-native-otp';
import axios from 'axios';

const DriverForgetPasswordScreen = () => {

    const navigation = useNavigation();
    const [initializing, setInitializing] = React.useState(true);
    const [secure, setSecure] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [isOTPSend, setOTPSend] = React.useState(false);
    const [userName, setNameUser] = React.useState();
    const [userMobile, setMobileUser] = React.useState();
    const [user, setUser] = React.useState();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repassword, setRepassword] = React.useState('');
    const [errors, setErrors] = React.useState('');
    const [OTP, setUserOTP] = React.useState(null);
    const [loader, setLoader] = React.useState(false);


    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);

    const showSuccessToast = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            text2: 'OTP has been sent to ' + userMobile + '!'
        });
    }

    const showErrorToast = (msg) => {
        Toast.show({
            type: 'error',
            text1: 'Something went wrong!',
            text2: msg
        });
    }

    const showPasswordToast = () => Toast.show({ type: 'error', text1: 'Invalid Password!', });

    const validation = () => {
        let reg = /^[7-9][0-9]{9}$/;
        console.log('validation3');
        if (reg.test(userMobile) === true) {
            loggedUsingMobileIn();
        } else {
            showErrorToast('Please Enter Valid Mobile Number');
        }
    }

    const passwordValidation = () => {
        const rgx = /^(?=.*[\W])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,50}$/;
        if (rgx.test(password)) {
            if (rgx.test(repassword)) {
                if (repassword.match(password)) {
                    DriverForgotPasswordApp();
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Password Not Match!',
                        text2: 'Please enter same password'
                    });
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Enter Valid RePassword',
                    text2: 'Please enter valid RePassword'
                });
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Enter Valid Password',
                text2: 'Please enter valid password'
            });

        }
    }

    const loggedUsingMobileIn = () => {
        var authOptions = {
            method: 'post',
            url: globle.API_BASE_URL + 'requesting_for_otp',
            data: JSON.stringify({ "mobile": userMobile }),
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
        setLoader(true);
        axios(authOptions)
            .then((response) => {
                console.log('loggedUsingMobileIn', JSON.stringify(response.data));
                if (response?.data?.status) {
                    showSuccessToast(response.data.message);
                    setOTPSend(true);
                    setLoader(false);
                } else {
                    setLoader(false);
                    console.log(response.data);
                }
            })
            .catch((error) => {
                setLoader(false);
            });
    }

    const DriverForgotPasswordApp = () => {
        setLoading(true);
        var authOptions = {
            method: 'post',
            url: globle.API_BASE_URL + 'forgot-password',
            data: JSON.stringify({ "mobile": userMobile, 'otp': OTP, "new_password": password, "confirm_password": repassword }),
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
        axios(authOptions)
            .then((response) => {
                if (response?.data?.status) {
                    setLoading(false);
                    console.log(response.data);
                    Toast.show({
                        type: 'success',
                        text1: 'congratulations 🎉 ' + response.data?.message,
                        text2: response.data?.message
                    });
                    navigation.replace('DriverLoginScreen');
                } else {
                    setLoading(false);
                    showErrorToast(response.data?.message);
                    console.log(response.data);
                }
            })
            .catch((error) => {
                setLoading(false);
                alert(error)
            });
    }

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@autoUserType', 'Driver');
            await AsyncStorage.setItem('@autoDriverGroup', jsonValue);
            navigation.navigate('HomeScreen');
        } catch (e) {
            // saving error
        }
    };

    const moveToRegister = () => {
        navigation.navigate('LoginScreen');
    }

    return (
        <View style={{ padding: 20, flex: 1 }}>
            {isOTPSend === false ?
                <View style={{ elevation: 5, flex: 1, padding: 20, backgroundColor: '#FFEEBB', borderRadius: 10, marginBottom: 90, top: 35 }}>
                    <View style={{ padding: 20, alignSelf: 'center' }}>
                        <Image style={{ height: 120, width: 120, resizeMode: 'cover', alignSelf: 'center', alignItems: 'center', marginBottom: 20, borderRadius: 150, marginTop: 60 }} source={require('../../assets/ic_launcher_round.jpg')} />
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Change Password</Text>
                    </View>
                    <View style={{ marginTop: 25 }}>
                        <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Mobile</Text>
                        <TextInput autoFocus={true} keyboardType='numeric' maxLength={10} placeholder='Enter Driver Mobile Number' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setMobileUser(e)} />
                    </View>
                    <TouchableOpacity
                        disabled={loading}
                        style={{
                            width: '100%',
                            marginTop: 20,
                            paddingHorizontal: 10,
                            paddingVertical: 14,
                            backgroundColor: 'black',
                            borderRadius: 5,
                            elevation: 6,
                        }}
                        onPress={validation}>
                        {loader === true ? <ActivityIndicator color={'#ffffff'} size={'small'} /> :
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                            }}>Send OTP</Text>}
                    </TouchableOpacity>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ color: '#FE0000', fontWeight: 'bold', fontSize: 10 }}>{errors}</Text>
                    </View>
                </View> :
                <View style={{ elevation: 5, flex: 1, padding: 20, backgroundColor: '#FFEEBB', borderRadius: 10, marginBottom: 50, marginTop: 50 }}>
                    <View style={{ marginTop: 120 }}>
                        <OTPInput
                            tintColor="#FB6C6A"
                            offTintColor="#000000"
                            otpLength={4}
                            onChange={(code) => setUserOTP(code)}
                            fontWeight={'900'}
                        />
                    </View>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 14, marginTop: 20 }}>Enter OTP & Enter Password</Text>
                    <View style={{ marginTop: 25 }}>
                        <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Password</Text>
                        <TextInput placeholder='Enter New password' secureTextEntry={secure} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setPassword(e)} />
                        <Pressable onPress={() => setSecure(!secure)} style={{ position: 'absolute', right: 15, top: 15 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/icons_eye.png')} />
                        </Pressable>
                    </View>
                    <View style={{ marginTop: 25 }}>
                        <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Re-enter Password</Text>
                        <TextInput placeholder='Re-enter Password' secureTextEntry={secure} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setRepassword(e)} />
                        <Pressable onPress={() => setSecure(!secure)} style={{ position: 'absolute', right: 15, top: 15 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/icons_eye.png')} />
                        </Pressable>
                    </View>
                    <TouchableOpacity
                        disabled={loading}
                        style={{
                            width: '100%',
                            marginTop: 20,
                            paddingHorizontal: 10,
                            paddingVertical: 14,
                            backgroundColor: 'black',
                            borderRadius: 5,
                            elevation: 6,
                        }}
                        onPress={passwordValidation}>
                        {loading === true ? <ActivityIndicator color={'#ffffff'} size={'small'} /> :
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                textAlign: 'center',
                            }}>Change Password</Text>}
                    </TouchableOpacity>
                </View>}
        </View>
    );

};


export default DriverForgetPasswordScreen;