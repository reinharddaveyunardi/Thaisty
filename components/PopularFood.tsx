//Press Swipe

import * as React from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import Carousel, {TAnimationStyle} from "react-native-reanimated-carousel";
import {thisDeviceWidth} from "@/utils";
import {ColorsPallette} from "@/constants/Colors";
import {PopularFoodData} from "@/data/data";
import {Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {useCallback, useRef, useState} from "react";

function PopularFood({navigation, onSelectedItem, addToCart}: any) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const width = thisDeviceWidth;
    const animationStyle: TAnimationStyle = React.useCallback((value: number) => {
        "worklet";
        const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
        const rotateZ = `${interpolate(value, [-10, 0, 10], [-10, 0, 10])}deg`;
        const translateX = interpolate(value, [-1, 0, 1], [-width, 0, width]);
        return {
            transform: [{rotateZ}, {translateX}],
            zIndex,
        };
    }, []);

    const handleAddToCart = (name: string, image: any, price: any) => {
        addToCart(name, image, price);
    };
    const handleShowInfo = (name: string, image: any, desc: string) => {
        onSelectedItem(name, image, desc);
        console.log(desc);
    };
    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);

    return (
        <View style={{marginVertical: 10}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={{color: ColorsPallette.white, fontSize: 18, fontWeight: "bold"}}>Popular Food</Text>
                <Ionicons name="chevron-forward" size={18} color={ColorsPallette.yellow} />
            </View>
            <Carousel
                loop
                style={{
                    height: 240,
                    width: "100%",
                    top: 10,
                }}
                width={width}
                height={width / 2}
                data={PopularFoodData}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => handleShowInfo(item.name, item.url, item.desc)}>
                        <Image source={item.image} style={{width: "90%", height: 200, borderRadius: 15}} />
                        <View style={{justifyContent: "space-between", height: "100%", position: "absolute"}}>
                            <View style={{justifyContent: "center", alignItems: "center", width: "95%", backgroundColor: "rgba(27, 27, 27, 0.9)"}}>
                                <Text style={{color: ColorsPallette.white, fontSize: 14, fontWeight: "bold"}}>{item.name}</Text>
                            </View>
                            <View
                                style={{
                                    justifyContent: "space-between",
                                    flexDirection: "row",
                                    width: "95%",
                                    backgroundColor: "rgba(27, 27, 27, 0.9)",
                                    paddingHorizontal: 10,
                                }}
                            >
                                <Text style={{fontSize: 16, fontWeight: "bold", color: ColorsPallette.white}}>{item.price}</Text>
                                <TouchableOpacity
                                    style={{justifyContent: "center", alignItems: "center"}}
                                    onPress={() => handleAddToCart(item.name, item.url, item.price)}
                                >
                                    <Text style={{color: ColorsPallette.white, fontSize: 14, fontWeight: "bold"}}>Add to cart</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                customAnimation={animationStyle}
            />
        </View>
    );
}

export default PopularFood;
const styles = StyleSheet.create({
    Container: {
        padding: 20,
    },
    Content: {
        flex: 1,
    },
    Card: {
        marginHorizontal: 10,
        width: 300,
        marginVertical: 10,
        height: "auto",
        padding: 0,
        backgroundColor: ColorsPallette.white,
        shadowColor: "#171717",
        shadowOffset: {width: -2, height: 7},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
        zIndex: 2,
    },
    courseInformation: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 50,
        padding: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        backgroundColor: ColorsPallette.white,
        shadowColor: "#171717",
        shadowOffset: {width: 0, height: -7},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 1,
        zIndex: 2,
    },
    courseData: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    courseTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },
    Image: {
        position: "relative",
        width: "100%",
        height: 180,
        backgroundColor: ColorsPallette.white,

        top: 0,
    },
    tagContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
    },
});
