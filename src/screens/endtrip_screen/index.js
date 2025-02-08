/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Pressable,
    View,
    Alert,
    ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { Image, Text } from 'react-native-elements';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapViewDirections from 'react-native-maps-directions';
import MapView, {
    Camera,
    Marker,
    Circle
} from 'react-native-maps';
import cars from '../../assets/data/cars';
import globle from '../../../common/env';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';
const TIMERREFRESH = 5000;
const TIMERREFRESHANIMATE = 8000;
const LATITUDE_DELTA = 0.0012;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LONGITUDE_DELTA = 0.0012;
let location = null;

const EndStartScreen = () => {

    const navigate = useNavigation();
    const route = useRoute();
    const numColumns = 2;
    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const [data, setData] = React.useState([]);
    const [Cardata, setCarData] = React.useState(cars);
    const [tripPrice, setTripPrice] = React.useState(0);
    const [Endname, setEndName] = React.useState([]); // React.useState(route.params.location?.pickup?.destinationCords.name);
    const [StartName, setStartName] = React.useState([]); //React.useState(route.params.location?.drop?.dropCords.name);
    const [Time, setTime] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [Distance, setDistance] = React.useState('');
    const [markerIcon, serMarkerIcon] = React.useState([]); // React.useState(route.params.location?.drop?.dropCords.icon);
    // const [latilong, setLatLong] = React.useState({ latitude: route.params?.location?.drop?.destinationCords?.latitude, longitude: route.params?.location?.drop?.destinationCords?.longitude });
    const [Destinationstate, setDestinationState] = React.useState(null); //(route.params.location?.drop?.dropCords);
    const [Pickupstate, setPickupState] = React.useState(null); //React.useState(route.params.location?.pickup?.destinationCords);

    React.useEffect(() => {
        // console.log('addEventListener1', JSON.stringify(route.params?.location));
        return () => {
            // console.log('addEventListener2', JSON.stringify(route.params?.drop));
        };
    }, [false]);

    useFocusEffect(
        React.useCallback(() => {
            // console.log('Destinationstate', JSON.stringify(Destinationstate));
            getAllTripData();
            // console.log('Pickupstate', JSON.stringify(Pickupstate));
            return () => {
                // console.log('addEventListener2', JSON.stringify(route.params.location?.pickup?.destinationCords));
                // Alert.alert('Screen was unfocused');
                // Useful for cleanup functions
            };
        }, [])
    );

    const getPriceFromWeb = async () => {
        // Optionally the request above could also be done as
        setLoading(true)
        var authOptions = {
            method: 'GET',
            url: globle.API_BASE_URL + 'getPrice',
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions).then((resp) => {
            console.log(resp.data.data?.value);
            setTripPrice(resp.data.data?.value);
            setLoading(true);
        });
    }

    // create trip
    const createNewTripForCustomer = async () => {
        const valueX = await AsyncStorage.getItem('@autoEndTrip');
        const valueXX = await AsyncStorage.getItem('@fromTrip');
        let to_location = JSON.parse(valueX);
        let from_location = JSON.parse(valueXX);

        const pickup_point = {
            latitude: from_location?.lat,
            longitude: from_location?.lng
        }
        const drop_point = {
            latitude: to_location?.latitude,
            longitude: to_location?.longitude
        }
        var formdata = new FormData();
        formdata.append('from_address', pickup_point);
        formdata.append('to_address', drop_point);

        formdata.append('from_state', '1');
        formdata.append('from_city', '1');

        formdata.append('to_state', '1');
        formdata.append('to_city', '1');

        formdata.append('to_pincode', '123123');
        formdata.append('from_pincode', '123123');

        formdata.append('to_lat', to_location?.latitude);
        formdata.append('to_long', to_location?.longitude);

        formdata.append('from_lat', from_location?.lat);
        formdata.append('from_long', from_location?.lng);

        formdata.append('price', '');
        formdata.append('distance', Distance);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('uploadProfile', requestOptions)
        fetch(globle.API_BASE_URL + 'travel-request', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('uploadProfileX', result)
                if (result.status) {
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
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

    const getAllTripData = async () => {
        const valueX = await AsyncStorage.getItem('@autoEndTrip');
        const valueXX = await AsyncStorage.getItem('@fromTrip');
        let to_location = JSON.parse(valueX);
        let from_location = JSON.parse(valueXX);

        const pickup_point = {
            latitude: from_location?.lat,
            longitude: from_location?.lng
        }
        const drop_point = {
            latitude: to_location?.latitude,
            longitude: to_location?.longitude
        }
        setPickupState(pickup_point);
        setDestinationState(drop_point);
        console.log('getAllTripData_F', pickup_point);
        console.log('getAllTripData_T', drop_point);
        getPriceFromWeb();
    }

    const GridItem = (item) => (
        <Pressable style={styles.item}>
            <View style={{ position: 'absolute', right: 5, top: 5, display: item.item.selected === true ? 'flex' : 'none' }}>
                <Image style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: 'green' }} source={require('../../assets/right_check.png')} />
            </View>
            <Text style={{ fontWeight: 'bold', color: 'black', position: 'absolute', left: 10, top: 5 }}>{item.item.type}</Text>
            <Image style={{ height: 110, width: 135, resizeMode: 'contain', marginTop: 15 }} source={require('../../assets/cars/UberX.jpeg')} />
        </Pressable>
    );

    const calculateDistance = (dis) => {
        let distance = dis;
        let price = tripPrice;
        const mePrice = Number(distance) * Number(price)
        return mePrice;
    }

    const displaytime = (time) => {
        var value = time;
        // value = value.toFixed(2);
        return value
    }

    const ConTwoDecDigit = (digit) => {
        return digit.indexOf(".") > 0 ?
            digit.split(".").length >= 2 ?
                digit.split(".")[0] + "." + digit.split(".")[1].substring(-1, 2)
                : digit
            : digit
    }

    const fetchTime = (d, t) => {
        setTime(t);
        setDistance(d);
        // updateState({
        //     distance: d,
        //     time: t
        // })
    }

    const fetchPickupCords = (locations) => {
        setPickupState({
            ...Pickupstate,
            pickupCords: {
                latitude: locations?.geometry?.location?.lat,
                longitude: locations?.geometry?.location?.lng,
                name: locations?.name,
                icon: locations?.icon,
            }
        })
        onCenterx(locations?.geometry?.location?.lat, locations?.geometry?.location?.lng);
    }

    const onCenterx = (lati, long) => {
        mapRef.current.animateToRegion({
            latitude: lati,
            longitude: long,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        });
        setLatLong({
            latitude: lati,
            longitude: long,
        })
        setDestinationState({
            destinationCords: {
                latitude: lati,
                longitude: long,
            }
        })
    }

    const onPressHandler = () => {
        let locationData = {
            startPoint: Destinationstate,
            endPoint: Pickupstate,
        }
        console.log('onPressHandler', JSON.stringify(locationData));
        navigate.navigate('MapScreens', locationData);
    }

    function goBackEndTrip() {
        Alert.alert(
            'End Trip',
            'Are you sure, want end the trip?',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => navigate.goBack() },
            ]
        );
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.containerX}>
            <Pressable onPress={() => goBackEndTrip()} style={{ position: 'absolute', top: 35, left: 10, zIndex: 9999 }} >
                <Image style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: 'green' }} source={require('../../assets/previous.png')} />
            </Pressable>
            {loading ? <View>
                <MapView
                    ref={mapRef}
                    style={{ height: height - 0, width: width }}
                    pitchEnabled={true}
                    initialRegion={{
                        ...Pickupstate,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                    onLayout={() => { }}
                >
                    {Object.keys(Destinationstate) !== null && (<MapViewDirections
                        origin={Pickupstate}
                        destination={Destinationstate}
                        apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                        strokeWidth={4}
                        strokeColor="green"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            fetchTime(result.distance, result.duration),
                                console.log(JSON.stringify(result)),
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: 30,
                                        bottom: 300,
                                        left: 30,
                                        top: 100,
                                    },
                                });
                        }}
                        onError={(errorMessage) => {
                            // console.log('GOT AN ERROR');
                        }}
                    />)}
                </MapView>
            </View> : <ActivityIndicator style={{ alignItems: 'center', marginTop: width / 1.5 }} size={'large'} color={'red'} />}
            {/* <View>
                <MapView
                    ref={mapRef}
                    style={{ height: height - 0, width: width }}
                    pitchEnabled={true}
                    initialRegion={{
                        ...Pickupstate,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                    onLayout={() => { }}
                >{Object.keys(Destinationstate).length > 0 && (<MapViewDirections
                    origin={Pickupstate}
                    destination={Destinationstate}
                    apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                    strokeWidth={4}
                    strokeColor="green"
                    optimizeWaypoints={true}
                    onStart={(params) => {
                        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                    }}
                    onReady={result => {
                        fetchTime(result.distance, result.duration),
                            mapRef.current.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    right: 30,
                                    bottom: 300,
                                    left: 30,
                                    top: 100,
                                },
                            });
                    }}
                    onError={(errorMessage) => {
                        // console.log('GOT AN ERROR');
                    }}
                />)}
                    <Marker
                        coordinate={Pickupstate}
                        image={markerIcon}
                    />
                    <Marker
                        coordinate={Destinationstate}
                        image={markerIcon}
                    />
                    <Circle
                        key={1}
                        center={Pickupstate}
                        radius={100}
                        options={{
                            strokeColor: "#66009a",
                            strokeOpacity: 0.2,
                            strokeWeight: 2,
                            fillColor: `#66009a`,
                            fillOpacity: 0.1,
                            zIndex: 1
                        }}
                    />
                </MapView>
            </View> */}
            <View style={styles.innerContainer}>
                <View >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={{ uri: 'https://www.pngkey.com/png/full/13-137571_map-marker-png-hd-marker-icon.png' }} />
                        <Text>Noida{Endname}</Text>
                        <View style={{ flex: 1, marginLeft: 20, marginRight: 20, borderBottomWidth: 2, borderStyle: 'dotted' }} />
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: 'green' }} source={{ uri: 'https://www.pngkey.com/png/full/13-137571_map-marker-png-hd-marker-icon.png' }} />
                        <Text>Gurugram{StartName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../assets/time_icon.png')} />
                        <Text>{displaytime(Time)} Min</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3313/3313915.png' }} />
                        <Text>{Distance} Km</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/32/32815.png' }} />
                        <Text>Cost {calculateDistance(Distance)}/-</Text>
                        <Image style={{ height: 12, width: 12, resizeMode: 'contain', marginRight: 10 }} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/32/32815.png' }} />
                    </View>
                </View>
                <TouchableOpacity onPress={() => onPressHandler()} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Search Driver</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    imageMarker: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    container: {
        flex: 1,
    },
    textInputContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    textInput: {
        marginLeft: 0,
        marginRight: 0,
        height: 38,
        color: '#5d5d5d',
        fontSize: 16,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        marginLeft: 20,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 14,
        marginTop: 10,
        backgroundColor: 'black',
        borderRadius: 5,
        elevation: 6,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    containerX: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    innerContainer: {
        padding: 20,
        height: 250,
        width: Dimensions.get('screen').width - 20,
        backgroundColor: 'white',
        flexGrow: 1,
        borderRadius: 10,
        elevation: 5,
        marginBottom: 30,
        position: 'absolute',
        bottom: 30,
        left: 10,
        zIndex: 999,
    }, item: {
        flex: 1,
        aspectRatio: 1,
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        elevation: 5,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
});

export default EndStartScreen;