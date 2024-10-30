import {View, Text, TouchableOpacity} from "react-native";
import React from "react";
import {Styles} from "@/style/Styles";

export default function CustomButton({title, to, navigation}: any) {
    return (
        <TouchableOpacity onPress={() => navigation.navigate(to)} style={[Styles.button, Styles.centerItem]}>
            <Text>{title}</Text>
        </TouchableOpacity>
    );
}
