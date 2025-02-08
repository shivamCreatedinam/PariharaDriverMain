import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const ProgressBar = ({ onComplete }) => {

    const progress = useRef(new Animated.Value(0)).current;
    const [hasCompleted, setHasCompleted] = React.useState(false); // State to track if callback is triggered

    useEffect(() => {
        // Start the animation on mount, running for 40 seconds
        Animated.timing(progress, {
            toValue: 1, // Full width
            duration: 40000, // 40 seconds in milliseconds
            useNativeDriver: false, // Use Native Driver is set to false as we're animating width
        }).start(() => {
            // Ensure the callback is triggered only once
            if (!hasCompleted) {
                setHasCompleted(true); // Mark as completed
                if (onComplete) {
                    onComplete(); // Trigger the onComplete callback
                }
            }
        });
    }, [progress, onComplete]);

    const animatedWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"], // Animate from 0% to 100% width
    });

    return (
        <View style={styles.container}>
            <View style={styles.progressBarContainer}>
                <Animated.View
                    style={[styles.progressBar, { width: animatedWidth }]}
                >
                    <LinearGradient
                        colors={["green", "green", "red"]} // Gradient colors from green to red
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    />
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        elevation:5
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        color: "#333",
    },
    progressBarContainer: {
        width: "100%",
        height: 10,
        backgroundColor: "#e0e0df",
        borderRadius: 0,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#3b5998",
    },
    gradient: {
        flex: 1, // Make gradient fill the progress bar
    },
});

export default ProgressBar;
