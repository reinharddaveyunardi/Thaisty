import React, {useEffect, useState} from "react";
import {View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, SafeAreaView, TouchableOpacity} from "react-native";
import {collection, getDocs, query, where} from "firebase/firestore";
import {auth, firestore} from "@/config/firebase";
import {useAuth} from "@/contexts/AuthProvider";
import {getUserId} from "@/services/SecureStore";
import {BahtFormat} from "@/utils/FormatCurrency";
import {useRouter} from "expo-router";
import {Colors} from "@/constant/Colors";

export default function OrderScreen({navigation}: any) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    function taskStatus(status: string) {
        switch (status) {
            case "looking_for_driver":
                return "Mencari Driver";
            case "pending":
                return "Menunggu Konfirmasi";
            case "accepted":
                return "Diterima";
            case "rejected":
                return "Ditolak";
            case "ongoing_to_customer":
                return "Dalam Perjalanan";
            case "finished":
                return "Selesai";
            default:
                return status;
        }
    }
    useEffect(() => {
        const fetchOrders = async () => {
            const userId = await getUserId();
            if (!userId) {
                console.log("User ID is not available");
                return;
            }
            try {
                const q = query(collection(firestore, "orders"), where("userId", "==", userId));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setOrders(data);
            } catch (e) {
                console.log("Error fetching orders:", e);
            } finally {
                setLoading(false);
            }
        };
        setInterval(() => {
            fetchOrders();
        }, 5000);
    }, [orders]);

    if (orders.length === 0) {
        return (
            <View style={styles.center}>
                <Text>Belum ada pesanan</Text>
            </View>
        );
    }
    const buttonHandler = () => {
        navigation.navigate(`OngoingOrder`, {orderId: orders[0].id});
    };
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>Status: {taskStatus(item.status)}</Text>
                        <Text>Alamat: {item.address}</Text>
                        <Text>Total: {BahtFormat(item.total)}</Text>
                        <Text>Driver: {item.driverName || "Driver not assigned"}</Text>
                        {item.status === "looking_for_driver" || item.status === "ongoing_to_customer" ? (
                            <View>
                                <TouchableOpacity onPress={buttonHandler} style={{backgroundColor: Colors.primary, padding: 8, borderRadius: 4, marginTop: 8}}>
                                    <Text style={{color: "#fff"}}>Track</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16, backgroundColor: "#fff"},
    center: {flex: 1, justifyContent: "center", alignItems: "center"},
    card: {
        backgroundColor: "#f0f0f0",
        padding: 16,
        margin: 16,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    title: {fontWeight: "bold", marginBottom: 4, fontSize: 16},
});
