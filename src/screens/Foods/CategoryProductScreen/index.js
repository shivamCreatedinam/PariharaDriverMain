import React from 'react';
import { Text, View, RefreshControl, Image, FlatList, ScrollView, Dimensions, ActivityIndicator, StatusBar, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { decode as atob, encode as btoa } from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globle from '../../../../common/env';
import axios from 'axios';

export default function CategoryProductDetails() {

    const [productData, setProductData] = React.useState([]);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
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
        console.log(JSON.stringify(id))
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let userId = JSON.parse(valueX)?.id;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + data);

        const formdata = new FormData();
        formdata.append('category_id', route.params?.id);
        formdata.append('user_id', userId);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata,
            redirect: "follow"
        };

        fetch(globle.API_BASE_URL + 'category-product-list', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status) {
                    setLoading(false);
                    setProductData(result?.product);
                }
            })
            .catch((error) => console.error(error));
    }

    const GoToProductDetails = (info) => {
        navigation.navigate('ProductDetails', info);
    }

    const GoToViewProductDetails = (info) => {
        navigation.navigate('CartScreenFood', info);
    }

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
    }

    const renderItemsCard = (item) => {

        return (
            <View style={{ backgroundColor: '#fff', width: Dimensions.get('screen').width / 2 - 23, borderRadius: 20, margin: 5, elevation: 5 }}>
                <View>
                    <TouchableOpacity onPress={() => GoToProductDetails(item)}>
                        <Image style={{ width: '100%', height: 160, resizeMode: 'cover', alignSelf: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={{ uri: 'https://theparihara.com/Parihara/public/' + item?.image }} />
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={{ paddingLeft: 10, color: '#000000', flex: 1, fontSize: 16, fontFamily: 'Poppins-Medium', position: 'absolute', bottom: 0, left: 0, color: '#FFFFFF' }}>₹ {item?.market_price} only</Text>
                </View>
                <View style={{ marginTop: 5, minHeight: 30, }}>
                    <Text adjustsFontSizeToFit={false} numberOfLines={1} style={{ fontSize: 14, paddingHorizontal: 10, paddingHorizontal: 5, fontWeight: '400', textAlign: 'left', fontWeight: '600', fontFamily: 'Poppins-Medium', textTransform: 'capitalize', marginLeft: 5 }}>{item?.product_name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                        <Image style={{ height: 15, width: 15, resizeMode: 'contain' }} source={require('../../../../src/assets/stopwatch.png')} />
                        <Text style={{ fontWeight: '800', color: 'green', marginLeft: 4, fontSize: 13, fontFamily: 'Poppins-Medium' }}>{getRandomInt(20, 50)} mins • {getRandomInt(2, 6)} km</Text>
                    </View>
                    {/* <Text adjustsFontSizeToFit={false} numberOfLines={2} style={{ fontSize: 11, paddingHorizontal: 10, paddingHorizontal: 5, textAlign: 'auto' }}>{item?.description}</Text> */}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingRight: 5, marginTop: 5, flex: 1 }}>
                    {item?.cart_status === 'No' ? <TouchableOpacity onPress={() => GoToProductDetails(item)} style={{ paddingHorizontal: 25, paddingVertical: 4, backgroundColor: '#000', borderRadius: 55, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 16, color: '#ffffff', fontFamily: 'Poppins-Medium' }}>View Item</Text>
                    </TouchableOpacity> : <TouchableOpacity onPress={() => GoToViewProductDetails(item)} style={{ paddingHorizontal: 25, paddingVertical: 4, backgroundColor: '#000', borderRadius: 55, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 16, color: '#ffffff', fontFamily: 'Poppins-Medium' }}>View Cart</Text>
                    </TouchableOpacity>}
                </View>
                <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', borderRadius: 100, elevation: 5 }}>
                    <Image style={{ width: 25, height: 25, }} source={item?.wishlist_status === 'No' ? require('../../../assets/wishlist_no.png') : require('../../../assets/wishlist.png')} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View>
            <View style={{ padding: 15, marginTop: StatusBar.currentHeight, flexDirection: 'row', alignItems: 'center', elevation: 5, backgroundColor: '#ffffff' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={{ width: 25, height: 25 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Image style={{ height: 35, width: 35, resizeMode: 'cover', marginLeft: 20, borderRadius: 100 }} source={{ uri: 'https://theparihara.com/Parihara/public/' + route.params?.image }} />
                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 16, marginLeft: 10, fontFamily: 'Poppins-Medium', textTransform: 'capitalize' }}>{route.params?.category_name}</Text>
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
                    } >
                    <FlatList
                        style={{ marginBottom: 10, marginLeft: 15, }}
                        numColumns={2}
                        horizontal={false}
                        data={productData}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item }) => renderItemsCard(item)}
                    />
                    {productData?.length === 0 && <View style={{ marginTop: 130, alignItems: 'center' }}>
                        <Image style={{ width: 350, height: 350, resizeMode: 'contain' }} source={require('../../../assets/no_data.jpeg')} />
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, color: '#b4b4b4', fontFamily: 'Poppins-Medium' }}>No Products Found</Text></View>}
                </ScrollView>}
        </View>
    )
}

const styles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
})