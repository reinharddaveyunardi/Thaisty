import React, {createContext, useEffect, useState, useContext} from "react";
import * as Location from "expo-location";
import {doc, GeoPoint, setDoc} from "firebase/firestore";
import {firestore} from "@/config/firebase";
import {getUserId} from "@/services/SecureStore";

const DriverLocationContext = createContext<any>(null);

export const DriverLocationProvider = ({children}: any) => {
    const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
    const [speed, setSpeed] = useState<number | null>(null);
    const [speedSample, setSpeedSample] = useState<number[]>([]);
    const [averageSpeed, setAverageSpeed] = useState<number>(0);

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval: 1,
                },
                async (loc) => {
                    const {latitude, longitude} = loc.coords;
                    const driverId = await getUserId();
                    if (!driverId) return;
                    await setDoc(
                        doc(firestore, "users", driverId),
                        {
                            location: location !== undefined ? new GeoPoint(latitude, longitude) : null,
                            updatedAt: new Date(),
                        },
                        {merge: true}
                    );
                    const speedInKmh = (loc.coords.speed ?? 0) * 3.6;

                    setLocation({latitude, longitude});
                    setSpeed(speedInKmh);

                    if (speedInKmh > 1) {
                        setSpeedSample((prev) => {
                            const newSamples = [...prev.slice(-4), speedInKmh];
                            const avg = newSamples.reduce((a, b) => a + b, 0) / newSamples.length;
                            setAverageSpeed(avg);
                            return newSamples;
                        });
                    }
                }
            );
        })();
    }, []);

    return <DriverLocationContext.Provider value={{location, speed, averageSpeed}}>{children}</DriverLocationContext.Provider>;
};

export const useDriverLocation = () => useContext(DriverLocationContext);
