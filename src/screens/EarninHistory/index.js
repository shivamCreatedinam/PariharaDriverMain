import React from "react";
import axios from 'axios';
import globle from '../../../common/env';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';


const EarningHistoryScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const [loading, setLoading] = React.useState(false);
    const [walletInfo, setWalletInfo] = React.useState(null);
    const [bookingHistory, setBookingHistory] = React.useState([]);

    React.useEffect(() => {
        getProfileDriverData();
        return () => {
            // dataRef.off(); // Clean up the listener when the component unmounts
        };
    }, []);

    const getProfileDriverData = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX);
        let url_driverProfile = globle.API_BASE_URL + 'get-driver-trip-amount?driver_id=' + data?.id;
        setLoading(true);
        var authOptions = {
            method: 'GET',
            url: url_driverProfile,
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions)
            .then((response) => {
                console.log('getProfileDriverData', response.data);
                if (response.data.status) {
                    setWalletInfo(response.data);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const renderItems = (items) => {

        return (
            <View>
                <Text>{JSON.stringify(items)}</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, paddingTop: 25, padding: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: .5 }}>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Earning History</Text>
            </View>
            <View style={{ flex: 1 }}>
                {bookingHistory.length > 0 ?
                    <FlatList
                        data={bookingHistory}
                        keyExtractor={(items) => items.id}
                        renderItem={(items) => renderItems(items.item)}
                    />
                    : <View style={{ flex: 1, alignItems: 'center', marginTop: 200 }}>
                        <Image style={{ width: 250, height: 250, resizeMode: 'cover' }} source={require('../../assets/search_result_not_found.png')} /></View>}
            </View>
        </View>
    )
}

export default EarningHistoryScreen;