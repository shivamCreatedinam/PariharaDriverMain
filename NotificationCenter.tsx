// @ts-nocheck
import { Animated, Easing, Text, TouchableOpacity, View, Image } from 'react-native';
import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import globel from './common/env';
import React, { FC } from 'react';

const NotificationCenter: FC<Props> = () => {


    const [
        message,
        setMessage,
    ] = React.useState<null | FirebaseMessagingTypes.RemoteMessage>(null);

    const transition = React.useRef<Animated.Value>(new Animated.Value(300)).current;

    const exitAnim = React.useRef(
        Animated.timing(transition, {
            duration: 55000,
            easing: Easing.in(Easing.exp),
            toValue: 300,
            useNativeDriver: true,
        }),
    ).current;

    React.useEffect(() => {
        const unsubscribe = messaging().onMessage((remoteMessage) => {
            if (remoteMessage.notification) { 
                transition.setValue(300);
                const enterAnim = Animated.spring(transition, {
                    toValue: 0,
                    useNativeDriver: true,
                });
                setMessage(remoteMessage);
                enterAnim.start();
                const timeoutHandler = setTimeout(() => {
                    exitAnim.start(() => {
                        setMessage(null);
                    });
                }, 55000);
                return () => {
                    setMessage(null);
                    clearTimeout(timeoutHandler);
                };
            }
        });

        return () => {
            unsubscribe();
        };
    }, [transition, exitAnim]);

    if (!message || !message.notification) {
        return null;
    }

    const BookingAccept = async (info) => {
        setMessage(null);
        console.log('BookingAccept', JSON.stringify(info));
    }

    /// from kha se -->> to kha tk 


    const BookingReject = async (info) => {
        setMessage(null);
        console.log('BookingReject', JSON.stringify(info));
    }
    // drivername

    const startTrackingDriver = async (info) => {
        setMessage(null);
        console.log(info)
    }

    if (message.notification.title === 'Driver accepted your booking') {
        return (
            <View style={{ padding: 20, position: 'absolute', bottom: 50, left: 0, right: 0, zIndex: 9999, backgroundColor: '#FEFCFF', alignItems: 'center', borderRadius: 10, margin: 5, elevation: 5 }}>
                <Animated.View style={{ padding: 20, flex: 1, alignItems: 'center' }}>
                    <Image style={{ height: 50, width: 50, resizeMode: 'contain', alignSelf: 'center' }} source={require('./src/assets/auto_icon.png')} />
                    <Text style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>
                        {message.notification.title}
                    </Text>
                    <View>
                        <Image style={{ height: 50, width: 50, resizeMode: 'contain', alignSelf: 'center' }} source={{ uri: globel.IMAGE_BASE_URL + message.data.drv_image }} />
                        <Text>{message.data.drivername}</Text>
                        <Text>vehicle Number : {message.data.vehicle_no}</Text>
                        <Text>Mobile Number : {message.data.mobile}</Text>
                    </View>
                    <Text style={{ padding: 10, textAlign: 'center' }}>
                        {message.notification.body}
                        {message.data.distance}
                        {message.data.drivername}
                        {message.data.mobile}
                        {message.data.from_address}
                        {message.data.from_pincode}
                        {message.data.vehicle_no}
                        {message.data.drv_image}
                        {message.data.trip_otp}
                        {message.data.driver_id}
                        {message.data.price}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => startTrackingDriver(message)}
                            style={{ flex: 1 }}>
                            <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'green', color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                Track Driver
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        );
    } else {
        return null
    }

}


// (
//     <View style={{ padding: 20, position: 'absolute', bottom: 50, left: 0, right: 0, zIndex: 9999, backgroundColor: '#FEFCFF', alignItems: 'center', borderRadius: 10, margin: 5, elevation: 5 }}>
//         <Animated.View style={{ padding: 20, flex: 1, alignItems: 'center' }}>
//             <Image style={{ height: 50, width: 50, resizeMode: 'contain', alignSelf: 'center' }} source={require('./src/assets/auto_icon.png')} />
//             <Text style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>
//                 {message.notification.title}
//             </Text>
//             <Text style={{ padding: 10, textAlign: 'center' }}>
//                 {message.notification.body}
//             </Text>
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                 <TouchableOpacity onPress={() => BookingReject(message)}
//                     style={{ flex: 1, marginRight: 2 }}>
//                     <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'orange', color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
//                         Cancel Booking
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => BookingAccept(message)}
//                     style={{ flex: 1 }}>
//                     <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'green', color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
//                         Accept Booking
//                     </Text>
//                 </TouchableOpacity>
//             </View>
//         </Animated.View>
//     </View>
// );

export default NotificationCenter;