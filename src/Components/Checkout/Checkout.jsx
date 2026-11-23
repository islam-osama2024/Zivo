import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext.jsx"; // ← اضفنا ده
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { useTranslation } from "react-i18next";

const Checkout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart(); // ← من الـ Context
    const { userEmail } = useContext(AuthContext);
    const [confirmedItems, setConfirmedItems] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [confirmedTotals, setConfirmedTotals] = useState(null);
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        fullName: "", email: "", address: "", city: "", country: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validate = (fields) => {
        const e = {};
        if (fields.includes("fullName") && !form.fullName.trim()) e.fullName = t("errorRequired2");
        if (fields.includes("email") && !/\S+@\S+\.\S+/.test(form.email)) e.email = t("errorInvalidEmail2");
        if (fields.includes("address") && !form.address.trim()) e.address = t("errorRequired2");
        if (fields.includes("city") && !form.city.trim()) e.city = t("errorRequired2");
        if (fields.includes("country") && !form.country.trim()) e.country = t("errorRequired2");
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
        e?.preventDefault();
        if (cartItems.length === 0) return;
        setSubmitting(true);
        try {
            // Demo store: no real payment is processed and nothing leaves the browser.
            await new Promise((r) => setTimeout(r, 800));

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
            setConfirmedTotals({ subtotal, shipping, total }); // ← احفظ الإجمالي قبل المسح
            cartItems.forEach((i) => removeFromCart(i.id)); // ← امسح من الـ Context
            setSuccess(true);
        } catch {
            setErrors({ submit: t("errorPaymentFailed") });
        }
        setSubmitting(false);
    };

    /* ── EMPTY CART ── */
    if (!submitting && !success && cartItems.length === 0 && confirmedItems.length === 0) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-5xl mb-4">🛒</p>
                <h2 className="text-xl font-bold text-gray-700 mb-2">{t("cartEmptyCheckout")}</h2>
                <p className="text-gray-400 text-sm mb-6">{t("addProductsBeforeCheckout")}</p>
                <button onClick={() => navigate("/products")} className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition">
                    {t("browseProductsBtn")}
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
                    <h2 className="text-2xl font-bold text-gray-800">{t("orderConfirmed")}</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {t("thankYou")} <span className="font-semibold text-gray-600">{form.fullName}</span>! {t("confirmationSentTo")}{" "}
                        <span className="text-green-600">{form.email}</span>
                    </p>
                </div>

                {/* المنتجات اللي اتشتروا */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
                        {t("itemsPurchased")} ({confirmedItems.length})
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
                                    <p className="text-[11px] text-gray-400">{t("qty")} {item.quantity || 1}</p>
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
                        <span>{t("subtotal")}</span>
                        <span>${(confirmedTotals?.subtotal ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>{t("shipping")}</span>
                        <span className="text-green-600 font-medium">{confirmedTotals?.shipping === 0 ? t("free") : `$${confirmedTotals?.shipping ?? 0}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                        <span>{t("totalPaid")}</span>
                        <span className="text-green-600">${(confirmedTotals?.total ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 pt-1">
                        <span>{t("shippingTo")}</span>
                        <span>{form.city}, {form.country}</span>
                    </div>
                </div>

                <button onClick={() => navigate("/products")} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-medium transition">
                    {t("continueShoppingBtn")}
                </button>
            </div>
        </div>
    );

    // ← جوه الكومبوننت عشان يترجموا
    const shippingFields = [
        { name: "fullName", label: t("fullName"), placeholder: "Islam Ahmed", type: "text" },
        { name: "email", label: t("emailAddress"), placeholder: "islam@example.com", type: "email" },
        { name: "address", label: t("address"), placeholder: "123 Main Street", type: "text" },
    ];

    const cityCountryFields = [
        { name: "city", label: t("city"), placeholder: "Cairo" },
        { name: "country", label: t("country"), placeholder: "Egypt" },
    ];

    const steps = [t("stepShipping"), t("stepPayment"), t("stepConfirm")];

    /* ── MAIN ── */
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header + Steps */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">{t("checkout")}</h1>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        {steps.map((s, i) => (
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
                                    {t("shippingInformation")}
                                </h2>
                                <div className="space-y-4">
                                    {shippingFields.map(({ name, label, placeholder, type }) => (
                                        <div key={name}>
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                                            <input name={name} type={type} value={form[name]} onChange={handleChange} placeholder={placeholder}
                                                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition ${errors[name] ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
                                            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-2 gap-3">
                                        {cityCountryFields.map(({ name, label, placeholder }) => (
                                            <div key={name}>
                                                <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                                                <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition ${errors[name] ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
                                                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={handleNextStep} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-medium transition">
                                        {t("continueToPayment")}
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
                                        {t("paymentDetails")}
                                    </h2>
                                </div>

                                {/* Demo payment notice: no card data is asked for or sent anywhere */}
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex gap-3">
                                    <span className="text-2xl flex-shrink-0">🧪</span>
                                    <div>
                                        <p className="font-semibold text-amber-800 text-sm mb-1">{t("demoPaymentTitle")}</p>
                                        <p className="text-amber-700 text-xs leading-relaxed">{t("demoPaymentNotice")}</p>
                                    </div>
                                </div>

                                {errors.submit && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-500 text-sm mb-4">⚠️ {errors.submit}</div>
                                )}

                                <button onClick={handleSubmit} disabled={submitting || cartItems.length === 0}
                                    className={`w-full py-3 rounded-full font-medium text-white transition flex items-center justify-center gap-2 ${submitting || cartItems.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 shadow-md"
                                        }`}>
                                    {submitting
                                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{t("processing")}</>
                                        : <>{t("placeDemoOrder", { amount: total.toFixed(2) })}</>
                                    }
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-base font-bold text-gray-800">
                                    {t("orderSummary")}
                                    <span className="ml-2 text-xs text-gray-400 font-normal">{t("orderSummaryItems", { count: cartItems.length })}</span>
                                </h2>
                                <button onClick={handleClearCart} className="text-xs text-red-400 hover:text-red-600 transition">{t("clearAll")}</button>
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <p className="text-3xl mb-2">🛒</p>
                                    <p className="text-sm">{t("cartIsEmpty")}</p>
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
                                                <p className="text-xs text-gray-400">${item.price} {t("each")}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <button onClick={() => decreaseQty(item.id)} className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs flex items-center justify-center transition">−</button>
                                                    <span className="text-xs font-medium w-4 text-center">{item.quantity || 1}</span>
                                                    <button onClick={() => increaseQty(item.id)} className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs flex items-center justify-center transition">+</button>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-bold text-gray-800">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                                                <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-red-400 hover:text-red-600 transition">{t("remove")}</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>{t("subtotal")}</span><span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>{t("shipping")}</span>
                                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? t("free") : `$${shipping}`}</span>
                                </div>
                                {shipping > 0 && <p className="text-[11px] text-gray-400">{t("freeShippingNote")}</p>}
                                <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                                    <span>{t("total")}</span>
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
