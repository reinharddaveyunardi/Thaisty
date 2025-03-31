import {View, Text, ScrollView, Animated, TouchableOpacity} from "react-native";
import {useState, useEffect} from "react";
import React from "react";

const promoData = [
    {title: "Cashback 20%", description: "Get 20% cashback on your first order"},
    {title: "Discount 50%", description: "Get 50% discount on your first order"},
    {title: "Free Delivery", description: "Enjoy free delivery on all orders"},
];

export default function PromoBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = new Animated.Value(1);

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.sequence([
                Animated.timing(fadeAnim, {toValue: 0, duration: 500, useNativeDriver: true}),
                Animated.timing(fadeAnim, {toValue: 1, duration: 500, useNativeDriver: true}),
            ]).start();

            setCurrentIndex((prevIndex) => (prevIndex + 1) % promoData.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    return (
        <View style={{height: 140, width: "100%", borderRadius: 10, overflow: "hidden"}}>
            <Animated.View
                style={{
                    backgroundColor: "#32A941",
                    height: "100%",
                    width: "100%",
                    borderRadius: 10,
                    padding: 16,
                    opacity: fadeAnim,
                }}
            >
                <Text style={{fontSize: 32, fontWeight: "bold", color: "white"}}>{promoData[currentIndex].title}</Text>
                <Text style={{fontSize: 16, fontWeight: "bold", color: "white"}}>{promoData[currentIndex].description}</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{position: "absolute", right: 16, bottom: 16, backgroundColor: "#fff", padding: 8, borderRadius: 8}}
                    onPress={() => {}}
                >
                    <Text style={{fontSize: 16, fontWeight: "bold", color: "#32A941"}}>Shop Now</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
