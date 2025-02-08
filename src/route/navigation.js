import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // For icons in bottom tabs

import analytics from '@react-native-firebase/analytics';
import database from '@react-native-firebase/database';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';

// inner pages
import UpdateProfileScreen from '../screens/UpdateProfileScreen';
import BookingHistoryScreen from '../screens/BookingHistoryScreen';
import PaymentSettingsScreen from '../screens/PaymentSettingsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import AppSettingsScreen from '../screens/AppSettingsScreen';
import BookingAcceptScreen from '../screens/BookingScreen';
import RideScreen from '../screens/RideScreen';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import PermissionScreenMain from '../screens/PermissionScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = () => {
    // Use a navigation ref
    const navigationRef = useRef();

    // Log screen views to Firebase Database
    const logScreenToDatabase = (screenName) => {
        const timestamp = new Date().toISOString();

        database()
            .ref('/screen-analytics')
            .push({
                screen: screenName,
                timestamp,
            })
            .then(() => console.log('Screen view saved to Firebase Database!'))
            .catch((error) => console.error('Error saving screen view:', error));
    };

    // Define the bottom tab navigator
    const BottomTabNavigator = () => (
        <Tab.Navigator
            initialRouteName="HomeScreen"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'HomeScreen') {
                        iconName = 'car-sport-outline';
                    } else if (route.name === 'DetailsScreen') {
                        iconName = 'paw-outline';
                    } else if (route.name === 'ProfileScreen') {
                        iconName = 'bonfire-outline';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',
                headerShown: false, // Hide header for tabs
            })}
        >
            <Tab.Screen name="HomeScreen" component={NotificationSettingsScreen} options={{ title: 'Home' }} />
            <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile' }} />
        </Tab.Navigator>
    );

    return (
        <NavigationContainer
            ref={navigationRef} // Pass the navigationRef here
            onReady={() => {
                const currentRoute = navigationRef.current.getCurrentRoute()?.name;
                if (currentRoute) {
                    logScreenToDatabase(currentRoute);
                }
            }}
            onStateChange={() => {
                const currentRoute = navigationRef.current.getCurrentRoute()?.name;
                if (currentRoute) {
                    logScreenToDatabase(currentRoute);
                }
            }}
        >
            <Stack.Navigator
                initialRouteName="PermissionScreenMain"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="SplashScreen"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />
                {/* Login and Registration Screens */}
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />

                {/* Bottom Tabs */}
                <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />

                {/* Details Screen */}
                <Stack.Screen name="UpdateProfileScreen" component={UpdateProfileScreen} />
                <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
                <Stack.Screen name="BookingHistoryScreen" component={BookingHistoryScreen} />
                <Stack.Screen name="PaymentSettingsScreen" component={PaymentSettingsScreen} />
                <Stack.Screen name="NotificationSettingsScreen" component={HomeScreen} />
                <Stack.Screen name="AppSettingsScreen" component={AppSettingsScreen} />
                <Stack.Screen name="BookingAcceptScreen" component={BookingAcceptScreen} />
                <Stack.Screen name="RideScreen" component={RideScreen} />
                <Stack.Screen name='PermissionScreenMain' component={PermissionScreenMain} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
