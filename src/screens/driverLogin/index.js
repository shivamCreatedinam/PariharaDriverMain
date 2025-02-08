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
import axios from 'axios';

const DriverLoginScreen = () => {

    const navigation = useNavigation();
    const [initializing, setInitializing] = React.useState(true);
    const [secure, setSecure] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [userName, setNameUser] = React.useState();
    const [userMobile, setMobileUser] = React.useState();
    const [user, setUser] = React.useState();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState('');

    // Handle user state changes
    // function onAuthStateChanged(user) {
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    // }

    // React.useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    // }, []);

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);

    const showSuccessToast = () => {
        Toast.show({
            type: 'error',
            text1: 'Register Success',
            text2: 'Welcome to ' + email + '! 👋'
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
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        const strongRegex = new RegExp('.{6,}') // RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
        const name_pattern = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;
        var pattern = new RegExp(/^[0-9\b]+$/);
        console.log('validation3');
        if (reg.test(email) === true) {
            if (strongRegex.test(password)) {
                console.log('validation5Done');
                driverLoginApp();
            } else {
                showErrorToast('Invalid Password, Please enter valid Password!');
            }
        } else {
            showErrorToast('Invalid email, Please enter valid email!');
        }
    }

    const driverLoginApp = () => {
        setLoading(true);
        var authOptions = {
            method: 'post',
            url: globle.API_BASE_URL + 'driver-login',
            data: JSON.stringify({ "email": email, "password": password }),
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
                    storeData(response.data?.driver);
                    showSuccessToast(response.data.message + '\n your OTP is: ' + response.data.otp);
                } else {
                    setLoading(false);
                    showErrorToast(response.data.message);
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
            <View style={{ elevation: 5, flex: 1, padding: 20, backgroundColor: '#FFEEBB', borderRadius: 10, marginBottom: 90, top: 35 }}>
                <View style={{ padding: 20 }}>
                    <Image style={{ height: 120, width: 120, resizeMode: 'cover', alignSelf: 'center', alignItems: 'center', marginLeft: 75, marginBottom: 20, borderRadius: 150 }} source={require('../../assets/ic_launcher_round.jpg')} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Email</Text>
                    <TextInput autoCapitalize="none" autoCorrect={false} placeholder='Enter user Email' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setEmail(e)} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Password</Text>
                    <TextInput placeholder='Enter user password' secureTextEntry={secure} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setPassword(e)} />
                    <Pressable onPress={() => setSecure(!secure)} style={{ position: 'absolute', right: 15, top: 15 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/icons_eye.png')} />
                    </Pressable>
                </View>
                <View
                    style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        style={{ tintColor: 'green', width: 20, height: 20, marginRight: 5 }}
                        source={{ uri: 'https://icons.veryicon.com/png/o/miscellaneous/8atour/check-box-4.png' }} />
                    <Text
                        style={{ fontSize: 8 }} >by clicking the button you agree with the <Text style={{ fontWeight: 'bold' }}>Terms & Conditions and Privacy Policy</Text></Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('DriverForgetPasswordScreen')} style={{ marginTop: 20, alignSelf: 'flex-end', marginRight: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#000000' }}>Forget Password</Text>
                </TouchableOpacity>
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
                    {loading === true ? <ActivityIndicator color={'#ffffff'} size={'small'} /> :
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                        }}>Login</Text>}
                </TouchableOpacity>
                {/* <View style={{ marginTop: 20, alignSelf: 'flex-end', marginRight: 10 }}>
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => moveToRegister()}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#b4b4b4' }}>Sign In</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={{ marginTop: 20 }}>
                    <Text style={{ color: '#FE0000', fontWeight: 'bold', fontSize: 10 }}>{errors}</Text>
                </View>
                {/* <Pressable onPress={() => logOut()}>
                    <Text>Logout</Text>
                </Pressable>
                <View>
                    <Text>Welcome {user?.email}</Text>
                    <Text>Welcome {JSON.stringify(user?.uid)}</Text>
                </View> */}
            </View>
        </View>
    );

};


export default DriverLoginScreen;