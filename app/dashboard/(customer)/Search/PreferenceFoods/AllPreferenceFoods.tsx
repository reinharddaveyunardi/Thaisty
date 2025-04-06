import {View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, RefreshControl} from "react-native";
import React, {useEffect, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {getUserId} from "@/services/SecureStore";
import {getFood, getUserData} from "@/services/api";
import {Colors} from "@/constant/Colors";

export default function AllPreferenceFoods({navigation}: any) {
    const [userPreferences, setUserPreferences] = useState<string[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [foodData, setFoodData] = useState<any[]>([]);
    const [filteredFoods, setFilteredFoods] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const food = await getFood();
        if (Array.isArray(food)) {
            setFoodData(food);
            setFilteredFoods(food);
        }
        setRefreshing(false);
    }, []);
    function BahtFormat(price: any) {
        return new Intl.NumberFormat("th-TH", {style: "currency", currency: "THB", trailingZeroDisplay: "stripIfInteger"}).format(price);
    }
    useEffect(() => {
        const loadFood = async () => {
            try {
                const food = await getFood();
                if (Array.isArray(food)) {
                    setFoodData(food);
                    setFilteredFoods(food);
                } else {
                    setFoodData([]);
                    setFilteredFoods([]);
                }
            } catch (e) {
                console.error("Error fetching food data:", e);
            }
        };
        loadFood();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (!foodData.length) return;

        if (query.trim() === "") {
            setFilteredFoods(foodData.filter((food) => selectedFilters.length === 0 || selectedFilters.some((filter) => food.category?.includes(filter))));
        } else {
            setFilteredFoods(
                foodData.filter(
                    (food) =>
                        food.name?.toLowerCase().includes(query.toLowerCase()) &&
                        (selectedFilters.length === 0 || selectedFilters.some((filter) => food.category?.includes(filter)))
                )
            );
        }
    };
    useEffect(() => {
        if (userPreferences.length > 0 && foodData.length > 0) {
            setSelectedFilters(userPreferences);
            setFilteredFoods(foodData.filter((food) => userPreferences.some((filter) => !food.allergies?.includes(filter))));
        }
    }, [userPreferences, foodData]);

    useEffect(() => {
        const getPreferences = async () => {
            try {
                const userId = await getUserId();
                const userData = await getUserData({userId: userId});
                setUserPreferences(userData?.allergies || []);
            } catch (e) {
                console.error("Error fetching user preferences:", e);
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
            </View>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((food) => (
                        <TouchableOpacity
                            key={food.name}
                            onPress={() =>
                                navigation.navigate("FoodDetail", {
                                    name: food.name,
                                    description: food.description,
                                    price: food.price,
                                    image_product: food.image,
                                    name_restaurant: food.name_restaurant,
                                    image_restaurant: food.image_restaurant,
                                    merchantId: food.merchantId,
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
                                <Image source={{uri: food.image}} style={{width: 100, height: 100, borderRadius: 10}} />
                            </View>
                            <View style={{marginHorizontal: 10}}>
                                <View style={{width: Dimensions.get("screen").width - 150}}>
                                    <Text style={{fontSize: 18, fontWeight: "bold"}} numberOfLines={1} ellipsizeMode="tail">
                                        {food.name}
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                    <Ionicons name="star" size={16} color={"#FFD700"} />
                                    <Text>{food.rating}</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 16, color: "green"}}>{BahtFormat(food.price)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center", height: "100%"}}>
                        <Text style={{fontSize: 18, color: "gray", justifyContent: "center"}}>No food matches the filter</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
