/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useEffect } from 'react';
import {
    Alert,
    Animated,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {
    setUpdateIntervalForType,
    SensorTypes,
} from 'react-native-sensors';
import * as geolib from 'geolib';
import Modal from "react-native-modal";
import { Rating, AirbnbRating } from 'react-native-ratings';
import MapViewDirections from 'react-native-maps-directions';
import { ProgressView } from "@react-native-community/progress-view";
// import database from '@react-native-firebase/database';
import MapView, {
    Marker,
    AnimatedRegion
} from 'react-native-maps';
import ToggleSwitch from 'toggle-switch-react-native'
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import imagePath from '../../../common/imagePath';
import { locationPermission, getCurrentLocation } from '../../../common/helperFunction';
import Loader from '../../../common/Loader';
import globle from '../../../common/env';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

setUpdateIntervalForType(SensorTypes.accelerometer, 15);

const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';
const TIMERREFRESH = 5000;
const TIMERREFRESHANIMATE = 8000;
const LATITUDE_DELTA = 0.012;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LONGITUDE_DELTA = 0.012;
let location = null;

const MapsScreens = () => {

    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const navigate = useNavigation();
    const routs = useRoute();
    const [distancex, setDistance] = React.useState(0);
    const [REX, setRex] = React.useState(randomCharacter);
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [compassSpeed, setCompassSpeed] = React.useState(0);
    const [isTraffic, setTraffic] = React.useState(false); // initialize marker rotation to 0 degrees
    const [curLatLong, setLatLong] = React.useState({ latitude: routs?.params?.startPoint?.latitude, longitude: routs?.params?.startPoint?.longitude, heading: 0 });
    const [stopTripEvent, setStopTripEvent] = React.useState(true);
    const [userTargetDistance, setTargetDistance] = React.useState(0);
    const targetLocation = { latitude: 28.5563204, longitude: 77.0362189 };
    const targetRadius = 100; // Radius in meters
    const [loading, setLoading] = React.useState(false);
    let RevertCxtUser = '/users/' + REX;
    const [MarkerNewArray, setNewMarkerArray] = React.useState([]);
    const [MarkerArray, setMarkerArray] = React.useState([
        { "longitude": 77.12749186903238, "latitude": 28.70454119126351, id: 1, profile: 'https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg', age: '25', driver_name: 'Laksmi', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.12502524256706, "latitude": 28.703771304253486, id: 2, profile: 'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg', age: '26', driver_name: 'Manjula', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.1235141530633, "latitude": 28.69960005323217, id: 3, profile: 'https://t4.ftcdn.net/jpg/04/83/56/37/360_F_483563763_SsVFqVsDnfFh2qg4FOJAuIBnYzeHUqNP.jpg', age: '23', driver_name: 'Manjunatha', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.13055830448866, "latitude": 28.703488697249032, id: 4, profile: 'https://static.vecteezy.com/system/resources/previews/000/944/950/non_2x/young-cheerful-indian-auto-rickshaw-driver-photo.jpg', age: '24', driver_name: 'Basavaraja', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.12984718382359, "latitude": 28.69716351165278, id: 5, profile: 'https://fromtheteachersdiary.files.wordpress.com/2016/07/indian-auto-rickshaw-driver-223251801.jpg', age: '32', driver_name: 'Basavaraja', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.12164733558893, "latitude": 28.695808905283172, id: 6, profile: 'https://lh4.ggpht.com/_Xhb-WdFfqdo/TC3MSpUoH5I/AAAAAAAAbu4/zKAzdGU_mMc/IMG_1909-600_thumb.jpg', age: '33', driver_name: 'Laksmamma', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.12788078933954, "latitude": 28.694074007127597, id: 7, profile: 'https://img.mensxp.com/media/content/2020/Feb/This-Kerala-Man-Holds-A-PhD--Also-Rides-An-Auto-Rickshaw1200_5e4d0745d921e.jpeg', age: '34', driver_name: 'Gauramma', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.13030282407999, "latitude": 28.710183719627118, id: 8, profile: 'https://im.indiatimes.in/media/content/2016/May/24bg_bgtki_auto_25_2867258f_1464160387.jpg', age: '31', driver_name: 'Jayamma', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.39414501935244, "latitude": 28.537394367333565, id: 9, profile: 'https://www.shutterstock.com/image-photo/indian-auto-rickshaw-tuttuk-driver-260nw-466234817.jpg', age: '42', driver_name: 'Ratnamma', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.39427175372839, "latitude": 28.53477261705656, id: 10, profile: 'https://static.toiimg.com/thumb/msid-53187442,width-400,resizemode-4/53187442.jpg', age: '33', driver_name: 'Gangamma', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.38872494548559, "latitude": 28.534528140893634, id: 11, profile: 'https://images.citizenmatters.in/wp-content/uploads/sites/3/2021/01/18224336/Chennais-women-drivers-1024x696.jpg', age: '31', driver_name: '', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.3898870125413, "latitude": 28.537586113951185, id: 12, profile: 'https://images.citizenmatters.in/wp-content/uploads/sites/3/2021/01/18225935/women-auto-drivers-1024x768.jpg', age: '41', driver_name: 'Nagamma', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.39055689424276, "latitude": 28.532660677754745, id: 13, profile: 'https://static.toiimg.com/thumb/msid-76223987,width-400,resizemode-4/76223987.jpg', age: '43', driver_name: 'Ramesa', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.39069771021605, "latitude": 28.53381503308665, id: 14, profile: 'https://static.toiimg.com/thumb/msid-72301790,width-400,resizemode-4/72301790.jpg', age: '23', driver_name: 'Nagaraja', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.393705137074, "latitude": 28.533764075590643, id: 15, profile: 'https://img.etimg.com/thumb/msid-51286074,width-480,height-360,imgsize-304130,resizemode-75/costs-rs-2-lakh-only.jpg', age: '45', driver_name: 'Basappa', driver_number: 'KA-01-AE-973' },
        { "longitude": 77.38793704658747, "latitude": 28.536223262138094, id: 16, profile: 'https://images.hindustantimes.com/rf/image_size_640x362/HT/p2/2016/09/02/Pictures/_9ab2cd7a-711b-11e6-afc2-14e084056c80.jpg', age: '22', driver_name: 'Mallappa', driver_number: 'KA-01-AE-973' },
    ]);
    const markerAnimation = React.useRef(new Animated.Value(0)).current;
    const [state, setState] = React.useState({
        curLoc: {
            latitude: routs?.params?.startPoint?.latitude,
            longitude: routs?.params?.startPoint?.longitude,
        },
        destinationCords: {
            latitude: 28.7003405,
            longitude: 77.1830238,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        },
        isLoading: false,
        coordinate: new AnimatedRegion({
            latitude: 28.7003405,
            longitude: 77.1830238,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }),
        inName: routs?.params?.startPoint?.name,
        OutName: routs?.params?.endPoint?.name,
        icon: routs?.params?.startPoint?.icon,
        time: 0,
        distance: 0,
        heading: 0,
    });

    console.log('MapsScreens', routs?.params?.startPoint?.latitude);


    function generateRandomCharacter() {
        const length = 10;
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    };


    function searchNearDriver() {
        let result = geolib.orderByDistance({ latitude: 52.456221, longitude: 12.63128 }, MarkerArray);
        console.log('searchNearDriver', result);
        setNewMarkerArray(result);
    }


    useFocusEffect(
        React.useCallback(() => {
            // console.log('Destinationstate', JSON.stringify(Destinationstate));
            // console.log('Pickupstate', JSON.stringify(Pickupstate));
            searchNearDriver();
            return () => {
                // console.log('addEventListener2', JSON.stringify(route.params.location?.pickup?.destinationCords));
                // Alert.alert('Screen was unfocused');
                // Useful for cleanup functions
            };
        }, [])
    );

    const randomCharacter = generateRandomCharacter();

    const onCenter = () => {
        setModalVisible(!isModalVisible);
        // mapRef.current.animateToRegion({
        //     latitude: state.curLoc.latitude,
        //     longitude: state.curLoc.longitude,
        //     latitudeDelta: LATITUDE_DELTA,
        //     longitudeDelta: LONGITUDE_DELTA
        // })
    }

    async function saveLoation(latitude, longitude, headingx) {

        let userDetails = {
            name: 'Noida To Gurgoan',
            last_update: new Date().getTime(),
            driver_Name: 'Mohit Tahk',
            pick_point_lat: curLatLong.latitude,
            pick_point_lng: curLatLong.longitude,
            drop_point_lat: destinationCords.latitude,
            drop_point_lng: destinationCords.longitude,
            trip_activate: true,
            driver_location: {
                name: REX,
                role: 'Driver',
                latitude: latitude,
                longitude: longitude,
                header: headingx
            }
        }

        database()
            .ref(RevertCxtUser)
            .set(userDetails)
            .then(() => {
                console.log('saveLoation', true);
            });
    }

    function goBackEndTrip() {
        setStopTripEvent(!stopTripEvent);
        console.log('goBackEndTrip', stopTripEvent);
        Alert.alert(
            'End Trip',
            'Are you sure, want end the trip?',
            [
                { text: 'Cancel', onPress: () => setStopTripEvent(true) },
                { text: 'OK', onPress: () => endTrip() },
            ]
        );
    }


    function endTrip() {
        navigate.goBack();
        // const endTrip = {
        //     trip_activate: false,
        // }
        // database()
        //     .ref(RevertCxtUser)
        //     .update(endTrip)
        //     .then(() => {
        //         console.log('endTrip', true);
        //         navigate.goBack();
        //     });
    }

    const onMapPress = (e) => {
        console.log("coordinates:" + JSON.stringify(e.nativeEvent.coordinate));
        let coordinate = e.nativeEvent.coordinate;
        setMarkerArray((MarkerArray) => [
            ...MarkerArray,
            coordinate,
        ]);
        console.log("coordinates:" + JSON.stringify(MarkerArray));
        // this.setState({
        //     marker: [
        //         {
        //             coordinate: e.nativeEvent.coordinate
        //         }
        //     ]
        // });
    }

    const startTrackingTrip = () => {
        setModalVisible(!isModalVisible);
    }

    return (
        <View style={styles.container}>
            <Modal isVisible={isModalVisible}>
                <View style={{ height: Dimensions.get('screen').height - 400, width: Dimensions.get('screen').width - 90, backgroundColor: '#ffffff', alignSelf: 'center', padding: 20, borderRadius: 9 }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image style={{ width: 120, height: 120, resizeMode: 'cover', borderRadius: 100 }} source={{ uri: 'https://img.mensxp.com/media/content/2020/Feb/This-Kerala-Man-Holds-A-PhD--Also-Rides-An-Auto-Rickshaw1200_5e4d0745d921e.jpeg' }} />
                        <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 10 }}>Macline Carlieo</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 10, marginTop: 5 }}>2 years, driving experience</Text>
                        <Rating
                            style={{ marginTop: 5 }}
                            type='star'
                            ratingCount={5}
                            imageSize={15}
                        // onFinishRating={this.ratingCompleted}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center' }}>Driver Details</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', marginRight: 10 }}>From</Text>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>Noida</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', marginRight: 10 }}>To</Text>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>Gurgaon</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', marginRight: 10 }}>Duration</Text>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>40min</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', marginRight: 10 }}>Charges</Text>
                            <Text style={{ flex: 1, fontWeight: 'bold' }}>4560/-</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => startTrackingTrip()} style={{ flex: 1, alignItems: 'center', backgroundColor: '#000', height: 50, padding: 10, borderRadius: 5 }}>
                            <Text style={{ color: '#fff', top: 5, textTransform: 'uppercase' }} >Start Trip</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={{ position: 'absolute', right: 0, top: 0 }}>
                <TouchableOpacity onPress={() => centerLocation()} style={{ position: 'absolute', bottom: 10, right: 10, display: loading === false ? 'none' : 'flex' }}>
                    <Image style={{ height: 55, width: 55, resizeMode: 'contain' }} source={require('../../assets/pointer_picker.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, elevation: 4, display: loading === false ? 'none' : 'flex' }}>
                    <View style={{ backgroundColor: '#000000', width: 40, height: 40, borderRadius: 100 }}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', marginTop: 8 }}>{Math.round(compassSpeed)}</Text>
                        <Text style={{ fontSize: 6, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Kmph</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ position: 'absolute', top: 55, right: 10, elevation: 4, display: loading === false ? 'none' : 'flex' }}>
                    <View style={{ backgroundColor: '#008000', width: 40, height: 40, borderRadius: 100 }}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', marginTop: 6, fontSize: 15 }}>{Math.round(state.distance)}</Text>
                        <Text style={{ fontSize: 7, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Km</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ position: 'absolute', top: 96, right: 10, elevation: 4, display: loading === false ? 'none' : 'flex' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'center', color: '#000000' }}>Traffic {userTargetDistance}</Text>
                    <ToggleSwitch
                        isOn={isTraffic}
                        onColor={'#634fc9'}
                        offColor={'#cc5500'}
                        size={'small'}
                        onToggle={isOn => setTraffic(!isTraffic)}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => goBackEndTrip()} style={{ position: 'absolute', top: 10, left: 10, zIndex: 9999 }}>
                <Image style={{ width: 35, height: 35, resizeMode: 'contain' }} source={require('../../assets/previous.png')} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                <MapView
                    ref={mapRef}
                    style={{ height: height - 0, width: width }}
                    pitchEnabled={true}
                    showScale={true}
                    showsIndoors={true}
                    initialCamera={{
                        center: {
                            latitude: state.curLoc.latitude,
                            longitude: state.curLoc.longitude,
                        },
                        pitch: 45, // Tilt
                        heading: 90, // Bearing
                        zoom: 16,
                    }}
                    onLayout={() => {
                        mapRef.current.animateCamera({
                            center: {
                                latitude: state.curLoc.latitude,
                                longitude: state.curLoc.longitude,
                            },
                            heading: 0,
                            pitch: 90,
                        });
                    }}
                // onPress={(event) => onMapPress(event)}
                >
                    {MarkerArray.map((items) =>
                        <Marker
                            key={items.id}
                            coordinate={{ latitude: items.latitude, longitude: items.longitude }}
                            title={`Near Driver ID ${items.id}`}
                            description={`${JSON.stringify(items)}`}
                        >
                            <Image
                                source={require('../../assets/data/auto_rickshaw.png')}
                                style={{
                                    width: 35,
                                    height: 35,
                                    resizeMode: 'contain',
                                }}
                            />
                        </Marker>
                    )}
                    <Marker
                        key={1}
                        style={{ backgroundColor: '#ccc', }}
                        image={require('../../assets/pin_start.png')}
                        coordinate={state.curLoc}
                        title={"Employee ETA : 20 Min"}
                    />
                </MapView>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                    }}
                    onPress={onCenter}
                >
                    <Image source={imagePath.greenIndicator} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomCard}>
                <Image style={{ width: '100%', height: 6, }} source={require('../../assets/search_driver.gif')} />
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 10, marginTop: 5 }}>Searching for Driver</Text>
                <View>
                    <FlatList
                        style={{ height: 200 }}
                        data={MarkerNewArray}
                        keyExtractor={(e) => e.id}
                        renderItem={(e) => <View style={{ padding: 10, margin: 10, elevation: 5, backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', borderRadius: 6 }}>
                            <Image style={{ width: 80, height: 80, resizeMode: 'cover', borderRadius: 100 }} source={{ uri: e.item?.profile + '' }} />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }} >Name: {e.item?.driver_name}</Text>
                                <Text style={{ fontSize: 10 }}>Plate: {e.item?.driver_number}</Text>
                                <Text style={{ fontSize: 10 }}>Age: {e.item?.age}</Text>
                                <View style={{ alignItems: 'flex-start', marginTop: 5 }}>
                                    <Rating
                                        type='star'
                                        ratingCount={5}
                                        imageSize={15}
                                    // onFinishRating={this.ratingCompleted}
                                    />
                                </View>
                            </View>
                            <Image style={{ width: 50, height: 50, resizeMode: 'contain', position: 'absolute', top: 10, right: 10 }} source={require('../../assets/loader_driver.gif')} />
                        </View>}
                    />
                </View>
            </View>
            <Loader isLoading={state.isLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomCard: {
        backgroundColor: 'white',
        width: '95%',
        paddingTop: 0,
        padding: 15,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24,
        borderBottomEndRadius: 24,
        borderBottomStartRadius: 24,
        marginBottom: 90,
        left: 10,
        elevation: 5,
    },
    inpuStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        height: 48,
        justifyContent: 'center',
        marginTop: 16
    }
});

export default MapsScreens;