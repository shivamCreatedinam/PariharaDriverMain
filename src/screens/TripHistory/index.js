import React from 'react';
import axios from 'axios';
import globle from '../../../common/env';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Text, View, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingTripHistoryScreen = () => {

    const navigate = useNavigation();
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [UserId, setUserId] = React.useState(null);
    const [package_id, setPackageId] = React.useState(null);
    const [isLinkTrue, setLinkTrue] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            loadProfile();
            console.log(globle.API_BASE_URL + 'place_order?package_id=')
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const loadProfile = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let id = JSON.parse(valueX)?.id;
        setUserId(id)
        console.log('loadProfile', JSON.stringify(valueX));
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'user-trip-list',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false)
                setData(response?.data?.data);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const renderItems = (info) => { 

        return (
            <View style={{ padding: 15, backgroundColor: info?.item?.payment_status === 'Success' ? '#D16666' : '#04724D', margin: 10, borderRadius: 10, elevation: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginBottom: 5, marginTop: 6 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, marginLeft: 10, color: 'white', marginBottom: 10 }}>Date {info?.item?.created_date}</Text>
                        </View>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, marginLeft: 10, color: 'white', textTransform: 'capitalize' }}>PayBy: {info?.item?.trip_type}</Text>
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10, color: 'white' }}>{info?.item?.distance}Km</Text>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10, color: 'white', textAlign: 'center' }}>{info?.item?.to_address}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10, color: 'white', textAlign: 'center' }}>{'To'}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10, color: 'white', textAlign: 'center' }}>{info?.item?.from_address}</Text>
                </View>
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10, color: 'white', marginTop: 10 }}>Trip End</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginTop: 15, padding: 20, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: 'grey', borderBottomWidth: 1, padding: 15 }}>
                    <TouchableOpacity onPress={() => navigate.goBack()} style={{ padding: 2, zIndex: 999 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', flex: 1, marginLeft: -20, fontWeight: 'bold', fontSize: 15 }}>Booking History</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={data}
                        keyExtractor={(ed) => ed.id}
                        renderItem={(items) => renderItems(items)}
                    />
                </View>
            </View>
        </View>
    )
}

export default BookingTripHistoryScreen;