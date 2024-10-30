import {ColorsPallette} from "@/constants/Colors";
import {thisDeviceHeight} from "@/utils";
import {StyleSheet} from "react-native";

export const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    deviceHeight: {
        height: thisDeviceHeight,
    },
    fullWidth: {
        width: "100%",
    },
    fullHeight: {
        height: "100%",
    },
    deviceWidth: {
        width: thisDeviceHeight,
    },
    centerItem: {
        justifyContent: "center",
        alignItems: "center",
    },
    roundedBorder: {
        borderRadius: 15,
    },
    shadowBox: {
        elevation: 4,
    },
    boxGap: {
        gap: 8,
        rowGap: 8,
        columnGap: 8,
    },
    textStyle: {
        color: ColorsPallette.white,
    },
    rightItem: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    button: {
        backgroundColor: ColorsPallette.yellow,
        padding: 2,
        paddingHorizontal: 4,
        paddingVertical: 2,
        height: 40,
        width: "100%",
        borderRadius: 10,
    },
});

export const LoginScreenStyle = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: "bold",
    },
    formBox: {
        width: "100%",
    },
    inputContainer: {
        width: "100%",
    },
    input: {
        borderBottomColor: ColorsPallette.yellow,
        width: "100%",
        height: 40,
        borderBottomWidth: 1,
    },
});

export const RegisterScreen = StyleSheet.create({
    container: Styles.container,
});

export const HomeScreen = StyleSheet.create({
    container: Styles.container,
});
