import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert, } from 'react-native';
import { fetchUserProfile } from '../../network/api'; // Import API utility
import Icon from 'react-native-vector-icons/Ionicons'; // For icons in bottom tabs
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { version } from '../../../package.json';
import { Card } from 'react-native-paper';

const ProfileScreen = () => {

    const navigation = useNavigation();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const menuItems = [
        { label: 'Update Profile', icon: 'person-circle-outline', screen: 'UpdateProfileScreen' },
        { label: 'Booking History', icon: 'book-outline', screen: 'BookingHistoryScreen' },
        { label: 'Payment Settings', icon: 'card-outline', screen: 'PaymentSettingsScreen' },
        { label: 'Notification Settings', icon: 'notifications-outline', screen: 'NotificationSettingsScreen' },
        { label: 'App Settings', icon: 'settings-outline', screen: 'AppSettingsScreen' },
        { label: 'Logout', icon: 'enter', screen: 'logout' },
    ];

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            const loadProfile = async () => {
                try {
                    const userData = await fetchUserProfile(); // Replace 4 with the actual user ID

                    setProfile(userData);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

            loadProfile();
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    useEffect(() => {

    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load profile.</Text>
            </View>
        );
    }

    const AskForLogoutFirst = () => {
        Alert.alert(
            'Log Out Confirmation',  // Message text
            'Are you sure you want to log out? Please confirm your action.', // Optional second argument (if you want a description, or just leave it empty)
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Your OK button logic here
                        logoutandReset();
                    },
                },
                {
                    text: 'Cancel',
                    onPress: () => {
                        // Your Cancel button logic here
                    },
                },
            ]
        );
    }

    const logoutandReset = async () => {
        try {
            // Clear all data from AsyncStorage
            await AsyncStorage.clear();

            // Optionally, reset application state or navigate to login screen
            // For example, using React Navigation:
            navigation.replace('SplashScreen'); // Adjust according to your navigation setup

            console.log('User  logged out and AsyncStorage cleared.');
        } catch (error) {
            console.error('Error clearing AsyncStorage: ', error);
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image
                    style={styles.profileImage}
                    source={{ uri: 'https://img.freepik.com/free-photo/fun-3d-illustration-cartoon-kid-with-rain-gear_183364-81182.jpg' }} // Placeholder image
                />
                <Text style={styles.username}>{profile.name}</Text>
                <Text style={styles.email}>{profile.vehicle_no}</Text>
            </View>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.label}>Mobile Number</Text>
                    <Text style={styles.value}>{profile.mobile}</Text>

                    <Text style={styles.label}>Account Status</Text>
                    <Text style={styles.value}>{profile.duty_status === 'On' ? 'Active' : 'Inactive'}</Text>

                    <Text style={styles.label}>Driver ID</Text>
                    <Text style={styles.value}>
                        {profile?.driver_id}
                    </Text>
                </Card.Content>
            </Card>
            <View style={styles.containerX}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => item.screen !== 'logout' ? navigation.navigate(item.screen, { user_id: 4 }) : AskForLogoutFirst()}
                    >
                        <Icon name={item.icon} size={24} color="#6200ee" style={styles.icon} />
                        <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={{ textAlign: 'center' }}>Version : {version}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        flex: 1
    },
    containerX: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: '#f8f9fa',
        padding: 0,
        marginTop: 15
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    card: {
        marginTop: 20,
        borderRadius: 10,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    icon: {
        marginRight: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});
export default ProfileScreen;
