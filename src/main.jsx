import "./i18n/i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ThemeProvider } from "./Context/ThemeContext";
import AuthContextProvider from "./Context/AuthContext";
import CounterProvider from "./Context/CounterContext";
import { CartProvider } from "./Context/CartContext";
import { WishlistProvider } from "./Context/WishlistContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Create Query Client with options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      cacheTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <CounterProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </CounterProvider>
        </QueryClientProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);