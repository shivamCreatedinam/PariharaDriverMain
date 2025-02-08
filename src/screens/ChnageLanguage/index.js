import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Toast from 'react-native-toast-message';
import React from 'react';

export default function ChangeLanguage() {

    const navigate = useNavigation();
    const [selectedLanguage, setSelectedLanguage] = React.useState(false);
    const [SelectLanguage, setSelectLanguage] = React.useState(null);

    const setLanguage = (info) => {
        setSelectLanguage(info);
        setSelectedLanguage(true);
        if (info === 'Coorg') {
            onChangeLanguage('Coorg')
        } else if (info === 'English') {
            onChangeLanguage('English')
        }
    }

    const onChangeLanguage = async (lang) => {
        try {
            await AsyncStorage.setItem('@appLanguage', lang);
            console.log('storeData', lang)
        } catch (e) {
            // saving error
        }
    }

    const saveLanguage = () => {
        if (SelectLanguage === null) {
            Toast.show({
                type: 'error',
                text1: 'Choose Language',
                text2: 'Please select your mother language!'
            });
        } else {
            navigate.replace('LoginScreen');
        }
    }

    const createDynamicLink = async () => {
        const link = await dynamicLinks().buildLink({
            link: 'https://invertase.io',
            // domainUriPrefix is created in your Firebase console
            domainUriPrefix: 'https://xyz.page.link',
            // optional setup which updates Firebase analytics campaign
            // "banner". This also needs setting up before hand
            analytics: {
                campaign: 'banner',
            },
        });
    }

    

    return (
        <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={{
                flexGrow: 1,
            }}
            style={{ padding: 20, flex: 1, marginBottom: 50 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 60 }}>Choose Language</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 5 }}>ಭಾಷೆಯನ್ನು ಆರಿಸಿ</Text>
            <TouchableOpacity onPress={() => setLanguage('English')} style={{ padding: 20, flexGrow: 1, backgroundColor: '#000', marginTop: 40, elevation: 5, borderRadius: 10 }}>
                <View style={{ height: 80, width: 80, borderRadius: 150, backgroundColor: 'grey', }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 33, padding: 20, textAlign: 'center', }}>A</Text>
                </View>
                <Text style={{ color: '#fff', paddingVertical: 20, paddingHorizontal: 5 }}>Parihara, India’s first and largest Auto-Taxi Service. Our Auto rides help you cut through traffic, reach on time, and save money.</Text>
                {SelectLanguage === 'English' ? <View style={{ position: 'absolute', right: 0, top: -5, zIndex: 9999 }}>
                    <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../../assets/check_mark.png')} />
                </View> : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLanguage('Coorg')} style={{ padding: 20, flexGrow: 1, backgroundColor: '#000', marginTop: 40, elevation: 5, borderRadius: 10 }}>
                <View style={{ height: 80, width: 80, borderRadius: 150, backgroundColor: 'grey', }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 33, padding: 20, textAlign: 'center', }}>ಎ</Text>
                </View>
                <Text style={{ color: '#fff', paddingVertical: 20, paddingHorizontal: 5 }}>ಪರಿಹಾರ, ಭಾರತದ ಮೊದಲ ಮತ್ತು ದೊಡ್ಡ ಆಟೋ-ಟ್ಯಾಕ್ಸಿ ಸೇವೆ. ನಮ್ಮ ಆಟೋ ಸವಾರಿಗಳು ನಿಮಗೆ ಟ್ರಾಫಿಕ್ ಅನ್ನು ಕಡಿಮೆ ಮಾಡಲು, ಸಮಯಕ್ಕೆ ತಲುಪಲು ಮತ್ತು ಹಣವನ್ನು ಉಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.</Text>
                {SelectLanguage === 'Coorg' ? <View style={{ position: 'absolute', right: 0, top: -5, zIndex: 9999 }}>
                    <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../../assets/check_mark.png')} />
                </View> : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => saveLanguage()} style={{ width: '100%', height: 50, backgroundColor: '#000', marginTop: 40, elevation: 5, borderRadius: 5, marginBottom: 150 }}>
                <Text style={{ fontSize: 14, color: '#fff', textAlign: 'center', marginTop: 15, textTransform: 'uppercase', fontWeight: 'bold' }}>Save Language</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({})