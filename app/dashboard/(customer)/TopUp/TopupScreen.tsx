import {View, Text, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, TextInput, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@/constant/Colors";
import {PaymentMethod} from "@/data/PaymentMethod";
import {getUserId} from "@/services/SecureStore";
import {Topup} from "@/services/api";

export default function TopupScreen({navigation}: any) {
    const [amount, setAmount] = useState<number>(0.0);
    const [paymentMethod, setPaymentMethod] = useState<string>("none");
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <View
                style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.25,
                    shadowRadius: 1.5,
                }}
            >
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{flexDirection: "column", height: "100%", width: "100%", padding: 16, gap: 16}}>
                <View>
                    <Text style={{marginBottom: 8}}>This is for testing</Text>
                    <View
                        style={{
                            backgroundColor: "#fff",
                            padding: 16,
                            borderRadius: 8,
                            elevation: 2,
                            shadowColor: "#000",
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.25,
                            shadowRadius: 1.5,
                        }}
                    >
                        <Text>Top Up</Text>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Text style={{fontSize: 32}}>฿</Text>
                            <TextInput
                                placeholder="0.00"
                                placeholderTextColor={"rgba(0,0,0, 0.5)"}
                                style={{fontSize: 32, width: "100%"}}
                                keyboardType="numeric"
                                onChangeText={(e) => {
                                    const cleaned = e.replace(",", ".");
                                    const parsed = parseFloat(cleaned);
                                    setAmount(isNaN(parsed) ? 0 : parsed);
                                }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <Text>Topup Method</Text>
                    <View style={{flexDirection: "column", gap: 8}}>
                        {PaymentMethod.map((item, index) => (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                key={index}
                                onPress={() => setPaymentMethod(item.name)}
                                style={{
                                    backgroundColor: paymentMethod === item.name ? Colors.primary : "#fff",
                                    padding: 12,
                                    borderRadius: 8,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <View>
                                    <Image source={{uri: item.icon}} style={{width: 32, height: 32}} />
                                </View>
                                <Text style={{color: paymentMethod === item.name ? "#fff" : "#000"}}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={paymentMethod === "none" || amount === 0.0}
                    onPress={async () => {
                        const userId = await getUserId();
                        if (!userId) return;

                        await Topup({userId, amount: amount, method: paymentMethod});
                        navigation.goBack();
                    }}
                    style={{backgroundColor: paymentMethod === "none" || amount === 0.0 ? "#ccc" : Colors.primary, padding: 12, borderRadius: 8}}
                >
                    <Text style={{color: "#fff"}}>Confirm Top Up</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
