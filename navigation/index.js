import * as React from 'react';
import { Image, Text, View, } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
// firebase 
import database from '@react-native-firebase/database';
// screens
import MapScreens from '../src/screens/map_screens';
import HomeScreen from '../src/screens/home_screen';
import RegisterScreen from '../src/screens/register_screen';
import ProfileScreen from '../src/screens/ProfileScreen';
import MapComponent from '../src/screens/TrackingMaps';
import LoginScreen from '../src/screens/login_screen';
import SplashAppScreen from '../src/screens/SplashScreen';
import SplashScreen from '../src/screens/splash_screen';
import TrackingMapsScreen from '../src/screens/tracking_maps';
import UpcomingTripsScreen from '../src/screens/upcoming_trips';
import EndStartScreen from '../src/screens/endtrip_screen';
import TripStartScreen from '../src/screens/tripstart_screen';
import OTPSubmitScreen from '../src/screens/submitOtpScreen';
import UserHomeScreen from '../src/screens/UserHomeScreen';
import TripHistoryScreen from '../src/screens/TripHistory';
import RegisterDriverTwoScreen from '../src/screens/registerDrivertwo';
import UserEditProfileScreen from '../src/screens/userEditProfile';
// driver
import DriverLoginScreen from '../src/screens/driverLogin';
import DriverProfileScreen from '../src/screens/driverProfile';
import NotificationScreen from '../src/screens/notificationScreen';
import StartTripSearchingScreen from '../src/screens/SearchStartTripLocation';
import SearchDestinationScreen from '../src/screens/SearchDestination';
import TripCreateScreen from '../src/screens/tripCreateScreen';
// master notification
import PurchasePackageList from '../src/screens/packageList';
import NotificationCenterScreen from '../src/screens/splash_screen';
import DriverTrackToMapsScreen from '../src/screens/trackingDrivertoTrip';
import TransactionHistoryScreen from '../src/screens/transactionHistoryScreen';
import BookingTripHistoryScreen from '../src/screens/TripHistory';
// new imports
import FoodHomeScreen from '../src/screens/Foods/FoodHome/';
import BookingHistoryScreen from '../src/screens/BookingHistory';
import EarningHistoryScreen from '../src/screens/EarninHistory';
import DriverEditScreen from '../src/screens/EditDriverProfile';
import VehicalDetailsScreen from '../src/screens/VehicalDetailsScreen';
import EnterDropLocationScreen from '../src/screens/EnterDropLocationScreen';
import RatingAndReviewScreen from '../src/screens/RatingAndReviewScreen';
import SettingScreen from '../src/screens/SettingScreen';
import ChangeLanguage from '../src/screens/ChnageLanguage';
// permission screen
import PermissionScreenMain from '../src/screens/PermissionScreen';
// DriverForgetPasswordScreen
import DriverForgetPasswordScreen from '../src/screens/DriverForgetPassword';

// restaurent screen product details
import ProductDetails from '../src/screens/Foods/ProductDetails';
import CategoryProductDetails from '../src/screens/Foods/CategoryProductScreen';
import CartScreenFood from '../src/screens/Foods/CartScreen';
import FoodNotificationScreen from '../src/screens/Foods/FoodNotificaiton';
import FoodOrderHistoryScreen from '../src/screens/Foods/OrderHistory';
import FoodOrderTrackScreen from '../src/screens/Foods/OrderTrackScreen';
import AddAddressScreen from '../src/screens/Foods/AddAddressScreen';
import OrderDetailsSingleProduct from '../src/screens/Foods/OrderItemDetails';
import PaymentGalewayScreen from '../src/screens/Foods/PaymentScreen';
// comming soon page
import CommingSoonScreen from '../src/screens/ComingSoonScreen';
import HomeFoodScreen from '../src/screens/FoodHomePage';

