import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import React from "react";

type StepThreeProps = {
    prevStep: () => void;
};

export default function StepThree({prevStep}: StepThreeProps) {
    return (
        <View>
            <Text>Sign Up Completed 🎉</Text>
            <TouchableOpacity
                onPress={prevStep}
                style={{backgroundColor: "lightgray", padding: 10, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 10}}
            >
                <Text>Back</Text>
            </TouchableOpacity>
        </View>
    );
}
