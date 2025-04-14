import {View, Text, Animated, Easing} from "react-native";
import React, {useEffect, useRef} from "react";
import {SkeletonProps} from "@/interfaces/Skeleton";

export default function Skeleton({width, height, borderRadius, style, speed}: SkeletonProps) {
    const shimmerAnimation = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnimation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ).start();
    }, [shimmerAnimation]);

    const translateXSlow = shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 800],
    });

    const translateXNormal = shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 400],
    });

    const translateXFast = shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 200],
    });
    return (
        <View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: "#e1e9ee",
                    overflow: "hidden",
                },
                style,
            ]}
        >
            <Animated.View
                style={{
                    width: "50%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    transform: [{translateX: speed === "slow" ? translateXSlow : speed === "normal" ? translateXNormal : translateXFast}],
                    opacity: 0.6,
                }}
            />
        </View>
    );
}