// change language 
const coorg = require('../common/coorg.json');
const eng = require('../common/eng.json');
// Theme.
const MyTheme = {
    dark: false,
    colors: {
        primary: '#FFE473',
        secondary: '#000000',
        background: 'white',
        card: 'rgb(255, 255, 255)',
        text: '#1F1F39',
        invert_text_color: '#FAFAFA',
        border: 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)',
    },
};

// Veriable.
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom screen.
function BottomNavigation() {

    return (
        <Tab.Navigator
            shifting={true}
            labeled={true}
            sceneAnimationEnabled={false}
            barStyle={{ backgroundColor: '#eff4fa' }}
            screenOptions={{
                tabBarShowLabel: false,
                activeTintColor: '#20251e',
                inactiveTintColor: '#20251e',
                showLabel: true,
                tabBarStyle: {},
                style: {
                    borderTopColor: '#66666666',
                    backgroundColor: 'eff4fa',
                    elevation: 0,
                },
            }}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Delivery' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <Image
                                style={{ width: focused ? 25 : 25, height: focused ? 25 : 25, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain' }}
                                source={require('../src/assets/car.png')}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <Image
                                style={{ width: 25, height: 25, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain' }}
                                source={require('../src/assets/car.png')}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <Image
                                style={{ width: 25, height: 25, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain' }}
                                source={require('../src/assets/car.png')}
                            />
                        );
                    },
                }}
            />

        </Tab.Navigator>
    );
}

function UserBottomNavigation() {


    const [selectedLanguage, setSelectedLanguage] = React.useState(null);

    useFocusEffect(
        React.useCallback(() => {
            getLanguageStatus();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const getLanguageStatus = async () => {
        const valueX = await AsyncStorage.getItem('@appLanguage');
        setSelectedLanguage(valueX);
        console.log('getLanguageStatus', valueX);
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#58ceb2',
                tabBarInactiveTintColor: 'gray',
                //Tab bar styles can be added here
                tabBarStyle: {
                },
                tabBarLabelStyle: {
                    paddingBottom: 3,
                },
            })}
            shifting={true}
            labeled={true}
            sceneAnimationEnabled={false} >
            <Tab.Screen
                name="UserHomeScreen"
                component={UserHomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Delivery' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain', }}
                                    source={require('../src/assets/auto_home_icon.png')}
                                />
                                <Text numberOfLines={1} style={{ alignItems: 'center', color: '#000', fontSize: 12, fontWeight: '700', fontFamily: 'Poppins-Medium' }}>{selectedLanguage === 'Coorg' ? coorg.crg.auto : eng.en.auto}</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Super Market"
                component={HomeFoodScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain', }}
                                    source={require('../src/assets/food_icon.png')}
                                />
                                <Text numberOfLines={1} style={{ alignItems: 'center', color: '#000', fontSize: 12, fontWeight: '700', fontFamily: 'Poppins-Medium' }}>{selectedLanguage === 'Coorg' ? coorg.crg.food : eng.en.food}</Text>
                            </View>
                        );
                    },
                }}
            />
            {/* <Tab.Screen
                name="Parhmacy"
                component={CommingSoonScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'cover', }}
                                    source={require('../src/assets/pharmacy_icon.png')}
                                />
                                <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'orange', height: 18, width: 18, borderRadius: 150 }}>
                                    <Text style={{ fontWeight: 'bold', left: 5, color: '#fff', fontSize: 10, top: 0, bottom: 0 }}>0</Text>
                                </View>
                                <Text numberOfLines={1} style={{ alignItems: 'center', color: '#000', fontSize: 12, fontWeight: '700', fontFamily: 'Poppins-Medium'  }}>{selectedLanguage === 'Coorg' ? coorg.crg.phramacy : eng.en.phramacy}</Text>
                            </View>
                        );
                    },
                }}
            /> */}
            <Tab.Screen
                name="Hotel"
                component={CommingSoonScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain', }}
                                    source={require('../src/assets/hotel_icon.png')}
                                />
                                <Text numberOfLines={1} style={{ alignItems: 'center', color: '#000', fontSize: 11, fontWeight: '700', fontFamily: 'Poppins-Medium' }}>{selectedLanguage === 'Coorg' ? coorg.crg.hotel : eng.en.hotel}</Text>
                            </View>
                        );
                    },
                }}
            />
            {/* <Tab.Screen
                name="Vegitables"
                component={CommingSoonScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain', }}
                                    source={require('../src/assets/super_market_icon.png')}
                                />
                                <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'orange', height: 18, width: 18, borderRadius: 150 }}>
                                    <Text style={{ fontWeight: 'bold', left: 5, color: '#fff', fontSize: 10, top: 0, bottom: 0 }}>0</Text>
                                </View>
                                <Text style={{ alignItems: 'center', color: '#000', fontSize: 11, fontWeight: '700', fontFamily: 'Poppins-Medium'  }}>{selectedLanguage === 'Coorg' ? coorg.crg.market : eng.en.market}</Text>
                            </View>
                        );
                    },
                }}
            /> */}
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain', }}
                                    source={require('../src/assets/profile_icon.png')}
                                />
                                <Text style={{ alignItems: 'center', color: '#000', fontSize: 12, fontWeight: '700', fontFamily: 'Poppins-Medium' }}>{selectedLanguage === 'Coorg' ? coorg.crg.profile : eng.en.profile}</Text>
                            </View>
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
}

