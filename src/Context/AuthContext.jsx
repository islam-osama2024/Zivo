import { createContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    // ✅ Hydrate synchronously so ProtectedRoute never sees a false "logged out" on refresh
    const [token, setToken] = useState(() => localStorage.getItem("tkn"));
    const [userEmail, setUserEmail] = useState(() => localStorage.getItem("user_email"));

    // ✅ Login — ابعت الإيميل معاه
    function login(userToken, email) {
        localStorage.setItem("tkn", userToken);
        localStorage.setItem("user_email", email);
        setToken(userToken);
        setUserEmail(email);
    }

    // ✅ Logout — امسح الإيميل مع التوكن
    function logout() {
        localStorage.removeItem("tkn");
        localStorage.removeItem("user_email");
        setToken(null);
        setUserEmail(null);
    }

    return (
        <AuthContext.Provider value={{ token, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
