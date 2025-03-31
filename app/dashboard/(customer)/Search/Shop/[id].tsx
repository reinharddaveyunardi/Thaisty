import Ionicons from "@expo/vector-icons/Ionicons";
import {useLocalSearchParams} from "expo-router";
import {useState} from "react";
import {View, Text, StyleSheet, Modal, SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, StatusBar} from "react-native";

const ShopProfile = [
    {
        name: "Restoran Tom Yum Enak Surabaya",
        contact: [{email: "qj0m1@example.com", phone: "+62 819 5967 5710"}],
        address: "Jl. Raya Surabaya No. 1, Surabaya, Jawa Timur, Indonesia",
        rating: 4.5,
        img: "https://hot-thai-kitchen.com/wp-content/uploads/2013/03/tom-yum-goong-blog.jpg",
        open: true,
        verified: true,
    },
];

export default function ShopScreen({route, navigation}: any) {
    const [modalVisible, setModalVisible] = useState(false);
    const {name, img, rating, open} = route.params;
    const contacts = ShopProfile[0].contact[0];
    const contactEntries = Object.entries(contacts);

    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
            <View style={{width: "100%", padding: 16, backgroundColor: "#fff"}}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", gap: 8}}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                        <Text style={{fontSize: 16, fontWeight: "bold"}}>Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={{width: "100%", height: "auto"}}>
                <View style={{width: "100%", alignItems: "center", height: "auto", padding: 2}}>
                    <ImageBackground source={{uri: img}} style={{width: "100%", height: 200, alignItems: "center", justifyContent: "center"}}>
                        <View style={{backgroundColor: "#fff", width: "85%", padding: 16, elevation: 4, height: 150, borderRadius: 10, gap: 8}}>
                            <View style={{gap: 4}}>
                                <Text style={{fontSize: 16, fontWeight: "bold"}}>{name}</Text>
                                <View>
                                    <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                                        {contactEntries.length > 0 && (
                                            <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                                {contactEntries[0][0] === "email" && <Ionicons name="mail-outline" size={16} color="black" />}
                                                {contactEntries[0][0] === "phone" && <Ionicons name="call-outline" size={16} color="black" />}
                                                <Text style={{fontSize: 12}}>{contactEntries[0][1]}</Text>
                                            </View>
                                        )}
                                        {contactEntries.length > 1 && (
                                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                                <Text style={{fontSize: 12, textDecorationLine: "underline"}}>+{contactEntries.length - 1} contact</Text>
                                            </TouchableOpacity>
                                        )}
                                        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                                            <View style={styles.modalBackground}>
                                                <View style={styles.modalContainer}>
                                                    <Text style={styles.modalTitle}>Additional Contacts</Text>
                                                    {contactEntries.slice(1).map(([key, value], index) => (
                                                        <View key={index} style={styles.contactItem}>
                                                            {key === "email" && <Ionicons name="mail-outline" size={16} color="black" />}
                                                            {key === "phone" && <Ionicons name="call-outline" size={16} color="black" />}
                                                            <Text style={{fontSize: 14}}>{value}</Text>
                                                        </View>
                                                    ))}
                                                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                                        <Text style={{color: "white", fontWeight: "bold"}}>Close</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </Modal>
                                    </View>
                                </View>
                                <Text style={{fontSize: 12, fontWeight: "light"}}>{ShopProfile[0].address}</Text>
                                <View style={{width: "100%", height: 1, backgroundColor: "#ccc"}} />
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                <Text style={{fontSize: 14, fontWeight: "bold"}}>{rating}</Text>
                                <Ionicons name="star" size={16} color={"#FFD700"} />
                                <Text>(4k+ reviews)</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginVertical: 5,
    },
    closeButton: {
        marginTop: 15,
        backgroundColor: "red",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
});
