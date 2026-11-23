import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom"; // ← أضفنا دول
import axios from "axios";
import { useTranslation } from "react-i18next";
import SimpleSlider from "../HomeSlider/HomeSlider.jsx";
import Categories from "../Categories/Categories.jsx";
import { useCart } from "../../Context/CartContext.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { toast, Toaster } from "react-hot-toast";
import image1 from "../../assets/image/clotes.avif";
import image2 from "../../assets/image/ele.avif";

const fetchProducts = async ({ queryKey }) => {
  const [_key, { category, search, skip, limit, brand }] = queryKey; // ← أضفنا brand
  let url = "";
  if (brand) {
    // Brand filter comes from the Brands page: fetch the full catalog, filter client-side below
    url = `https://dummyjson.com/products?limit=0`;
  } else if (search?.trim()) {
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  } else if (category && category !== "all") {
    url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
  } else {
    url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
  }

  const res = await axios.get(url);
  let data = res.data.products || res.data;

  // ← فلتر الـ brand لو جاي من صفحة Brands
  if (brand) {
    data = data.filter((p) =>
      p.brand?.toLowerCase().includes(brand.toLowerCase())
    );
  }

  return data.map((p) => {
    const hasDiscount = Math.random() > 0.5;
    const discountPercentage = hasDiscount ? Math.floor(Math.random() * 26) + 5 : 0;
    const discountedPrice =
      discountPercentage > 0 && p.price ? (p.price * (100 - discountPercentage)) / 100 : p.price;
    const isNew = Math.random() > 0.7;
    const isBestSeller = Math.random() > 0.8;
    const reviewsCount = Math.floor(Math.random() * 5) + 1;
    const reviews = Array.from({ length: reviewsCount }).map((_, i) => ({
      rating: Math.floor(Math.random() * 5) + 1,
      comment: "Great product!",
      reviewerName: `User${i + 1}`,
      date: new Date().toISOString().split("T")[0],
    }));
    return { ...p, discountPercentage, discountedPrice, isNew, isBestSeller, reviews };
  });
};

