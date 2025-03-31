import {View, Text, StyleSheet} from "react-native";
import {LinearGradient} from "react-native-linear-gradient";
import {BlurView} from "expo-blur";

export default function BlurBackground() {
    return (
        <View style={styles.container}>
            <LinearGradient colors={["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"]} style={styles.gradient} />
            <BlurView intensity={30} tint="light" style={styles.blur}>
                <Text style={styles.text}>Blur Effect</Text>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    gradient: {
        position: "absolute",
        width: "100%",
        height: 200,
        bottom: 0,
    },
    blur: {
        position: "absolute",
        width: "80%",
        height: 100,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
});
