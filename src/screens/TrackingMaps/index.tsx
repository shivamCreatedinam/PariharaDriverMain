//@ts-nocheck
import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform,
    Pressable,
    Image,
    Alert,
} from "react-native";
import MapView, {
    Marker,
    AnimatedRegion,
    Polyline,
    PROVIDER_GOOGLE,
} from "react-native-maps";
import haversine from "haversine";
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import globle from '../../../common/env';
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;

const mapDarkStyle = [
    {
        elementType: "geometry",
        stylers: [
            {
                color: "#212121",
            },
        ],
    },
    {
        elementType: "labels.icon",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#212121",
            },
        ],
    },
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#9e9e9e",
            },
        ],
    },
    {
        featureType: "administrative.land_parcel",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#bdbdbd",
            },
        ],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
            {
                color: "#181818",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#616161",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#1b1b1b",
            },
        ],
    },
    {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#2c2c2c",
            },
        ],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#8a8a8a",
            },
        ],
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
            {
                color: "#373737",
            },
        ],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
            {
                color: "#3c3c3c",
            },
        ],
    },
    {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [
            {
                color: "#4e4e4e",
            },
        ],
    },
    {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#616161",
            },
        ],
    },
    {
        featureType: "transit",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            {
                color: "#000000",
            },
        ],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#3d3d3d",
            },
        ],
    },
];

