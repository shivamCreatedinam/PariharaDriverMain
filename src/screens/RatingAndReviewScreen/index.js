import React from "react";
import { View, Text, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
// change language 
const coorg = require('../../../common/coorg.json');
const eng = require('../../../common/eng.json');


const RatingAndReviewScreen = () => {

    const navigation = useNavigation();
    const [RatingText, setRatingText] = React.useState(null);
    const [RatingNumber, setRatingNumber] = React.useState(null);
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

    const ratingCompleted = (rating) => {
        console.log("Rating is: " + rating);
        setRatingNumber(rating);
    }

    const submitRating = () => {
        if (RatingText === null) {
            RatingSubmit('Please share your valuable feedback, Please enter')
        } else {
            if (RatingNumber === null) {
                RatingSubmit('Please Rate your Driver')
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Driver Rating Successfully',
                    text2: '🎉 Congratulations 🎉 Driver Rating Successfully',
                });
                navigation.replace('UserBottomNavigation');
            }
        }
    }

    const RatingSubmit = (msg) => {
        Toast.show({
            type: 'error',
            text1: msg,
            text2: msg,
        });
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled' >
            <View style={{ padding: 30, borderRadius: 10, borderColor: 'grey', borderWidth: 1, margin: 50, marginTop: Dimensions.get('screen').width / 2, elevation: 5, backgroundColor: '#FFFFFF' }}>
                <TouchableOpacity onPress={() => navigation.replace('UserBottomNavigation')} style={{ position: 'absolute', right: -5, top: -15, backgroundColor: '#fff', borderWidth: 1, borderRadius: 150, width: 25, height: 25, }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', marginTop: 1 }}>X</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>{selectedLanguage === 'Coorg' ? coorg.crg.rate_your_driver : eng.en.rate_your_driver}</Text>
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ textAlign: 'center', marginBottom: 15, letterSpacing: 1 }}>{selectedLanguage === 'Coorg' ? coorg.crg.rate_your_driver_info : eng.en.rate_your_driver_info}</Text>
                    <TextInput
                        style={{
                            borderRadius: 10, borderColor: 'grey', borderWidth: 1, width: Dimensions.get('screen').width - 130, height: 150, paddingRight: 10,
                            textAlignVertical: 'top', padding: 10
                        }}
                        placeholder={selectedLanguage === 'Coorg' ? coorg.crg.please_write_your_feedback : eng.en.please_write_your_feedback}
                        value={RatingText}
                        multiline={true}
                        numberOfLines={5}
                        returnKeyType={'go'}
                        onChangeText={(e) => setRatingText(e)}
                    />
                    <Rating
                        showRating
                        onFinishRating={(item) => ratingCompleted(item)}
                        style={{ paddingVertical: 10 }}
                    />
                    <TouchableOpacity onPress={() => submitRating()} style={{ padding: 12, backgroundColor: '#000000', width: '100%', elevation: 5, borderRadius: 5, marginTop: 10 }}>
                        <Text style={{ color: '#ffffff', textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center' }}>{selectedLanguage === 'Coorg' ? coorg.crg.submit : eng.en.submit}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default RatingAndReviewScreen;