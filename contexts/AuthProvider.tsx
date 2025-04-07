import {onAuthStateChanged, User} from "firebase/auth";
import {createContext, useContext, useEffect, useState} from "react";
import {auth, firestore} from "@/config/firebase";
import {getUserId, saveUserId} from "@/services/SecureStore";
import {doc, getDoc} from "firebase/firestore";
interface AuthContextType {
    user: User;
    loading: boolean;
    role: string;
}
const AuthContext = createContext<AuthContextType | any>(null);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState(null);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUserData(firebaseUser);
            if (firebaseUser) {
                setUser(firebaseUser);
                await saveUserId(firebaseUser.uid);
                const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
                if (userDoc.exists()) {
                    setRole(userDoc.data().role);
                }
            } else {
                const storedUserId = await getUserId();
                if (storedUserId) {
                    setUser({uid: storedUserId});
                    const userDoc = await getDoc(doc(firestore, "users", storedUserId));
                    if (userDoc.exists()) {
                        setRole(userDoc.data().role);
                    }
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{user, role, loading, userData}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
