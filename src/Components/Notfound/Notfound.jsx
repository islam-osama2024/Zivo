import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  // عداد تنازلي يرجع للهوم تلقائي
  useEffect(() => {
    if (countdown === 0) { navigate("/"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        {/* الرقم 404 */}
        <div className="relative inline-block mb-6">
          <span className="text-[140px] font-extrabold text-emerald-500/10 select-none leading-none block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2 animate-bounce">🛒</div>
              <p className="text-emerald-600 font-bold text-lg">Oops!</p>
            </div>
          </div>
        </div>

        {/* النص */}
        <h1 className="text-2xl font-extrabold text-gray-800 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-2 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved. Don't worry, let's get you back on track!
        </p>

        {/* عداد تنازلي */}
        <p className="text-xs text-gray-400 mb-8">
          Redirecting to home in{" "}
          <span className="font-bold text-emerald-600 text-sm">{countdown}s</span>
        </p>

        {/* أزرار */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold text-sm transition shadow-md hover:shadow-emerald-200 hover:shadow-lg"
          >
            🏠 Back to Home
          </Link>
          <Link
            to="/products"
            className="px-7 py-3 bg-white border border-gray-200 hover:border-emerald-300 text-gray-600 hover:text-emerald-600 rounded-full font-medium text-sm transition shadow-sm"
          >
            🛍 Browse Products
          </Link>
        </div>

        {/* روابط سريعة */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-4">Quick links</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {[
              { label: "Products", to: "/products" },
              { label: "Categories", to: "/categories" },
              { label: "Brands", to: "/Brands" },
              { label: "Cart", to: "/cart" },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-xs text-gray-400 hover:text-emerald-600 transition font-medium"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}