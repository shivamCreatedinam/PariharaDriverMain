import { StyleSheet } from "react-native";
import Colors from "../../../common/Colour";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30
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
    map: {
        width: "100%",
        height: "100%",
    },
    markerRound: {
        alignItems: "center",
        justifyContent: "center",
        width: 15,
        height: 15,
        borderRadius: 50,
        backgroundColor: Colors.black,
    },
    markerRectangle: {
        alignItems: "center",
        justifyContent: "center",
        width: 15,
        height: 15,
        backgroundColor: Colors.black,
    },
    markerCircle: {
        width: 5,
        height: 5,
        borderRadius: 50,
        backgroundColor: Colors.white
    },
    borderStyleBase: {
        width: 30,
        height: 45
    },
    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },
    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },
    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
});

export default styles;