export default function ProductsPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [skip, setSkip] = useState(0);
  const limit = 12;
  const [gridView, setGridView] = useState(true);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [modalProduct, setModalProduct] = useState(null);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [searchParams] = useSearchParams(); // ← جديد
  const navigate = useNavigate();           // ← جديد
  const brandFilter = searchParams.get("brand") || ""; // ← جديد

  const { data: products = [], isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["products", { category: selectedCategory, search: searchQuery, skip, limit, brand: brandFilter }], // ← أضفنا brand
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  const sortedProducts = [...products];
  if (sortBy === "priceAsc")
    sortedProducts.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
  else if (sortBy === "priceDesc")
    sortedProducts.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
  else if (sortBy === "rating")
    sortedProducts.sort((a, b) => {
      const avgA = a.reviews.reduce((sum, r) => sum + r.rating, 0) / (a.reviews.length || 1);
      const avgB = b.reviews.reduce((sum, r) => sum + r.rating, 0) / (b.reviews.length || 1);
      return avgB - avgA;
    });

  const displayedProducts = showSaleOnly
    ? sortedProducts.filter((p) => p.discountPercentage > 0)
    : sortedProducts;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-200 dark:text-gray-600"}`}>★</span>
    ));

  const renderSkeletons = () =>
    Array.from({ length: limit }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden animate-pulse">
        <div className="h-44 bg-gray-100 dark:bg-gray-700" />
        <div className="p-3 space-y-2">
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded mt-3" />
        </div>
      </div>
    ));

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setModalProduct(null); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Slider */}
      <div className="w-full m-0 p-0">
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-12 lg:col-span-9 h-[36rem]">
            <SimpleSlider />
          </div>
          <div className="col-span-12 lg:col-span-3 h-[36rem] flex flex-col">
            <div className="relative flex-1 overflow-hidden group">
              <img src={image1} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Fashion" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-xs font-semibold tracking-widest text-green-300">{t("newBadge")}</p>
                <p className="text-base font-bold">{t("fashion")}</p>
              </div>
            </div>
            <div className="relative flex-1 overflow-hidden group">
              <img src={image2} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Electronics" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-xs font-semibold tracking-widest text-green-300">{t("hotBadge")}</p>
                <p className="text-base font-bold">{t("electronics")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ← Brand Filter Indicator */}
      {brandFilter && (
        <div className="max-w-7xl mx-auto px-4 pt-5">
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-2xl px-4 py-3">
            <span className="text-emerald-600 dark:text-emerald-400 text-lg">🏷</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">{t("showingProductsForBrand")}</span>
            <span className="bg-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {brandFilter}
            </span>
            <button
              onClick={() => navigate("/products")}
              className="ml-auto text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition flex items-center gap-1"
            >
              {t("clearFilter")}
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">🔍</span>
            <input
              type="text"
              placeholder={t("searchProducts")}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSkip(0); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 px-3 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="default">{t("sortDefault")}</option>
            <option value="priceAsc">{t("sortPriceAsc")}</option>
            <option value="priceDesc">{t("sortPriceDesc")}</option>
            <option value="rating">{t("sortRating")}</option>
          </select>

          <div className="flex border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden shadow-sm">
            <button onClick={() => setGridView(true)} className={`px-4 py-2.5 text-sm transition ${gridView ? "bg-green-500 text-white" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>{t("grid")}</button>
            <button onClick={() => setGridView(false)} className={`px-4 py-2.5 text-sm transition ${!gridView ? "bg-green-500 text-white" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>{t("list")}</button>
          </div>

          <button
            onClick={() => setShowSaleOnly(!showSaleOnly)}
            className={`px-4 py-2.5 rounded-full text-sm font-medium border transition shadow-sm ${showSaleOnly ? "bg-red-500 text-white border-red-500" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-red-300 hover:text-red-500"}`}
          >
            {t("saleOnly")}
          </button>
        </div>

        {!isLoading && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            {t("productsFound", { count: displayedProducts.length })}
            {selectedCategory !== "all" && <span> {t("inCategory")} <span className="text-green-600 dark:text-green-400 font-medium capitalize">{selectedCategory.replace(/-/g, " ")}</span></span>}
            {brandFilter && <span> · {t("brandLabel")} <span className="text-emerald-600 dark:text-emerald-400 font-medium">{brandFilter}</span></span>}
          </p>
        )}
      </div>

      {/* Categories */}
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => { setSelectedCategory(cat); setSkip(0); }}
      />

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {isError && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-red-500 dark:text-red-400 font-medium">{error.message}</p>
          </div>
        )}

        {!isLoading && !isFetching && displayedProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <p className="text-5xl mb-3">🔎</p>
            <p className="font-medium">
              {brandFilter ? t("noProductsFoundForBrand", { brand: brandFilter }) : t("noProductsFound")}
            </p>
            <p className="text-sm mt-1">{t("tryDifferentSearch")}</p>
            {brandFilter && (
              <button
                onClick={() => navigate("/products")}
                className="mt-4 px-5 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 transition"
              >
                {t("clearBrandFilter")}
              </button>
            )}
          </div>
        )}

        <div className={`grid gap-5 ${gridView ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" : "grid-cols-1"}`}>
          {isLoading || isFetching
            ? renderSkeletons()
            : displayedProducts.map((product) => {
              const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / (product.reviews.length || 1);
              const inWishlist = isInWishlist(product.id);

              return gridView ? (
                <div
                  key={product.id}
                  onClick={() => setModalProduct(product)}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-200 cursor-pointer group hover:-translate-y-1 relative"
                >
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {product.discountPercentage > 0 && <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{t("percentOff", { percent: product.discountPercentage })}</span>}
                    {product.isNew && <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{t("newBadge")}</span>}
                    {product.isBestSeller && <span className="bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{t("bestBadge")}</span>}
                  </div>
                  <button
                    className={`absolute top-2 right-2 z-10 text-lg transition ${inWishlist ? "text-red-500" : "text-gray-300 dark:text-gray-600 hover:text-red-400"}`}
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                  >
                    {inWishlist ? "♥" : "♡"}
                  </button>
                  <div className="h-40 bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    <img src={product.thumbnail || product.image} alt={product.title} className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-xs font-medium line-clamp-2 mb-1 text-gray-700 dark:text-gray-200">{product.title}</h3>
                    {/* ← brand name */}
                    {product.brand && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mb-1">{product.brand}</span>
                    )}
                    <div className="flex items-center gap-0.5 mb-2">
                      {renderStars(avgRating)}
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">({product.reviews.length})</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {product.discountPercentage > 0 ? (
                        <>
                          <span className="line-through text-gray-300 dark:text-gray-600 text-xs">${product.price}</span>
                          <span className="text-red-500 dark:text-red-400 font-bold text-sm">${product.discountedPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-sm text-gray-800 dark:text-gray-100">${product.price}</span>
                      )}
                    </div>
                    <button
                      className="mt-auto w-full bg-green-500 hover:bg-green-600 text-white py-1.5 text-xs rounded-full font-medium transition"
                      onClick={(e) => { e.stopPropagation(); addToCart(product); toast.success(t("addedToCartToast", { name: product.title })); }}
                    >
                      {t("addToCartBtn")}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={product.id}
                  onClick={() => setModalProduct(product)}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex gap-4 p-4 hover:shadow-lg transition cursor-pointer group items-center"
                >
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={product.thumbnail || product.image} alt={product.title} className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-1 mb-1 flex-wrap">
                      {product.discountPercentage > 0 && <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{t("percentOff", { percent: product.discountPercentage })}</span>}
                      {product.isNew && <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{t("newBadge")}</span>}
                      {product.isBestSeller && <span className="bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{t("bestBadge")}</span>}
                    </div>
                    <h3 className="font-medium text-sm text-gray-800 dark:text-gray-100 line-clamp-1">{product.title}</h3>
                    {product.brand && <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{product.brand}</span>}
                    <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5">{product.description}</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {renderStars(avgRating)}
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">({product.reviews.length})</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {product.discountPercentage > 0 ? (
                      <div className="text-right">
                        <div className="line-through text-gray-300 dark:text-gray-600 text-xs">${product.price}</div>
                        <div className="text-red-500 dark:text-red-400 font-bold text-base">${product.discountedPrice.toFixed(2)}</div>
                      </div>
                    ) : (
                      <span className="font-bold text-base text-gray-800 dark:text-gray-100">${product.price}</span>
                    )}
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 text-xs rounded-full font-medium transition whitespace-nowrap"
                      onClick={(e) => { e.stopPropagation(); addToCart(product); toast.success(t("addedToCartToast", { name: product.title })); }}
                    >
                      {t("addToCartBtn")}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {!isLoading && !isFetching && displayedProducts.length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setSkip((prev) => prev + limit)}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition shadow-md hover:shadow-lg"
            >
              {t("loadMoreProducts")}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setModalProduct(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-y-auto max-h-[90vh] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <div className="h-56 bg-gray-50 dark:bg-gray-700 flex items-center justify-center rounded-t-2xl overflow-hidden">
                <img src={modalProduct.thumbnail || modalProduct.image} alt={modalProduct.title} className="h-full w-full object-contain p-4" />
              </div>
              <button onClick={() => setModalProduct(null)} className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-lg font-bold">✕</button>
              {modalProduct.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{t("percentOff", { percent: modalProduct.discountPercentage })}</span>
              )}
            </div>
            <div className="p-5">
              {/* ← brand في الـ modal */}
              {modalProduct.brand && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{modalProduct.brand}</span>
              )}
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-2">{modalProduct.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">{modalProduct.description}</p>
              <div className="flex items-center gap-3 mt-4">
                {modalProduct.discountPercentage > 0 ? (
                  <>
                    <span className="line-through text-gray-300 dark:text-gray-600 text-sm">${modalProduct.price}</span>
                    <span className="text-red-500 dark:text-red-400 font-bold text-2xl">${modalProduct.discountedPrice.toFixed(2)}</span>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">{t("saveBadge", { percent: modalProduct.discountPercentage })}</span>
                  </>
                ) : (
                  <span className="text-gray-800 dark:text-gray-100 font-bold text-2xl">${modalProduct.price}</span>
                )}
              </div>
              {modalProduct.reviews.length > 0 && (
                <div className="mt-5 border-t dark:border-gray-700 pt-4">
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-3">{t("customerReviews")}</h3>
                  <div className="space-y-3">
                    {modalProduct.reviews.slice(0, 3).map((r, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{r.reviewerName}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{r.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-1">{renderStars(r.rating)}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                className="mt-5 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-medium transition text-sm"
                onClick={() => { addToCart(modalProduct); toast.success(t("addedToCartToast", { name: modalProduct.title })); }}
              >
                {t("addToCartBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
