import {Colors} from "@/constant/Colors";
import {Ionicons} from "@expo/vector-icons";
import {CameraView, CameraType, useCameraPermissions} from "expo-camera";
import {useState, useEffect} from "react";
import {Button, SafeAreaView, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function ScanBarcodeScreen({navigation}: any) {
    const facing = "back";
    const [hasPermission, setHasPermission] = useCameraPermissions();
    const insets = useSafeAreaInsets();
    if (!hasPermission) return <Text>loading</Text>;

    if (!hasPermission.granted) {
        return (
            <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>We need camera permission to scan barcodes</Text>
                <Button onPress={setHasPermission} title="Grant permission" />
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                barcodeScannerSettings={{barcodeTypes: ["qr"]}}
                onBarcodeScanned={(res) => console.log(res.data)}
            />
            <View
                style={{
                    position: "absolute",
                    top: insets.top + 20,
                    left: 20,
                    backgroundColor: Colors.white,
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    message: {
        textAlign: "center",
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
});
