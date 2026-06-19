import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [token, setToken] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    // ✅ عند أول تحميل أو Refresh
    useEffect(() => {
        const savedToken = localStorage.getItem("tkn");
        const savedEmail = localStorage.getItem("user_email");
        if (savedToken) setToken(savedToken);
        if (savedEmail) setUserEmail(savedEmail);
    }, []);

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