import * as SecureStore from "expo-secure-store";

export const saveUserId = async (userId: string) => {
    try {
        await SecureStore.setItemAsync("user_id", userId);
    } catch (error) {
        console.error("Gagal menyimpan User ID:", error);
    }
};

export const getUserId = async () => {
    try {
        const userId = await SecureStore.getItemAsync("user_id");
        return userId;
    } catch (error) {
        console.error("Gagal mendapatkan User ID:", error);
        return null;
    }
};

export const removeUserId = async () => {
    try {
        await SecureStore.deleteItemAsync("user_id");
    } catch (error) {
        console.error("Gagal menghapus User ID:", error);
    }
};
