import {View, Text, SafeAreaView, TouchableOpacity} from "react-native";
import React from "react";

export default function DriverScreen({navigation}: any) {
    return (
        <SafeAreaView>
            <View>
                <Text>Beranda Driver</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("SearchOrder")}>
                <Text>Cari Orderan</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
