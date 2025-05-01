import DashedLine from "@/components/ui/Dashline";
import Skeleton from "@/components/ui/SkeletonLoading";
import {Colors} from "@/constant/Colors";
import {useCart} from "@/contexts/CartProvider";
import {getMenuIngredients, getMerchant, getUserData} from "@/services/api";
import {getUserId} from "@/services/SecureStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useCallback, useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Image,
    ActivityIndicator,
    Dimensions,
    Animated,
    Platform,
    RefreshControl,
    Modal,
} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const {width} = Dimensions.get("window");
const IMAGE_HEIGHT = 300;
export default function FoodScreen({route, navigation}: any) {
    const [counter, setCounter] = useState(1);
    const [showAllergyWarning, setShowAllergyWarning] = useState(false);
    const [canProceed, setCanProceed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [merchant, setMerchant] = useState<any>(null);
    const [ingredient, setIngredient] = useState<any | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const insets = useSafeAreaInsets();
    const {addToCart, cart, removeFromCart} = useCart();
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
        const containsAllergy = ingredient?.some((item: any) => userData?.allergies?.includes(item.name));
        if (containsAllergy && !canProceed) {
            setShowAllergyWarning(true);
            return;
        }

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
        setCanProceed(false);
    };
    const {name, image_product, description, price, merchantId, menuId} = route.params;
    useEffect(() => {
        const getMerchantProfile = async () => {
            try {
                const merchantData = await getMerchant({merchantId: merchantId});
                const ingredient = await getMenuIngredients({menuId: menuId, merchantId: merchantId});
                setIngredient(ingredient);
                setMerchant(merchantData);
            } catch (error) {
                console.log(error);
            }
        };

        getMerchantProfile();
        const fetchUserData = async () => {
            try {
                const userId = await getUserId();
                const userData = await getUserData({userId: userId});
                setUserData(userData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserData();
    }, []);
    const existingCartItem = cart.find((item) => item.name === name);

    useEffect(() => {
        if (existingCartItem) {
            setCounter(existingCartItem.quantity);
        }
    }, [existingCartItem]);
    const onRefresh = useCallback(async () => {
        const userId = await getUserId();
        const userData = await getUserData({userId: userId});
        setUserData(userData);
    }, []);
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
                refreshControl={<RefreshControl refreshing={loading} onRefresh={() => onRefresh()} />}
                contentContainerStyle={{paddingTop: IMAGE_HEIGHT}}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
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
                            <Text style={{fontWeight: "bold", fontSize: 16}}>{merchant?.name}</Text>
                        </TouchableOpacity>
                    )}
                    <View style={Styles.divider} />
                    <View style={{gap: 4, marginTop: 4}}>
                        <Text>{ingredient ? "Ingredients" : <Skeleton height={20} width={"100%"} borderRadius={10} speed="normal" />}</Text>
                        <View></View>
                        <View>
                            {ingredient ? (
                                <>
                                    {ingredient.some((item: any) => userData?.allergies?.includes(item.name)) && (
                                        <View style={{padding: 10, backgroundColor: "rgba(218, 156, 59, .2)", borderRadius: 8}}>
                                            <Text>
                                                <View style={{flexDirection: "row", alignItems: "center", gap: 8}}>
                                                    <Ionicons name="warning" size={20} color={Colors.danger} />
                                                    <Text style={{color: Colors.danger, fontWeight: "bold"}}>
                                                        This food contains your allergies: {userData?.allergies?.join(", ")}
                                                    </Text>
                                                </View>
                                            </Text>
                                        </View>
                                    )}
                                    {ingredient.map((item: any, index: number) => {
                                        const isAllergic = userData?.allergies?.includes(item.name);
                                        return (
                                            <View key={index}>
                                                <View
                                                    style={{
                                                        backgroundColor: isAllergic ? "rgba(218, 156, 59, .2)" : "transparent",
                                                        padding: 8,
                                                        borderRadius: 8,
                                                        flexDirection: isAllergic ? "row" : "column",
                                                        justifyContent: isAllergic ? "space-between" : "flex-start",
                                                        alignItems: isAllergic ? "center" : "flex-start",
                                                    }}
                                                >
                                                    <Text style={{color: isAllergic ? Colors.danger : "black"}}>
                                                        {item.name} - {item.quantity}
                                                    </Text>
                                                    {isAllergic && (
                                                        <Text style={{color: Colors.danger, fontWeight: "bold"}}>
                                                            <Ionicons name="warning" size={20} color={Colors.danger} />
                                                        </Text>
                                                    )}
                                                </View>
                                                <View style={{marginVertical: 4}}>
                                                    <DashedLine />
                                                </View>
                                            </View>
                                        );
                                    })}
                                </>
                            ) : (
                                <Skeleton height={200} width={"100%"} borderRadius={10} speed="normal" />
                            )}
                        </View>
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
                        {existingCartItem && (
                            <View style={{flexDirection: "row", gap: 12, borderRadius: 5, backgroundColor: "rgba(0,0,0,0.1)", height: 30}}>
                                {existingCartItem.quantity > 0 && existingCartItem.quantity < 2 && (
                                    <TouchableOpacity
                                        onPress={() => removeFromCart(name)}
                                        style={[Styles.counterBtn, {borderTopLeftRadius: 5, borderBottomLeftRadius: 5}]}
                                    >
                                        <View>
                                            <Ionicons name="trash" size={20} color={Colors.danger} />
                                        </View>
                                    </TouchableOpacity>
                                )}
                                {existingCartItem.quantity > 1 && (
                                    <TouchableOpacity
                                        onPress={() => setCounter(counter - 1 < 1 ? 1 : counter - 1)}
                                        style={[Styles.counterBtn, {borderTopLeftRadius: 5, borderBottomLeftRadius: 5}]}
                                    >
                                        <View>
                                            <Text>-</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
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
                        )}
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
            <Modal visible={showAllergyWarning} transparent animationType="fade" onRequestClose={() => setShowAllergyWarning(false)}>
                <View style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center"}}>
                    <View style={{backgroundColor: "white", padding: 20, borderRadius: 12, width: "80%"}}>
                        <View style={{flexDirection: "row", marginBottom: 10, gap: 10}}>
                            <Ionicons name="warning" size={20} color={Colors.danger} />
                            <Text style={{color: Colors.danger, fontWeight: "bold", fontSize: 16}}>Warning</Text>
                        </View>
                        <View style={{marginBottom: 20}}>
                            <Text>
                                This food contains your {userData?.allergies?.length > 1 ? "allergies" : "allergy"}:{" "}
                                <Text style={{color: Colors.danger, fontWeight: "bold"}}>{userData?.allergies?.join(", ")}.</Text>
                            </Text>
                            <Text>Are you sure you want to proceed?</Text>
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "flex-end", gap: 12}}>
                            <TouchableOpacity
                                onPress={() => setShowAllergyWarning(false)}
                                style={{padding: 10, backgroundColor: Colors.primary, borderRadius: 5, width: 50, alignItems: "center"}}
                            >
                                <Text style={{color: Colors.white, fontWeight: "bold"}}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowAllergyWarning(false);
                                    setCanProceed(true);
                                    handleAddToCart();
                                }}
                                style={{
                                    padding: 10,
                                    backgroundColor: Colors.white,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: Colors.danger,
                                    width: 50,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{color: Colors.danger, fontWeight: "bold"}}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        paddingBottom: 150,
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
        width: "100%",
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
        width: "100%",
        height: 100,
        backgroundColor: "red",
        marginVertical: 10,
        borderRadius: 10,
    },
});
