import React, {useEffect, useState, useRef} from "react";
import {View, StyleSheet, Dimensions, Text, ActivityIndicator, TouchableOpacity, SafeAreaView, Modal} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from "expo-location";
import {doc, GeoPoint, setDoc} from "firebase/firestore";
import {auth, firestore} from "@/config/firebase";
import {useAuth} from "@/contexts/AuthProvider";
import {saveUserLocation} from "@/services/api";
import {getUserId} from "@/services/SecureStore";
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@/constant/Colors";
import {useSafeAreaInsets} from "react-native-safe-area-context";
type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};
export default function SelectLocationScreen({navigation}: any) {
    const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
    const [region, setRegion] = useState<Region | null>(null);
    const [defaultRegion, setDefaultRegion] = useState<Region>({latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0});
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState(false);
    const mapRef = useRef(null);
    const router = useRouter();
    const [address, setAddress] = useState("");
    const inset = useSafeAreaInsets();

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Izin lokasi dibutuhkan");
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            const {latitude, longitude} = loc.coords;
            setDefaultRegion({latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005});

            const defaultRegion = {
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };

            setRegion(defaultRegion);
            setLocation({latitude, longitude});
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (region) {
            (async () => {
                let result = await Location.reverseGeocodeAsync({
                    latitude: region.latitude,
                    longitude: region.longitude,
                });
                if (result.length > 0) {
                    if (result[0].name && result[0].city) {
                        setAddress(`${result[0].name}, ${result[0].city}`);
                    } else {
                        setAddress(`${result[0].name}, ${result[0].street}, ${result[0].district}`);
                    }
                }
            })();
        }
    }, [region]);
    useEffect(() => {
        navigation.getParent()?.setOptions({tabBarStyle: {display: "none"}});
        return () => {
            navigation.getParent()?.setOptions({tabBarStyle: {backgroundColor: "#fff"}});
        };
    }, [navigation]);
    const handleRegionChange = (reg: any) => {
        setRegion(reg);
    };
    const handleConfirmLocation = async () => {
        const userId = await getUserId();
        saveUserLocation({userId, latitude: region?.latitude, longitude: region?.longitude, address});
        router.back();
    };
    if (loading || !region) {
        return <ActivityIndicator style={{flex: 1}} size="large" />;
    }
    if (!region) {
        return <ActivityIndicator style={{flex: 1}} size="large" />;
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{position: "absolute", top: inset.top + 10, left: 20, zIndex: 10}}>
                <TouchableOpacity style={{backgroundColor: "white", width: 40, height: 40, justifyContent: "center", alignItems: "center", borderRadius: 50}}>
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => router.back()} />
                </TouchableOpacity>
            </View>
            <MapView style={styles.map} region={region} onRegionChangeComplete={handleRegionChange} ref={mapRef} />
            <View style={styles.pinContainer}>
                <Text style={styles.pin}>📍</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleConfirmLocation}>
                <Text style={styles.buttonText}>Pilih Lokasi Ini</Text>
            </TouchableOpacity>
            {/* <Modal transparent visible={!!address} animationType="fade">
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <View
                        style={{
                            width: "80%",
                            height: "auto",
                            backgroundColor: "white",
                            borderRadius: 10,
                            padding: 20,
                            gap: 16,
                        }}
                    >
                        <View>
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <View>
                                    <Text style={{fontSize: 16, fontWeight: "bold"}}>Your Location found!</Text>
                                </View>
                            </View>
                            <Text>{address}</Text>
                        </View>
                        <View>
                            <Text>Do you want to use this location?</Text>
                            <View style={{flexDirection: "row", width: "45%", justifyContent: "space-between", gap: 16}}>
                                <TouchableOpacity
                                    style={{backgroundColor: Colors.primary, width: "100%", padding: 10, borderRadius: 5, alignItems: "center"}}
                                    onPress={() => {
                                        setPopup(false);
                                        handleConfirmLocation();
                                    }}
                                >
                                    <Text style={{color: "#fff"}}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{borderColor: Colors.primary, borderWidth: 1, width: "100%", padding: 10, borderRadius: 5, alignItems: "center"}}
                                    onPress={() => {
                                        setPopup(false);
                                    }}
                                >
                                    <Text style={{color: Colors.primary}}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1},
    map: {flex: 1},
    pinContainer: {
        position: "absolute",
        top: Dimensions.get("window").height / 2 - 64,
        left: Dimensions.get("window").width / 2 - 12,
        zIndex: 10,
    },
    pin: {fontSize: 32},
    button: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "#1e90ff",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    buttonText: {color: "white", fontSize: 16},
});
