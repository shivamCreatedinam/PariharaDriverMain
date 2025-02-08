import { View, Text, TouchableOpacity, StatusBar, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import globle from '../../../../common/env';
import React from 'react';
import { ActivityIndicator } from 'react-native';

const FoodOrderHistoryScreen = () => {

    const [DataCart, setDataCart] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const navigation = useNavigation();

    const showErrorToast = (msg, orderReciptId) => {
        Toast.show({
            type: 'success',
            text1: 'Download Order Recipt ' + orderReciptId + '',
            text2: msg
        });
    }

    useFocusEffect(
        React.useCallback(() => {
            loadProducts();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const onRefresh = () => {
        //set isRefreshing to true
        setIsRefreshing(true);
        loadProducts();
        // and set isRefreshing to false at the end of your callApiMethod()
    }

    const loadProducts = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);
        const formdata = new FormData();
        formdata.append('user_id', userId);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };
        fetch(globle.API_BASE_URL + 'my-order-list', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result?.status) {
                    setLoading(false);
                    setIsRefreshing(false);
                    setDataCart(result?.order);
                }
            })
            .catch(error => setLoading(false));

        // showErrorToast('Download Order Recipt in progress...', '0923029' + item?.id + 'PLOK')
    }

    const renderItemsCard = (item) => {
        return (
            <View style={{ margin: 5, backgroundColor: '#ffffff', elevation: 5, borderRadius: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#666362' }}>Order : {item?.order_number}</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#b4b4b4' }}>{item?.created_date} At {item?.created_time} </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('OrderDetailsSingleProduct', item)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ backgroundColor: '#000000', padding: 8, borderRadius: 5, marginRight: 15 }}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: '#ffffff' }} source={require('../../../assets/bills.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: '#b4b4b4', marginVertical: 10 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ padding: 10 }}>
                        <Image style={{ height: 100, width: 100, resizeMode: 'cover', marginRight: 10, borderRadius: 15 }} source={{ uri: 'https://cdn.dribbble.com/users/655390/screenshots/3174374/food-app-loader-2.gif' }} />
                    </TouchableOpacity>
                    <View style={{ marginRight: 20, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item?.appartment}</Text>
                        <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: 14, color: '#b4b4b4' }}>{item?.house_no}</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#b4b4b4' }}>EASY BITES</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item?.payment_mode}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>  ₹ {item?.sub_total}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginBottom: 5 }}>
                                <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../../assets/restaurant_icon.png')} />
                                <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: '#3b8132', borderRadius: 5, marginRight: 5, backgroundColor: '#3b8132', elevation: 5 }} />
                                <Text adjustsFontSizeToFit={true} style={{ fontWeight: 'bold', color: '#3b8132' }}>{item?.order_status}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }} source={require('../../../assets/payment_method.png')} />
                                <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: '#3b8132', borderRadius: 5, marginRight: 5, backgroundColor: '#3b8132', elevation: 5 }} />
                                <Text style={{ fontWeight: 'bold', color: '#3b8132' }}>{item?.payment_status}</Text>
                            </View>
                            {item.id === 2 ?
                                <TouchableOpacity onPress={() => navigation.navigate('FoodOrderTrackScreen')} style={{ borderRadius: 1, borderWidth: 1, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 5, backgroundColor: '#000000', elevation: 5 }}>
                                    <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Track Order</Text>
                                </TouchableOpacity> : null}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight + 20, height: Dimensions.get('screen').height }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 7, backgroundColor: '#ffffff', elevation: 5 }}>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Orders History</Text>
            </View>
            <View
                style={{ flex: 1, padding: 5, backgroundColor: '#ffffff', marginTop: 1, }} >
                {isLoading === true ? <ActivityIndicator style={{ marginTop: Dimensions.get('screen').height / 2.5 }} size={'large'} color={'#000000'} /> :
                    <View
                        style={{ flexGrow: 1, marginTop: 2, }} >
                        {DataCart.length === 0 ? <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>No Order Found</Text> :
                            <FlatList
                                style={{}}
                                data={DataCart.slice(0, 10)}
                                keyExtractor={(id) => id}
                                refreshing={isRefreshing}
                                onRefresh={() => onRefresh()}
                                renderItem={({ item }) => renderItemsCard(item)}
                                showsVerticalScrollIndicator={false}
                            />}
                    </View>}
            </View>
        </View>
    )
}

export default FoodOrderHistoryScreen


const styles = StyleSheet.create({})