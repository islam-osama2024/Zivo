import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, firebaseReady, socialProviders } from "../firebase";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    // ✅ Legacy email/password session (demo API) — hydrates synchronously so
    // ProtectedRoute never sees a false "logged out" on refresh
    const [token, setToken] = useState(() => localStorage.getItem("tkn"));
    const [userEmail, setUserEmail] = useState(() => localStorage.getItem("user_email"));

    // ✅ Social session (Firebase) — resolved asynchronously on first load
    const [socialUser, setSocialUser] = useState(null);
    const [socialReady, setSocialReady] = useState(!firebaseReady);

    useEffect(() => {
        if (!auth) return undefined;
        return onAuthStateChanged(auth, (user) => {
            setSocialUser(user);
            setSocialReady(true);
        });
    }, []);

    // ✅ Login — ابعت الإيميل معاه
    function login(userToken, email) {
        localStorage.setItem("tkn", userToken);
        localStorage.setItem("user_email", email);
        setToken(userToken);
        setUserEmail(email);
    }

    // ✅ Social login — verified by Firebase, never by decoding anything locally
    async function socialSignIn(providerLabel) {
        if (!auth) {
            const err = new Error("Social sign-in is not configured yet");
            err.code = "auth/not-configured";
            throw err;
        }
        const Provider = socialProviders[providerLabel];
        const credential = await signInWithPopup(auth, new Provider());
        return credential.user;
    }

    // ✅ Logout — امسح الإيميل مع التوكن، واخرج من Firebase لو الجلسة سوشيال
    function logout() {
        localStorage.removeItem("tkn");
        localStorage.removeItem("user_email");
        setToken(null);
        setUserEmail(null);
        if (auth && socialUser) {
            signOut(auth).catch(() => {});
        }
        setSocialUser(null);
    }

    const mode = socialUser ? "social" : token ? "legacy" : null;

    // ✅ Namespaced local storage. Social identities are keyed by the verified
    // Firebase UID. Legacy sessions keep their original keys exactly as before,
    // so existing local data stays readable only by a legacy session and is
    // never merged into or exposed to a social identity.
    function storageKey(kind) {
        if (mode === "social") return `${kind}_fb_${socialUser.uid}`;
        if (mode === "legacy") {
            const email = userEmail.toLowerCase();
            if (kind === "orders") return `orders_${email}`;
            if (kind === "avatar") return `avatar_${email}`;
            if (kind === "cart") return "cartItems";
            if (kind === "wishlist") return "wishlistItems";
        }
        return null;
    }

    const isAuthenticated = mode !== null;
    // Only wait for Firebase when there is no legacy session to show
    const authPending = !token && firebaseReady && !socialReady;

    const displayName = socialUser?.displayName || null;
    const activeEmail = socialUser?.email || userEmail;

    return (
        <AuthContext.Provider
            value={{
                token,
                userEmail,
                socialUser,
                mode,
                isAuthenticated,
                authPending,
                displayName,
                activeEmail,
                storageKey,
                login,
                socialSignIn,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
