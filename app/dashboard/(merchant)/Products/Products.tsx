import {View, Text, SafeAreaView, TouchableOpacity, ScrollView} from "react-native";
import React from "react";
import {Ionicons} from "@expo/vector-icons";

export default function ProductsScreen({navigation}: any) {
    return (
        <SafeAreaView>
            <View
                style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                    elevation: 5,
                    shadowColor: "#000",
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                }}
            >
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{flexGrow: 1, padding: 16}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("AddProduct")}
                    activeOpacity={0.9}
                    style={{
                        width: "100%",
                        height: 50,
                        backgroundColor: "white",
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        justifyContent: "center",
                    }}
                >
                    <View>
                        <Ionicons name="add" size={24} color="black" />
                    </View>
                    <View>
                        <Text>Add Product</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function productsCard() {
    return (
        <View>
            <Text>Products Card</Text>
        </View>
    );
}
