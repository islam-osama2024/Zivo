import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContextProvider from "./Context/AuthContext";
import Layout from "./Components/Layout/Layout";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Notfound from "./Components/Notfound/Notfound";
import Products from "./Components/Products/Products";
import Cart from "./Components/Cart/Cart";
import Categories from "./Components/Categories/Categories";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Checkout from "./Components/Checkout/Checkout.jsx";
import Brands from "./Components/Brands/Brands.jsx";
import Wishlist from "./Components/Wishlist/Wishlist.jsx";
import Profile from "./Components/Profile/Profile.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute><Products /></ProtectedRoute>,
      },
      {
        path: "products",
        element: <ProtectedRoute><Products /></ProtectedRoute>,
      },
      {
        path: "categories",
        element: <ProtectedRoute><Categories /></ProtectedRoute>,
      },
      {
        path: "brands",
        element: <ProtectedRoute><Brands /></ProtectedRoute>,
      },
      {
        path: "checkout",
        element: <ProtectedRoute><Checkout /></ProtectedRoute>,
      },
      {
        path: "cart",
        element: <ProtectedRoute><Cart /></ProtectedRoute>,
      },
      {
        path: "wishlist",
        element: <ProtectedRoute><Wishlist /></ProtectedRoute>,
      },
      {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthContextProvider>
  );
}