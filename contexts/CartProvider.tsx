import React, {createContext, useContext, useState, ReactNode} from "react";
type CartItem = {
    name: string;
    price: number;
    quantity: number;
    img: string;
    restaurant: string;
};
type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (name: string) => void;
    updateQuantity: (name: string, quantity: number) => void;
    getTotalPrice: () => number;
};
const CartContext = createContext<CartContextType | undefined>(undefined);
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({children}) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
            if (existingItem) {
                return prevCart.map((cartItem) => (cartItem.name === item.name ? {...cartItem, quantity: cartItem.quantity + item.quantity} : cartItem));
            }
            return [...prevCart, item];
        });
    };
    const removeFromCart = (name: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.name !== name));
    };
    const updateQuantity = (name: string, quantity: number) => {
        setCart((prevCart) => prevCart.map((item) => (item.name === name ? {...item, quantity} : item)));
    };
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    return <CartContext.Provider value={{cart, addToCart, removeFromCart, updateQuantity, getTotalPrice}}>{children}</CartContext.Provider>;
};
