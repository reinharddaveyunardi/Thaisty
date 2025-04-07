import React, {useEffect, useState, useRef} from "react";
import {View, StyleSheet, Dimensions, Text, ActivityIndicator, TouchableOpacity, SafeAreaView} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from "expo-location";
import {doc, GeoPoint, setDoc} from "firebase/firestore";
import {auth, firestore} from "@/config/firebase";
import {useAuth} from "@/contexts/AuthProvider";
import {saveUserLocation} from "@/services/api";
import {getUserId} from "@/services/SecureStore";
import {useRouter} from "expo-router";
type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};
export default function SelectLocationScreen() {
    const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
    const [region, setRegion] = useState<Region | null>(null);
    const [defaultRegion, setDefaultRegion] = useState<Region>({latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0});
    const [loading, setLoading] = useState(true);
    const mapRef = useRef(null);
    const router = useRouter();
    const [address, setAddress] = useState("");

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
                    setAddress(`${result[0].name}, ${result[0].city}`);
                }
            })();
        }
    }, [region]);

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

    return (
        <SafeAreaView style={styles.container}>
            <MapView style={styles.map} initialRegion={region} onRegionChangeComplete={handleRegionChange} ref={mapRef} />
            <View style={styles.pinContainer}>
                <Text style={styles.pin}>📍</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleConfirmLocation}>
                <Text style={styles.buttonText}>Pilih Lokasi Ini</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1},
    map: {flex: 1},
    pinContainer: {
        position: "absolute",
        top: Dimensions.get("window").height / 2 - 24,
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
