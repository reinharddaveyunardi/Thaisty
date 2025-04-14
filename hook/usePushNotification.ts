import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import {Platform} from "react-native";
import {collection, doc, setDoc} from "firebase/firestore";
import {firestore} from "@/config/firebase";

export async function registerForPushNotificationsAsync(userId: string) {
    let token;

    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Expo Push Token:", token);

        await setDoc(
            doc(firestore, "users", userId),
            {
                expoToken: token,
            },
            {merge: true}
        );
    } else {
        alert("Harus pakai perangkat fisik untuk notifikasi push!");
    }

    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    return token;
}
