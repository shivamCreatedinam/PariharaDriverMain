import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, TouchableOpacity, Image, Linking, Alert, NativeModules } from 'react-native';
import HomeHeader from '../../components/HomeHeader'; // Adjust the path accordingly
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AcceptBooking, AcceptDriverTrip } from '../../network/api';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { showPopup } from '../../common';
// import RNDrawOverlay from 'react-native-draw-overlay';
import ProgressBar from '../../components/ProgressBar';
import { LoadingContext } from '../../components/Loader/LoadingContext';

const { FloatingWindow } = NativeModules;

const SOCKET_SERVER_URL = 'https://nodeadmin.createdinam.com/';

export default function NotificationSettingsScreen() {

  // console.log('FloatingWindow:', FloatingWindow); // Debugging log
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [timer, setTimer] = useState(40); // 40 seconds timer
  const { loading, showLoader, hideLoader } = useContext(LoadingContext);
  const animatedWidth = useRef(new Animated.Value(0)).current; // Animated width for the button

  useEffect(() => {
    // Establish socket connection
    const socket = io(SOCKET_SERVER_URL);

    // Listen for 'new_booking' event
    socket.on('new_booking', (newBooking) => {
      console.log('New booking received:', newBooking);
      // Update the bookings list with the new booking
      setBookings((prevBookings) => [...prevBookings, newBooking]);
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Start the timer
    let countdown = timer;
    const interval = setInterval(() => {
      if (countdown > 0) {
        countdown -= 1;
        setTimer(countdown);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    // Animate the button's background fill
    Animated.timing(animatedWidth, {
      toValue: 100, // Fill to 100% width
      duration: 40000, // 40 seconds
      useNativeDriver: false,
    }).start();

    return () => clearInterval(interval);
  }, [bookings]);

  async function requestDrawOverAppsPermission() {
    // RNDrawOverlay.askForDispalayOverOtherAppsPermission()
    //   .then(res => {
    //     // res will be true if permission was granted 
    //     console.log("requestDrawOverAppsPermission", JSON.stringify(res));
    //   })
    //   .catch(e => {
    //     // permission was declined
    //     console.log("requestDrawOverAppsPermissionError", JSON.stringify(e));
    //   })
  }

  const handleAccept = (data, index) => {
    showLoader(); // Show loader
    AcceptBooking(data?.booking_id).then((res) => {
      console.log('BookingAccepted:', res); // Should be true or false
      AcceptDriverTrip(data?.booking_id).then((res) => {
        hideLoader(); // Hide loader
        console.log('BookingAccepted:', res); // Should be true or false
        navigation.replace('BookingAcceptScreen', data);
      }).catch(error => {
        hideLoader(); // Hide loader
        console.error('Booking acceptance failed:', error);
      });
    }).catch(error => {
      hideLoader(); // Hide loader
      console.error('Booking acceptance failed:', error);
    });
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const interval = setInterval(() => {
  //       console.log("Screen is focused, running interval task...");
  //       FloatingWindow?.requestOverlayPermission();
  //       FloatingWindow?.requestOverlayPermission();
  //       showPopup("Screen is focused, running interval task...");
  //     }, 5000);

  //     // Cleanup: Stop the interval when screen loses focus
  //     return () => clearInterval(interval);
  //   }, [])
  // );

  const handleProgressComplete = () => {
    Alert.alert("Progress Complete", "The progress bar has finished!");
  };

  const renderBookingItems = (data, index) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.passengers}>01</Text>
            <View>
              <Text style={styles.passengerLabel}>Passengers</Text>
            </View>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', // Replace with the profile picture URL
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{data?.booking_user}</Text>
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.location}>
              <View style={styles.dotBlue} />
              <View>
                <Text style={styles.label}>Pickup Location</Text>
                <Text style={styles.address}>
                  {data?.pickup_location_name}
                </Text>
              </View>
            </View>

            <View style={styles.location}>
              <View style={styles.dotRed} />
              <View>
                <Text style={styles.label}>Drop Location</Text>
                <Text style={styles.address}>{data?.drop_location_name}</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, alignSelf: 'flex-start', alignContent: 'center', alignItems: 'center' }}>
            <Text style={styles.price}>Charges ₹ {data?.price}</Text>
          </View>
          {/* <View style={styles.footer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.fill]} onPress={() => handleAccept(data?.booking_id)}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.fill]} onPress={() => handleAccept(data?.booking_id)}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View> */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => handleAccept(data, index)} style={styles.buttonAcceptCenter}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRejectCenter}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ProgressBar onComplete={handleProgressComplete} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <HomeHeader />
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => renderBookingItems(item, index)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonAcceptCenter: {
    flex: 1,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingVertical: 16,
    margin: 10,
    borderRadius: 10
  }, buttonRejectCenter: {
    flex: 1,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 16,
    margin: 10,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600'
  },
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookingItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  text: {
    fontSize: 16,
  },
  cardContainer: {
    margin: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passengers: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  passengerLabel: {
    fontSize: 14,
    color: '#777',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  locationContainer: {
    marginBottom: 16,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dotBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007bff',
    marginRight: 8,
  },
  dotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff0000',
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    color: '#777',
  },
  address: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontWeight: '800',
    fontSize: 18,
    color: '#333',
    marginLeft: 10,
    textAlign: 'center'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  button: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});