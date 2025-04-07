import React, {useEffect, useState} from "react";
import {View, FlatList, ActivityIndicator, Text} from "react-native";
import {collection, onSnapshot, query, where, updateDoc, doc} from "firebase/firestore";
import {firestore} from "@/config/firebase";
import OrderCard from "../components/OrderCard";
import {getDistance} from "geolib";
import * as Location from "expo-location";
import {useAuth} from "@/contexts/AuthProvider";
import {getUserId} from "@/services/SecureStore";
import {getUserData} from "@/services/api";

export default function SearchOrdersScreen() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [driverLocation, setDriverLocation] = useState<{latitude: number; longitude: number} | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [driverData, setDriverData] = useState<any>(null);
    useEffect(() => {
        (async () => {
            const loadDriverProfile = async () => {
                try {
                    const driverData = await getUserData({userId});
                    setDriverData(driverData);
                } catch (error) {
                    console.error("Failed to fetch driver data:", error);
                }
            };
            const userId = await getUserId();
            setUserId(userId);
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Izin lokasi ditolak");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setDriverLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            loadDriverProfile();
        })();
    }, []);

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

    const handleAccept = async (orderId: string) => {
        console.log("accepting", orderId);
        await updateDoc(doc(firestore, "orders", orderId), {
            status: "driver_found",
            driverId: userId,
            driverName: driverData.fullName,
        });
        console.log("accepted", orderId);
    };

    if (loading || !driverLocation) return <ActivityIndicator style={{flex: 1}} size="large" />;

    return (
        <View style={{flex: 1}}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <OrderCard order={item} onAccept={() => handleAccept(item.id)} />}
                ListEmptyComponent={<Text style={{textAlign: "center", marginTop: 20}}>Tidak ada order di sekitar.</Text>}
            />
        </View>
    );
}
