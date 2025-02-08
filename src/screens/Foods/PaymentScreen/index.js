import { View, Text, TouchableOpacity, StatusBar, Image, FlatList, Dimensions, ActivityIndicator, BackHandler, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView, WebViewMessageEvent } from "react-native-webview";
import AwesomeAlert from 'react-native-awesome-alerts';
import Toast from 'react-native-toast-message';
import globle from '../../../../common/env';
import React from 'react'

const PaymentGalewayScreen = () => {

    const [isLoading, setLoading] = React.useState(false);
    const [isShowAlert, setShowAlert] = React.useState(false);
    const [isShowAlertMessage, setShowAlertMessage] = React.useState('');
    const [user_id, setUserId] = React.useState('');
    const navigation = useNavigation();
    const route = useRoute();

    useFocusEffect(
        React.useCallback(() => {
            loadProducts();
            console.log(JSON.stringify(route?.params))
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    function backButtonHandler() { }

    React.useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
        };
    }, [backButtonHandler]);

    const loadProducts = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        setUserId(userId);
        setLoading(false);
    }

    const onMessage = (info) => {
        setShowAlertMessage(info?.nativeEvent?.data);
        console.log('response_payment:------------>', JSON.stringify(info?.nativeEvent?.data));
        if (info?.nativeEvent?.data === 'Success') {
            Toast.show({
                type: 'success',
                text1: 'Payment Successfully!',
                text2: 'Payment Successfully!',
            });
            navigation.goBack();
        } else if (info?.nativeEvent?.data === 'Aborted') {
            setShowAlert(true);
            // Toast.show({
            //     type: 'error',
            //     text1: 'Payment Not Successfully! \n try Again for paid Amount',
            //     text2: 'Payment Not Successfully! \n try Again for paid Amount',
            // });
            // navigation.goBack();
        }
    }



    return (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight, backgroundColor: '#ffffff' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 7, backgroundColor: '#ffffff', elevation: 5, marginTop: 5 }}>
                <AwesomeAlert
                    show={isShowAlert}
                    showProgress={false}
                    title={`Opps Payment ${isShowAlertMessage}`}
                    message="Payment Not Successfully! try Again for paid Amount"
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    // cancelText="Retry Payment"
                    confirmText="Cancel"
                    confirmButtonColor="#DD6B55"
                    onCancelPressed={() => {
                        navigation.replace('CartScreenFood');
                    }}
                    onConfirmPressed={() => {
                        navigation.replace('CartScreenFood');
                    }}
                />
            </View>
            {isLoading ? <ActivityIndicator size={'large'} color={'black'} style={{ marginTop: Dimensions.get('screen').width / 4, alignSelf: 'center', zIndex: 99999, }} /> :
                <WebView
                    style={{ flex: 1, marginTop: 10, resizeMode: 'cover', zIndex: 9999 }}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{ uri: globle.API_BASE_URL + 'validate-place-order-online?order_number=' + route?.params + '&user_id=' + user_id }}
                    startInLoadingState={true}
                    onMessage={(data) => onMessage(data)}
                />}
        </View>
    )
}

export default PaymentGalewayScreen

const styles = StyleSheet.create({})