export default class MapComponent extends React.Component {

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true,
            TripOtp: this.props?.route?.params?.data?.trip_otp,
            DriverName: this.props?.route?.params?.data?.drivername,
            DriverImage: this.props?.route?.params?.data?.drv_image,
            DriverVehicleNo: this.props?.route?.params?.data?.vehicle_no,
            latitude: 28.6987867,
            longitude: 77.2047205,
            routeCoordinates: [],
            tripEndPoint: {
                latitude: 28.752041,
                longitude: 77.2008786,
            },
            distanceTravelled: 0,
            Distance: '',
            Duration: '',
            prevLatLng: {},
            heading: 0,
            coordinate: new AnimatedRegion({
                latitude: 28.6987867,
                longitude: 77.2047205,
                latitudeDelta: 0,
                longitudeDelta: 0,
            }),
            driver_location: {
                latitude: 0,
                longitude: 0,
            },
            region: new AnimatedRegion({
                latitude: 28.6987867,
                longitude: 77.2047205,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }),
        };
        // this.marker = React.createRef();
    }

    componentDidMount() {
        this.getTripDetails();
        const { coordinate } = this.state;
        this.watchID = Geolocation.watchPosition(
            position => {
                const { routeCoordinates, distanceTravelled } = this.state;
                const { latitude, longitude, heading } = position.coords;

                const newCoordinate = {
                    latitude,
                    longitude,
                };

                if (Platform.OS === "android") {
                    if (this.marker) {
                        this.marker.animateMarkerToCoordinate(
                            newCoordinate,
                            1200,
                        );
                    }
                } else {
                    coordinate.timing(newCoordinate).start();
                }

                this.setState({
                    latitude,
                    longitude,
                    heading,
                    routeCoordinates: routeCoordinates.concat([newCoordinate]),
                    distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
                    prevLatLng: newCoordinate,
                });
            },
            error => console.log(error),
            {
                enableHighAccuracy: false,
                // timeout: 20000,
                maximumAge: 1000,
                // distanceFilter: 0
            }
        );
        this.startTracking();
        setInterval(() => {
        }, 6000);
    }


    startTracking = async () => {
        // Set up a listener for your Firebase database reference
        // const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        // let data = JSON.parse(valueX);
        // console.log(data?.id);
        // // const driverData = {
        // //     lattitude: lattitude,
        // //     longitude: longitude,
        // // }
        let reff = '/tracking/' + 1 + '';
        database().ref(reff).on('value', (snapshot) => {
            // Update the component state with the fetched data
            let data = snapshot.val();
            console.log('------>', JSON.stringify(data));
            this.animateMarker(data?.location?.lattitude, data?.location?.longitude)
            // this.setState({
            //     coordinate: new AnimatedRegion({
            //         latitude: data?.location?.lattitude,
            //         longitude: data?.location?.longitude,
            //         latitudeDelta: LATITUDE_DELTA,
            //         longitudeDelta: LONGITUDE_DELTA,
            //     })
            // })
            console.log('location_has_been_update', JSON.stringify(data?.location?.longitude));
        });
    }

    animateMarker = (Lt, Ln) => {
        const newCoordinate = {
            latitude: Lt,
            longitude: Ln,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };

        // if (Platform.OS === 'android') {
        //     if (this.marker) {
        //         this.marker.animateMarkerToCoordinate(newCoordinate, 15000);
        //     }
        // } else {
        //     coordinate.timing(newCoordinate).start();
        // }
    };

    // animateMarkerToLocation = (latitude, longitude) => {
    //     Animated.timing(this.state?.coordinate, {
    //         toValue: { latitude, longitude },
    //         duration: 1000, // Animation duration in milliseconds
    //         useNativeDriver: false, // Set to true if possible for better performance
    //     }).start();
    // };

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchID);
    }

    // getMapRegion = () => ({
    //     latitude: this.state.latitude,
    //     longitude: this.state.longitude,
    //     latitudeDelta: LATITUDE_DELTA,
    //     longitudeDelta: LONGITUDE_DELTA
    // });

    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };

    onCenter = (latitude: any, longitude: any) => {
        console.log('onCenter-------------->')
        this.mapRef?.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    goBackEndTrip() {
        Alert.alert(
            'Go To Background',
            'Are you sure, want go Background, Tracking enable in background.',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => this.checkOrBack() },
            ]
        );
    }

    checkOrBack = async () => {
        const autoUserGroup = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(autoUserGroup);
        console.log('checkOrBack', JSON.stringify(data));
        this.props.navigation.navigate('UserHomeScreen');
    }

    getTripDetails = async () => {
        console.log('Tracking_Start', JSON.stringify(this.props?.route?.params?.data));
        const autoUserGroup = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(autoUserGroup)?.token;
        const valueX = await AsyncStorage.getItem('@autoEndTrip');
        const valueXX = await AsyncStorage.getItem('@fromTrip');
        let to_location = JSON.parse(valueX);
        let from_location = JSON.parse(valueXX);
        const pickup_point = {
            latitude: from_location?.latitude,
            longitude: from_location?.longitude
        }
        const drop_point = {
            latitude: to_location?.latitude,
            longitude: to_location?.longitude
        }
        console.log('getTripDetails', pickup_point);
        console.log('getTripDetails', drop_point);
        this.setState({
            latitude: from_location?.latitude,
            longitude: from_location?.longitude,
            tripEndPoint: {
                latitude: to_location?.latitude,
                longitude: to_location?.longitude,
            }, coordinate: new AnimatedRegion({
                latitude: from_location?.latitude,
                longitude: from_location?.longitude,
                latitudeDelta: 0,
                longitudeDelta: 0,
            }),
            loading: false,
        })
    }

    handleOnMapsPress = () => {
        if (Platform.OS === 'ios') {
            //  Linking.openURL('maps://app?saddr=' + startinPointName + '&daddr=' + endingPointName+'&travelmode=car')
            // startTrip();
            // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + 'Office to Home ')
        }
        if (Platform.OS === 'android') {
            // startTrip();
            // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + DATA[1].name + DATA[2].name)
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <Pressable onPress={() => this.goBackEndTrip()} style={{ position: 'absolute', top: 50, left: 10, zIndex: 9999 }} >
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: 'white' }} source={require('../../assets/previous.png')} />
                </Pressable>
                <MapView
                    ref={mapRef => (this.mapRef = mapRef)}
                    // style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    showUserLocation
                    followUserLocation
                    loadingEnabled
                    // customMapStyle={mapDarkStyle}
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}>
                    <MapViewDirections
                        origin={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                        destination={this.state?.tripEndPoint}
                        apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                        mode={'DRIVING'}
                        strokeWidth={6}
                        strokeColor="green"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            this.setState({
                                Distance: result.distance,
                                Duration: result.duration,
                            });
                        }}
                        onError={(errorMessage) => {
                            console.log('GOT_AN_ERROR', JSON.stringify(errorMessage));
                        }}
                    />
                    {/* <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} strokeColor="green" /> */}
                    <Marker coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}>
                        <Image style={{
                            width: 55,
                            height: 55,
                        }} source={require('../../assets/user_icon.png')} />
                    </Marker>
                    <Marker coordinate={this.state?.tripEndPoint}>
                        <Image style={{
                            width: 55,
                            height: 55,
                        }} source={require('../../assets/end_icon.png')} />
                    </Marker>
                    <Marker.Animated
                        ref={marker => (this.marker = marker)}
                        coordinate={this.state?.coordinate}>
                        <Image
                            source={require('../../assets/data/auto_rickshaw.png')}
                            style={{
                                width: 45,
                                height: 45,
                                resizeMode: 'contain',
                                transform: [{ rotate: `${this.state.heading}deg` }],
                            }}
                        />
                    </Marker.Animated>
                </MapView>
                <View style={{ position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#ffffff', borderRadius: 10, elevation: 5 }}>
                    <View style={{ padding: 20, alignItems: 'flex-end', flexDirection: 'row', }}>
                        <Text style={{ flex: 1, alignItems: 'center', marginBottom: 5, fontWeight: 'bold', color: 'grey' }}>SHARE OTP WITH DRIVER TO START TRIP</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, borderColor: 'grey', borderWidth: 1, padding: 7, borderRadius: 5, letterSpacing: 5 }}>{this.state.TripOtp}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginLeft: 10, marginRight: 10 }}>
                        <View style={{ flex: 1, marginBottom: 2 }}>
                            <Image style={{ height: 50, width: 50, borderRadius: 150, resizeMode: 'contain', marginLeft: 7 }} source={{ uri: globle.IMAGE_BASE_URL + this.state?.DriverImage }} />
                            <Text style={{ fontWeight: 'bold' }}>{this.state.DriverName}</Text>
                            <Text style={{ fontWeight: 'bold' }}>{this.state.DriverVehicleNo}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.handleOnMapsPress()} style={{}}>
                            <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('../../assets/map_icon.png')} />
                            <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'center' }}>Open Map</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={{ position: 'absolute', top: 150, right: 10, backgroundColor: '#fff', padding: 10, borderRadius: 150 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                        {parseFloat(this.state.distanceTravelled).toFixed(2)} km
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    bubble: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.7)",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20
    },
    latlng: {
        width: 200,
        alignItems: "stretch"
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10
    },
    buttonContainer: {
        position: 'absolute',
        width: '90%',
        zIndex: 9999,
        bottom: 120,
        left: 20,
    }
});