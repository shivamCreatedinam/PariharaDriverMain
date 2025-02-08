import { NativeModules, PermissionsAndroid, Platform } from 'react-native';

const { FloatingWindow } = NativeModules;

// Request permission to show overlay
export const requestOverlayPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.SYSTEM_ALERT_WINDOW
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
    return false;
};

// Show popup window
export const showPopup = async (message) => {
    const permissionGranted = await requestOverlayPermission();
    if (permissionGranted) {
        // Show popup with message
        FloatingWindow.showPopup(message);
    } else {
        console.warn('Overlay permission denied');
    }
};