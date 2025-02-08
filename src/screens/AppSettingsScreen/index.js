import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation'; // For location tracking
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://nodeadmin.createdinam.com/';

export default function AppSettingsScreen() {


    const [location, setLocation] = useState(null);
    const socket = io(SOCKET_SERVER_URL);
    console.log('ReceivedConnection:', socket);
    useEffect(() => {
        // Register user with the server
        const userId = '4'; // Replace with the actual user ID
        socket.emit('registerUser', userId);
        console.log('Received location update:', userId);
        // Listen for location updates from the server
        socket.on('locationUpdated', (data) => {
            console.log('Received location update:', data);
        });

        // Clean up on unmount
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        // Periodically send location updates to the server
        const watchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                console.log('ReceivedGeolocation:', JSON.stringify(position.coords));
                // Emit location update to the server
                socket.emit('updateLocation', {
                    userId: 'user123', // Replace with the actual user ID
                    latitude,
                    longitude,
                });
            },
            (error) => {
                console.error('Error fetching location:', error);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 10, // Trigger update only when moving 10m
            }
        );

        // Clean up on unmount
        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Current Location:</Text>
            {location ? (
                <Text>
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                </Text>
            ) : (
                <Text>Fetching location...</Text>
            )}
        </View>
    );


}