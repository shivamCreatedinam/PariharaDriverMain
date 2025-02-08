/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Pressable,
    View,
    Dimensions,
    Animated,
    Easing,
    ImageBackground,
} from 'react-native';
import { Image, Text } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import AddressPickup from '../../../common/AddressPickup';
import cars from '../../assets/data/cars'; // background_maps
import backgroundImage from '../../assets/background_maps.png';
import MapView, {
    Marker,
    AnimatedRegion
} from 'react-native-maps';
import styless from '../../../common/styles';
import {
    INPUT_RANGE_START,
    INPUT_RANGE_END,
    OUTPUT_RANGE_START,
    OUTPUT_RANGE_END,
    ANIMATION_TO_VALUE,
    ANIMATION_DURATION,
} from '../../../common/constants';


const TripStartScreen = () => {

    const routes = useRoute();
    const navigate = useNavigation();
    const initialValue = 0;
    const translateValue = React.useRef(new Animated.Value(initialValue)).current;
    const numColumns = 2;
    const [data, setData] = React.useState([]);
    const [Cardata, setCarData] = React.useState(cars);
    const [selectedTrip, setSelectedTrip] = React.useState('');
    const [Destinationstate, setDestinationState] = React.useState({ destinationCords: {} });
    const [Pickupstate, setPickupState] = React.useState({ pickupCords: {} });
    const [Dropstate, setDropState] = React.useState({ dropCords: {} });

    console.log(JSON.stringify(routes.params));

    React.useEffect(() => {
        const translate = () => {
            translateValue.setValue(initialValue);
            Animated.timing(translateValue, {
                toValue: ANIMATION_TO_VALUE,
                duration: ANIMATION_DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => translate());
        };

        translate();
    }, [translateValue]);

    const translateAnimation = translateValue.interpolate({
        inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
        outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
    });

    const AnimetedImage = Animated.createAnimatedComponent(ImageBackground);

    const onPressHandler = () => {
        let tripDetails = {
            drop: Dropstate,
            pickup: Destinationstate,
            carDetails: selectedTrip,
        }
        navigate.navigate('EndStartScreen', { location: tripDetails });
    };

    //  / lat, lng, zipCode, cityText icon
    const fetchPickupCords = (locations) => {
        setDestinationState({
            ...Destinationstate,
            destinationCords: {
                latitude: locations?.geometry?.location?.lat,
                longitude: locations?.geometry?.location?.lng,
                name: locations?.name,
                icon: locations?.icon,
            }
        })
    }

    const fetchDropCords = (locations) => {
        setDropState({
            ...Dropstate,
            dropCords: {
                latitude: locations?.geometry?.location?.lat,
                longitude: locations?.geometry?.location?.lng,
                name: locations?.name,
                icon: locations?.icon,
            }
        })
        onCenterx(locations?.geometry?.location?.lat, locations?.geometry?.location?.lng);
    }

    const confirm = (items) => {
        const categories = Cardata.map((item) => {
            item.selected = false;
            return item;
        });
        categories[items.index].selected = true;
        setSelectedTrip(items.item);
        setCarData(categories);
    }

    const GridItem = (item) => (
        <Pressable onPress={() => confirm(item)} style={styles.item}>
            <View style={{ position: 'absolute', right: 5, top: 5, display: item.item.selected === true ? 'flex' : 'none' }}>
                <Image style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: 'green' }} source={require('../../assets/right_check.png')} />
            </View>
            <Text style={{ fontWeight: 'bold', color: 'black', position: 'absolute', left: 10, top: 5 }}>{item.item.type}</Text>
            <Image style={{ height: 110, width: 135, resizeMode: 'contain', marginTop: 15 }} source={{ uri: item.item.icon }} />
        </Pressable>
    );

    return (
        <View style={styles.containerX}>
            <AnimetedImage
                resizeMode="repeat"
                style={[styless.background, {
                    transform: [
                        {
                            translateX: translateAnimation,
                        },
                        {
                            translateY: translateAnimation,
                        },
                    ],
                }]}
                source={backgroundImage} />
            <View style={styles.innerContainer}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black', }}>Search By Location</Text>
                <View style={{ height: 260, width: Dimensions.get('screen').width - 80, position: 'absolute', top: 50, zIndex: 999, left: 20, right: 20, padding: 10 }}>
                    <AddressPickup
                        placheholderText="Enter Pickup Location"
                        fetchAddress={fetchPickupCords}
                    />
                    {Object.keys(Destinationstate.destinationCords).length > 0 ?
                        <Pressable onPress={() => console.log('click pick')} style={{ position: 'absolute', right: 25, top: 45, zIndex: 9999 }}>
                            <Image style={{ height: 20, width: 20, resizeMode: 'contain', }} source={require('../../assets/red_cross.png')} />
                        </Pressable> : null}
                </View>
                {Object.keys(Destinationstate.destinationCords).length > 0 ?
                    <View style={{ height: 260, width: Dimensions.get('screen').width - 80, position: 'absolute', top: 150, zIndex: 999, left: 20, right: 20, padding: 10 }}>
                        <AddressPickup
                            placheholderText="Enter Drop Location"
                            fetchAddress={fetchDropCords}
                        />
                        {Object.keys(Dropstate.dropCords).length > 0 ?
                            <Pressable onPress={() => console.log('click drop')} style={{ position: 'absolute', right: 25, top: 45, zIndex: 9999 }}>
                                <Image style={{ height: 20, width: 20, resizeMode: 'contain', }} source={require('../../assets/red_cross.png')} />
                            </Pressable> : null}
                    </View> : null}
                <TouchableOpacity onPress={() => onPressHandler()} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Go To Route</Text>
                </TouchableOpacity>
            </View>
        </View>
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
        width: '100%',
        position: 'absolute',
        paddingHorizontal: 10,
        paddingVertical: 14,
        bottom: 10,
        left: 20,
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
        padding: 20,
        backgroundColor: '#ffffff',
        flex: 1
    },
    innerContainer: {
        padding: 20,
        backgroundColor: '#bebebe',
        flexGrow: 1,
        borderRadius: 10,
        elevation: 5,
        marginBottom: 70,
        elevation: 4,
        marginTop: Dimensions.get('screen').width / 3.5
    }, item: {
        flex: 1,
        aspectRatio: 1,
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        elevation: 5
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
});

export default TripStartScreen;