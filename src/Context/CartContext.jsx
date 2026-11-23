import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

function readItems(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const { storageKey } = useContext(AuthContext);
    const cartKey = storageKey("cart") || "cartItems";

    // State carries the key its items belong to, so switching identity never
    // writes one session's cart over another's
    const [state, setState] = useState(() => ({ key: cartKey, items: readItems(cartKey) }));

    // ✅ Load when the active identity's key changes
    useEffect(() => {
        if (state.key === cartKey) return;
        setState({ key: cartKey, items: readItems(cartKey) });
    }, [cartKey, state.key]);

    // ✅ Save only items that belong to the current key
    useEffect(() => {
        if (state.key !== cartKey) return;
        localStorage.setItem(cartKey, JSON.stringify(state.items));
    }, [state, cartKey]);

    const cartItems = state.items;
    const setCartItems = (updater) =>
        setState((prev) => ({
            key: prev.key,
            items: typeof updater === "function" ? updater(prev.items) : updater,
        }));

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const increaseQty = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            )
        );
    };

    const decreaseQty = (id) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                increaseQty,
                decreaseQty,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
