import {View, Text, ScrollView, TouchableOpacity, Image} from "react-native";
import React, {useEffect, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {getFood} from "@/services/api";
import {BahtFormat} from "@/utils/FormatCurrency";
import SkeletonLoading from "./SkeletonLoading";

export default function RecommendationSection({navigation, userPreferences = []}: any) {
    const [filteredFoods, setFilteredFoods] = useState<any[]>([]);
    const [foodData, setFoodData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const getRecommendationFood = async () => {
            setIsLoading(true);
            const food = await getFood();
            if (Array.isArray(food)) {
                setFoodData(food);
                setIsLoading(false);
            }
        };
        getRecommendationFood();
    }, []);

    useEffect(() => {
        if (userPreferences?.length > 0 && foodData.length > 0) {
            setFilteredFoods(foodData.filter((food) => userPreferences.some((filter: any) => !food.allergies?.includes(filter))));
            setIsLoading(false);
        } else {
            setFilteredFoods(foodData);
        }
    }, [userPreferences, foodData]);
    return (
        <ScrollView horizontal={true} contentContainerStyle={{gap: 16}} showsHorizontalScrollIndicator={false}>
            {isLoading ? (
                <SkeletonLoading quantity={3} />
            ) : filteredFoods.length > 0 ? (
                filteredFoods.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.99}
                        onPress={() =>
                            navigation.navigate("FoodDetail", {
                                name: item.name,
                                image_product: item.image,
                                description: item.description,
                                price: item.price,
                                merchantId: item.merchantId,
                            })
                        }
                        style={{gap: 6}}
                    >
                        <View>
                            <Image source={{uri: item.image}} style={{width: 180, height: 100, borderRadius: 10}} />
                        </View>
                        <View style={{height: 0.4, backgroundColor: "#2d2d2d", width: "100%"}} />
                        <View>
                            <Text style={{fontSize: 16, fontWeight: "bold"}}>{item.name}</Text>
                            <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                <Ionicons name="star" size={16} color={"#FFD700"} />
                                <Text>{item.rating}</Text>
                            </View>
                            <Text style={{fontSize: 16, fontWeight: "900", color: "#52BB60"}}>{BahtFormat(item.price)}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={{fontSize: 16, color: "gray", textAlign: "center"}}>No food matches your preferences</Text>
            )}
        </ScrollView>
    );
}
