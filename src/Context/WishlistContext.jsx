import { createContext, useContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    // ✅ تحميل المفضلة من localStorage عند البداية
    const [wishlistItems, setWishlistItems] = useState(() => {
        const saved = localStorage.getItem("wishlistItems");
        return saved ? JSON.parse(saved) : [];
    });

    // ✅ حفظ أي تغيير في localStorage
    useEffect(() => {
        localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    }, [wishlistItems]);

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
