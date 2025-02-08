import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { accelerometer } from 'react-native-sensors';
import Barometer from 'react-native-barometer';

const EARTH_GRAVITY = 9.8; // m/s²
const AIR_DENSITY = 1.225; // kg/m³ at sea level
const PRESSURE_AT_SEA_LEVEL = 1013.25; // hPa (standard pressure)

const calculateHeightFromPressure = (pressureStart, pressureEnd) => {
  // Formula: h = (P1 - P2) / (ρ * g)
  return ((pressureStart - pressureEnd) * 100) / (AIR_DENSITY * EARTH_GRAVITY); // Height in meters
};

export default function BookingHistoryScreen() {

  const [pressureStart, setPressureStart] = useState(null);
  const [pressureCurrent, setPressureCurrent] = useState(null);
  const [height, setHeight] = useState(0);
  const [motionData, setMotionData] = useState({ z: 0 });
  const [recording, setRecording] = useState(false);


  useEffect(() => {
    let barometerSubscription;
    let accelerometerSubscription;

    if (recording) {
      // Start Barometer Subscription
      barometerSubscription = Barometer.addListener(({ pressure }) => {
        const pressureHpa = pressure * 10; // Convert kPa to hPa
        setPressureCurrent(pressureHpa);

        if (pressureStart === null) {
          setPressureStart(pressureHpa);
        } else {
          const calculatedHeight = calculateHeightFromPressure(pressureStart, pressureHpa);
          setHeight(calculatedHeight.toFixed(2));
        }
      });

      // Start Accelerometer Subscription
      accelerometerSubscription = accelerometer.subscribe(({ z }) => {
        setMotionData({ z });
      });
    }

    return () => {
      barometerSubscription && barometerSubscription.remove();
      accelerometerSubscription && accelerometerSubscription.unsubscribe();
    };
  }, [recording]);

  const handleStart = () => {
    const isSupported = Barometer.isSupported();
    console.log('handleStart::', isSupported);
    // Start Accelerometer Subscription
    accelerometer.subscribe(({ z }) => {
      setMotionData({ z });
      console.log('handleStart::', z);
    });
  };

  const handleStop = () => {
    setRecording(false);
    setPressureStart(null);
    setPressureCurrent(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Height Measurement</Text>
      <Text style={styles.label}>Pressure Start: {pressureStart ? pressureStart.toFixed(2) + ' hPa' : 'N/A'}</Text>
      <Text style={styles.label}>Current Pressure: {pressureCurrent ? pressureCurrent.toFixed(2) + ' hPa' : 'N/A'}</Text>
      <Text style={styles.label}>Height: {height} meters</Text>
      <Text style={styles.label}>Vertical Motion (z-axis): {motionData.z.toFixed(2)} m/s²</Text>
      <Button title={recording ? 'Stop' : 'Start'} onPress={recording ? handleStop : handleStart} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});