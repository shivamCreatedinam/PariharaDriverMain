/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import { useNavigation, useRoute } from "@react-navigation/native";
import { OtpInput } from "react-native-otp-entry";
import OTPInput from 'react-native-otp';
import { Image } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globle from '../../../common/env';

import axios from 'axios';

const OTPSubmitScreen = () => {

    const navigation = useNavigation();
    const routes = useRoute();
    let otpInput = useRef(null);
    const [initializing, setInitializing] = React.useState(true);
    const [secure, setSecure] = React.useState(true);
    const [loader, serLoader] = React.useState(false);
    const [OTP, setUserOTP] = React.useState(null);
    const [email, setEmail] = React.useState(routes?.params?.mobileNumber);
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState('');

    React.useEffect(() => {
        console.log('addEventListener', JSON.stringify(routes?.params?.mobileNumber));
        return () => {
            console.log('addEventListener', JSON.stringify(routes));
        };
    }, [false]);

    const showSuccessToast = (value) => {
        Toast.show({
            type: 'success',
            text1: value,
            text2: value
        });
        storeData(value);
        // navigation.navigate('HomeBottomNavigation');
    }

    const showSuccessErrorToast = (value) => {
        Toast.show({
            type: 'error',
            text1: value,
            text2: value
        });
        storeData(value);
        // navigation.navigate('HomeBottomNavigation');
    }

    const clearText = () => {
        otpInput.current.clear();
    }

    const setText = () => {
        otpInput.current.setValue("1234");
    }

    const setUserData = async () => {

    }

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@autoUserType', 'User');
            await AsyncStorage.setItem('@autoUserGroup', jsonValue);
            console.log('storeData', value?.name)
            if (value?.is_update === 1) {
                navigation.replace('UserBottomNavigation');
            } else if (value?.is_update === 0) {
                navigation.replace('UserEditProfileScreen', { screenType: 'NewUser' });
            }
        } catch (e) {
            // saving error
        }
    };

    const showErrorToast = () => Toast.show({ type: 'error', text1: 'Invalid Mobile Number', });

    const showPasswordToast = () => Toast.show({ type: 'error', text1: 'Invalid Password!', });

    const validation = () => {
        console.log('validation3');
        if (OTP.length === 4) {
            console.log('validation4');
            loggedUsingSubmitMobileIn();
        }
        else {
            console.log('validation7');
            showErrorToast();
        }
    }

    const loggedUsingSubmitMobileIn = () => {
        serLoader(true);
        var authOptions = {
            method: 'post',
            url: globle.API_BASE_URL + 'verify-otp',
            data: JSON.stringify({ "mobile": Number(email), 'otp': Number(OTP) }),
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
        axios(authOptions)
            .then((response) => {
                if (response.data.status) {
                    console.log('loggedUsingSubmitMobileIn', response.data);
                    serLoader(false);
                    showSuccessToast(response.data);
                } else {
                    console.log('errors', JSON.stringify(response?.data) + '' + JSON.stringify({ "mobile": email, 'otp': OTP }));
                    if (response?.data?.error?.otp[0] !== undefined) {
                        // showSuccessErrorToast(response?.data?.error?.otp[0]);
                        serLoader(false);
                    } else {
                        // message
                        showSuccessErrorToast(response?.data?.message);
                        serLoader(false);
                    }
                }
            })
            .catch((error) => {
                // alert(error)
                console.log('errors', error);
                showSuccessErrorToast(error);
                serLoader(false);
            });
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
        axios(authOptions)
            .then((response) => {
                if (response.data.status) {
                    console.log('loggedUsingMobileIn', response.data);
                    showSuccessToast(response.data.message + '\n your OTP is: ' + response.data.otp);
                } else {
                    console.log('loggedUsingMobileIn', response.data);
                }
            })
            .catch((error) => {
                alert(error)
            });
    }

    return (
        <View style={{ padding: 20, flex: 1 }}>
            <ScrollView style={{ elevation: 5, flex: 1, padding: 20, backgroundColor: '#FFEEBB', borderRadius: 10, marginBottom: 90, top: 55 }}>
                <View style={{ padding: 20, flex: 1, alignItems: 'center' }}>
                    <Image style={{ height: 200, width: 200, resizeMode: 'cover', marginBottom: 20, borderRadius: 150 }} source={require('../../assets/ic_launcher_round.jpg')} />
                </View>
                <View>
                    <OtpInput
                        numberOfDigits={4}
                        focusColor={"green"}
                        focusStickBlinkingDuration={500}
                        onTextChange={(text) => setUserOTP(text)}
                        onFilled={(text) => setUserOTP(text)}
                        textInputProps={{
                            accessibilityLabel: "One-Time Password",
                        }}
                        theme={{
                            containerStyle: styles.container,
                            pinCodeContainerStyle: styles.pinCodeContainer,
                            pinCodeTextStyle: styles.pinCodeText,
                            focusStickStyle: styles.focusStick,
                            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                        }}
                    />
                </View>
                <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ tintColor: 'green', width: 20, height: 20, marginRight: 5 }} source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/8atour/check-box-4.png' }} />
                    <Text style={{ fontSize: 8 }} >by clicking the button you agree with the <Text style={{ fontWeight: 'bold' }}>Terms & Conditions and Privacy Policy</Text></Text>
                </View>
                <TouchableOpacity
                    onPress={loggedUsingMobileIn}
                    style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, right: 2, fontWeight: 'bold' }}
                    >Forget Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: '100%',
                    marginTop: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 14,
                    backgroundColor: 'black',
                    borderRadius: 5,
                    elevation: 6,
                }} onPress={validation}>
                    {loader ? <ActivityIndicator color={'#fff'} size={'small'} /> :
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                        }}>Continue</Text>}
                </TouchableOpacity>
                {/* <View style={{ marginTop: 20, alignSelf: 'flex-end', marginRight: 10 }}>
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => moveToLogin()}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#b4b4b4' }}>Driver Login</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#FE0000', fontWeight: 'bold', fontSize: 10 }}>{errors}</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },
    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },
    container: {

    },
    pinCodeContainer: {

    },
    pinCodeText: {

    },
    focusStick: {

    },
    activePinCodeContainer: {

    },
    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
});

export default OTPSubmitScreen;