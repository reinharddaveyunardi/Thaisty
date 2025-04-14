import * as Notifications from "expo-notifications";
import {useEffect} from "react";
import {useRouter} from "expo-router";

export default function useNotificationHandler() {
    const router = useRouter();

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const screen = response.notification.request.content.data.screen;
            const orderId = response.notification.request.content.data.orderId;

            if (screen && orderId) {
                router.push({
                    pathname: `/dashboard/DashboardScreen`,
                    params: {orderId},
                });
            }
        });

        return () => subscription.remove();
    }, []);
}
