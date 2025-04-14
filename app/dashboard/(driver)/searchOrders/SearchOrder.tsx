import React, {useEffect, useState} from "react";
import {View, FlatList, ActivityIndicator, Text, SafeAreaView, TouchableOpacity} from "react-native";
import {collection, onSnapshot, query, where, updateDoc, doc, getDoc, setDoc} from "firebase/firestore";
import {firestore} from "@/config/firebase";
import OrderCard from "../components/OrderCard";
import {getDistance} from "geolib";
import * as Location from "expo-location";
import {useAuth} from "@/contexts/AuthProvider";
import {getUserId} from "@/services/SecureStore";
import {getUserData} from "@/services/api";
import {Ionicons} from "@expo/vector-icons";
export default function SearchOrdersScreen({navigation}: any) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [driverLocation, setDriverLocation] = useState<{latitude: number; longitude: number} | null>(null);
    useEffect(() => {
        (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Izin lokasi ditolak");
                return;
            }
            console.log("Updating driver location");
            const location = await Location.getCurrentPositionAsync({timeInterval: 1000, accuracy: 2});
            setDriverLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            console.log("Updated driver location", location.coords.latitude, location.coords.longitude);
        })();
    }, []);
    useEffect(() => {
        if (driverLocation) {
            console.log("Driver location updated (by useEffect):", driverLocation.latitude, driverLocation.longitude);
        }
    }, [driverLocation]);

    useEffect(() => {
        if (!driverLocation) return;

        const q = query(collection(firestore, "orders"), where("status", "==", "looking_for_driver"));
        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setOrders(data);
            setLoading(false);
        });

        return () => unsub();
    }, [driverLocation]);

    const seeDetail = (id: string) => navigation.navigate("OrderDetail", {orderId: id});
    if (loading || !driverLocation) return <ActivityIndicator style={{flex: 1}} size="large" />;

    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    height: 60,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                }}
            >
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={orders}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <OrderCard order={item} seeDetail={() => seeDetail(item.id)} />}
                ListEmptyComponent={<Text style={{textAlign: "center", marginTop: 20}}>Tidak ada order di sekitar.</Text>}
            />
        </SafeAreaView>
    );
}
