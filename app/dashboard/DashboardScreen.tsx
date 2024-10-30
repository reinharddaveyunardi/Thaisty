import {SafeAreaView, ScrollView, StatusBar, Text, View, Image} from "react-native";
import React, {useCallback, useRef, useState} from "react";
import BannerAds from "@/components/BannerAds";
import {ColorsPallette} from "@/constants/Colors";
import {thisDeviceHeight} from "@/utils";
import TrendingFood from "@/components/TrendingFood";
import PopularFood from "@/components/PopularFood";
import {Ionicons} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native-gesture-handler";
import BottomSheet, {BottomSheetScrollView, BottomSheetView} from "@gorhom/bottom-sheet";
import {Styles} from "@/style/Styles";

export default function DashboardScreen() {
    const [sheetMode, setSheetMode] = useState(true);
    const [selectedItem, setSelectedItem] = useState("");
    const [imageSelectedItem, setImageSelectedItem] = useState("");
    const [descSelectedItem, setDescSelectedItem] = useState("");
    const [cartItems, setCartItems] = useState<any[]>([]);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleSelectedItem = (item: string, image: string, desc: string) => {
        setSheetMode(true);
        setSelectedItem(item);
        setImageSelectedItem(image);
        setDescSelectedItem(desc);
        bottomSheetRef.current?.snapToIndex(1);
    };

    const addToCart = (name: string, image: any, price: any) => {
        const newItem = {
            name: name,
            image: image,
            price: price,
        };
        setCartItems([...cartItems, newItem]);
    };
    const handleSwitchtoCart = () => {
        setSheetMode(false);
        bottomSheetRef.current?.snapToIndex(1);
    };

    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);
    return (
        <SafeAreaView style={{marginVertical: 20}}>
            <StatusBar backgroundColor={ColorsPallette.gray} barStyle="dark-content" />
            <View style={{position: "absolute", zIndex: 1, bottom: 20, right: 20, width: 40, height: 40}}>
                <View
                    style={{
                        backgroundColor: ColorsPallette.yellow,
                        height: "100%",
                        width: "100%",
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity onPress={() => handleSwitchtoCart()}>
                        <Ionicons name="cart-outline" size={24} color={ColorsPallette.white} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <View>
                    <BannerAds />
                </View>
                <View style={{backgroundColor: ColorsPallette.gray, height: thisDeviceHeight, padding: 20, gap: 20}}>
                    <View>
                        <TrendingFood onSelectedItem={handleSelectedItem} addToCart={addToCart} />
                    </View>
                    <View>
                        <PopularFood onSelectedItem={handleSelectedItem} addToCart={addToCart} />
                    </View>
                    <View>{/* Popular Dessert */}</View>
                </View>
            </ScrollView>
            {sheetMode ? (
                <BottomSheet
                    index={-1}
                    snapPoints={[100, 500]}
                    ref={bottomSheetRef}
                    enablePanDownToClose
                    onChange={handleSheetChanges}
                    handleIndicatorStyle={{backgroundColor: ColorsPallette.yellow}}
                    handleStyle={{backgroundColor: ColorsPallette.gray, borderTopLeftRadius: 15, borderTopRightRadius: 15}}
                >
                    <BottomSheetScrollView style={{backgroundColor: ColorsPallette.gray}}>
                        <View style={{paddingHorizontal: 20}}>
                            {imageSelectedItem ? (
                                <Image style={{width: "100%", height: 160, borderRadius: 15}} source={{uri: imageSelectedItem}} resizeMode="cover" />
                            ) : null}
                        </View>
                        <View style={[Styles.centerItem, {marginVertical: 10}]}>
                            <Text style={{fontWeight: "bold", fontSize: 24, color: ColorsPallette.white}}>{selectedItem}</Text>
                        </View>
                        <View style={[Styles.centerItem]}>
                            <View style={{width: "80%"}}>
                                {descSelectedItem ? <Text style={{color: ColorsPallette.white}}>{descSelectedItem}</Text> : null}
                            </View>
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
            ) : (
                <BottomSheet
                    index={-1}
                    snapPoints={[100, 500]}
                    ref={bottomSheetRef}
                    enablePanDownToClose
                    onChange={handleSheetChanges}
                    handleIndicatorStyle={{backgroundColor: ColorsPallette.yellow}}
                >
                    <BottomSheetView style={Styles.centerItem}>
                        <View>
                            <Text>My Cart</Text>
                        </View>
                    </BottomSheetView>
                    <BottomSheetScrollView>
                        {cartItems.map((item, index) => (
                            <View key={index}>
                                <Text>{item.name}</Text>
                                <Image source={{uri: item.image}} style={{width: 100, height: 100}} />
                                <Text>{item.desc}</Text>
                            </View>
                        ))}
                    </BottomSheetScrollView>
                </BottomSheet>
            )}
        </SafeAreaView>
    );
}
