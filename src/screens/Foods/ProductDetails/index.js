import React from 'react';
import { Text, View, RefreshControl, Image, ActivityIndicator, ScrollView, Dimensions, Alert, StatusBar, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import globle from '../../../../common/env';

export default function ProductDetails() {

    const [productData, setProductData] = React.useState({});
    const [prodAttributes, setProdAttributes] = React.useState([]);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isQuantity, setQuantity] = React.useState(Number(productData?.cart_qty));
    const [isLoading, setLoading] = React.useState(false);
    const [Price, setPrice] = React.useState(null);
    const [value, setValue] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);
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

    const onRefresh = () => {
        loadProducts(route?.params);
    }

    const loadProducts = async (id) => {
        setLoading(true);
        console.log(JSON.stringify(id))
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);

        const formdata = new FormData();
        formdata.append('product_id', route.params?.id);
        // formdata.append('attributes_id', value);
        formdata.append('user_id', userId);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };

        fetch(globle.API_BASE_URL + 'product-details', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log('loadProducts', JSON.stringify(data));
                if (data.status) {
                    setLoading(false);
                    setProdAttributes(data.prod_attributes);
                    setProductData(data?.product_details);
                    setQuantity(data?.product_details?.cart_qty)
                }
            })
            .catch(error => setLoading(false));
    }

    const AddToWishlist = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);
        const formdata = new FormData();
        formdata.append('product_id', route.params?.id);
        formdata.append('user_id', userId);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        fetch(globle.API_BASE_URL + 'add-to-favourite', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    loadProducts(route.params?.id);
                    setLoading(false);
                }
            })
            .catch(error => setLoading(false));
    }

    const RemoveToWishlist = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);
        const formdata = new FormData();
        formdata.append('product_id', route.params?.id);
        formdata.append('user_id', userId);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        fetch(globle.API_BASE_URL + 'remove-favourite', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    loadProducts(route.params?.id);
                    setLoading(false);
                }
            })
            .catch(error => setLoading(false));
    }

    const AddToCart = async () => {
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);
        const formdata = new FormData();
        formdata.append('product_id', route.params?.id);
        formdata.append('attribute_id', value);
        formdata.append('user_id', userId);
        formdata.append('qty', 1);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        console.log('loadProducts', JSON.stringify(requestOptions));
        fetch(globle.API_BASE_URL + 'add-to-cart', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('loadProducts', JSON.stringify(result));
                if (result.status) {
                    Toast.show({
                        type: 'success',
                        text1: result?.message,
                        text2: result?.message,
                    });
                    loadProducts(route.params?.id);
                    setLoading(false);
                } else {
                    setLoading(false);
                    Toast.show({
                        type: 'error',
                        text1: result?.error?.attribute_id[0],
                        text2: result?.error?.attribute_id[0],
                    });
                }
            })
            .catch(error => setLoading(false));
    }

    const updateCartOptionPlus = async (qty) => {
        const QTY_NUMBER = Number(qty) + 1;
        console.log('updateCartOptionPlus', QTY_NUMBER);
        setQuantity(QTY_NUMBER)
        setLoading(true);
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);
        const formdata = new FormData();
        formdata.append('product_id', route.params?.id);
        formdata.append('user_id', userId);
        formdata.append('qty', QTY_NUMBER);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        console.log('loadProducts', JSON.stringify(requestOptions));
        fetch(globle.API_BASE_URL + 'cart-update', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('loadProducts', JSON.stringify(result));
                if (result.status) {
                    Toast.show({
                        type: 'success',
                        text1: result?.message,
                        text2: result?.message,
                    });
                    loadProducts(route.params?.id);
                    setLoading(false);
                } else {
                    setLoading(false);
                    Toast.show({
                        type: 'error',
                        text1: result?.error?.attribute_id[0],
                        text2: result?.error?.attribute_id[0],
                    });
                }
            })
            .catch(error => setLoading(false));
    }

    const updateCartOptionMinus = async (qty) => {
        const QTY_NUMBER = Number(qty) - 1;
        console.log('updateCartOptionPlus', QTY_NUMBER);
        if (QTY_NUMBER === 0) {
            setQuantity(QTY_NUMBER)
            setLoading(true);
            const valueX = await AsyncStorage.getItem('@autoUserGroup');
            let data = JSON.parse(valueX)?.token;
            let userId = JSON.parse(valueX)?.id;
            const myHeaders = new Headers();
            myHeaders.append("Authorization", 'Bearer ' + data);
            const formdata = new FormData();
            formdata.append('product_id', route.params?.id);
            formdata.append('user_id', userId);
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };
            console.log('loadProducts', JSON.stringify(requestOptions));
            fetch(globle.API_BASE_URL + 'remove-from-cart', requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('loadProducts', JSON.stringify(result));
                    if (result.status) {
                        Toast.show({
                            type: 'success',
                            text1: result?.message,
                            text2: result?.message,
                        });
                        loadProducts(route.params?.id);
                        setLoading(false);
                    } else {
                        setLoading(false);
                        Toast.show({
                            type: 'error',
                            text1: result?.error?.attribute_id[0],
                            text2: result?.error?.attribute_id[0],
                        });
                    }
                })
                .catch(error => setLoading(false));
        } else {
            setQuantity(QTY_NUMBER)
            setLoading(true);
            const valueX = await AsyncStorage.getItem('@autoUserGroup');
            let data = JSON.parse(valueX)?.token;
            let userId = JSON.parse(valueX)?.id;
            const myHeaders = new Headers();
            myHeaders.append("Authorization", 'Bearer ' + data);
            const formdata = new FormData();
            formdata.append('product_id', route.params?.id);
            formdata.append('user_id', userId);
            formdata.append('qty', QTY_NUMBER);
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };
            console.log('loadProducts', JSON.stringify(requestOptions));
            fetch(globle.API_BASE_URL + 'cart-update', requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('loadProducts', JSON.stringify(result));
                    if (result.status) {
                        Toast.show({
                            type: 'success',
                            text1: result?.message,
                            text2: result?.message,
                        });
                        loadProducts(route.params?.id);
                        setLoading(false);
                    } else {
                        setLoading(false);
                        Toast.show({
                            type: 'error',
                            text1: result?.error?.attribute_id[0],
                            text2: result?.error?.attribute_id[0],
                        });
                    }
                })
                .catch(error => setLoading(false));
        }
    }

    return (
        <View>
            <View style={{ padding: 20, marginTop: StatusBar.currentHeight, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={{ width: 25, height: 25, marginTop: 0 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ flex: 1, fontWeight: 'bold', marginLeft: 20, fontSize: 16, marginTop: 0, fontFamily: 'Poppins-Medium' }}>{productData?.product_name}</Text>
            </View>
            {isLoading === true ?
                <Image style={{ height: 150, width: 150, resizeMode: 'contain', alignItems: 'center', alignSelf: 'center', marginTop: Dimensions.get('screen').width - 100 }} source={require('../../../assets/food_processing.gif')} /> :
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => onRefresh()}
                            tintColor="red"
                        />
                    }
                    style={{ marginBottom: 50 }}
                >
                    <View>
                        <Image style={{ height: 400, width: Dimensions.get('screen').width, resizeMode: 'cover' }} source={{ uri: 'https://theparihara.com/Parihara/public/' + productData?.image }} />
                        <View style={{ padding: 20, position: 'absolute', bottom: 5, right: 10 }}>
                            <Image style={{ width: 12, height: 12, resizeMode: 'contain', tintColor: '#ffffff' }} source={require('../../../assets/profile_icon.png')} />
                            <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold', fontSize: 14, fontFamily: 'Poppins-Medium' }}>{JSON.stringify(productData?.rating_count)}</Text>
                        </View>
                    </View>
                    <View style={{ padding: 20, marginBottom: 0 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 5 }} source={require('../../../assets/approved.png')} />
                            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ flex: 1, fontWeight: 'bold', fontSize: 26, textTransform: 'capitalize', marginRight: 10 }}>{productData?.product_name}</Text>
                            <View style={{}}>
                                <Text style={{ fontWeight: 'bold', fontSize: 26, color: '#000000', fontFamily: 'Poppins-Medium' }}>{Price === null ? '' : '₹ ' + Price + '/-'}</Text>
                            </View>
                        </View>
                        <View style={styles.container}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={prodAttributes}
                                search
                                maxHeight={300}
                                labelField="attribute_title"
                                valueField="attributes_id"
                                placeholder={!isFocus ? 'Select Attribute' : '...'}
                                searchPlaceholder="Search..."
                                value={value}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setPrice(item?.saling_price);
                                    setValue(item?.attributes_id);
                                    setIsFocus(false);
                                }}
                            />
                        </View>
                        <View style={{ paddingVertical: 10 }}>
                            {/* {prodAttributes?.map((items, index) => <Text style={{ paddingVertical: 5, backgroundColor: '#fff', color: '#000000', fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize' }}>{items?.saling_price}</Text>)} */}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Text numberOfLines={1} style={{ fontWeight: 'bold', color: '#000000', fontSize: 16, marginBottom: 20, fontFamily: 'Poppins-Medium' }}>{productData?.category_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', display: isQuantity <= 0 ? 'none' : 'flex', marginTop: -15 }}>
                                <TouchableOpacity onPress={() => updateCartOptionMinus(isQuantity)}>
                                    <Image style={{ height: 25, width: 25, resizeMode: 'contain' }} source={require('../../../assets/minus.png')} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 16, color: '#000000', fontFamily: 'Poppins-Medium', marginLeft: 10, marginRight: 10 }}>{isQuantity}</Text>
                                <TouchableOpacity onPress={() => updateCartOptionPlus(isQuantity)}>
                                    <Image style={{ height: 25, width: 25, resizeMode: 'contain' }} source={require('../../../assets/plus.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={{ fontWeight: '900', fontSize: 16, color: '#b4b4b4', fontFamily: 'Poppins-Medium' }}>{productData?.description}</Text>
                    </View>
                    <View style={{ position: 'absolute', top: 20, right: 20 }}>
                        {/* <Text style={{ fontSize: 14, color: '#ffffff' }}>Rating {productData?.average_rating}</Text> */}
                    </View>
                    <View style={{ padding: 20 }}>
                        {productData?.cart_status === 'No' ? <TouchableOpacity onPress={() => AddToCart()} style={{ padding: 20, backgroundColor: '#000000', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 25, height: 25, tintColor: '#ffffff' }} source={require('../../../assets/super_market_icon.png')} />
                            <Text style={{ color: '#ffffff', marginLeft: 30, fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', fontFamily: 'Poppins-Medium' }}>Order Now</Text>
                        </TouchableOpacity> :
                            <TouchableOpacity onPress={() => navigation.navigate('CartScreenFood')} style={{ padding: 20, backgroundColor: '#009900', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: 25, height: 25, tintColor: '#ffffff' }} source={require('../../../assets/super_market_icon.png')} />
                                <Text style={{ color: '#ffffff', marginLeft: 30, fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', fontFamily: 'Poppins-Medium' }}>View Cart</Text>
                            </TouchableOpacity>}
                    </View>
                    <TouchableOpacity onPress={() => productData?.wishstatus === 'No' ? AddToWishlist() : RemoveToWishlist()} style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', borderRadius: 100, elevation: 5, marginBottom: 100 }}>
                        <Image style={{ width: 25, height: 25, }} source={productData?.wishstatus === 'No' ? require('../../../assets/wishlist_no.png') : require('../../../assets/wishlist.png')} />
                    </TouchableOpacity>
                    <View style={{ marginBottom: 120 }} />
                </ScrollView>}
        </View>
    )
}

const styles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
        fontFamily: 'Poppins-Medium'
    },
    container: {
        backgroundColor: 'white',
        padding: 0,
        marginTop: 20,
        marginBottom: 10
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        fontFamily: 'Poppins-Medium'
    },
    placeholderStyle: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium'
    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})