// Stack screen.
function StackNavigation(initialRouts) {

    console.log('StackNavigation', 'init_routes --> ' + initialRouts?.initialRouts)
    const routeNameRef = React.useRef();
    const navigationRef = React.useRef();

    let addItem = item => {
        database().ref('/navigation').push({
            name: item
        });
    };

    // SplashAppScreen
    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            }}
            theme={MyTheme}
            onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current.getCurrentRoute().name;
                if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                    });
                }
                routeNameRef.current = currentRouteName;
                addItem(currentRouteName);
            }} >
            <Stack.Navigator
                initialRouteName={initialRouts?.initialRouts}
                screenOptions={{ headerShown: false, }}>
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{
                        title: 'HomeScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="SplashAppScreen"
                    component={SplashAppScreen}
                    options={{
                        title: 'SplashAppScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="UserBottomNavigation"
                    component={UserBottomNavigation}
                    options={{
                        title: 'UserBottomNavigation',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="MapScreens"
                    component={MapScreens}
                    options={{
                        title: 'MapScreens',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="UpcomingTripsScreen"
                    component={UpcomingTripsScreen}
                    options={{
                        title: 'UpcomingTripsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TrackingMapsScreen"
                    component={TrackingMapsScreen}
                    options={{
                        title: 'TrackingMapsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        title: 'TrackingMapsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="OTPSubmitScreen"
                    component={OTPSubmitScreen}
                    options={{
                        title: 'OTPSubmitScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="RegisterScreen"
                    component={RegisterScreen}
                    options={{
                        title: 'RegisterScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="HomeBottomNavigation"
                    component={BottomNavigation}
                    options={{
                        title: 'BottomNavigation',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TripStartScreen"
                    component={TripStartScreen}
                    options={{
                        title: 'TripStartScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="EndStartScreen"
                    component={EndStartScreen}
                    options={{
                        title: 'EndStartScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="MapComponent"
                    component={MapComponent}
                    options={{
                        title: 'MapComponent',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TripHistoryScreen"
                    component={TripHistoryScreen}
                    options={{
                        title: 'TripHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="RegisterDriverTwoScreen"
                    component={RegisterDriverTwoScreen}
                    options={{
                        title: 'RegisterDriverTwoScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="DriverLoginScreen"
                    component={DriverLoginScreen}
                    options={{
                        title: 'DriverLoginScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="DriverProfileScreen"
                    component={DriverProfileScreen}
                    options={{
                        title: 'DriverProfileScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="UserEditProfileScreen"
                    component={UserEditProfileScreen}
                    options={{
                        title: 'UserEditProfileScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="NotificationScreen"
                    component={NotificationScreen}
                    options={{
                        title: 'NotificationScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="StartTripSearchingScreen"
                    component={StartTripSearchingScreen}
                    options={{
                        title: 'StartTripSearchingScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="SearchDestinationScreen"
                    component={SearchDestinationScreen}
                    options={{
                        title: 'SearchDestinationScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TripCreateScreen"
                    component={TripCreateScreen}
                    options={{
                        title: 'TripCreateScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="DriverTrackToMapsScreen"
                    component={DriverTrackToMapsScreen}
                    options={{
                        title: 'DriverTrackToMapsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="PurchasePackageList"
                    component={PurchasePackageList}
                    options={{
                        title: 'PurchasePackageList',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TransactionHistoryScreen"
                    component={TransactionHistoryScreen}
                    options={{
                        title: 'TransactionHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="BookingTripHistoryScreen"
                    component={BookingTripHistoryScreen}
                    options={{
                        title: 'BookingTripHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="NotificationCenterScreen"
                    component={NotificationCenterScreen} />
                <Stack.Screen
                    name="BookingHistoryScreen"
                    component={BookingHistoryScreen}
                    options={{
                        title: 'BookingHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="EarningHistoryScreen"
                    component={EarningHistoryScreen}
                    options={{
                        title: 'EarningHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="DriverEditScreen"
                    component={DriverEditScreen}
                    options={{
                        title: 'DriverEditScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="VehicalDetailsScreen"
                    component={VehicalDetailsScreen}
                    options={{
                        title: 'VehicalDetailsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="EnterDropLocationScreen"
                    component={EnterDropLocationScreen}
                    options={{
                        title: 'EnterDropLocationScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="RatingAndReviewScreen"
                    component={RatingAndReviewScreen}
                    options={{
                        title: 'RatingAndReviewScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="SettingScreen"
                    component={SettingScreen}
                    options={{
                        title: 'SettingScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="ChangeLanguage"
                    component={ChangeLanguage}
                    options={{
                        title: 'ChangeLanguage',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="PermissionScreenMain"
                    component={PermissionScreenMain}
                    options={{
                        title: 'PermissionScreenMain',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="DriverForgetPasswordScreen"
                    component={DriverForgetPasswordScreen}
                    options={{
                        title: 'DriverForgetPasswordScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetails}
                    options={{
                        title: 'ProductDetails',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="CategoryProductDetails"
                    component={CategoryProductDetails}
                    options={{
                        title: 'CategoryProductDetails',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="CartScreenFood"
                    component={CartScreenFood}
                    options={{
                        title: 'CartScreenFood',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="FoodNotificationScreen"
                    component={FoodNotificationScreen}
                    options={{
                        title: 'FoodNotificationScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="FoodOrderHistoryScreen"
                    component={FoodOrderHistoryScreen}
                    options={{
                        title: 'FoodOrderHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="FoodOrderTrackScreen"
                    component={FoodOrderTrackScreen}
                    options={{
                        title: 'FoodOrderTrackScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="AddAddressScreen"
                    component={AddAddressScreen}
                    options={{
                        title: 'AddAddressScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="OrderDetailsSingleProduct"
                    component={OrderDetailsSingleProduct}
                    options={{
                        title: 'OrderDetailsSingleProduct',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="PaymentGalewayScreen"
                    component={PaymentGalewayScreen}
                    options={{
                        title: 'PaymentGalewayScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="CommingSoonScreen"
                    component={CommingSoonScreen}
                    options={{
                        title: 'CommingSoonScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="FoodHomeScreen"
                    component={FoodHomeScreen}
                    options={{
                        title: 'FoodHomeScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigation; // FoodHomeScreen