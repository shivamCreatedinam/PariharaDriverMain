import React from 'react';
import { Text, View, ImageBackground, Image, FlatList, ScrollView, Dimensions, TextInput, StatusBar, TouchableOpacity, useWindowDimensions, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob, encode as btoa } from 'base-64';
import { SliderBox } from "react-native-image-slider-box";
import globle from '../../../common/env';
import axios from 'axios';

// https://example.com/wp-json/wc/v3/products?categories=15&?consumer_key=ck_6b20b87f3dd27c9a9e878a3d5baf03c47656a903&consumer_secret={{consumer_secret}}

const HomeFoodScreen = () => {

    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const [search, setSearch] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [productData, setProductData] = React.useState([]);
    const [CategoryData, setCategoryData] = React.useState([]);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [OfferBannerImages, setOfferBannerImages] = React.useState([]);
    const [restaurantList, setRestaurantList] = React.useState([]);
    const [DealsOfWeek, setDealsOfWeek] = React.useState([]);

    const loadProducts = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'homepage',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response.data.status) {
                    console.log(JSON.stringify(response.data));
                    setLoading(false)
                    setProductData(response.data?.popular);
                    setOfferBannerImages(response.data?.slider);
                    setRestaurantList(response.data?.restaurant);
                    setDealsOfWeek(response.data?.deals_of_week);
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
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

    return (
        <ImageBackground
            source={require('../../assets/background_images.gif')}
            style={{ width: '100%', height: '100%' }}>
            <View style={{ marginTop: StatusBar.currentHeight + 15, paddingLeft: 15, paddingRight: 15, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput editable={false} style={{ color: '#fff', backgroundColor: '#fff', borderRadius: 20, paddingLeft: 15, elevation: 5, flex: 1, fontFamily: 'Poppins-Medium', fontSize: 12 }} placeholder='Find for food or restaurant' />
                <TouchableOpacity onPress={() => navigation.navigate('CartScreenFood')} style={{ padding: 10, backgroundColor: '#fff', borderRadius: 15, marginLeft: 10 }}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/shoppingbag.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FoodOrderHistoryScreen')} style={{ padding: 10, backgroundColor: '#fff', borderRadius: 15, marginLeft: 10 }}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/order_history.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FoodNotificationScreen')} style={{ padding: 10, backgroundColor: '#fff', borderRadius: 15, marginLeft: 10 }}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/bell_icon_cart.png')} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginTop: 10 }}>
                <SliderBox
                    sliderBoxHeight={200}
                    dotColor="#FFEE58"
                    inactiveDotColor="#90A4AE"
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 15,
                        marginHorizontal: 1,
                        padding: 0,
                        margin: 0
                    }}
                    activeOpacity={0.5}
                    paginationBoxVerticalPadding={10}
                    ImageComponentStyle={{ borderRadius: 15, width: '90%', marginTop: 5 }}
                    imageLoadingColor="#2196F3"
                    autoplayInterval={5000}
                    autoplay
                    circleLoop={true}
                    images={restaurantList}
                    onCurrentImagePressed={index => navigation.navigate('FoodHomeScreen')}
                />
            </View>
        </ImageBackground>
    )

}

export default HomeFoodScreen;