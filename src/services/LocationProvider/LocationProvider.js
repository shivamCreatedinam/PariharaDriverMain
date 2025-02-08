import { NativeModules, PermissionsAndroid, Platform } from 'react-native';

const { LocationModule } = NativeModules;

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Location permission granted');
            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
};

const fetchLocation = async () => {
    try {
        const location = await LocationModule.getCurrentLocation();
        console.log('Location:', location);
    } catch (error) {
        console.error('Error fetching location:', error);
    }
};

// Call this function to fetch location
const getLocation = async () => {
    await requestLocationPermission();
    await fetchLocation();
};

export default getLocation;