import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext";
import { FiMail, FiShoppingBag, FiHeart, FiLogOut, FiCamera, FiPackage } from "react-icons/fi";

export default function Profile() {
    const { userEmail, logout } = useContext(AuthContext);
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // ← صورة الأفاتار، محفوظة في localStorage مرتبطة بالإيميل
    const avatarKey = userEmail ? `avatar_${userEmail.toLowerCase()}` : null;
    const [avatar, setAvatar] = useState(() => {
        if (!avatarKey) return null;
        try {
            return localStorage.getItem(avatarKey) || null;
        } catch {
            return null;
        }
    });

    // ← الطلبات السابقة (من checkout)
    const ordersKey = userEmail ? `orders_${userEmail.toLowerCase()}` : null;
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!ordersKey) return;
        try {
            const saved = localStorage.getItem(ordersKey);
            setOrders(saved ? JSON.parse(saved) : []);
        } catch {
            setOrders([]);
        }
    }, [ordersKey]);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    function handleAvatarClick() {
        fileInputRef.current?.click();
    }

    function handleAvatarChange(e) {
        const file = e.target.files?.[0];
        if (!file || !avatarKey) return;

        // ← تحويل الصورة لـ base64 وحفظها في localStorage
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            setAvatar(base64);
            try {
                localStorage.setItem(avatarKey, base64);
            } catch {
                /* لو الصورة كبيرة جداً ومحدش يقدر يحفظها، تجاهل بهدوء */
            }
        };
        reader.readAsDataURL(file);
    }

    // ← أخذ أول حرفين من الإيميل عشان نعرضهم كـ Avatar افتراضي
    const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "?";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 transition-colors duration-300">
            <div className="max-w-2xl mx-auto">

                {/* Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center mb-6 transition-colors duration-300">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 dark:border-emerald-900"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl font-bold">
                                {initials}
                            </div>
                        )}

                        {/* زرار تغيير الصورة */}
                        <button
                            onClick={handleAvatarClick}
                            aria-label="Change avatar"
                            className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                        >
                            <FiCamera className="text-sm text-gray-600 dark:text-gray-300" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>

                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">{userEmail || "Guest"}</h1>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 flex items-center justify-center gap-1.5">
                        <FiMail className="text-sm" />
                        {userEmail || "No email available"}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div
                        onClick={() => navigate("/cart")}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 text-center cursor-pointer hover:shadow-md transition"
                    >
                        <FiShoppingBag className="text-2xl text-emerald-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{cartItems.length}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Items in Cart</p>
                    </div>

                    <div
                        onClick={() => navigate("/wishlist")}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 text-center cursor-pointer hover:shadow-md transition"
                    >
                        <FiHeart className="text-2xl text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{wishlistItems.length}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Wishlist Items</p>
                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4">Account Information</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-white">{userEmail || "—"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Member Status</span>
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-3 py-1 rounded-full">Active</span>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <FiPackage className="text-emerald-500" />
                        Order History
                    </h2>

                    {orders.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-3xl mb-2">📦</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">No orders yet</p>
                            <button
                                onClick={() => navigate("/products")}
                                className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                            >
                                Start Shopping →
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                            {orders.map((order, i) => (
                                <li
                                    key={order.id || i}
                                    className="border border-gray-100 dark:border-gray-700 rounded-xl p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {order.date ? new Date(order.date).toLocaleDateString() : "—"}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">
                                                {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            ${order.total?.toFixed ? order.total.toFixed(2) : order.total}
                                        </span>
                                    </div>
                                    {order.items && order.items.length > 0 && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">
                                            {order.items.map((it) => it.title || it.name).join(", ")}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-2xl font-medium transition"
                >
                    <FiLogOut />
                    Logout
                </button>
            </div>
        </div>
    );
}