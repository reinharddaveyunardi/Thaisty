import {Colors} from "@/constant/Colors";
import {BahtFormat} from "@/utils/FormatCurrency";
import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";

export default function OrderCard({order, seeDetail}: {order: any; seeDetail: () => void}) {
    return (
        <View style={styles.card}>
            <Text>Customer name: {order.customerName || "Tidak diketahui"}</Text>
            <Text style={styles.text}>Alamat: {order.customerAddress || "Tidak diketahui"}</Text>
            <Text style={styles.text}>Total: {BahtFormat(order.fee)}</Text>
            <TouchableOpacity style={styles.button} onPress={seeDetail}>
                <Text style={styles.buttonText}>Lihat Detail Order</Text>
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
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 3,
    },
    text: {fontSize: 16, marginBottom: 8},
    button: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
    },
    buttonText: {color: "#fff", textAlign: "center"},
});
