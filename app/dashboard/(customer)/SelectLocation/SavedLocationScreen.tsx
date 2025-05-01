import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import React, {useEffect, useState} from "react";
import {getSavedAddress} from "@/services/api";
import {getUserId} from "@/services/SecureStore";
import {SafeAreaView} from "react-native-safe-area-context";
import LocationCard from "./components/LocationCard";
import {Ionicons} from "@expo/vector-icons";

export default function SavedLocationScreen({route, navigation}: any) {
    const [savedLocations, setSavedLocations] = useState<any | null>(null);

    useEffect(() => {
        const fetchSavedLocations = async () => {
            const userId = await getUserId();
            try {
                const res = await getSavedAddress({userId});
                setSavedLocations(res);
            } catch (e) {
                console.log(e);
            }
        };
        fetchSavedLocations();
    }, []);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <View
                style={{
                    shadowColor: "#000",
                    shadowOffset: {width: 0, height: 4},
                    shadowOpacity: 0.25,
                    shadowRadius: 1.5,
                    elevation: 5,
                    backgroundColor: "#fff",
                    padding: 16,
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{padding: 16}}>
                {savedLocations && savedLocations.length > 0 ? (
                    savedLocations.map((item: any, index: number) => (
                        <View key={index}>
                            <LocationCard data={item} navigation={navigation} />
                        </View>
                    ))
                ) : (
                    <View>
                        <Text>No Saved Location</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
