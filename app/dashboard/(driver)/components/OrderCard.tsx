import {BahtFormat} from "@/utils/FormatCurrency";
import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";

export default function OrderCard({order, onAccept}: {order: any; onAccept: () => void}) {
    return (
        <View style={styles.card}>
            <Text>Customer name: {order.customerName || "Tidak diketahui"}</Text>
            <Text style={styles.text}>Alamat: {order.address || "Tidak diketahui"}</Text>
            <Text style={styles.text}>Total: {BahtFormat(order.total)}</Text>
            <TouchableOpacity style={styles.button} onPress={onAccept}>
                <Text style={styles.buttonText}>Ambil Order</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        backgroundColor: "#f2f2f2",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 3,
    },
    text: {fontSize: 16, marginBottom: 8},
    button: {
        backgroundColor: "#1e90ff",
        padding: 12,
        borderRadius: 8,
    },
    buttonText: {color: "#fff", textAlign: "center"},
});
