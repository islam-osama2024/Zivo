import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const fetchCategories = async () => {
  const res = await axios.get("https://dummyjson.com/products/categories");
  const slugs = res.data
    .map((c) => (typeof c === "string" ? c : c?.slug))
    .filter(Boolean);

  const withImages = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const prod = await axios.get(
          `https://dummyjson.com/products/category/${slug}?limit=1`
        );
        const image = prod.data.products?.[0]?.thumbnail || "";
        return { slug, image };
      } catch {
        return { slug, image: "" };
      }
    })
  );

  return withImages.filter((c) => c?.slug);
};

const FALLBACK = "https://placehold.co/300x150?text=No+Image";

export default function Categories({ selectedCategory, onSelectCategory }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // كاش 10 دقايق
  });

  const formatName = (name) => {
    if (!name || typeof name !== "string") return "";
    return name
      .replace(/-/g, " ")
      .split(" ")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  };

  const filtered = categories.filter((c) =>
    formatName(c.slug).toLowerCase().includes(search.toLowerCase())
  );

  // Loading skeleton
  if (isLoading) return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-6 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border rounded-xl overflow-hidden animate-pulse">
            <div className="w-full h-28 bg-gray-200" />
            <div className="p-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">⚠️</span>
      <p className="text-red-500 font-semibold text-lg">فيه مشكلة في تحميل الـ Categories</p>
      <p className="text-gray-400 text-sm mt-1">تأكد من الاتصال بالإنترنت وحاول تاني</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Shop by Category</h2>
        <p className="text-gray-400 mt-1 text-sm">
          {categories.length} categories available
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <span className="text-4xl">🔎</span>
          <p className="mt-3">No categories match "{search}"</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {filtered.map(({ slug, image }) => (
          <div
            key={slug}
            onClick={() => {
              onSelectCategory(slug);
              navigate(`/products?category=${slug}`);
            }}
            className={`group cursor-pointer border rounded-xl overflow-hidden text-center transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${selectedCategory === slug
                ? "ring-2 ring-green-500 border-green-400"
                : "border-gray-100 hover:border-green-300"
              }`}
          >
            {/* صورة */}
            <div className="relative overflow-hidden h-28 bg-gray-50">
              <img
                src={image || FALLBACK}
                alt={formatName(slug)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => { e.target.src = FALLBACK; }}
              />
              {/* overlay لما يتحدد */}
              {selectedCategory === slug && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                  <span className="text-green-600 text-2xl">✓</span>
                </div>
              )}
            </div>

            {/* اسم الـ category */}
            <div className="p-2 bg-white">
              <span className="font-semibold text-xs text-gray-700 group-hover:text-green-600 transition-colors">
                {formatName(slug)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}