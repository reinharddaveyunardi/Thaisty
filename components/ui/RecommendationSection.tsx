import {View, Text, ScrollView, TouchableOpacity, Image} from "react-native";
import React, {useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {foodData} from "@/data/FoodData";
import Animated from "react-native-reanimated";

export default function RecommendationSection({navigation, userPreferences}: any) {
    const allergies = userPreferences ?? [];

    const filteredFoods = foodData.filter((food) => {
        return !food.category.some((category) => allergies.some((allergy: string) => category.toLowerCase().includes(allergy.toLowerCase())));
    });
    return (
        <ScrollView horizontal={true} contentContainerStyle={{gap: 16}} showsHorizontalScrollIndicator={false}>
            {filteredFoods.length > 0 ? (
                filteredFoods.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.99}
                        onPress={() => navigation.navigate("FoodDetail", {name: item.name_eng, img: item.img, price: item.price, desc: item.desc_eng})}
                        style={{gap: 12}}
                    >
                        <View>
                            <Image source={{uri: item.img}} style={{width: 180, height: 100, borderRadius: 10}} />
                        </View>
                        <View style={{height: 0.2, backgroundColor: "#2d2d2d", width: "100%"}} />
                        <View>
                            <Text style={{fontSize: 16, fontWeight: "bold"}}>{item.name_eng}</Text>
                            <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                <Ionicons name="star" size={16} color={"#FFD700"} />
                                <Text>{item.rating}</Text>
                            </View>
                            <Text style={{fontSize: 16, fontWeight: "900", color: "#52BB60"}}>${Math.round(item.price * 0.03)}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={{fontSize: 16, color: "gray", textAlign: "center"}}>No food matches your preferences</Text>
            )}
        </ScrollView>
    );
}
