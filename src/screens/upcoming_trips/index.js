/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';

const UpcomingTripsScreen = () => {


    const navigate = useNavigation();
    const [data, setData] = React.useState([]);


    React.useEffect(() => {
        const dataRef = database().ref('/users/');
        dataRef.on('value', snapshot => {
            const newData = [];
            snapshot.forEach(childSnapshot => {
                newData.push(childSnapshot.val());
            });
            setData(newData);
        });

        return () => {
            dataRef.off(); // Clean up the listener when the component unmounts
        };
    }, []);

    function trackMaps(data) {
        navigate.navigate('TrackingMapsScreen', data);
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => trackMaps(item)} style={{ padding: 5, borderWidth: item.trip_activate === true ? 1 : 0, borderColor: item.trip_activate === true ? 'green' : 'red', marginBottom: 5, margin: 5, borderRadius: 5 }}>
                <Text>{JSON.stringify(item.driver_location)}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>{item.pick_point}</Text>
                    <Text>{item.drop_point}</Text>
                </View>
                <View>
                    <Text>{item.driver_Name}</Text>
                    <Text>{item.drop_point}</Text>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <View style={{}}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', padding: 10 }}> Upcoming Trips : {data.length}</Text>
            <FlatList
                data={data}
                style={{ height: Dimensions.get('screen').height - 60 }}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    imageMarker: { width: 40, height: 40, resizeMode: 'contain' }
});

export default UpcomingTripsScreen;