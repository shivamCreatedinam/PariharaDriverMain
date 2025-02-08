import Geolocation from '@react-native-community/geolocation';

const enableGPS = () => {
    Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'always',
    });
};

export default enableGPS;
