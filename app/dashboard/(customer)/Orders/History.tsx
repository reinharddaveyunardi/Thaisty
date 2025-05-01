import {View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar} from "react-native";
import React, {useEffect, useState} from "react";
import {getUserId} from "@/services/SecureStore";
import {firestore} from "@/config/firebase";
import {query, collection, where, getDocs} from "firebase/firestore";
import {BahtFormat} from "@/utils/FormatCurrency";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {Colors} from "@/constant/Colors";

export default function History({navigation}: any) {
    const [history, setHistory] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const onRefresh = React.useCallback(async () => {
        const getHistory = async () => {
            setLoading(true);
            const userId = await getUserId();
            if (!userId) return;

            try {
                const qOrders = query(collection(firestore, "orders"), where("customerId", "==", userId), where("status", "==", "finished"));
                const qTopups = query(collection(firestore, "users", userId, "historyTopup"));

                const [orderSnap, topupSnap] = await Promise.all([getDocs(qOrders), getDocs(qTopups)]);

                const orders = orderSnap.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            type: "order",
                            ...doc.data(),
                        } as any)
                );

                const topups = topupSnap.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            type: "topup",
                            ...doc.data(),
                        } as any)
                );
                const combined = [...orders, ...topups].sort((a, b) => b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.());

                setHistory(combined);
            } catch (e) {
                console.log("Error fetching history:", e);
            } finally {
                setLoading(false);
            }
        };
        getHistory();
    }, []);

    useEffect(() => {
        const getHistory = async () => {
            setLoading(true);
            const userId = await getUserId();
            if (!userId) return;

            try {
                const qOrders = query(collection(firestore, "orders"), where("customerId", "==", userId), where("status", "==", "finished"));
                const qTopups = query(collection(firestore, "users", userId, "historyTopup"));

                const [orderSnap, topupSnap] = await Promise.all([getDocs(qOrders), getDocs(qTopups)]);

                const orders = orderSnap.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            type: "order",
                            ...doc.data(),
                        } as any)
                );

                const topups = topupSnap.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            type: "topup",
                            ...doc.data(),
                        } as any)
                );
                const combined = [...orders, ...topups].sort((a, b) => b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.());

                setHistory(combined);
            } catch (e) {
                console.log("Error fetching history:", e);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", () => {
            getHistory();
        });
        return () => unsubscribe;
    }, []);

    return (
        <ScrollView style={{flex: 1, backgroundColor: "#fff", padding: 16}}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            {loading ? (
                <View>
                    <Text>Loading...</Text>
                </View>
            ) : history && history.length > 0 ? (
                history.map((item: any) => (
                    <View key={item.id} style={styles.card}>
                        {item.type === "order" ? (
                            <View style={{flexDirection: "row", gap: 16, alignItems: "center"}}>
                                <Ionicons name="cart-outline" size={24} color={Colors.primary} />
                                <View>
                                    <Text style={styles.title}>Order</Text>
                                    <Text>Address: {item.address}</Text>
                                    <Text>Total: {BahtFormat(item.total)}</Text>
                                    <Text>Driver: {item.driverName || "Driver not assigned"}</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={{flexDirection: "row", gap: 16, alignItems: "center"}}>
                                <MaterialCommunityIcons name="cash-plus" size={24} color={Colors.primary} />
                                <View>
                                    <Text style={styles.title}>Top Up</Text>
                                    <Text>Amount: {BahtFormat(item.amount)}</Text>
                                    <Text>Method: {item.method}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                ))
            ) : (
                <View style={styles.center}>
                    <Text>No history</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#fff"},
    center: {flex: 1, justifyContent: "center", alignItems: "center"},
    card: {
        backgroundColor: "#f0f0f0",
        padding: 16,
        width: "100%",
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    title: {fontWeight: "bold", marginBottom: 4, fontSize: 16},
});
