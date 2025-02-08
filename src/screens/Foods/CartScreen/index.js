import { View, Text, TouchableOpacity, StatusBar, Image, FlatList, Dimensions, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet from "react-native-gesture-bottom-sheet";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import Toast from 'react-native-toast-message';
import globle from '../../../../common/env';
import React from 'react';

const CartScreenFood = () => {

    const [DataCart, setDataCart] = React.useState([]);
    const [AddressData, setAddressData] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);
    const [TotalPrice, setTotalPrice] = React.useState(0);
    const [CartCount, setCartCount] = React.useState(0);
    const [AddressId, setAddressId] = React.useState('');
    const [PaymentMode, setPaymentMode] = React.useState('');
    const [DeliveryAddress, setDeliveryAddress] = React.useState('');
    const [DeliveryCharge, setDeliveryCharge] = React.useState(0);
    const [order_id, setOrderId] = React.useState('');
    const [user_id, setUserId] = React.useState('');
    const bottomSheet = React.useRef();
    const bottomPaymnetTypeSheet = React.useRef();
    const navigation = useNavigation();
    const route = useRoute();

    useFocusEffect(
        React.useCallback(() => {
            loadProducts();
            DisplayAddress();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const loadProducts = async (id) => {
        setLoading(true);
        console.log(JSON.stringify(id))
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

        fetch(globle.API_BASE_URL + 'my-cart-list', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log('loadProducts_', JSON.stringify(data));
                if (data?.status) {
                    setLoading(false);
                    setDataCart(data?.cart);
                    setTotalPrice(data?.total_price);
                    setCartCount(data?.cart_count);
                    setDeliveryCharge(data?.delivery_charge);
                } else {
                    setLoading(false);
                    setDataCart([]);
                }
            })
            .catch(error => setLoading(false));
    }

    const DisplayAddress = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        setUserId(userId);
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
        console.log('DisplayAddress_', JSON.stringify(requestOptions));
        fetch(globle.API_BASE_URL + 'address-list', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log('DisplayAddress_', JSON.stringify(data));
                if (data?.status) {
                    setAddressData(data?.data);
                } else {
                }
            })
            .catch(error => setLoading(false));
    }

    const removeFromCart = async (item) => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);
        const formdata = new FormData();
        formdata.append('product_id', item?.id);
        formdata.append('user_id', userId);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };
        fetch(globle.API_BASE_URL + 'remove-from-cart', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data?.status === true) {
                    setLoading(false);
                    loadProducts();
                } else {
                    setLoading(false);
                }
            })
            .catch(error => setLoading(false));

    }

    const renderItemsCard = (item) => {

        return (
            <View style={{ margin: 5, backgroundColor: '#ffffff', elevation: 5, borderRadius: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', item)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ padding: 10 }}>
                        <Image style={{ height: 110, width: 110, resizeMode: 'cover', marginRight: 10, borderRadius: 15 }} source={{ uri: 'https://theparihara.com/Parihara/public/' + item?.image }} />
                    </TouchableOpacity>
                    <View style={{ marginRight: 20, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, fontFamily: 'Poppins-Medium' }}>{item?.product_name}</Text>
                        <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: 14, color: '#b4b4b4', fontFamily: 'Poppins-Medium' }}>{item?.description}</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#b4b4b4', fontFamily: 'Poppins-Medium' }}>{item?.attribute_title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18, fontFamily: 'Poppins-Medium', color: '#000000', }}>₹ {item?.total_price}</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#000000', fontFamily: 'Poppins-Medium', flex: 1, textAlign: 'right' }}>1 x {item?.cart_qty}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ position: 'absolute', top: 10, right: 10, }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../../../assets/cancel.png')} />
                </TouchableOpacity>
            </View>
        )
    }

    const renderAddressCard = (info) => {
        return (
            <TouchableOpacity onPress={() => GoToSaveAddress(info)} style={{ padding: 15, backgroundColor: '#ffffff', margin: 10, borderRadius: 10, elevation: 5 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{info?.full_name}, {info?.address_type}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{info?.mobile}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{info?.house_no}</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{info?.appartment}, {info?.pincode}</Text>
            </TouchableOpacity>
        )
    }

    const GoToSaveAddress = (info) => {
        setAddressId(info?.id);
        let saveAddress = info?.full_name + ',' + info?.address_type + ',' + info?.house_no + ',' + info?.appartment + ',' + info?.pincode;
        setDeliveryAddress(saveAddress);
        bottomSheet.current.close();
    }

    const CheckAddressAvailable = () => {
        if (AddressId === '') {
            bottomSheet.current.show()

        } else if (PaymentMode === '') {
            bottomPaymnetTypeSheet.current.show()
        } else {
            GoToCompleteOrder();
        }
    }

    const GoToCompleteXOrder = () => {
        bottomSheet.current.close();
    }

    const GoToNewAddress = () => {
        bottomSheet.current.close();
        navigation.navigate('AddAddressScreen');
    }

    const GoToCompleteOrder = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);
        const formdata = new FormData();
        formdata.append('user_id', userId);
        formdata.append('payment_mode', PaymentMode);
        formdata.append('address_id', AddressId);
        formdata.append('delivery_charge', DeliveryCharge);
        formdata.append('promocode', '');
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        console.log('loadProducts', JSON.stringify(requestOptions));
        fetch(globle.API_BASE_URL + 'place-order', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('loadProducts', JSON.stringify(result));
                if (result.status) {
                    Toast.show({
                        type: 'success',
                        text1: result?.message,
                        text2: result?.message,
                    });
                    setOrderId(result?.order_number);
                    if (PaymentMode.match('ONLINE')) {
                        navigation.navigate('PaymentGalewayScreen', result?.order_number);
                    } else {
                        UpdateCart();
                    }
                    setLoading(false);
                } else {
                    setLoading(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Error Address',
                        text2: 'Something went wrong!',
                    });
                }
            })
            .catch(error => {
                setLoading(false)
                console.log('loadProducts', JSON.stringify(error));
            });
    }

    const UpdateCart = () => {
        loadProducts();
        DisplayAddress();
    }

    const updatePaymentMode = (mode) => {
        if (mode === 'ONLINE') {
            bottomPaymnetTypeSheet.current.close();
            setPaymentMode(mode);
        } else if (mode === 'COD') {
            bottomPaymnetTypeSheet.current.close();
            setPaymentMode(mode);
        }
    }

    const onMessage = (info) => {
        console.log('response_payment:------------>', JSON.stringify(info?.nativeEvent?.data));
        if (info?.nativeEvent?.data === 'Success') {
            // setLinkTrue(false);
            Alert.alert('Payment Successfully!');
        } else {
            Alert.alert('Payment Not Successfully! \n try Again for recharge');
            // setLinkTrue(false);
        }
    }

    return (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#ffffff', elevation: 5 }}>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cart</Text>
            </View>
            {isLoading === true ? <Image style={{ height: 150, width: 150, resizeMode: 'contain', alignItems: 'center', alignSelf: 'center', marginTop: Dimensions.get('screen').width - 100 }} source={require('../../../assets/food_processing.gif')} /> :
                <View
                    style={{ flex: 1, padding: 5, backgroundColor: '#ffffff', marginTop: 1, }} >
                    <View
                        style={{ flexGrow: 1, marginTop: 2, }} >
                        <FlatList
                            style={{ height: Dimensions.get('screen').height / 1, marginTop: 2, }}
                            ListEmptyComponent={<View style={{ marginTop: 130, alignItems: 'center' }}>
                                <Image style={{ width: 350, height: 350, resizeMode: 'contain' }} source={require('../../../assets/no_data.jpeg')} />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, color: '#b4b4b4' }}>Cart Empty</Text></View>}
                            data={DataCart}
                            keyExtractor={(id) => id}
                            renderItem={({ item }) => renderItemsCard(item)}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    <View style={{ display: DataCart.length === 0 ? 'none' : 'flex', padding: 15, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000000', zIndex: 9999, elevation: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 50, marginBottom: 15 }}>
                            <TextInput style={{ flex: 1, marginLeft: 20, fontSize: 16 }} placeholder='Enter Coupon' placeholderTextColor={'#b4b4b4'} />
                            <TouchableOpacity style={{ padding: 5, backgroundColor: '#000000', borderRadius: 50, marginLeft: 10, marginRight: 10, }}>
                                <Text style={{ paddingVertical: 5, paddingHorizontal: 25, color: '#ffffff', fontWeight: 'bold' }}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={{ fontWeight: 'bold', flex: 1, color: '#ffffff', fontFamily: 'Poppins-Medium' }}>Item's</Text>
                            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>x{DataCart.length}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={{ fontWeight: 'bold', flex: 1, color: '#ffffff', fontFamily: 'Poppins-Medium' }}>Total Amount</Text>
                            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontFamily: 'Poppins-Medium' }}>₹ {TotalPrice}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', flex: 1, color: '#ffffff', fontFamily: 'Poppins-Medium' }}>Delivey Charges</Text>
                            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontFamily: 'Poppins-Medium' }}>₹ {DeliveryCharge}</Text>
                        </View>
                        <View style={{ display: DeliveryAddress === '' ? 'none' : 'flex', marginTop: 5 }}>
                            <Text style={{ fontSize: 10, color: '#fff', fontFamily: 'Poppins-Medium' }}>Delivey Address : {DeliveryAddress}</Text>
                        </View>
                        <View style={{ width: '100%', height: 1, backgroundColor: '#b4b4b4', marginVertical: 10 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={{ fontWeight: 'bold', flex: 1, color: '#ffffff', fontSize: 22, fontWeight: 'bold', fontFamily: 'Poppins-Medium' }}>Total Amount</Text>
                            <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: 'bold', fontFamily: 'Poppins-Medium' }}>₹ {TotalPrice}</Text>
                        </View>
                        <TouchableOpacity onPress={() => CheckAddressAvailable()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ paddingVertical: 18, backgroundColor: '#3b8132', borderRadius: 6, paddingHorizontal: 15, elevation: 5 }}>
                            <Text style={{ color: '#ffffff', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', fontFamily: 'Poppins-Medium' }}>Proceed To Pay {'- ' + PaymentMode}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            <BottomSheet
                hasDraggableIcon
                radius={20}
                ref={bottomSheet}
                height={450} >
                <View style={{ padding: 15, alignSelf: 'center', alignItems: 'center', width: '100%' }}>
                    <TouchableOpacity style={{ paddingVertical: 16, paddingHorizontal: 15, backgroundColor: '#000000', borderRadius: 5, width: '100%' }} onPress={() => GoToNewAddress()} >
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>Add New Address</Text>
                    </TouchableOpacity>
                    <View style={{ width: '100%', height: 1, backgroundColor: '#b4b4b4', marginVertical: 1 }} />
                    <View>
                        <FlatList
                            style={{ flex: 1, width: Dimensions.get('screen').width - 10, marginHorizontal: 10 }}
                            data={AddressData}
                            keyExtractor={(id) => id}
                            renderItem={({ item }) => renderAddressCard(item)}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </BottomSheet>
            <BottomSheet
                hasDraggableIcon
                radius={20}
                ref={bottomPaymnetTypeSheet}
                height={450} >
                <View style={{ padding: 15, alignSelf: 'center', alignItems: 'center', width: '90%' }}>
                    <Text>Payment Mode</Text>
                    <View style={{ width: '100%', height: 1, backgroundColor: '#b4b4b4', marginVertical: 1 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                        <TouchableOpacity onPress={() => updatePaymentMode('COD')} style={{ flex: 1, backgroundColor: '#000000', borderRadius: 5, width: '100%', marginRight: 10, padding: 10 }}>
                            <Text style={{ padding: 5, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>COD</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updatePaymentMode('ONLINE')} style={{ flex: 1, backgroundColor: '#000000', borderRadius: 5, width: '100%', padding: 10 }}>
                            <Text style={{ padding: 5, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>ONLINE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        </View>
    )
}

export default CartScreenFood