import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext"; // ✅ مسار صحيح


export default function ProtectedRoute({ children }) {
    const { isAuthenticated, authPending } = useContext(AuthContext);

    // لسه بنستنى جلسة Firebase تتحقق — منعرضش حاجة لحد ما تعرف
    if (!isAuthenticated && authPending) {
        return null;
    }

    // لو المستخدم مش مسجل دخول، اعد توجيهه للـ login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;

}
