import {View, Text, SafeAreaView, TextInput, TouchableOpacity, FlatList, Image, Dimensions} from "react-native";
import React, {useEffect, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {Link, useRouter} from "expo-router";
import {foodData} from "@/data/FoodData";

const foods = foodData;

export default function SearchScreen({navigation}: any) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredFoods, setFilteredFoods] = useState(foods);
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredFoods(foods);
        } else {
            const filtered = foods.filter((food) => food.name_eng.toLowerCase().includes(query.toLowerCase()));
            setFilteredFoods(filtered);
        }
    };
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff", padding: 16}}>
            <View style={{width: "100%", flexDirection: "row", alignItems: "center", gap: 8, borderBottomWidth: 0.2, paddingBottom: 16}}>
                <View style={{flexDirection: "row", alignItems: "center", gap: 8, width: "100%", left: 6}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{flexDirection: "row", alignItems: "center", width: "85%", borderWidth: 0.2, gap: 4, paddingHorizontal: 8, borderRadius: 8}}>
                        <Ionicons name="search" size={24} color="black" />
                        <TextInput placeholder="Search Thailand Restaurant" style={{height: 40, flex: 1}} value={searchQuery} onChangeText={handleSearch} />
                    </View>
                </View>
            </View>

            <FlatList
                data={filteredFoods}
                keyExtractor={(item) => item.name_eng}
                renderItem={({item}) => (
                    <TouchableOpacity
                        key={item.name_eng}
                        onPress={() =>
                            navigation.navigate("Shop", {
                                name: item.name_eng,
                                img: item.img,
                                rating: item.rating,
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
                            {item.verified && (
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
                            <Image source={{uri: item.img}} style={{width: 100, height: 100, borderRadius: 10}} />
                        </View>
                        <View style={{marginHorizontal: 10}}>
                            <View style={{width: Dimensions.get("screen").width - 150}}>
                                <Text style={{fontSize: 18, fontWeight: "bold"}} numberOfLines={1} ellipsizeMode="tail">
                                    {item.name_restaurant}
                                </Text>
                            </View>

                            <View>
                                {/* {item.open ? (
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
                                    <Text>{item.rating}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}
