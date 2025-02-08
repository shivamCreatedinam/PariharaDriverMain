import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import getLocation from '../../services/LocationProvider/LocationProvider';

const { width, height } = Dimensions.get('screen');

const SplashScreen = () => {

    const navigation = useNavigation();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const userSession = await AsyncStorage.getItem('userSession');

                if (userSession) {
                    // User is logged in
                    try {
                        const LocationData = await getLocation();
                        console.log('FetchLocation:', JSON.stringify(LocationData));
                    } catch (error) {
                        console.error('Anable to fetch location:', error);
                    }
                    navigation.replace('BottomTabs');
                } else {
                    // User is not logged in
                    navigation.replace('LoginScreen');
                }
            } catch (error) {
                console.error('Error retrieving user session:', error);
                navigation.replace('LoginScreen');
            }
        };

        // Simulate a short delay for the splash screen
        setTimeout(checkLoginStatus, 2500);
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Hide Status Bar */}
            <StatusBar hidden={true} />
            {/* Background GIF using FastImage */}
            <FastImage
                source={require('../../assets/splash.gif')}
                style={styles.background}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        width,
        height,
        position: 'absolute',
    },
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
    },
});

export default SplashScreen;
