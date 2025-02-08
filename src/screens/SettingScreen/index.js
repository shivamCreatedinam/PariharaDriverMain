import React from "react";
import RNRestart from 'react-native-restart';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// change language 
const coorg = require('../../../common/coorg.json');
const eng = require('../../../common/eng.json');

const SettingScreen = () => {

    const navigate = useNavigation();
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

    const changeLanguage = () => {
        console.log('changeLanguage', 'changeLanguage');
        Alert.alert(selectedLanguage === 'Coorg' ? coorg.crg.change_language : eng.en.change_language, selectedLanguage === 'Coorg' ? coorg.crg.change_language_alert : eng.en.change_language_alert,
            [
                { text: selectedLanguage === 'Coorg' ? coorg.crg.english_lang : eng.en.english_lang, onPress: () => onChangeLanguage('English') },
                { text: selectedLanguage === 'Coorg' ? coorg.crg.coorg_language : eng.en.coorg_language, onPress: () => onChangeLanguage('Coorg') },
            ]
        );
    }

    const onChangeLanguage = async (lang) => {
        try {
            await AsyncStorage.setItem('@appLanguage', lang);
            console.log('storeData', lang)
            RNRestart.restart();
            navigate.reset();
        } catch (e) {
            // saving error
        }
    }

    return (
        <View style={{ flex: 1, paddingTop: 25, padding: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: .5 }}>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{selectedLanguage === 'Coorg' ? coorg.crg.language_setting : eng.en.language_setting}</Text>
            </View>
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => changeLanguage()} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/language.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>{selectedLanguage === 'Coorg' ? coorg.crg.change_language : eng.en.change_language}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SettingScreen

const styles = StyleSheet.create({})