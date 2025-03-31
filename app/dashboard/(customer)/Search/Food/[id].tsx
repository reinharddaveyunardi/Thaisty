import {Colors} from "@/constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useEffect, useState} from "react";
import {View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Image} from "react-native";
export default function FoodScreen({route, navigation}: any) {
    const [counter, setCounter] = useState(1);
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);

    function BahtFormat(price: any) {
        return new Intl.NumberFormat("th-TH", {style: "currency", currency: "THB", trailingZeroDisplay: "stripIfInteger"}).format(price);
    }

    const {name, img, rating, open, desc, price} = route.params;
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
            <View style={{position: "absolute", top: "10%", left: 16, zIndex: 1}}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{backgroundColor: "#fff", padding: 8, borderRadius: 50}}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView style={{backgroundColor: "#fff"}}>
                <Image style={{width: "100%", height: 300}} source={{uri: img}} />
                <View style={{backgroundColor: "#fff", padding: 16, bottom: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                    <View>
                        <Text style={{fontSize: 24, fontWeight: "semibold"}}>{name}</Text>
                        <View style={{width: "90%", height: 0.5, backgroundColor: "#2d2d2d", marginTop: 10}} />
                        <Text style={{fontSize: 16, fontWeight: "semibold", marginTop: 10}}>Description</Text>
                        <Text style={{fontSize: 16, fontWeight: "semibold", marginTop: 5, opacity: 0.7}}>{desc}</Text>
                    </View>
                </View>
            </ScrollView>
            <View
                style={{
                    position: "absolute",
                    bottom: "5%",
                    width: "100%",
                    paddingHorizontal: "2%",
                    height: "auto",
                }}
            >
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "space-around",
                        height: "100%",
                        shadowColor: "#000",
                        shadowOffset: {width: 3, height: 3},
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        borderRadius: 10,
                        paddingHorizontal: "2%",
                        elevation: 5,
                        paddingVertical: "2%",
                        backgroundColor: "white",
                        gap: 12,
                    }}
                >
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <View>
                            <Text>{BahtFormat(price * 33.91)}</Text>
                        </View>
                        <View style={{flexDirection: "row", gap: 12, borderRadius: 5, backgroundColor: "rgba(0,0,0,0.1)", height: 30}}>
                            <TouchableOpacity
                                onPress={() => setCounter(counter - 1 < 1 ? 1 : counter - 1)}
                                style={[Styles.counterBtn, {borderTopLeftRadius: 5, borderBottomLeftRadius: 5}]}
                            >
                                <View>
                                    <Text>-</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                <Text>{counter}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setCounter(counter + 1)}
                                style={[Styles.counterBtn, {borderTopRightRadius: 5, borderBottomRightRadius: 5}]}
                            >
                                <View>
                                    <Text>+</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={{
                                width: "100%",
                                height: 40,
                                borderRadius: 5,
                                backgroundColor: Colors.primary,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{color: "#fff"}}>Add to Cart - {BahtFormat(counter * (price * 33.91))}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const Styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    counterBtn: {
        width: 30,
        height: 30,
        borderRadius: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginVertical: 5,
    },
    closeButton: {
        marginTop: 15,
        backgroundColor: "red",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
});
