import { View, Text, TouchableOpacity, StatusBar, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import React from 'react';

const FoodNotificationScreen = () => {

    const [DataCart, setDataCart] = React.useState([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    const navigation = useNavigation();

    const showErrorToast = (msg) => {
        Toast.show({
            type: 'error',
            text1: 'Something went wrong!',
            text2: msg
        });
    }

    const renderItemsCard = (item) => {
        return (
            <View style={{ margin: 5, backgroundColor: '#ffffff', elevation: 5, borderRadius: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#666362' }}>Order : 0923029{item.id}PLOK</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#b4b4b4' }}>12 February 2024 At 5:34Pm  </Text>
                    </View>
                    <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ backgroundColor: '#000000', padding: 8, borderRadius: 5, marginRight: 15 }}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: '#ffffff' }} source={require('../../../assets/bills.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: '#b4b4b4', marginVertical: 10 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <TouchableOpacity onPress={() => showErrorToast('Upload Correct Driving Licence Image')} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ padding: 10 }}>
                        <Image style={{ height: 110, width: 110, resizeMode: 'cover', marginRight: 10, borderRadius: 15 }} source={{ uri: 'https://images.squarespace-cdn.com/content/v1/63120ad437b82d25a00b57a7/1662129666499-6EV1U19KMVD9CE3A2TQ6/unsplash-image-H2RzlOijhlQ.jpg' }} />
                    </TouchableOpacity>
                    <View style={{ marginRight: 20, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>FRENCH FRIES</Text>
                        <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: 14, color: '#b4b4b4' }}>Fries, nuggets & poppers to calm your hunger, quick solution to hunger pangs. Never compromise on the taste.</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#b4b4b4' }}>EASY BITES</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>₹ 99</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: '#3b8132', borderRadius: 5, marginRight: 5, backgroundColor: '#3b8132', elevation: 5 }} />
                            <Text style={{ fontWeight: 'bold', color: '#3b8132' }}>Order Delivered</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight, height: Dimensions.get('screen').height }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 7, backgroundColor: '#ffffff', elevation: 5 }}>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18, fontFamily: 'Poppins-Medium' }}>Notifications</Text>
            </View>
            <View
                style={{ flex: 1, padding: 5, backgroundColor: '#ffffff', marginTop: 1, }} >
                <View
                    style={{ flexGrow: 1, marginTop: 2, }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: Dimensions.get('screen').height / 2.5, textAlign: 'center', color: '#b4b4b4', fontFamily: 'Poppins-Medium' }}>No Upcoming Notification</Text>
                    <FlatList
                        style={{ display: 'none' }}
                        data={DataCart}
                        keyExtractor={(id) => id}
                        renderItem={({ item }) => renderItemsCard(item)}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </View>
    )
}

export default FoodNotificationScreen


const styles = StyleSheet.create({})