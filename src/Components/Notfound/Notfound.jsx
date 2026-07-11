import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  // عداد تنازلي يرجع للهوم تلقائي
  useEffect(() => {
    if (countdown === 0) { navigate("/"); return; }
    const timeout = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timeout);
  }, [countdown, navigate]);

  const quickLinks = [
    { key: "products", to: "/products" },
    { key: "categories", to: "/categories" },
    { key: "brands", to: "/brands" },
    { key: "cart", to: "/cart" },
    { key: "wishlist", to: "/wishlist" },
    { key: "profile", to: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="max-w-lg w-full text-center">

        {/* الرقم 404 */}
        <div className="relative inline-block mb-6">
          <span className="text-[140px] font-extrabold text-emerald-500/10 dark:text-emerald-400/10 select-none leading-none block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2 animate-bounce">🛒</div>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{t("oops")}</p>
            </div>
          </div>
        </div>

        {/* النص */}
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-3">
          {t("pageNotFound")}
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed mb-2 max-w-sm mx-auto">
          {t("notFoundMessage")}
        </p>

        {/* عداد تنازلي */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">
          {t("redirectingToHome")}{" "}
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{countdown}s</span>
        </p>

        {/* أزرار */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold text-sm transition shadow-md hover:shadow-emerald-200 hover:shadow-lg"
          >
            🏠 {t("backToHome")}
          </Link>
          <Link
            to="/products"
            className="px-7 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full font-medium text-sm transition shadow-sm"
          >
            🛍 {t("browseProducts")}
          </Link>
        </div>

        {/* روابط سريعة */}
        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{t("quickLinks")}</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {quickLinks.map(({ key, to }) => (
              <Link
                key={to}
                to={to}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition font-medium"
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}