import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // ← أضف ده
import axios from "axios";
import { useTranslation } from "react-i18next";

const getAllBrands = () =>
  axios.get("https://ecommerce.routemisr.com/api/v1/brands");

export default function Brands() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate(); // ← أضف ده

  const { isError, isLoading, data } = useQuery({
    queryKey: ["allBrands"],
    queryFn: getAllBrands,
    staleTime: 1000 * 60 * 10,
  });

  const brands = data?.data?.data || [];
  const featured = brands.slice(0, 6);
  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { num: brands.length + "+", label: t("brandsLabel") },
    { num: "500+", label: t("productsLabel") },
    { num: "24/7", label: t("supportLabel") },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
              <div className="h-36 bg-gray-100 dark:bg-gray-700" />
              <div className="p-3"><div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3 mx-auto" /></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <span className="text-5xl mb-4">⚠️</span>
        <p className="text-red-500 dark:text-red-400 font-semibold text-lg">{t("failedToLoadBrands")}</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{t("checkConnection")}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full tracking-widest mb-4">{t("topBrands")}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              {t("shopYourFavourite")} <br />
              <span className="text-emerald-400">{t("favouriteBrands")}</span>
            </h1>
            <p className="text-gray-400 text-base max-w-md">
              {t("discoverBrandsCount", { count: brands.length })}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {stats.map(({ num, label }) => (
              <div key={label} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-extrabold text-emerald-400">{num}</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Featured Brands */}
        {featured.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1 h-6 bg-emerald-500 rounded-full" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t("featuredBrands")}</h2>
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full ml-auto">{t("topPicks")}</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {featured.map((brand) => (
                <div
                  key={brand._id}
                  onClick={() => setSelected(brand)}
                  className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-emerald-100 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-500 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full" />
                  <div className="h-24 flex items-center justify-center p-3">
                    <img src={brand.image} alt={brand.name} className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-center pb-2 px-1">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{brand.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Brands */}
        <div className="flex items-center gap-3 mb-5">
          <span className="w-1 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t("allBrands")}</h2>
        </div>

        {/* Search */}
        <div className="max-w-md mb-8">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">🔍</span>
            <input
              type="text"
              placeholder={t("searchBrands")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
            )}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <p className="text-4xl mb-3">🔎</p>
            <p className="font-medium">{t("noBrandsMatch", { search })}</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.map((brand) => (
            <div
              key={brand._id}
              onClick={() => setSelected(brand)}
              className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <div className="h-36 bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-5 overflow-hidden">
                <img src={brand.image} alt={brand.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="py-3 px-2 text-center border-t border-gray-50 dark:border-gray-700">
                <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{brand.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ Modal ══ */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-52 bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-950 flex items-center justify-center p-8">
              <img src={selected.image} alt={selected.name} className="h-full w-full object-contain" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{selected.name}</h2>
                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{t("verified")}</span>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">{t("browseAllProducts", { name: selected.name })}</p>
              <div className="flex gap-3">
                {/* ← ده اللي اتغير */}
                <button
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-full text-sm font-medium transition"
                  onClick={() => {
                    setSelected(null);
                    navigate(`/products?brand=${encodeURIComponent(selected.name)}`);
                  }}
                >
                  {t("viewProducts")}
                </button>
                <button
                  className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  onClick={() => setSelected(null)}
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}