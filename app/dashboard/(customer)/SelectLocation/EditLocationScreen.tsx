import {View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions} from "react-native";
import React, {useState} from "react";
import MapView, {Marker, Region} from "react-native-maps";

export default function EditLocationScreen({navigation, route}: any) {
    const {data} = route.params;

    const [newLocation, setNewLocation] = useState({
        latitude: data.location._lat,
        longitude: data.location._long,
    });

    const [region, setRegion] = useState<Region>({
        latitude: data.location._lat,
        longitude: data.location._long,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    const handleRegionChangeComplete = (region: Region) => {
        setNewLocation({
            latitude: region.latitude,
            longitude: region.longitude,
        });
    };
    const gray = "#808080";

    return (
        <SafeAreaView style={styles.container}>
            <MapView initialRegion={region} onRegionChangeComplete={handleRegionChangeComplete} style={styles.map}>
                <Marker coordinate={{latitude: data.location._lat, longitude: data.location._long}} titleVisibility="visible" title="Lokasi Lama"></Marker>
                {newLocation && (newLocation.latitude !== data.location._lat || newLocation.longitude !== data.location._long) && (
                    <Marker
                        draggable
                        tracksViewChanges
                        coordinate={{
                            latitude: newLocation.latitude,
                            longitude: newLocation.longitude,
                        }}
                        pinColor="navy"
                        title="Lokasi Baru"
                    />
                )}
            </MapView>
            <View style={styles.pinContainer}>
                <Text style={styles.pin}>📍</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    console.log("Lokasi baru dipilih:", newLocation);
                }}
            >
                <Text style={styles.buttonText}>Change Location</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1},
    map: {flex: 1, width: "100%"},
    pinContainer: {
        position: "absolute",
        top: Dimensions.get("window").height / 2 - 48,
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
