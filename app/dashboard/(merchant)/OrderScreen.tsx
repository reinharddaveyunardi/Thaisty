import {View, Text} from "react-native";
import React, {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {firestore} from "@/config/firebase";
import {getUserId} from "@/services/SecureStore";

export default function OrderScreen() {
    const [orders, setOrders] = useState<any | null>(null);
    useEffect(() => {
        const fetchOrders = async () => {
            const userId = await getUserId();
            if (!userId) {
                console.log("User ID is not available");
                return;
            }
            try {
                const q = query(collection(firestore, "orders"), where("merchantId", "==", userId));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setOrders(data);
                console.log("Render Data");
            } catch (e) {
                console.log("Error fetching orders:", e);
            }
        };
        fetchOrders();
    });
    return (
        <View>
            <Text>OrderScreen</Text>
        </View>
    );
}
