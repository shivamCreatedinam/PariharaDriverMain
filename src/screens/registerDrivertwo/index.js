/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    Alert
} from 'react-native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import globle from '../../../common/env';
import Modal from 'react-native-modal';

const RegisterDriverTwoScreen = () => {

    const navigation = useNavigation();
    const routes = useRoute();
    const [initializing, setInitializing] = React.useState(true);
    const [secure, setSecure] = React.useState(true);
    const [user, setUser] = React.useState();
    const [VehicleNumber, setVehicleNumber] = React.useState('');
    const [AadharNumber, setAadharNumber] = React.useState('');
    const [Address, setAddress] = React.useState();
    const [DrivingLicence, setDrivingLicence] = React.useState('');
    const [InsuranceLicence, setInsuranceLicence] = React.useState('');
    const [AadharFront, setAadharFront] = React.useState('');
    const [AadharBack, setAadharBack] = React.useState('');
    const [PollusionCertificate, setPollusionCertificate] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [uploadProfile, setuploadProfile] = React.useState(null);
    const [errors, setErrors] = React.useState('');
    const [location, setLocation] = React.useState({ latitude: 60.1098678, longitude: 24.7385084, });
    const [isModalVisible, setModalVisible] = useState(false);

    const handleLocationPermission = async () => {
        // let permissionCheck = '';
        // if (Platform.OS === 'ios') {
        //     permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

        //     if (permissionCheck === RESULTS.DENIED) {
        //         const permissionRequest = await request(
        //             PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        //         );
        //         permissionRequest === RESULTS.GRANTED ? console.warn('Location permission granted.') : console.warn('Location perrmission denied.');
        //     }
        // }

        // if (Platform.OS === 'android') {
        //     permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        //     if (permissionCheck === RESULTS.DENIED) {
        //         const permissionRequest = await request(
        //             PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        //         );
        //         permissionRequest === RESULTS.GRANTED
        //             ? console.warn('Location permission granted.')
        //             : console.warn('Location perrmission denied.');
        //     }
        // }
    };
    const ImagePickerModal = ({ isVisible, onClose, onCameraPress, onGalleryPress }) => {
        return (
            <Modal isVisible={isVisible}>

                <View style={{ alignSelf: 'center', justifyContent: 'center', backgroundColor: '#fff', width: '90%', height: '28%', borderRadius: 10, alignItems: 'center' }}>
                    <TouchableOpacity style={{ display: 'flex', alignSelf: 'flex-end', right: 25 }} onPress={onClose}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'cover', alignSelf: 'center', alignItems: 'center' }} source={require('../../assets/cross.png')} />
                    </TouchableOpacity>
                    <Text style={{ fontWeight: '700', color: '#000' }}>Select an image source</Text>
                    <TouchableOpacity onPress={onCameraPress} style={{ borderRadius: 10, padding: 7, borderColor: "#000", width: '50%', borderWidth: 1, justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
                        <Text style={{ justifyContent: 'center', alignSelf: 'center' }}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onGalleryPress} style={{ borderRadius: 10, padding: 7, borderColor: "#000", width: '50%', borderWidth: 1, justifyContent: 'center', alignSelf: 'center', marginTop: 15 }}>
                        <Text style={{ justifyContent: 'center', alignSelf: 'center' }}>Gallery</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity >
                        <Text>Cancel</Text>
                    </TouchableOpacity> */}
                </View>
            </Modal>
        );
    };


    React.useEffect(() => {
        // handleLocationPermission();
    }, []);

    // React.useEffect(() => {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;
    //             setLocation({ latitude, longitude });
    //         },
    //         (error) => {
    //             console.log(error.code, error.message);
    //         },
    //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    //     );
    // }, []);

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    React.useEffect(() => {
        requestPermission();
    }, []);

    const requestPermission = async () => {
        try {
            const cameraPermission = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            const storagePermission = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            );

            if (cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
                storagePermission === PermissionsAndroid.RESULTS.GRANTED) {
                // Permissions granted, you can now access the camera and gallery.
            } else {
                // Handle permission denied by the user.
            }
        } catch (err) {
            console.error(err);
        }

        // try {
        //     console.log('asking for permission')
        //     const granted = await PermissionsAndroid.requestMultiple(
        //         [PermissionsAndroid.PERMISSIONS.CAMERA,
        //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
        //     )
        //     if (granted['android.permission.CAMERA'] && granted['android.permission.WRITE_EXTERNAL_STORAGE']) {
        //         console.log("You can use the camera");
        //     } else {
        //         console.log("Camera permission denied");
        //     }
        // } catch (error) {
        //     console.log('permission error', error)
        // }
    }

    // React.useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    // }, []);

    // React.useEffect(() => {
    //     // AppState.addEventListener('change', _handleAppStateChange);
    //     return () => {
    //         // console.log('addEventListener');
    //     };
    // }, [false]);

    const showSuccessToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Register Success',
            text2: 'Welcome to ' + email + '! 👋'
        });
    }

    const showPasswordToast = () => Toast.show({ type: 'error', text1: 'Invalid Password!', });

    const showErrorToast = (msg) => {
        Toast.show({
            type: 'error',
            text1: 'Something went wrong!',
            text2: msg
        });
    }

    const validation = () => {
        console.log('validation1');
        let reg = new RegExp(/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/);
        console.log('validation2');
        const strongRegex = /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/
        console.log('validation3');
        if (VehicleNumber.length > 3) {
            console.log('validation4');
            if (strongRegex.test(AadharNumber)) {
                console.log('validation5');
                // if (Address?.length === null || Address?.length === 0) {
                //     showErrorToast('Please Enter Valid Address!');
                // }
                if (AadharBack !== null) {
                    if (AadharFront !== null) {
                        if (DrivingLicence !== null) {
                            if (InsuranceLicence !== null) {
                                moveToRegister();
                            } else {
                                showErrorToast('Upload Correct Insurance Image');
                            }
                        } else {
                            showErrorToast('Upload Correct Driving Licence Image');
                        }
                    } else {
                        showErrorToast('Upload Correct Aadhar Card Front Image');
                    }
                } else {
                    showErrorToast('Upload Aadhar Card Back Image');
                }
            } else if (AadharNumber?.length !== 12) {
                showErrorToast('Please Enter Valid Aadhar Number!');
            }
            else {
                console.log('validation6');
                showErrorToast('Enter Correct Aadhar Card Number');
            }
        } else {
            console.log('validation7');
            showErrorToast('Enter Correct Vehicle Number');
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



    const uplodDrivingCard = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setDrivingLicence(image.path)
        });
    }

    const openGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);
            setDrivingLicence(image.path)
        });
    }

    const uplodPollusionCertificateCard = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setPollusionCertificate(image.path);
        });
    }

    const uplodAadharFrontCard = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setAadharFront(image.path);
        });
    }

    const uplodAadharBackCard = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setAadharBack(image.path);
        });
    }

    const uplodProfilePhotoCard = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setuploadProfile(image.path)
        });
    }

    const moveToRegister = () => {

        var formdata = new FormData();
        formdata.append('mobile', routes.params.mobile);
        formdata.append('email', routes.params.email);
        formdata.append('name', routes.params.name);
        formdata.append('vehicle_no', VehicleNumber);
        formdata.append('address', Address);
        formdata.append('latitude', location.latitude);
        formdata.append('longitude', location.longitude);
        formdata.append('password', routes.params.password);
        formdata.append("aadhar_front", { uri: AadharFront, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        formdata.append("aadhar_back", { uri: AadharBack, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        formdata.append("drv_licence", { uri: DrivingLicence, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });// insurence_file
        formdata.append("insurence_file", { uri: PollusionCertificate, name: 'file_insurence_file.png', filename: 'file_insurence_file.png', type: 'image/png' });
        console.log("formdata", JSON.stringify(formdata))
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch(globle.API_BASE_URL + 'driver-signup', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('uploadProfile', result)
                if (result.status) {
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.name + ' \n ' + result?.message,
                    });
                    saveAndReplace();
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            })
            .catch(error => console.log('error', error));
    }

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('@autoDriverType', 'Driver');
            await AsyncStorage.setItem('@autoDriverGroup', jsonValue);
            navigation.navigate('UserBottomNavigation');
        } catch (e) {
            // saving error
        }
    };

    const saveAndReplace = async () => {
        navigation.replace('DriverLoginScreen');
    }

    return (
        <View style={{ padding: 20, flex: 1, marginTop: 20 }}>
            <View style={{ elevation: 5, flex: 1, padding: 20, backgroundColor: '#FFEEBB', borderRadius: 10, marginBottom: 20 }}>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => uplodProfilePhotoCard()}>
                    {uploadProfile !== null ?
                        <Image style={{ height: 110, width: 110, resizeMode: 'cover', alignSelf: 'center', alignItems: 'center', marginLeft: 5, marginBottom: 20, borderRadius: 150 }} source={{ uri: uploadProfile }} /> :
                        <Image style={{ height: 110, width: 110, resizeMode: 'contain', alignSelf: 'center', alignItems: 'center', marginLeft: 5, marginBottom: 20, borderRadius: 150 }} source={require('../../assets/profile_man.png')} />}
                    <View style={{ position: 'absolute', right: 0 }}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../../assets/camera.png')} />
                    </View>
                </TouchableOpacity>
                <View style={{ marginTop: 5 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Vehicle No</Text>
                    <TextInput autoCapitalize='characters' placeholder='XX99XX9999' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setVehicleNumber(e)} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Aadhar Number</Text>
                    <TextInput inputMode='numeric' placeholder='####-####-####' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setAadharNumber(e)} maxLength={12} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Address</Text>
                    <TextInput autoCapitalize="none" autoCorrect={false} placeholder='Enter driver address' style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10 }} onChangeText={(e) => setAddress(e)} value={Address} />
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Driving Licence</Text>
                    <TextInput placeholder='Upload Driving Licence' defaultValue={DrivingLicence} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10, paddingRight: 40 }} editable={false} />
                    <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)} style={{ position: 'absolute', right: 15, top: 15, backgroundColor: '#FFEEBB' }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/camera.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Vehicle Registration Certificate (VRC)</Text>
                    <TextInput placeholder='Vehicle Registration Certificate (VRC)' defaultValue={AadharFront} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10, paddingRight: 40 }} editable={false} />
                    <TouchableOpacity onPress={() => uplodAadharFrontCard()} style={{ position: 'absolute', right: 15, top: 15 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/camera.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Pollution Certificate (PC)</Text>
                    <TextInput placeholder='Pollution Certificate (PC)' defaultValue={PollusionCertificate} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10, paddingRight: 40 }} editable={false} />
                    <TouchableOpacity onPress={() => uplodPollusionCertificateCard()} style={{ position: 'absolute', right: 15, top: 15 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/camera.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 25 }}>
                    <Text style={{ fontSize: 10, position: 'absolute', backgroundColor: '#FFEEBB', padding: 3, marginTop: -15, zIndex: 999, left: 2 }}>Vehicle Insurance</Text>
                    <TextInput placeholder='Vehicle Insurance' defaultValue={AadharBack} style={{ borderWidth: 1, borderColor: '#b4b4b4', borderRadius: 4, padding: 10, paddingRight: 40 }} editable={false} />
                    <TouchableOpacity onPress={() => uplodAadharBackCard()} style={{ position: 'absolute', right: 15, top: 15 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/camera.png')} />
                    </TouchableOpacity>
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
                    onPress={() => validation()}>
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                    }}>Register Driver</Text>
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
                <ImagePickerModal
                    isVisible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    onCameraPress={uplodDrivingCard}
                    onGalleryPress={openGallery}
                />
            </View>
        </View>
    );

};


export default RegisterDriverTwoScreen;