import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For session management
import axios from 'axios';

const LoginScreen = () => {

    const navigation = useNavigation();
    const [email, setEmail] = useState('test@gmail.com');
    const [password, setPassword] = useState('Admin@123');
    const [loading, setLoading] = useState(false);


    const handleLoginX = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'https://nodeadmin.createdinam.com/login_members',
                {
                    email: email,
                    password_hash: password,
                    last_login: new Date().toISOString(),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(`handleLogin ${JSON.stringify(response.data)}`)
            // Handle successful login response
            if (response.status === 200) {
                // Assuming the response contains user details under `user` key
                const userData = response.data?.response[0] || {};
                console.log(`handleLogin ${JSON.stringify(response.data)}`)
                // Save user session details to AsyncStorage
                await AsyncStorage.setItem('userSession', JSON.stringify(userData));
                // Navigate to BottomTabs
                navigation.replace('BottomTabs');
            } else {
                Alert.alert('Error', response.data?.message);
            }
        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('Error', 'Invalid credentials or server error.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        // Input Validation
        if (!email || !password) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email!');
            return;
        }

        setLoading(true);

        try {
            // Prepare form data
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            // Make the POST request using Axios
            const response = await axios.post(
                'https://theparihara.com/Parihara/public/api/driver-login',
                formData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Process the response
            const result = response.data;
            if (result.status) {
                // Save user session details to AsyncStorage
                await AsyncStorage.setItem('userSession', JSON.stringify(result?.driver));
                // Navigate to Home/Dashboard with driver details
                navigation.replace('BottomTabs');
            } else {
                Alert.alert('Error', result?.message || 'Login failed');
            }

            // console.log('handleLogin:', JSON.stringify(response));

        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to continue</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.footerText}>
                Don’t have an account?{' '}
                <Text style={styles.signupText} onPress={() => navigation.navigate('RegistrationScreen')}>
                    Sign Up
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#888',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        fontSize: 16,
        color: '#888',
    },
    signupText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
