/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    View,
    Alert,
    Animated,
    Platform,
    StyleSheet,
    Text,
    Dimensions,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import database from '@react-native-firebase/database';
import MapView, {
    Camera,
    Marker,
    AnimatedRegion
} from 'react-native-maps';
import imagePath from '../../../common/imagePath';
import Loader from '../../../common/Loader';
import globle from '../../../common/env';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height; 
const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION'; 
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = 0.005;

const TrackingMapsScreen = () => {

    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const routes = useRoute();
    const navigate = useNavigation();
    const [dataInfo, setInfoData] = React.useState({});
    const [TripStatus, setTripStatus] = React.useState(0);
    const markerAnimation = React.useRef(new Animated.Value(0)).current;


    console.log('TrackingMapsScreen', JSON.stringify(routes.params?.pick_point_lat));

    React.useEffect(() => {
        const dataRef = database().ref('/users/' + routes.params.driver_location?.name + '/driver_location/');
        dataRef.on('value', snapshot => {
            const newData = [];
            snapshot.forEach(childSnapshot => {
                newData.push(childSnapshot.val());
            });
            setInfoData(snapshot.val());
            setTripStatus(1);
        });

        return () => {
            dataRef.off(); // Clean up the listener when the component unmounts
        };
    }, []);

    React.useEffect(() => {
        if (TripStatus > 0) {
            onCenter();
        }
    }, [dataInfo]);


    const onCenter = () => {
        mapRef.current.animateToRegion({
            latitude: dataInfo.latitude,
            longitude: dataInfo.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    const goBackEndTrip = () => {
        navigate.goBack();
    }


    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => goBackEndTrip()} style={{ position: 'absolute', top: 10, left: 10, zIndex: 9999 }}>
                <Image style={{ width: 35, height: 35, resizeMode: 'contain' }} source={require('../../assets/previous.png')} />
            </TouchableOpacity>
            <Text> TrackingMapsScreen {dataInfo.name} </Text>
            {dataInfo.latitude !== undefined ?
                <View>
                    <MapView
                        ref={mapRef}
                        style={{ height: height - 0, width: width }}
                        pitchEnabled={true}
                        initialRegion={{
                            latitude: dataInfo.latitude,
                            longitude: dataInfo.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                    >
                        <MapViewDirections
                            origin={{
                                latitude: routes.params?.pick_point_lat,
                                longitude: routes.params?.pick_point_lng
                            }}
                            destination={{
                                latitude: routes.params?.drop_point_lat,
                                longitude: routes.params?.drop_point_lng
                            }}
                            apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                            strokeWidth={6}
                            strokeColor="green"
                            optimizeWaypoints={true}
                            onStart={(params) => {
                                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
                                console.log(`Distance: ${result.distance} km`)
                                console.log(`Duration: ${result.duration} min.`)
                                // fetchTime(result.distance, result.duration),
                                //     mapRef.current.fitToCoordinates(result.coordinates, {
                                //         edgePadding: {
                                //             right: 30,
                                //             bottom: 300,
                                //             left: 30,
                                //             top: 100,
                                //         },
                                //     });
                            }}
                            onError={(errorMessage) => {
                                // console.log('GOT AN ERROR');
                            }}
                        />
                        <Marker
                            ref={markerRef}
                            coordinate={{
                                latitude: dataInfo.latitude,
                                longitude: dataInfo.longitude,
                            }}
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <Image
                                source={imagePath.icBike}
                                style={{
                                    width: 40,
                                    height: 40,
                                    transform: [{ rotate: `${dataInfo.header}deg` }]
                                }}
                                resizeMode="contain"
                            />
                        </Marker>
                    </MapView>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 0,
                            elevation: 5
                        }}
                        onPress={onCenter}
                    >
                        <Image source={imagePath.greenIndicator} />
                    </TouchableOpacity>
                </View>
                : <View>
                    <Text>Loading...</Text>
                </View>}
        </View>
    );
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
    imageMarker: { width: 40, height: 40, resizeMode: 'contain' }
});

export default TrackingMapsScreen;