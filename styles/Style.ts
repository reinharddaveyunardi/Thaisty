import {Colors} from "./../constant/Colors";
import {Dimensions, StyleSheet} from "react-native";

export const Style = StyleSheet.create({
    Devider: {
        width: "100%",
        backgroundColor: Colors.primary,
        height: 2,
        borderRadius: 50,
    },
});

export const LoginScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    boxContainer: {
        backgroundColor: "white",
        justifyContent: "center",
        width: "90%",
        padding: 20,
        height: 450,
        borderRadius: 10,
        zIndex: 2,
        gap: 10,
    },
    iconContainer: {
        alignItems: "center",
    },
    iconBox: {
        width: 80,
        height: 80,
    },
    formContainer: {
        justifyContent: "center",
        width: "100%",
        gap: 16,
    },
    inputBox: {
        flex: 1,
    },
    inputField: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    inputStyle: {
        borderWidth: 1,
        padding: 5,
        paddingLeft: 15,
        width: "87%",
        borderRadius: 5,
    },
    forgotPassword: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    buttonContainer: {
        flex: 1,
    },
    button: {
        backgroundColor: "#0d7d5e",
        alignItems: "center",
        padding: 10,
        height: 40,
        width: "100%",
        fontWeight: "bold",
        borderRadius: 5,
    },
    logoContainer: {
        width: "100%",
        resizeMode: "contain",
        backgroundColor: "white",
        height: 110,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        resizeMode: "contain",
        height: 150,
        width: "100%",
    },
    rememberMe: {
        display: "flex",
        flexDirection: "row",
        height: 20,
        alignItems: "center",
        gap: 5,
    },
});

export const PreferenceScreenStyle = StyleSheet.create({
    button: {},
});

export const DropDownStyles = StyleSheet.create({
    dropdownButtonStyle: {
        width: "100%",
        height: 50,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 16,
        color: "#151E26",
    },
    dropdownButtonArrowStyle: {
        fontSize: 16,
    },
    dropdownButtonIconStyle: {
        fontSize: 16,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: "#E9ECEF",
        borderRadius: 8,
        width: Dimensions.get("window").width - 120,
    },
    dropdownItemStyle: {
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        color: "#151E26",
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});
