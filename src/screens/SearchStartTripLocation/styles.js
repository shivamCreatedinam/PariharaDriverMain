import { StyleSheet } from "react-native";
import Colors from "../../../common/Colour";

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#ffffff',
        flex: 1
    },
    mapContainer: {
        height: "50%"
    },
    bottomContainer: {
        height: "50%"
    },
    floatTopButton: {
        position: "absolute",
        top: 50,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.lightGrey,
        zIndex: 4,
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    background: {
        position: 'absolute',
        width: 1200,
        height: 1200,
        backgroundColor: '#000',
        top: 0,
        opacity: 0.2,
        transform: [
            {
                translateX: 0,
            },
            {
                translateY: 0,
            },
        ],
    },
    searchInputContainer: {
        paddingHorizontal: 20,
        borderBottomColor: 'grey',
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
        marginBottom: 10,
        fontSize: 11,
        paddingLeft: 20,
    },
});

export default styles;
