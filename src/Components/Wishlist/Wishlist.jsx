import React from "react";
import { useWishlist } from "../../Context/WishlistContext";
import { useCart } from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

export default function Wishlist() {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    /* ── Empty ── */
    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-6xl">💔</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-400 text-sm mb-8 max-w-sm">
                    Save the products you love and find them here anytime.
                </p>
                <button
                    onClick={() => navigate("/products")}
                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition shadow-md"
                >
                    Browse Products →
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlistItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition relative"
                        >
                            {/* Remove */}
                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition z-10"
                                aria-label="Remove from wishlist"
                            >
                                <FaHeart className="text-red-500 text-sm" />
                            </button>

                            {/* صورة */}
                            <div className="w-full h-40 bg-gray-50 rounded-xl overflow-hidden mb-3 border border-gray-100">
                                <img
                                    src={item.thumbnail || item.image}
                                    alt={item.title}
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => { e.target.src = "https://placehold.co/160x160?text=?"; }}
                                />
                            </div>

                            {/* معلومات */}
                            <h2 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</h2>
                            {item.brand && <p className="text-xs text-emerald-600 font-medium mt-0.5">{item.brand}</p>}

                            <div className="flex items-center justify-between mt-3">
                                <span className="text-base font-bold text-gray-800">
                                    ${(item.discountedPrice ?? item.price).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs font-medium transition"
                                >
                                    <FaShoppingCart className="text-xs" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}