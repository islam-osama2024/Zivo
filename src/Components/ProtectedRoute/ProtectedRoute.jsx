import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext"; // ✅ مسار صحيح


export default function ProtectedRoute({ children }) {
    const { token } = useContext(AuthContext);

    // لو المستخدم مش مسجل دخول، اعد توجيهه للـ login
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;

}
