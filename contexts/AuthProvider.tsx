import React, {createContext, useContext, useState, useEffect} from "react";
import {auth} from "../config/firebase";
import {onAuthStateChanged, User} from "firebase/auth";
import {useRouter} from "expo-router";
import {getToken, removeToken} from "@/services/SecureStore";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const token = await getToken();

            if (token) {
                onAuthStateChanged(auth, (currentUser) => {
                    if (currentUser) {
                        setUser(currentUser);
                        router.replace("/dashboard/DashboardScreen");
                    } else {
                        setUser(null);
                        router.replace("/auth/LoginScreen");
                    }
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = async () => {
        await auth.signOut();
        await removeToken();
        setUser(null);
        router.replace("/auth/LoginScreen");
    };

    return <AuthContext.Provider value={{user, loading, logout}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
