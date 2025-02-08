import { View, Text, TouchableOpacity, StatusBar, Image, FlatList, Dimensions, StyleSheet, Linking, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globle from '../../../../common/env';
import React from 'react';

const OrderDetailsSingleProduct = () => {

    const [OrderDetails, setOrderDetails] = React.useState(null);
    const [RestaurantDetails, setRestaurantDetails] = React.useState(null);
    const [OrderProducts, setOrderProducts] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const navigation = useNavigation();
    const route = useRoute();


    useFocusEffect(
        React.useCallback(() => {
            loadProducts(route.params);
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const loadProducts = async (info) => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);
        const formdata = new FormData();
        formdata.append('order_number', info?.order_number);
        formdata.append('user_id', userId);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };
        console.log(JSON.stringify(requestOptions));
        fetch(globle.API_BASE_URL + 'my-order-details', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result?.status) {
                    console.log(JSON.stringify(result));
                    setOrderDetails(result?.order_details);
                    setOrderProducts(result?.ordered_product);
                    setRestaurantDetails(result?.restaurant);
                    setLoading(false);
                    setIsRefreshing(false);
                }
            })
            .catch(error => setLoading(false));

        // showErrorToast('Download Order Recipt in progress...', '0923029' + item?.id + 'PLOK')
    }



    const renderItemsCard = (item) => {
        return (
            <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#ffffff', elevation: 5, borderRadius: 10, margin: 2 }}>
                <Image style={{ width: 100, height: 100, borderRadius: 10 }} source={{ uri: 'https://theparihara.com/Parihara/public/' + item?.image }} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 2 }}>{item?.product_name}</Text>
                    <Text numberOfLines={2} style={{ marginRight: 15, marginTop: 5, fontWeight: 'bold', color: '#b4b4b4' }}>{item?.description}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Text style={{ fontWeight: 'bold' }}>₹ {item?.total_price}/-</Text>
                        <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{item?.attribute_title}</Text>
                    </View>
                    <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>qty - {item?.qty}</Text>
                </View>
            </View>
        )
    }

    const trackOrderStatus = () => {
        let infoTracker = {
            latitude: OrderDetails?.latitude,
            longitude: OrderDetails?.longitude,
            restaurent_latitude: RestaurantDetails?.latitude,
            restaurent_longitude: RestaurantDetails?.latitude,
            order_id: OrderDetails?.order_number
        }
        console.log(JSON.stringify(infoTracker));
        navigation.navigate('FoodOrderTrackScreen', infoTracker);
    }

    return (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight + 20, height: Dimensions.get('screen').height }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 7, backgroundColor: '#ffffff', elevation: 5 }}>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Orders Details</Text>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => loadProducts()}
                    />
                }
            >
                <View>
                    {isLoading === true ? <Text>Loading...</Text> :
                        <View>
                            <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 12, marginTop: 15 }}>Order Delivey Details</Text>
                            <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#ffffff', elevation: 5, margin: 4, }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#b4b4b4' }}>#{OrderDetails?.order_number}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#000000' }}>{OrderDetails?.payment_mode} - ₹{OrderDetails?.grand_total}/-</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 22, color: '#000000' }}>{OrderDetails?.full_name} - {OrderDetails?.mobile}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>Address Type - {OrderDetails?.address_type}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>{OrderDetails?.house_no}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000000' }}>{OrderDetails?.appartment}, {OrderDetails?.pincode}</Text>
                            </View>
                            <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 12, marginTop: 15 }}>Order Payment Status</Text>
                            <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#ffffff', elevation: 5, margin: 4, }}>
                                <Text>Order Food Status - {OrderDetails?.order_status}</Text>
                                <Text style={{ paddingTop: 10 }}>Payment Status - {OrderDetails?.payment_status}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1 }}>Payment Mode - {OrderDetails?.payment_mode}</Text>
                                    {OrderDetails?.payment_status === 'Pending' && OrderDetails?.payment_mode === 'ONLINE' ?
                                        <TouchableOpacity style={{ backgroundColor: '#000000', marginLeft: 10, borderRadius: 5, paddingVertical: 10, paddingHorizontal: 40 }} onPress={() => navigation.navigate('PaymentGalewayScreen', OrderDetails?.order_number)}>
                                            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Pay Now</Text>
                                        </TouchableOpacity> : null}
                                </View>
                            </View>
                            {RestaurantDetails !== null ?
                                <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#ffffff', elevation: 5, margin: 4, }}>
                                    <Image style={{ height: 100, width: 100, resizeMode: 'cover', alignSelf: 'flex-start', borderRadius: 100 }} source={{ uri: 'https://theparihara.com/Parihara/public/' + RestaurantDetails?.image }} />
                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{RestaurantDetails?.restaurant_name}</Text>
                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${RestaurantDetails?.mobile}`)}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{RestaurantDetails?.mobile}</Text>
                                    </TouchableOpacity>
                                    <Text>{RestaurantDetails?.email}</Text>
                                    <Text>Address: {RestaurantDetails?.address}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Store Time : </Text>
                                        <Text>{RestaurantDetails?.open_times} - </Text>
                                        <Text>{RestaurantDetails?.close_status}</Text>
                                    </View>
                                </View> : null}
                            <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 12, marginTop: 15 }}>Deliver Boy Status</Text>
                            <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#ffffff', elevation: 5, margin: 4, }}>
                                {OrderDetails?.delivery_boy_name === null ? <Text style={{ padding: 10, fontWeight: 'bold', fontSize: 16 }}>No Delivery Boy Assigned</Text> : <View>
                                    <Text style={{ textTransform: 'capitalize' }}>Driver Name - {OrderDetails?.delivery_boy_name}</Text>
                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${OrderDetails?.delivery_boy_mobile}`)}>
                                        <Text style={{ fontWeight: 'bold' }}>Driver Mobile - {OrderDetails?.delivery_boy_mobile}</Text>
                                    </TouchableOpacity>
                                </View>}
                            </View>
                            <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#ffffff', elevation: 5, margin: 4, }}>
                                {OrderDetails?.delivery_boy_name === null ? <Text style={{ padding: 10, fontWeight: 'bold', fontSize: 16 }}>Order Tracking Not Available - Pending Delivery Status</Text> : <View>
                                    <TouchableOpacity onPress={() => trackOrderStatus()} style={{ borderRadius: 1, borderWidth: 1, paddingVertical: 15, paddingHorizontal: 15, borderRadius: 5, backgroundColor: '#000000', elevation: 5 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', fontSize: 16 }}>Track Order</Text>
                                    </TouchableOpacity>
                                </View>}
                            </View>
                        </View>}
                </View>
                <View style={{ margin: 10 }}>
                    <FlatList
                        data={OrderProducts}
                        renderItem={({ item }) => renderItemsCard(item)}
                        keyExtractor={item => item.id}
                        refreshing={isRefreshing}
                        onRefresh={() => loadProducts()}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default OrderDetailsSingleProduct

const styles = StyleSheet.create({})