import React, { useEffect } from 'react';
import { AppState, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationService = () => {
    const userId = 6; // Replace with dynamic user_id if required
    const updateInterval = 10000; // Update every 10 seconds
    let watchId = null;

    // Function to send location to the server
    const sendLocationToServer = async (latitude, longitude, locationName = '', headerDirection) => {
        const DriverData = await AsyncStorage.getItem('userSession');
        const driverDataParsed = DriverData ? JSON.parse(DriverData) : null;
        const response = await fetch('https://nodeadmin.createdinam.com/update-location', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: driverDataParsed.id,
                latitude,
                longitude,
                header: headerDirection, // Replace with dynamic header value if required
                location_name: locationName,
            }),
        });
        console.log('Location:', JSON.stringify(response));
        if (!response.ok) {
            console.error('Failed to update location:', JSON.stringify(response));
        } else {
            console.log('Location updated successfully!');
        }
    };

    // Start watching location in the foreground
    const startForegroundTracking = () => {
        watchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, heading } = position.coords;
                sendLocationToServer(latitude, longitude, 'Current Location', heading);
            },
            (error) => console.error('Error watching location:', error),
            { enableHighAccuracy: true, distanceFilter: 10 }
        );
    };

    // Start background tracking
    const startBackgroundTracking = async () => {
        try {
            const status = await BackgroundFetch.configure(
                {
                    minimumFetchInterval: 15, // 15 minutes
                    stopOnTerminate: false,
                    startOnBoot: true,
                    enableHeadless: true,
                },
                async (taskId) => {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude, heading } = position.coords;
                            sendLocationToServer(latitude, longitude, 'Background Location', heading);
                        },
                        (error) => console.error('Error fetching background location:', error),
                        { enableHighAccuracy: true }
                    );

                    BackgroundFetch.finish(taskId);
                },
                (error) => {
                    console.error('Background Fetch failed:', error);
                }
            );

            if (status !== BackgroundFetch.STATUS_AVAILABLE) {
                console.warn('Background Fetch is not available.');
            }
        } catch (error) {
            console.error('Failed to configure background fetch:', error);
        }
    };

    useEffect(() => {
        // Start tracking on component mount
        startForegroundTracking();
        startBackgroundTracking();

        // Cleanup on unmount
        return () => {
            if (watchId !== null) {
                Geolocation.clearWatch(watchId);
            }
            BackgroundFetch.stop();
        };
    }, []);

    return null;
};

export default LocationService;
