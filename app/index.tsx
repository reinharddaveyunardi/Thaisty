import {useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {View} from "react-native";
import * as SecureStore from "expo-secure-store";
import Loading from "./components/Loading";

export default function Index() {
    const router = useRouter();
    const [token, setToken] = useState<String | null>("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getToken = async () => {
            const storedToken = await SecureStore.getItemAsync("token");
            setToken(storedToken);
            setLoading(false);
        };
        getToken();
    }, []);
    useEffect(() => {
        if (!loading) {
            if (token === null) {
                router.replace("/auth/LoginScreen");
            } else {
                router.replace("/dashboard/DashboardScreen");
            }
        }
    }, [loading, token]);
    return <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>{loading ? <Loading /> : null}</View>;
}
