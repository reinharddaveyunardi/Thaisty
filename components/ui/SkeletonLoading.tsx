import {View, Text} from "react-native";
import React from "react";

export default function SkeletonLoading({quantity}: {quantity: number}) {
    return [...Array(quantity)].map((_, index) => (
        <View key={index} style={{width: 180, height: 150, backgroundColor: "#E0E0E0", borderRadius: 10, padding: 10}}>
            <View style={{width: "100%", height: 100, backgroundColor: "#C0C0C0", borderRadius: 10}} />
            <View style={{height: 8, backgroundColor: "#C0C0C0", marginTop: 8, width: "70%"}} />
            <View style={{height: 8, backgroundColor: "#C0C0C0", marginTop: 4, width: "50%"}} />
        </View>
    ));
}
