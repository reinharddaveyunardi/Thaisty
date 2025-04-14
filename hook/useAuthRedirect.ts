import {useEffect} from "react";
import {router} from "expo-router";
import {getUserId} from "@/services/SecureStore";
import {getUserData} from "@/services/api";

const routes = {
    customer: "/dashboard/CustomerScreen",
    merchant: "/dashboard/MerchantScreen",
    driver: "/dashboard/DriverScreen",
} as const;

type Role = keyof typeof routes;

export function useAuthRedirect(setLoading: (v: boolean) => void) {
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const userId = await getUserId();
            const userData = await getUserData({userId});

            const userRole = userData?.role as Role | undefined;

            if (!userId || !userRole) {
                router.replace("/auth/LoginScreen");
                setLoading(false);
                return;
            }

            router.replace(routes[userRole]);
            setLoading(false);
        };

        checkAuth();
    }, []);
}
