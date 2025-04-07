import {Colors} from "@/constant/Colors";
import {useCart} from "@/contexts/CartProvider";
import {getMerchant} from "@/services/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useEffect, useRef, useState} from "react";
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Image, ActivityIndicator, Dimensions, Animated, Platform} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const {width} = Dimensions.get("window");
const IMAGE_HEIGHT = 300;
export default function FoodScreen({route, navigation}: any) {
    const [counter, setCounter] = useState(1);
    const [loading, setLoading] = useState(false);
    const [merchant, setMerchant] = useState<any>(null);
    const insets = useSafeAreaInsets();
    const {addToCart, cart} = useCart();
    const scrollY = useRef(new Animated.Value(0)).current;
    const translateY = scrollY.interpolate({
        inputRange: [0, IMAGE_HEIGHT],
        outputRange: [0, -IMAGE_HEIGHT / 2],
        extrapolate: "clamp",
    });
    const titleOpacity = scrollY.interpolate({
        inputRange: [IMAGE_HEIGHT - 80, IMAGE_HEIGHT - 40],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    const titleTranslateY = scrollY.interpolate({
        inputRange: [IMAGE_HEIGHT - 80, IMAGE_HEIGHT - 40],
        outputRange: [20, 0],
        extrapolate: "clamp",
    });
    const titleFadeOutOpacity = scrollY.interpolate({
        inputRange: [IMAGE_HEIGHT - 80, IMAGE_HEIGHT - 40],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });
    const titleFadeOutTranslate = scrollY.interpolate({
        inputRange: [IMAGE_HEIGHT - 80, IMAGE_HEIGHT - 40],
        outputRange: [0, -10],
        extrapolate: "clamp",
    });
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});

        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);

    function BahtFormat(price: any) {
        return new Intl.NumberFormat("th-TH", {style: "currency", currency: "THB", trailingZeroDisplay: "stripIfInteger"}).format(price);
    }
    const handleAddToCart = () => {
        setLoading(true);

        addToCart({
            name: name,
            price: price,
            quantity: counter,
            restaurant: merchant?.name,
            img: image_product,
            merchantId: merchantId,
        });

        setLoading(false);
    };
    const {name, image_product, description, price, merchantId} = route.params;
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
    }, []);
    const existingCartItem = cart.find((item) => item.name === name);

    useEffect(() => {
        if (existingCartItem) {
            setCounter(existingCartItem.quantity);
        }
    }, [existingCartItem]);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <StatusBar barStyle="dark-content" backgroundColor={"white"} />
            <Animated.View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                    paddingTop: insets.top + 20,
                    paddingHorizontal: 16,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Animated.View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: "#fff",
                        opacity: titleOpacity,
                    }}
                />
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                    style={{padding: 8, borderRadius: 50, flexDirection: "row", alignItems: "center"}}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Animated.Text
                    style={{
                        marginLeft: 12,
                        fontSize: 18,
                        fontWeight: "bold",
                        opacity: titleOpacity,
                        transform: [{translateY: titleTranslateY}],
                    }}
                    numberOfLines={1}
                >
                    {name}
                </Animated.Text>
            </Animated.View>

            <Animated.Image source={{uri: image_product}} style={[Styles.headerImage, {transform: [{translateY}]}]} resizeMode="cover" />
            <Animated.ScrollView
                contentContainerStyle={{paddingTop: IMAGE_HEIGHT}}
                scrollEventThrottle={16}
                onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {useNativeDriver: true})}
            >
                <View style={Styles.contentBox}>
                    <Animated.Text
                        style={[
                            Styles.title,
                            {
                                opacity: titleFadeOutOpacity,
                                transform: [{translateY: titleFadeOutTranslate}],
                            },
                        ]}
                    >
                        {name}
                    </Animated.Text>
                    <View style={Styles.divider} />
                    <Text style={Styles.subTitle}>Description</Text>
                    <Text style={Styles.description}>{description}</Text>

                    {merchant && (
                        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Shop", {merchantId})} style={Styles.merchantBox}>
                            <Image style={Styles.merchantImage} source={{uri: merchant.image}} />
                            <Text>{merchant?.name}</Text>
                        </TouchableOpacity>
                    )}
                    <View style={[Styles.dummyBlock, {alignItems: "center", justifyContent: "center"}]}>
                        <Text>Bahan Bahan</Text>
                    </View>
                    <View style={[Styles.dummyBlock, {alignItems: "center", justifyContent: "center", height: 500}]}>
                        <Text>Scroll Test</Text>
                    </View>
                </View>
            </Animated.ScrollView>
            <View
                style={{
                    position: "absolute",
                    bottom: insets.bottom + 10,
                    width: "100%",
                    paddingHorizontal: "2%",
                    height: "auto",
                }}
            >
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "space-around",
                        height: "100%",
                        shadowColor: "#000",
                        shadowOffset: {width: 3, height: 3},
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        borderRadius: 10,
                        paddingHorizontal: "2%",
                        elevation: 5,
                        paddingVertical: "2%",
                        backgroundColor: "white",
                        gap: 12,
                    }}
                >
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <View>
                            <Text>{BahtFormat(price)}</Text>
                            {existingCartItem && <Text style={{color: "#000", fontSize: 12}}>Already in Cart: {existingCartItem.quantity}</Text>}
                        </View>
                        <View style={{flexDirection: "row", gap: 12, borderRadius: 5, backgroundColor: "rgba(0,0,0,0.1)", height: 30}}>
                            <TouchableOpacity
                                onPress={() => setCounter(counter - 1 < 1 ? 1 : counter - 1)}
                                style={[Styles.counterBtn, {borderTopLeftRadius: 5, borderBottomLeftRadius: 5}]}
                            >
                                <View>
                                    <Text>-</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                <Text>{counter}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setCounter(counter + 1)}
                                style={[Styles.counterBtn, {borderTopRightRadius: 5, borderBottomRightRadius: 5}]}
                            >
                                <View>
                                    <Text>+</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={handleAddToCart}
                            style={{
                                width: "100%",
                                height: 40,
                                borderRadius: 5,
                                backgroundColor: Colors.primary,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <View style={{flexDirection: "column", alignItems: "center"}}>
                                    <Text style={{color: "#fff"}}>Add to Cart - {BahtFormat(price * counter)}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
    counterBtn: {
        width: 30,
        height: 30,
        borderRadius: 0,
        justifyContent: "center",
        alignItems: "center",
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
    headerImage: {
        position: "absolute",
        width: width,
        height: IMAGE_HEIGHT,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
    },
    contentBox: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        padding: 16,
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
    },
    subTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
    },
    description: {
        fontSize: 16,
        opacity: 0.7,
        marginTop: 5,
    },
    divider: {
        width: "90%",
        height: 0.5,
        backgroundColor: "#2d2d2d",
        marginTop: 10,
    },
    merchantBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        gap: 10,
    },
    merchantImage: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    dummyBlock: {
        height: 100,
        backgroundColor: "red",
        marginVertical: 10,
        borderRadius: 10,
    },
});
