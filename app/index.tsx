import {useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {View} from "react-native";
import * as SecureStore from "expo-secure-store";
import Loading from "./components/Loading";
import {getUserId} from "@/services/SecureStore";

export default function Index() {
    const router = useRouter();
    const [token, setToken] = useState<String | null>("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getUserToken = async () => {
            setLoading(true);
            const token = await getUserId();
            setToken(token);
            setLoading(false);
        };
        getUserToken();
    }, []);
    useEffect(() => {
        if (!loading) {
            if (!token) {
                router.replace("/auth/LoginScreen");
            } else {
                router.replace("/dashboard/DashboardScreen");
            }
        }
    }, [loading, token]);
    return <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>{loading ? <Loading /> : null}</View>;
}
