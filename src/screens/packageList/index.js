import React from 'react';
import axios from 'axios';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import { showMessage } from "react-native-flash-message";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Text, View, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView, WebViewMessageEvent } from "react-native-webview";

const PurchasePackageList = () => {

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
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let id = JSON.parse(valueX)?.id;
        setUserId(id)
        console.log('loadProfile', JSON.stringify(valueX));
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'get-package-list',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false)
                console.log(JSON.stringify(response?.data?.data));
                setData(response?.data?.data);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const rechargeNow = async (ids) => {
        setPackageId(ids)
        setLinkTrue(true);
        // const valueX = await AsyncStorage.getItem('@autoUserGroup');
        // let data = JSON.parse(valueX)?.token;
        // var formdata = new FormData();
        // formdata.append('package_id', ids);
        // var requestOptions = {
        //     method: 'POST',
        //     body: formdata,
        //     redirect: 'follow',
        //     headers: {
        //         'Authorization': 'Bearer ' + data,
        //     }
        // };
        // console.log('startTrip', JSON.stringify(requestOptions))
        // fetch(globle.API_BASE_URL + 'place_order', requestOptions)
        //     .then(response => response.json())
        //     .then(result => {
        //         console.log('startTrip', result);
        //         if (result.status) {
        //             console.log('startTrip', result?.url);
        //             Toast.show({
        //                 type: 'success',
        //                 text1: 'Status Update Successfully',
        //                 text2: result?.message,
        //             });
        //             setpaymentUrl(result?.url);
        //             setLinkTrue(true);
        //             setLoading(true);
        //         } else {
        //             Toast.show({
        //                 type: 'error',
        //                 text1: 'Something went wrong!',
        //                 text2: result?.message,
        //             });
        //             setLoading(true);
        //         }
        //     })
        //     .catch((error) => {
        //         console.log('error', error);
        //         Toast.show({
        //             type: 'error',
        //             text1: 'Something went wrong!',
        //             text2: error,
        //         });
        //         setLoading(true)
        //     });

        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'place_order?package_id=' + ids,
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('Profile', config);
        axios.request(config)
            .then((response) => {
                setLoading(false)
                console.log(JSON.stringify(response));
                // setData(response?.data?.data);
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const renderItems = (info) => {

        return (
            <View style={{ padding: 25, flexDirection: 'row', alignItems: 'center', backgroundColor: '#bae1ff', margin: 10, borderRadius: 10, elevation: 5 }}>
                <Image style={{ width: 40, height: 40, resizeMode: 'contain', }} source={require('../../assets/wallet_info.png')} />
                <View style={{ flex: 1 }}>
                    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 18, marginLeft: 10, }}>₹{info?.item?.amount}/-</Text>
                    <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10, marginLeft: 10, color: 'grey' }}>Unlimited</Text>
                </View>
                <TouchableOpacity onPress={() => rechargeNow(info?.item?.id)} style={{ backgroundColor: '#000000', paddingVertical: 8, paddingHorizontal: 25, borderRadius: 10 }}>
                    <Text style={{ color: '#fff', textTransform: 'capitalize', fontWeight: 'bold' }}>recharge now</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const onMessage = (info) => {
        console.log('response_payment:------------>', JSON.stringify(info?.nativeEvent?.data));
        if (info?.nativeEvent?.data === 'Success') {
            setLinkTrue(false);
            Alert.alert('Payment Successfully!');
        } else {
            Alert.alert('Payment Not Successfully! \n try Again for recharge');
            setLinkTrue(false);
        }
    }

    return (<View style={{ flex: 1 }}>{isLinkTrue === true ?
        <View style={{ flex: 1, backgroundColor: "#fff", }}>
            <WebView
                style={{ flex: 1, marginTop: 30, resizeMode: 'cover', }}
                scalesPageToFit={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                // source={{ uri: 'https://sewamoapp-185293-ruby.b185293.stage.eastus.az.svc.builder.ai/bx_block_transactions/transactions/new?order_id=134' }}
                source={{ uri: globle.API_BASE_URL + 'place_order?package_id=' + package_id + '&user_id=' + UserId }}
                startInLoadingState={true}
                onMessage={(data) => onMessage(data)}
            />
        </View> :
        <View style={{ marginTop: 25, padding: 20, flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: 'grey', borderBottomWidth: 1, padding: 10 }}>
                <TouchableOpacity onPress={() => navigate.goBack()} style={{ padding: 5, zIndex: 9999 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', flex: 1, marginLeft: -20, fontWeight: 'bold', fontSize: 15 }}>Package List</Text>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    keyExtractor={(ed) => ed.id}
                    renderItem={(items) => renderItems(items)}
                />
            </View>
        </View>}
    </View>)
}

export default PurchasePackageList;