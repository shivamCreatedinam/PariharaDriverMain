/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    BackHandler,
    Dimensions,
    Animated,
    Easing,
    ImageBackground,
    Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import backgroundImage from '../../assets/background_maps.png';
import styless from '../../../common/styles';
import {
    INPUT_RANGE_START,
    INPUT_RANGE_END,
    OUTPUT_RANGE_START,
    OUTPUT_RANGE_END,
    ANIMATION_TO_VALUE,
    ANIMATION_DURATION,
} from '../../../common/constants';
import { Image } from 'react-native-elements';
import { ActivityIndicator } from 'react-native';

const ProfileChooseScreen = () => {

    const initialValue = 0;
    const translateValue = React.useRef(new Animated.Value(initialValue)).current;
    const AnimetedImage = Animated.createAnimatedComponent(ImageBackground);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            // whatever
            setTimeout(() => {
                // setTimeout
                loadSessionStorage();
            }, 3000);
        }, [])
    );

    const loadSessionStorage = async () => {
        if (true) {
            navigation.navigate('LoginScreen');
        } else {
            navigation.navigate('LoginScreen');
        }
    }

    React.useEffect(() => {
        const backAction = () => {
            // Handle the back button press here
            // You can perform any necessary actions or navigate to a different screen
            Alert.alert(
                'Close Application',
                'Are you sure, Close Go Ride?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => navigation },
                ]
            );
            // Return true to prevent the default back button behavior
            return true;
        };

        // Add the event listener for the hardware back button press
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // Clean up the event listener when the component is unmounted
        return () => backHandler.remove();
    }, []);

    React.useEffect(() => {
        const translate = () => {
            translateValue.setValue(initialValue);
            Animated.timing(translateValue, {
                toValue: ANIMATION_TO_VALUE,
                duration: ANIMATION_DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => translate());
        };
        translate();
    }, [translateValue]);

    const translateAnimation = translateValue.interpolate({
        inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
        outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
    });


    return (
        <View style={{ flex: 1 }}>
            <ActivityIndicator style={{ position: 'absolute', alignItems: 'center', bottom: 60, alignSelf: 'center' }} color={'#FAD323'} size={'large'} />
            <AnimetedImage
                resizeMode="repeat"
                style={[styless.background, {
                    transform: [
                        {
                            translateX: translateAnimation,
                        },
                        {
                            translateY: translateAnimation,
                        },
                    ],
                }]}
                source={backgroundImage} />
            <View style={{ marginTop: Dimensions.get('screen').height / 3, alignItems: 'center' }}>
                <Image style={{ height: 120, width: 120, resizeMode: 'contain' }} source={require('../../assets/ic_launcher_round.png')} />
                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 11 }} >Go Driving</Text>
            </View>
        </View>
    );
};


export default ProfileChooseScreen;