import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native-elements'

const CommingSoonScreen = () => {
    return (
        <View style={{ backgroundColor: '#fffff', flex: 1, alignSelf: 'center' }}>
            <Image style={{ width: 350, height: 350, alignSelf: 'center', marginTop: Dimensions.get('screen').width / 2 }} source={require('../../assets/comming_soon.png')} />
        </View>
    )
}

export default CommingSoonScreen

const styles = StyleSheet.create({})