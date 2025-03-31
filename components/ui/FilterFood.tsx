import {Colors} from "@/constant/Colors";
import {foodData} from "@/data/FoodData";
import React, {useState} from "react";
import {View, Text, ScrollView, TouchableOpacity, Image} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const filters = ["Vegetarian", "Spicy", "Seafood", "Fast Food"];

const allFoods = foodData;

const FilterFood = ({navigation}: any) => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [filteredFoods, setFilteredFoods] = useState(allFoods);
    const toggleFilter = (filter: string) => {
        let updatedFilters = [...selectedFilters];

        if (selectedFilters.includes(filter)) {
            updatedFilters = updatedFilters.filter((item) => item !== filter);
        } else {
            updatedFilters.push(filter);
        }

        setSelectedFilters(updatedFilters);
        if (updatedFilters.length === 0) {
            setFilteredFoods(allFoods);
        } else {
            setFilteredFoods(allFoods.filter((food) => updatedFilters.every((filter) => food.category.includes(filter))));
        }
    };

    return (
        <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginTop: 16}} contentContainerStyle={{gap: 12}}>
                {filters.map((item, index) => (
                    <TouchableOpacity
                        activeOpacity={0.99}
                        key={index}
                        onPress={() => toggleFilter(item)}
                        style={{
                            width: 100,
                            height: 40,
                            backgroundColor: selectedFilters.includes(item) ? Colors.primary : "#fff",
                            borderWidth: 1,
                            borderColor: Colors.primary,
                            borderRadius: 5,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{textAlign: "center", color: selectedFilters.includes(item) ? "#fff" : "#000"}}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={{marginTop: 20}}>
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((food, index) => (
                        <TouchableOpacity key={index} activeOpacity={0.99} onPress={() => navigation.navigate("FoodDetail", {name: food.name_eng})}>
                            <View>
                                <Image source={{uri: food.img}} style={{width: 180, height: 100, borderRadius: 10}} />
                            </View>
                            <Text style={{fontSize: 16, fontWeight: "bold"}}>{food.name_eng}</Text>
                            <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                <Ionicons name="star" size={16} color={"#FFD700"} />
                                <Text>{food.rating}</Text>
                            </View>
                            <Text style={{fontSize: 16, fontWeight: "900", color: "#52BB60"}}>${Math.round(food.price * 0.03)}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={{fontSize: 18, color: "gray"}}>No food matches the filter</Text>
                )}
            </View>
        </View>
    );
};

export default FilterFood;
