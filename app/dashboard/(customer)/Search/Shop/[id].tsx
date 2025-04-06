import {Colors} from "@/constant/Colors";
import {getMerchant, getMerchantMenu} from "@/services/api";
import {BahtFormat} from "@/utils/FormatCurrency";
import {MaterialIcons} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useLocalSearchParams} from "expo-router";
import React from "react";
import {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Image,
    StatusBar,
    RefreshControl,
    Dimensions,
} from "react-native";
import SwipeToPay from "./components/ui/SwipeToPay";
import {useCart} from "@/contexts/CartProvider";

export default function ShopScreen({route, navigation}: any) {
    const [modalVisible, setModalVisible] = useState(false);
    const [merchant, setMerchant] = useState<any>(null);
    const [merchantMenu, setMerchantMenu] = useState<any>([]);
    const [refreshing, setRefreshing] = useState(false);
    const {cart, addToCart} = useCart();
    const {merchantId} = route.params;
    const contacts = merchant?.contact ? merchant.contact[0] : {};
    const contactEntries = contacts ? Object.entries(contacts) : [];
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const merchantData = await getMerchant({merchantId: merchantId});
        setMerchant(merchantData);
        const merchantMenu = await getMerchantMenu({merchantId: merchantId});
        setMerchantMenu(merchantMenu);
        console.log(merchantMenu);
        setRefreshing(false);
    }, []);
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);
    useEffect(() => {
        const getMerchantProfile = async () => {
            try {
                const merchantData = await getMerchant({merchantId: merchantId});
                setMerchant(merchantData);
            } catch (error) {
                console.log(error);
            }
        };

        getMerchantProfile();

        const getMenu = async () => {
            try {
                const merchantMenu = await getMerchantMenu({merchantId: merchantId});
                if (Array.isArray(merchantMenu)) {
                    setMerchantMenu(merchantMenu);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getMenu();
    }, []);
    const groupedMenu = merchantMenu?.reduce((acc: any, item: any) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});
    const handleAddToCart = ({name, image_product, price, merchantName}: {name: string; image_product: string; price: number; merchantName: string}) => {
        addToCart({
            name: name,
            price: price,
            quantity: 1,
            restaurant: merchantName,
            img: image_product,
        });
    };
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
            {cart.length > 0 ? (
                <View style={{position: "absolute", bottom: "-85%", left: 0, width: "100%", height: "100%", zIndex: 9999}}>
                    <SwipeToPay onSuccess={() => console.log("Pembayaran berhasil")} />
                </View>
            ) : null}
            <ScrollView
                style={{width: "100%", height: "100%", backgroundColor: "#fff"}}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={{width: "100%", alignItems: "center", height: "auto", padding: 2}}>
                    <ImageBackground source={{uri: merchant?.image}} style={{width: "100%", height: 200, alignItems: "center", justifyContent: "center"}}>
                        <View style={{backgroundColor: "#fff", width: "85%", padding: 16, elevation: 4, height: 150, borderRadius: 10, gap: 8}}>
                            <View style={{gap: 4}}>
                                <Text style={{fontSize: 16, fontWeight: "bold"}}>{merchant?.name}</Text>
                                <View>
                                    <View style={{flexDirection: "row", alignItems: "center", gap: 2}}>
                                        {contactEntries.length > 0 && (
                                            <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                                                {contactEntries[0][0] === "email" && <Ionicons name="mail-outline" size={16} color="black" />}
                                                {contactEntries[0][0] === "phone" && <Ionicons name="call-outline" size={16} color="black" />}
                                                <Text style={{fontSize: 12}}>{String(contactEntries[0][1])}</Text>
                                            </View>
                                        )}
                                        {contactEntries.length > 1 && (
                                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                                <Text style={{fontSize: 12, textDecorationLine: "underline"}}>+{contactEntries.length - 1} contact</Text>
                                            </TouchableOpacity>
                                        )}
                                        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                                            <View style={Styles.modalBackground}>
                                                <View style={Styles.modalContainer}>
                                                    <Text style={Styles.modalTitle}>Additional Contacts</Text>
                                                    {contactEntries.slice(1).map(([key, value], index) => (
                                                        <View key={index} style={Styles.contactItem}>
                                                            {key === "email" && <Ionicons name="mail-outline" size={16} color="black" />}
                                                            {key === "phone" && <Ionicons name="call-outline" size={16} color="black" />}
                                                            <Text style={{fontSize: 14}}>{String(value)}</Text>
                                                        </View>
                                                    ))}
                                                    <TouchableOpacity style={Styles.closeButton} onPress={() => setModalVisible(false)}>
                                                        <Text style={{color: "white", fontWeight: "bold"}}>Close</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </Modal>
                                    </View>
                                </View>
                                <Text style={{fontSize: 12, fontWeight: "light"}}>{merchant?.location}</Text>
                                <View style={{width: "100%", height: 1, backgroundColor: "#ccc"}} />
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                <Text style={{fontSize: 14, fontWeight: "bold"}}>{merchant?.rating || 0}</Text>
                                <Ionicons name="star" size={16} color={"#FFD700"} />
                                <Text>(4k+ reviews)</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                {groupedMenu ? (
                    Object.keys(groupedMenu).map((category, catIndex) => (
                        <View key={catIndex} style={{width: "100%", paddingVertical: 10}}>
                            <Text style={{fontSize: 18, fontWeight: "bold", paddingHorizontal: 16}}>{category}</Text>
                            {groupedMenu[category].map((item: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() =>
                                        navigation.navigate("FoodDetail", {
                                            name: item.name,
                                            price: item.price,
                                            image_product: item.image,
                                            merchantId: merchantId,
                                        })
                                    }
                                    style={{
                                        padding: 10,
                                        flexDirection: "row",
                                        gap: 10,
                                        marginVertical: 10,
                                        borderBottomWidth: 0.2,
                                        borderBottomColor: "#ccc",
                                        marginHorizontal: 6,
                                    }}
                                >
                                    <View style={{width: 100, height: 100}}>
                                        {item.verified && (
                                            <View
                                                style={{
                                                    position: "absolute",
                                                    top: -10,
                                                    right: -10,
                                                    zIndex: 2,
                                                    backgroundColor: "white",
                                                    padding: 4,
                                                    borderRadius: 50,
                                                    elevation: 5,
                                                    shadowColor: "#000",
                                                    shadowOffset: {width: 2, height: 2.5},
                                                    shadowOpacity: 0.4,
                                                    shadowRadius: 1,
                                                }}
                                            >
                                                <MaterialIcons name="verified-user" size={24} color="green" />
                                            </View>
                                        )}
                                        <Image source={{uri: item.image}} style={{width: 100, height: 100, borderRadius: 10}} />
                                    </View>
                                    <View style={{marginHorizontal: 10}}>
                                        <View style={{width: Dimensions.get("screen").width - 150}}>
                                            <Text style={{fontSize: 18, fontWeight: "bold"}} numberOfLines={1} ellipsizeMode="tail">
                                                {item.name}
                                            </Text>
                                        </View>
                                        <View>
                                            <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                                <Ionicons name="star" size={16} color={"#FFD700"} />
                                                <Text>{item.rating}</Text>
                                            </View>
                                            <Text>{BahtFormat(item.price)}</Text>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleAddToCart({
                                                        name: item.name,
                                                        image_product: item.image,
                                                        price: item.price,
                                                        merchantName: merchant.name,
                                                    })
                                                }
                                            >
                                                <Ionicons name="cart-outline" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))
                ) : (
                    <Text style={{textAlign: "center", padding: 20}}>No menu available</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const Styles = StyleSheet.create({
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
    counterBtn: {
        width: 30,
        height: 30,
        borderRadius: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        marginTop: 15,
        backgroundColor: "red",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
});
