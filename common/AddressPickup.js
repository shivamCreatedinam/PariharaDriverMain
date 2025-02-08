import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import globle from './env';

const AddressPickup = ({ placheholderText, fetchAddress }) => {

    const ref = React.useRef();

    React.useEffect(() => {
        ref.current?.setAddressText('');
      }, [fetchAddress]);

    const onPressAddress = (data, details) => {
        // console.log("details==>>>>", details)
        let resLength = details.address_components
        let zipCode = ''

        let filtersResCity = details.address_components.filter(val => {
            if (val.types.includes('locality') || val.types.includes('sublocality')) {
                return val
            }
            if (val.types.includes('postal_code')) {
                let postalCode = val.long_name
                zipCode = postalCode
            }
            return false
        })

        let dataTextCityObj = filtersResCity.length > 0
            ? filtersResCity[0] :
            details.address_components[
            resLength > 1 ? resLength - 2 : resLength - 1
            ];

        let cityText =
            dataTextCityObj.long_name && dataTextCityObj.long_name.length > 17
                ? dataTextCityObj.short_name
                : dataTextCityObj.long_name;

        // console.log("zip cod found", zipCode)
        // console.log("city namte", cityText)

        const lat = details.geometry.location.lat
        const lng = details.geometry.location.lng
        const locations = details
        // lat, lng, zipCode, cityText, 
        fetchAddress(locations)
    }

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                ref={ref}
                placeholder={placheholderText}
                minLength={2}
                autoFocus={false}
                numberOfLines={1}
                returnKeyType={'default'}
                onPress={onPressAddress}
                fetchDetails={true}
                query={{
                    key: globle.GOOGLE_MAPS_APIKEY_V2,
                    language: 'en',
                    components: 'country:ind',
                }}
                enableHighAccuracyLocation={true}
                currentLocation={true}
                currentLocationLabel='Current location'
                styles={{
                    textInputContainer: styles.containerStyle,
                    textInput: styles.textInputStyle,
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                GooglePlacesSearchQuery={{
                    rankby: 'distance',
                    types: 'building',
                }}
                filterReverseGeocodingByTypes={[
                    'locality',
                    'administrative_area_level_3',
                ]}
                debounce={200}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        borderRadius: 15,
        backgroundColor: 'transparent'
    },
    containerStyle: {
        backgroundColor: 'transparent',
        marginTop: 15,
        borderRadius: 15,
    },
    textInputStyle: {
        height: 45,
        color: 'black',
        fontSize: 12,
        backgroundColor: 'white',
        marginTop: 6,
        fontWeight: 'bold',
        marginLeft: 10,
        borderRadius: 10,
        elevation: 5, 
    }
});

export default AddressPickup;