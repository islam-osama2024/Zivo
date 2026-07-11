import React from "react";
import { useWishlist } from "../../Context/WishlistContext";
import { useCart } from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Wishlist() {
    const { t } = useTranslation();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    /* ── Empty ── */
    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <span className="text-6xl">💔</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t("wishlistEmpty")}</h2>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-8 max-w-sm">
                    {t("wishlistEmptyMessage")}
                </p>
                <button
                    onClick={() => navigate("/products")}
                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition shadow-md"
                >
                    {t("browseProductsBtn")}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t("myWishlist")}</h1>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                        {t("itemsSaved", { count: wishlistItems.length })}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlistItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition relative"
                        >
                            {/* Remove */}
                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition z-10"
                                aria-label="Remove from wishlist"
                            >
                                <FaHeart className="text-red-500 text-sm" />
                            </button>

                            {/* صورة */}
                            <div className="w-full h-40 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-gray-600">
                                <img
                                    src={item.thumbnail || item.image}
                                    alt={item.title}
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => { e.target.src = "https://placehold.co/160x160?text=?"; }}
                                />
                            </div>

                            {/* معلومات */}
                            <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm line-clamp-1">{item.title}</h2>
                            {item.brand && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{item.brand}</p>}

                            <div className="flex items-center justify-between mt-3">
                                <span className="text-base font-bold text-gray-800 dark:text-gray-100">
                                    ${(item.discountedPrice ?? item.price).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs font-medium transition"
                                >
                                    <FaShoppingCart className="text-xs" />
                                    {t("addToCartBtn")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}