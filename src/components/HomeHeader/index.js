import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { API_DRIVER_BASE_URL } from '../../network/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchUserProfile } from '../../network/api'; // Import API utility
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingContext } from '../../components/Loader/LoadingContext';

const HomeHeader = () => {

  const navigation = useNavigation();
  const [isProfileActive, setIsProfileActive] = useState(true);
  const { loading, showLoader, hideLoader } = useContext(LoadingContext);
  const [userData, setUserData] = useState(null);

  const userId = 4; // Replace with dynamic user_id if needed

  // // Fetch user profile details
  // const fetchUserProfile = async () => {
  //   try {
  //     const response = await fetch('https://nodeadmin.createdinam.com/login_profile', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ user_id: userId }),
  //     });
  //     const data = await response.json();
  //     if (data.status === 200) {
  //       setUserData(data.response);
  //       setIsProfileActive(data.response.is_active === 1);
  //     } else {
  //       console.error('Failed to fetch user profile:', data.error);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user profile:', error);
  //   }
  // };

  const loadProfile = async () => {
    try {
      showLoader(); // Show loader
      const userData = await fetchUserProfile(); // Replace 4 with the actual user ID
      setIsProfileActive(userData?.duty_status === 'Off' ? false : true);
      setUserData(userData);
    } catch (error) {
      hideLoader(); // Hide loader
      console.error(error);
    } finally {
      hideLoader(); // Hide loader
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      loadProfile();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  useEffect(() => {

  }, []);

  // Update profile status
  const updateProfileStatus = async (status) => {
    try {
      showLoader(); // Show loader
      console.log('updating profile status:', status);
      const DriverData = await AsyncStorage.getItem('userSession');
      const Driver_ID = JSON.parse(DriverData)?.id;
      const response = await fetch(`${API_DRIVER_BASE_URL}/duty-on-off`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver_id: Driver_ID,
          status: status,
        }),
      });
      const data = await response.json();
      console.log('ErrorProfile:', JSON.stringify(data));
      if (data.status === true) {
        loadProfile();
      } else {
        hideLoader(); // Hide loader
        console.error('Failed to update profile status:', data.error);
      }
    } catch (error) {
      hideLoader(); // Hide loader
      console.error('Error updating profile status:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <View style={styles.headerContainer}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#6200EE" />
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {userData ? (
          <>
            <Image
              source={{
                uri: 'https://dummyimage.com/100x100/000/fff.png&text=User',
              }}
              style={styles.profileImage}
            />
            <Text style={styles.username}>{userData.name}</Text>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>

      {/* Toggle Switch */}
      <View style={styles.toggleContainer}>
        <ToggleSwitch
          isOn={isProfileActive}
          onColor="green"
          offColor="black"
          label={isProfileActive === true ? 'Online' : 'Offline'}
          labelStyle={{ color: "white", fontWeight: "900" }}
          size={'medium'}
          onToggle={isOn => updateProfileStatus(isOn === true ? 'On' : 'Off')}
        />
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#6200ea',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    color: '#fff',
    fontSize: 14,
    marginRight: 10,
    fontWeight: '600'
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});
