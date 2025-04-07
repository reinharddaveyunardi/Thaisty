import React, {useState, useRef} from "react";
import {View, Text, Animated, PanResponder, StyleSheet} from "react-native";

export default function SwipeToPay({onSuccess}: {onSuccess: () => void}) {
    const translateX = useRef(new Animated.Value(0)).current;
    const [completed, setCompleted] = useState(false);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, {dx: translateX}], {
            useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gesture) => {
            if (gesture.dx > 200) {
                setCompleted(true);
                onSuccess();
                Animated.timing(translateX, {
                    toValue: 250,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            } else {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.slider}>
                <Animated.View style={[styles.circle, {transform: [{translateX}]}]} {...panResponder.panHandlers} />
                {!completed && <Text style={styles.text}>Geser untuk Bayar</Text>}
                {completed && <Text style={styles.text}>Pembayaran Berhasil!</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    slider: {
        width: 300,
        height: 50,
        backgroundColor: "#ddd",
        borderRadius: 30,
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
    },
    circle: {
        width: 50,
        height: 50,
        backgroundColor: "#4CAF50",
        borderRadius: 25,
        position: "absolute",
        left: 0,
    },
    text: {
        position: "absolute",
        width: "100%",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
});
