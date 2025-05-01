import {View, Text, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import {Feather, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {Colors} from "@/constant/Colors";
import {getUserId} from "@/services/SecureStore";
import {deleteSavedAddress} from "@/services/api";

export default function LocationCard({data, navigation}: any) {
    const [popup, setPopup] = useState(false);

    const removeLocation = async (addressId: string) => {
        try {
            const userId = await getUserId();
            await deleteSavedAddress({addressId, userId});
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <View style={{alignSelf: "center", padding: 14, width: "100%", borderWidth: 1, borderRadius: 8, borderColor: Colors.primary}} key={data.id}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <View>
                    <Text>{data.name}</Text>
                </View>
                <View style={{flexDirection: "row", gap: 12}}>
                    <TouchableOpacity activeOpacity={0.9} style={{alignSelf: "flex-end"}} onPress={() => removeLocation(data.id)}>
                        <Ionicons name="trash-outline" size={24} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate("EditLocationScreen", {data: data})}>
                        <Feather name="edit" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9}>
                        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{backgroundColor: "rgba(0, 0, 0, 0.1)", padding: 12, borderRadius: 8, marginTop: 12}}>
                <Text>{data.address}</Text>
            </View>
        </View>
    );
}
