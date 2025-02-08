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
    KeyboardAvoidingView
} from 'react-native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
import { Image } from 'react-native-elements';
import { ScrollView } from 'react-native';

const RegisterScreen = () => {

    const navigation = useNavigation();
    const [initializing, setInitializing] = React.useState(true);
    const [secure, setSecure] = React.useState(true);
    const [userName, setNameUser] = React.useState();
    const [userMobile, setMobileUser] = React.useState();
    const [user, setUser] = React.useState();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState('');

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    React.useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

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
        const strongRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
        const name_pattern = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;
        var pattern = new RegExp(/^[0-9\b]+$/);
        const nameRegex = /^[A-Za-z0-9][A-Za-z0-9\s]*$/;
        const stringReg = /^[A-Za-z\u0900-\u097F ]+$/; //only characters regular expression
        const regex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;  //email regular expression
        const regMobile = /^[1-9]{1}[0-9]{9}$/; //telephone regular expression
        const regText = /^[A-Za-z0-9][A-Za-z0-9\s]*$/;
        // console.log('validation3');
        if (stringReg.test(userName) === true) {
            console.log('validation4');
            if (regex.test(email) === true) {
                // console.log('validation5');
                if (regMobile.test(userMobile) === true) {
                    // console.log('mobile valid correct');
                    if (regText.test(password) === true) {
                        // console.log('validation5Done');
                        let updateData = {
                            name: userName,
                            email: email,
                            mobile: userMobile,
                            password: password
                        }
                        navigation.replace('RegisterDriverTwoScreen', updateData);
                    } else if (password?.length < 4) {
                        showErrorToast('Invalid Password, Please enter minimum of 4 chars!');
                    }
                    else {
                        showErrorToast('Invalid Password, Please enter valid Password!');
                    }
                } else {
                    showErrorToast('Invalid Mobile, Please enter valid Mobile Number!');
                }
            } else {
                showErrorToast('Invalid email, Please enter valid email!');
            }
        } else {
            showErrorToast('Invalid name, Please enter valid name!');
        }
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
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                showSuccessToast();
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setErrors('That email address is already in use!');
                }
                if (error.code === 'auth/invalid-email') {
                    setErrors('That email address is invalid!');
                }
            });
    };

    const logOut = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
    }

    const moveToRegister = () => {
        navigation.navigate('LoginScreen');
    }

    return (
        <View style={{ padding: 20, flex: 1, paddingBottom: 20, marginBottom: 20 }}>
            <ScrollView style={{ flex: 1, marginVertical: 20 }}>
                <View style={{ elevation: 5, flex: 1, padding: 20, backgroundColor: '#FFEEBB', borderRadius: 10, marginBottom: 0, top: 35 }} behavior='padding'>
                    <View style={{ padding: 20 }}>
                        <Image style={{ height: 120, width: 120, resizeMode: 'cover', alignSelf: 'center', alignItems: 'center', marginLeft: 75, marginBottom: 20, borderRadius: 150 }} source={require('../../assets/ic_launcher_round.jpg')} />
                    </View>
                    <View style={{ marginTop: 25 }}>
                        <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Full Name</Text>
                        <TextInput autoCapitalize="none" autoCorrect={false} placeholder='Enter user Name' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setNameUser(e)} value={userName} />
                    </View>
                    <View style={{ marginTop: 25 }}>
                        <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Email</Text>
                        <TextInput autoCapitalize="none" autoCorrect={false} placeholder='Enter user Email' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setEmail(e)} value={email} />
                    </View>
                    <View style={{ marginTop: 25 }}>
                        <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Mobile</Text>
                        <TextInput autoCapitalize="none" keyboardType="numeric" autoCorrect={false} placeholder='Enter user Mobile' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setMobileUser(e)} maxLength={10} value={userMobile?.trim()} />
                    </View>
                    <View style={{ marginTop: 25 }}>
                        <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Password</Text>
                        <TextInput placeholder='Enter user password' secureTextEntry={secure} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setPassword(e)} value={password?.trim()} />
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
                    <TouchableOpacity
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
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                        }}>Next</Text>
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>Or</Text>
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            marginTop: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 14,
                            backgroundColor: 'black',
                            borderRadius: 5,
                            elevation: 6,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                        onPress={() => navigation.navigate('DriverLoginScreen')}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            marginLeft: 120,
                            fontSize: 14
                        }}>Login</Text>
                        <Image style={{ width: 12, height: 12, resizeMode: 'contain', tintColor: 'white', marginLeft: 10 }} source={require('../../assets/driver_icon.png')} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ color: '#FE0000', fontWeight: 'bold', fontSize: 10 }}>{errors}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );

};


export default RegisterScreen;