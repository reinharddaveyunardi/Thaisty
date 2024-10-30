import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {thisDeviceWidth} from "@/utils";
import {TrendingFoodData} from "@/data/data";
import {ColorsPallette} from "@/constants/Colors";
import {Styles} from "@/style/Styles";
export default function TrendingFood({onSelectedItem, addToCart}: any) {
    const handleAddToCart = (name: string, image: any, price: any) => {
        addToCart(name, image, price);
    };
    const handleShowInfo = (name: string, image: any, desc: string) => {
        onSelectedItem(name, image, desc);
    };
    return (
        <View style={Styles.boxGap}>
            <Text style={{color: ColorsPallette.white, fontSize: 18, fontWeight: "bold"}}>Trending Food</Text>
            <View style={Styles.boxGap}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={Styles.boxGap}>
                    {TrendingFoodData.map((item, index) => (
                        <TouchableOpacity style={{width: thisDeviceWidth / 2}} key={index} onPress={() => handleShowInfo(item.name, item.url, item.desc)}>
                            <Image source={item.image} style={{width: 190, height: 110, borderRadius: 15}} />
                            <View style={{justifyContent: "space-between", height: "100%", position: "absolute"}}>
                                <View style={{justifyContent: "center", alignItems: "center", width: "100%", backgroundColor: "rgba(27, 27, 27, 0.9)"}}>
                                    <Text style={{color: ColorsPallette.white, fontSize: 14, fontWeight: "bold"}}>{item.name}</Text>
                                </View>
                                <View
                                    style={{
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                        width: "100%",
                                        backgroundColor: "rgba(27, 27, 27, 0.9)",
                                        paddingHorizontal: 10,
                                    }}
                                >
                                    <Text style={{fontSize: 16, fontWeight: "bold", color: ColorsPallette.white}}>{item.price}</Text>
                                    <TouchableOpacity
                                        style={{justifyContent: "center", alignItems: "center"}}
                                        onPress={() => handleAddToCart(item.name, item.url, item.desc)}
                                    >
                                        <Text style={{color: ColorsPallette.white, fontSize: 14, fontWeight: "bold"}}>Add to cart</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
