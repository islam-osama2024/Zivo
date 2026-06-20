import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext.jsx"; // ← اضفنا ده
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext.jsx";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart(); // ← من الـ Context
    const { userEmail } = useContext(AuthContext);
    const [confirmedItems, setConfirmedItems] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        fullName: "", email: "", address: "", city: "", country: "",
        cardNumber: "", expiry: "", cvc: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "cardNumber") value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
        if (name === "expiry") value = value.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
        if (name === "cvc") value = value.replace(/\D/g, "").slice(0, 3);
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validate = (fields) => {
        const e = {};
        if (fields.includes("fullName") && !form.fullName.trim()) e.fullName = "Required";
        if (fields.includes("email") && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
        if (fields.includes("address") && !form.address.trim()) e.address = "Required";
        if (fields.includes("city") && !form.city.trim()) e.city = "Required";
        if (fields.includes("country") && !form.country.trim()) e.country = "Required";
        if (fields.includes("cardNumber") && form.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Invalid card number";
        if (fields.includes("expiry") && form.expiry.length < 5) e.expiry = "Invalid expiry";
        if (fields.includes("cvc") && form.cvc.length < 3) e.cvc = "Invalid CVC";
        return e;
    };

    const handleNextStep = () => {
        const e = validate(["fullName", "email", "address", "city", "country"]);
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ← بنستخدم functions الـ Context مباشرة
    const handleClearCart = () => cartItems.forEach((i) => removeFromCart(i.id));

    const subtotal = cartItems.reduce((t, i) => t + i.price * (i.quantity || 1), 0);
    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal + shipping;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const e2 = validate(["cardNumber", "expiry", "cvc"]);
        if (Object.keys(e2).length > 0) { setErrors(e2); return; }
        if (cartItems.length === 0) return;
        setSubmitting(true);
        try {
            await axios.post("https://jsonplaceholder.typicode.com/posts", { ...form, cartItems, total });

            // ← حفظ الطلب في localStorage لصفحة Profile
            if (userEmail) {
                const ordersKey = `orders_${userEmail.toLowerCase()}`;
                try {
                    const saved = localStorage.getItem(ordersKey);
                    const existingOrders = saved ? JSON.parse(saved) : [];
                    const newOrder = {
                        id: Date.now(),
                        date: new Date().toISOString(),
                        items: cartItems,
                        total,
                    };
                    localStorage.setItem(ordersKey, JSON.stringify([newOrder, ...existingOrders]));
                } catch {
                    /* تجاهل لو فيه مشكلة في الحفظ */
                }
            }

            setConfirmedItems([...cartItems]); // ← احفظهم قبل المسح
            cartItems.forEach((i) => removeFromCart(i.id)); // ← امسح من الـ Context
            setSuccess(true);
        } catch {
            setErrors({ submit: "Payment failed. Please try again." });
        }
        setSubmitting(false);
    };

    /* ── EMPTY CART ── */
    if (!submitting && !success && cartItems.length === 0 && confirmedItems.length === 0) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-5xl mb-4">🛒</p>
                <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                <p className="text-gray-400 text-sm mb-6">Add some products before checking out</p>
                <button onClick={() => navigate("/products")} className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition">
                    Browse Products →
                </button>
            </div>
        </div>
    );

    /* ── SUCCESS ── */
    if (success) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <span className="text-4xl">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Order Confirmed!</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Thank you, <span className="font-semibold text-gray-600">{form.fullName}</span>! Confirmation sent to{" "}
                        <span className="text-green-600">{form.email}</span>
                    </p>
                </div>

                {/* المنتجات اللي اتشتروا */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
                        Items Purchased ({confirmedItems.length})
                    </h3>
                    <ul className="space-y-3">
                        {confirmedItems.map((item) => (
                            <li key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-green-100">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-[10px] font-bold">✓</span>
                                </div>
                                <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                    <img
                                        src={item.thumbnail || item.image}
                                        alt={item.title || item.name}
                                        className="w-full h-full object-contain p-1"
                                        onError={(e) => { e.target.src = "https://placehold.co/48x48?text=?"; }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-700 line-clamp-1">{item.title || item.name}</p>
                                    <p className="text-[11px] text-gray-400">Qty: {item.quantity || 1}</p>
                                </div>
                                <span className="text-sm font-bold text-green-600 flex-shrink-0">
                                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ملخص */}
                <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>${confirmedItems.reduce((t, i) => t + i.price * (i.quantity || 1), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span>
                        <span className="text-green-600 font-medium">{shipping === 0 ? "FREE 🎉" : `$${shipping}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                        <span>Total Paid</span>
                        <span className="text-green-600">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 pt-1">
                        <span>Shipping to</span>
                        <span>{form.city}, {form.country}</span>
                    </div>
                </div>

                <button onClick={() => navigate("/products")} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-medium transition">
                    Continue Shopping →
                </button>
            </div>
        </div>
    );

    /* ── MAIN ── */
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header + Steps */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        {["Shipping", "Payment", "Confirm"].map((s, i) => (
                            <React.Fragment key={s}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? "bg-green-500 text-white" :
                                            step === i + 1 ? "bg-green-500 text-white ring-4 ring-green-100" :
                                                "bg-gray-200 text-gray-400"
                                        }`}>
                                        {step > i + 1 ? "✓" : i + 1}
                                    </div>
                                    <span className={`text-sm font-medium ${step === i + 1 ? "text-green-600" : "text-gray-400"}`}>{s}</span>
                                </div>
                                {i < 2 && <div className={`w-12 h-0.5 ${step > i + 1 ? "bg-green-500" : "bg-gray-200"}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">

                    {/* Form */}
                    <div className="lg:col-span-3">

                        {step === 1 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                                    <span className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                                    Shipping Information
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { name: "fullName", label: "Full Name", placeholder: "Islam Ahmed", type: "text" },
                                        { name: "email", label: "Email", placeholder: "islam@example.com", type: "email" },
                                        { name: "address", label: "Address", placeholder: "123 Main Street", type: "text" },
                                    ].map(({ name, label, placeholder, type }) => (
                                        <div key={name}>
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                                            <input name={name} type={type} value={form[name]} onChange={handleChange} placeholder={placeholder}
                                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition ${errors[name] ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
                                            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[{ name: "city", placeholder: "Cairo" }, { name: "country", placeholder: "Egypt" }].map(({ name, placeholder }) => (
                                            <div key={name}>
                                                <label className="text-xs font-medium text-gray-500 mb-1 block capitalize">{name}</label>
                                                <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition ${errors[name] ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
                                                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={handleNextStep} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-medium transition">
                                        Continue to Payment →
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <button onClick={() => setStep(1)} className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-xs transition">←</button>
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <span className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                                        Payment Details
                                    </h2>
                                </div>

                                {/* Card Preview */}
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 mb-6 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="text-xs text-gray-400 tracking-widest">CREDIT CARD</div>
                                        <div className="flex">
                                            <div className="w-7 h-7 bg-red-500 rounded-full opacity-80" />
                                            <div className="w-7 h-7 bg-yellow-400 rounded-full opacity-80 -ml-3" />
                                        </div>
                                    </div>
                                    <div className="font-mono text-lg tracking-widest mb-4 text-white/90 min-h-[28px]">
                                        {form.cardNumber || "•••• •••• •••• ••••"}
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <p className="text-gray-400 text-[10px] mb-0.5">CARD HOLDER</p>
                                            <p className="font-medium">{form.fullName || "Your Name"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-[10px] mb-0.5">EXPIRES</p>
                                            <p className="font-medium">{form.expiry || "MM/YY"}</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Card Number</label>
                                        <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456"
                                            className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 transition ${errors.cardNumber ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
                                        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">Expiry</label>
                                            <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY"
                                                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 transition ${errors.expiry ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
                                            {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">CVC</label>
                                            <input name="cvc" value={form.cvc} onChange={handleChange} placeholder="•••" type="password"
                                                className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 transition ${errors.cvc ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
                                            {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                                        </div>
                                    </div>

                                    {errors.submit && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-500 text-sm">⚠️ {errors.submit}</div>
                                    )}

                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                        <span>🔒</span><span>Your payment info is encrypted and secure</span>
                                    </div>

                                    <button type="submit" disabled={submitting || cartItems.length === 0}
                                        className={`w-full py-3 rounded-full font-medium text-white transition flex items-center justify-center gap-2 ${submitting || cartItems.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 shadow-md"
                                            }`}>
                                        {submitting
                                            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                                            : <>Pay ${total.toFixed(2)} →</>
                                        }
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-base font-bold text-gray-800">
                                    Order Summary
                                    <span className="ml-2 text-xs text-gray-400 font-normal">({cartItems.length} items)</span>
                                </h2>
                                <button onClick={handleClearCart} className="text-xs text-red-400 hover:text-red-600 transition">Clear all</button>
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <p className="text-3xl mb-2">🛒</p>
                                    <p className="text-sm">Cart is empty</p>
                                </div>
                            ) : (
                                <ul className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="flex gap-3 items-center">
                                            <div className="w-14 h-14 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                                                <img
                                                    src={item.thumbnail || item.image}
                                                    alt={item.title || item.name}
                                                    className="w-full h-full object-contain p-1"
                                                    onError={(e) => { e.target.src = "https://placehold.co/56x56?text=?"; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.title || item.name}</p>
                                                <p className="text-xs text-gray-400">${item.price} each</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <button onClick={() => decreaseQty(item.id)} className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs flex items-center justify-center transition">−</button>
                                                    <span className="text-xs font-medium w-4 text-center">{item.quantity || 1}</span>
                                                    <button onClick={() => increaseQty(item.id)} className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs flex items-center justify-center transition">+</button>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-bold text-gray-800">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                                                <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-red-400 hover:text-red-600 transition">Remove</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "FREE 🎉" : `$${shipping}`}</span>
                                </div>
                                {shipping > 0 && <p className="text-[11px] text-gray-400">Free shipping on orders over $200</p>}
                                <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span className="text-green-600">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;