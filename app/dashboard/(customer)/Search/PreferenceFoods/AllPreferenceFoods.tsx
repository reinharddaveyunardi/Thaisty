import {View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, Dimensions} from "react-native";
import React, {useEffect, useState} from "react";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {getUserId} from "@/services/SecureStore";
import {getUserData} from "@/services/api";
import {foodData} from "@/data/FoodData";
import {Colors} from "@/constant/Colors";

export default function AllPreferenceFoods({navigation}: any) {
    const [userPreferences, setUserPreferences] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [filteredFoods, setFilteredFoods] = useState(foodData);
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredFoods(foodData.filter((food) => selectedFilters.length === 0 || selectedFilters.some((filter) => food.category.includes(filter))));
        } else {
            setFilteredFoods(
                foodData.filter(
                    (food) =>
                        food.name_eng.toLowerCase().includes(query.toLowerCase()) &&
                        (selectedFilters.length === 0 || selectedFilters.some((filter) => food.category.includes(filter)))
                )
            );
        }
    };

    const toggleFilter = (filter: string) => {
        let updatedFilters = [...selectedFilters];

        if (updatedFilters.includes(filter)) {
            updatedFilters = updatedFilters.filter((item) => item !== filter);
        } else {
            updatedFilters.push(filter);
        }

        setSelectedFilters(updatedFilters);

        if (updatedFilters.length === 0) {
            setFilteredFoods(foodData);
        } else {
            setFilteredFoods(foodData.filter((food) => updatedFilters.some((filter) => !food.category.includes(filter))));
        }
    };
    useEffect(() => {
        if (userPreferences.length > 0) {
            setSelectedFilters(userPreferences);
            setFilteredFoods(foodData.filter((food) => userPreferences.some((filter) => !food.category.includes(filter))));
        }
    }, [userPreferences]);
    useEffect(() => {
        const getPreferences = async () => {
            try {
                const userId = await getUserId();
                const userData = await getUserData({userId: userId});
                setUserPreferences(userData?.allergies);
            } catch (e) {
                console.log(e);
            }
        };
        getPreferences();
    }, []);
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <View
                style={{
                    backgroundColor: "#fff",
                    padding: 16,
                    borderBottomRightRadius: 20,
                    borderBottomLeftRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    gap: 12,
                }}
            >
                <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                    <Text style={{fontSize: 16}}>Back</Text>
                </TouchableOpacity>
                <View>
                    <View style={{flexDirection: "row", alignItems: "center", width: "100%", borderWidth: 0.2, gap: 4, paddingHorizontal: 8, borderRadius: 8}}>
                        <Ionicons name="search" size={24} color="black" />
                        <TextInput placeholder="Search Thailand Restaurant" style={{height: 40, flex: 1}} value={searchQuery} onChangeText={handleSearch} />
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {/* Filter button */}
                    {userPreferences.map((item, index) => (
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
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((food, index) => (
                        <TouchableOpacity
                            key={food.name_eng}
                            onPress={() =>
                                navigation.navigate("Shop", {
                                    name: food.name_eng,
                                    img: food.img,
                                    rating: food.rating,
                                })
                            }
                            style={{
                                padding: 10,
                                flexDirection: "row",
                                gap: 10,
                                marginVertical: 10,
                                borderBottomWidth: 0.2,
                                borderBottomColor: "#ccc",
                                marginHorizontal: 6,
                            }}
                        >
                            <View style={{width: 100, height: 100}}>
                                {food.verified && (
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: -10,
                                            right: -10,
                                            zIndex: 2,
                                            backgroundColor: "white",
                                            padding: 4,
                                            borderRadius: 50,
                                            elevation: 5,
                                            shadowColor: "#000",
                                            shadowOffset: {width: 2, height: 2.5},
                                            shadowOpacity: 0.4,
                                            shadowRadius: 1,
                                        }}
                                    >
                                        <MaterialIcons name="verified-user" size={24} color="green" />
                                    </View>
                                )}
                                <Image source={{uri: food.img}} style={{width: 100, height: 100, borderRadius: 10}} />
                            </View>
                            <View style={{marginHorizontal: 10}}>
                                <View style={{width: Dimensions.get("screen").width - 150}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}} numberOfLines={1} ellipsizeMode="tail">
                                        {food.name_eng}
                                    </Text>
                                </View>

                                <View>
                                    {/* {food.open ? (
                                    <View style={{flexDirection: "column", gap: 4}}>
                                        <Text style={{color: "green"}}>Open</Text>
                                    </View>
                                ) : (
                                    <View style={{flexDirection: "row", gap: 4}}>
                                        <Text style={{color: "red"}}>Close</Text>
                                    </View>
                                )} */}
                                    <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                        <Ionicons name="star" size={16} color={"#FFD700"} />
                                        <Text>{food.rating}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={{fontSize: 18, color: "gray"}}>No food matches the filter</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
