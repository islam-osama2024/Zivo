import React from "react";
import { useCart } from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.discountedPrice ?? item.price) * item.quantity, 0
  );
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  /* ── Empty ── */
  if (cartItems.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-6xl">🛒</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-400 text-sm mb-8 max-w-sm">
        Looks like you haven't added anything yet. Start shopping and find something you love!
      </p>
      <button
        onClick={() => navigate("/products")}
        className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition shadow-md"
      >
        Start Shopping →
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
          <p className="text-gray-400 text-sm mt-1">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemPrice = item.discountedPrice ?? item.price;
              const itemTotal = itemPrice * item.quantity;
              const hasDiscount = item.discountedPrice && item.discountedPrice < item.price;

              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center hover:shadow-md transition">
                  {/* صورة */}
                  <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                    <img
                      src={item.thumbnail || item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => { e.target.src = "https://placehold.co/96x96?text=?"; }}
                    />
                  </div>

                  {/* معلومات */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</h2>
                    {item.brand && <p className="text-xs text-emerald-600 font-medium mt-0.5">{item.brand}</p>}
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>

                    {/* السعر */}
                    <div className="flex items-center gap-2 mt-2">
                      {hasDiscount && (
                        <span className="text-xs text-gray-300 line-through">${item.price.toFixed(2)}</span>
                      )}
                      <span className="text-sm font-bold text-gray-800">${itemPrice.toFixed(2)}</span>
                      {hasDiscount && (
                        <span className="text-[10px] bg-red-100 text-red-500 font-bold px-1.5 py-0.5 rounded-full">
                          SALE
                        </span>
                      )}
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold transition"
                      >−</button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold transition"
                      >+</button>
                    </div>
                  </div>

                  {/* السعر الكلي + Remove */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <p className="font-bold text-gray-800">${itemTotal.toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition flex items-center gap-1"
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping */}
            <button
              onClick={() => navigate("/products")}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 mt-2 transition"
            >
              ← Continue Shopping
            </button>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6">
              <h2 className="text-base font-bold text-gray-800 mb-5">Order Summary</h2>

              {/* Mini product list */}
              <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src={item.thumbnail || item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-0.5"
                        onError={(e) => { e.target.src = "https://placehold.co/40x40?text=?"; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 line-clamp-1">{item.title}</p>
                      <p className="text-[11px] text-gray-400">x{item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      ${((item.discountedPrice ?? item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? "FREE 🎉" : `$${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-gray-400 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
                    💡 Add ${(200 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-5 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold transition shadow-md hover:shadow-lg text-sm"
              >
                Proceed to Checkout →
              </button>

              {/* Secure badge */}
              <div className="flex items-center justify-center gap-1.5 mt-4 text-gray-400 text-xs">
                <span>🔒</span>
                <span>Secure & encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}