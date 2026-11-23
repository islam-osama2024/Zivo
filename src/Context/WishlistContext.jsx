import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

function readItems(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

export function WishlistProvider({ children }) {
    const { storageKey } = useContext(AuthContext);
    const wishlistKey = storageKey("wishlist") || "wishlistItems";

    // State carries the key its items belong to (same isolation as the cart)
    const [state, setState] = useState(() => ({ key: wishlistKey, items: readItems(wishlistKey) }));

    // ✅ تحميل المفضلة الخاصة بالهوية النشطة
    useEffect(() => {
        if (state.key === wishlistKey) return;
        setState({ key: wishlistKey, items: readItems(wishlistKey) });
    }, [wishlistKey, state.key]);

    // ✅ حفظ تحت مفتاح الهوية النشطة فقط
    useEffect(() => {
        if (state.key !== wishlistKey) return;
        localStorage.setItem(wishlistKey, JSON.stringify(state.items));
    }, [state, wishlistKey]);

    const wishlistItems = state.items;
    const setWishlistItems = (updater) =>
        setState((prev) => ({
            key: prev.key,
            items: typeof updater === "function" ? updater(prev.items) : updater,
        }));

    const addToWishlist = (product) => {
        setWishlistItems((prev) => {
            const exists = prev.find((item) => item.id === product.id);
            if (exists) return prev; // موجود أصلاً، مش هنكرر
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    };

    const isInWishlist = (id) => {
        return wishlistItems.some((item) => item.id === id);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                toggleWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);
