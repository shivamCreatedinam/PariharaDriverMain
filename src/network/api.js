import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export const API_BASE_URL = 'https://nodeadmin.createdinam.com';
export const API_DRIVER_BASE_URL = "https://theparihara.com/Parihara/public/api"

export const fetchUserProfile = async () => {
    try {
        const DriverData = await AsyncStorage.getItem('userSession');
        const response = await axios.get(`${API_DRIVER_BASE_URL}/driver-profile?driver_id=${JSON.parse(DriverData)?.id}`);
        console.log(JSON.stringify(response.data?.driver));
        return response?.data?.driver; // Returns the user profile details
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};


export const AcceptBooking = async (request_trip_id) => {
    console.log('AcceptBooking started');

    try {
        const DriverData = await AsyncStorage.getItem('userSession');
        const driverDataParsed = DriverData ? JSON.parse(DriverData) : null;
        if (!driverDataParsed) {
            console.log("Driver data not found");
            return false;
        }

        const BookingURL = `${API_DRIVER_BASE_URL}/driver-nearest-user-accept-trip`;

        const formdata = new FormData();
        formdata.append('driver_id', driverDataParsed.id);
        formdata.append('request_id', request_trip_id);
        formdata.append('driver_latitude', '22.421991');
        formdata.append('driver_longitude', '21.4429928');

        const requestOptions = {
            method: 'POST',
            body: formdata,
            headers: {
                'Authorization': `Bearer ${driverDataParsed.id}`,
            },
        };

        // Making the request using fetch
        const response = await fetch(BookingURL, requestOptions);
        const result = await response.json();
        console.log('resultOptions: ', JSON.stringify(result));

        if (response.status) {
            // API response status is okay
            console.log('Trip accepted: ', result.message);
            return true;
        } else {
            // If API response status is not ok
            Toast.show({
                type: 'error',
                text1: result.message || 'Error accepting trip.',
                text2: result.message || 'There was an issue accepting the trip.',
            });
            console.log('API Error: ', result.message);
            return false;
        }
    } catch (error) {
        console.error('Error in AcceptBooking: ', error);
        Toast.show({
            type: 'error',
            text1: 'An unexpected error occurred',
            text2: error.message || 'Please try again later.',
        });
        return false;
    }
};


export const StartTripBooking = async (request_trip_id, trip_otp) => {
    console.log('Start Trip Booking!');

    try {
        const DriverData = await AsyncStorage.getItem('userSession');
        const driverDataParsed = DriverData ? JSON.parse(DriverData) : null;
        if (!driverDataParsed) {
            console.log("Driver data not found");
            return false;
        }

        const BookingURL = `${API_DRIVER_BASE_URL}/driver-verify-trip-otp`;

        const formdata = new FormData();
        formdata.append('driver_id', driverDataParsed.id);
        formdata.append('request_id', request_trip_id);
        formdata.append('otp', trip_otp);

        const requestOptions = {
            method: 'POST',
            body: formdata,
            headers: {
                'Authorization': `Bearer ${driverDataParsed.id}`,
            },
        };

        console.log('Request Options: ', JSON.stringify(requestOptions));

        // Making the request using fetch
        const response = await fetch(BookingURL, requestOptions);
        const result = await response.json();
        console.log('API Error: ', result);
        if (response?.status === "true") {
            // API response status is okay
            Toast.show({
                type: 'success',
                text1: result.message,
                text2: 'Trip accepted successfully.',
            });
            console.log('Trip accepted: ', result.message);
            return true;
        } else {
            // If API response status is not ok
            console.log('API Error: ', result.message);
            Toast.show({
                type: 'error',
                text1: result.message || 'Error accepting trip.',
                text2: result.message || 'There was an issue accepting the trip.',
            });
            return false;
        }
    } catch (error) {
        console.error('Error in AcceptBooking: ', error);
        Toast.show({
            type: 'error',
            text1: 'An unexpected error occurred',
            text2: error.message || 'Please try again later.',
        });
        return false;
    }
};

export const AcceptDriverTrip = async (request_trip_id) => {
    console.log('AcceptDriverTrip');
    try {
        const DriverData = await AsyncStorage.getItem('userSession');
        const BookingURL = `${API_BASE_URL}/update-trip-accept`;
        // const response = await axios.get();
        console.log(JSON.stringify(DriverData));
        // Make the POST request using Axios
        var formdata = new FormData();
        formdata.append('booking_id', request_trip_id);

        const raw = JSON.stringify({
            "booking_id": request_trip_id
        });
        var requestOptions = {
            method: 'POST',
            body: raw,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(DriverData)?.id,
                "Content-Type": "application/json"
            }
        };
        console.log('AcceptDriverTrip', JSON.stringify(requestOptions))
        fetch(BookingURL, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('AcceptDriverTrip', JSON.stringify(result));
                if (result.success) {
                    Toast.show({
                        type: 'success',
                        text1: result.message,
                        text2: 'Trip accepted successfully.',
                    });
                    console.log('AcceptDriverTrip', JSON.stringify(result));
                    return true;
                } else {
                    console.log('AcceptDriverTripError', JSON.stringify(result));
                    return false;
                }
            })
            .catch((error) => {
                console.log('AcceptDriverTripError', JSON.stringify(error));
                return false;
            });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const SubmitDriverTripOtp = async (request_trip_id) => {
    console.log('AcceptDriverTrip');
    try {
        const DriverData = await AsyncStorage.getItem('userSession');
        const BookingURL = `${API_BASE_URL}/update-otp-submit`;
        // const response = await axios.get();
        console.log(JSON.stringify(DriverData));
        // Make the POST request using Axios
        var formdata = new FormData();
        formdata.append('booking_id', request_trip_id);

        const raw = JSON.stringify({
            "booking_id": request_trip_id
        });
        var requestOptions = {
            method: 'POST',
            body: raw,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(DriverData)?.id,
                "Content-Type": "application/json"
            }
        };
        console.log('AcceptDriverTrip', JSON.stringify(requestOptions))
        fetch(BookingURL, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('AcceptDriverTrip', JSON.stringify(result));
                if (result.success) {
                    Toast.show({
                        type: 'success',
                        text1: result.message,
                        text2: 'Trip accepted successfully.',
                    });
                    console.log('AcceptDriverTrip', JSON.stringify(result));
                    return true;
                } else {
                    console.log('AcceptDriverTripError', JSON.stringify(result));
                    return false;
                }
            })
            .catch((error) => {
                console.log('AcceptDriverTripError', JSON.stringify(error));
                return false;
            });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};


export const updateToken = async (id, token) => {
    try {
        const DriverData = await AsyncStorage.getItem('userSession');
        const Driver_ID = JSON.parse(DriverData)?.id;
        const response = await axios.post(`${API_DRIVER_BASE_URL}/update-driver-fcm`, {
            'driver_id': Driver_ID,
            'token': token,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Handle successful response
        console.log(`Error updating token: ${JSON.stringify(response)}`);
        return response.data;
    } catch (error) {
        // Handle errors
        console.error('Error updating token:', error.response?.data || error.message);
        // throw error.response?.data || { error: 'An unknown error occurred' };
    }
};

