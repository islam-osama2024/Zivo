import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaApple } from "react-icons/fa";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

// ← لوجو Zivo مباشرة بدل صورة
const ZivoLogo = ({ white = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="110" height="34" viewBox="0 0 120 36">
        <circle cx="8" cy="18" r="7" fill={white ? "white" : "#10b981"} />
        <circle cx="8" cy="18" r="3.5" fill={white ? "#10b981" : "white"} />
        <text
            x="22" y="24"
            fontFamily="system-ui,sans-serif"
            fontWeight="700"
            fontSize="22"
            fill={white ? "white" : "#10b981"}
            letterSpacing="-0.5"
        >
            Zivo
        </text>
    </svg>
);

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [remember, setRemember] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);
        try {
            const { data } = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/auth/signin",
                { email, password }
            );
            login(data.token, email);
            navigate("/products");
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Email or password is incorrect");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (errorMessage) {
            const t = setTimeout(() => setErrorMessage(null), 3000);
            return () => clearTimeout(t);
        }
    }, [errorMessage]);

    const socialButtons = [
        { icon: <FcGoogle size={20} />, bg: "bg-white border border-gray-200 hover:bg-gray-50", label: "Google" },
        { icon: <FaFacebookF size={18} className="text-white" />, bg: "bg-[#1877F2] hover:bg-[#1565d8]", label: "Facebook" },
        { icon: <FaGithub size={18} className="text-white" />, bg: "bg-gray-900 hover:bg-gray-700", label: "GitHub" },
        { icon: <FaApple size={20} className="text-white" />, bg: "bg-black hover:bg-gray-800", label: "Apple" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* ── الجانب الأيسر — ديكور ── */}
                <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
                    <div className="absolute top-1/2 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/2" />

                    <div className="relative z-10 text-center">
                        {/* ← لوجو Zivo أبيض على الخلفية الخضرا */}
                        <div className="mb-8 flex justify-center">
                            <ZivoLogo white />
                        </div>
                        <h2 className="text-3xl font-extrabold mb-3 leading-tight">
                            Welcome back! 👋
                        </h2>
                        <p className="text-emerald-100 text-sm leading-relaxed mb-8">
                            Sign in to your account and discover thousands of products at the best prices.
                        </p>
                        {[
                            { icon: "🛒", text: "Shop from 500+ brands" },
                            { icon: "🚀", text: "Fast & free delivery" },
                            { icon: "🔒", text: "Secure payments" },
                        ].map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-3 mb-3 text-left">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm flex-shrink-0">{icon}</div>
                                <span className="text-sm text-emerald-100">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── الجانب الأيمن — الفورم ── */}
                <div className="flex flex-col justify-center p-8 md:p-10">

                    {/* Logo mobile ← أخضر على خلفية بيضا */}
                    <div className="md:hidden mb-6 flex justify-center">
                        <ZivoLogo />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Sign in</h1>
                    <p className="text-gray-400 text-sm mb-7">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-emerald-600 font-medium hover:underline">Create one</Link>
                    </p>

                    {/* Error */}
                    {errorMessage && (
                        <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                            <span>⚠️</span>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Email address</label>
                            <div className="relative">
                                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setErrorMessage(null); }}
                                    placeholder="islam@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrorMessage(null); }}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-11 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition bg-gray-50 focus:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="w-4 h-4 rounded accent-emerald-500"
                                />
                                Remember me
                            </label>
                            <Link to="/forget-password" className="text-sm text-emerald-600 hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2 ${loading
                                    ? "bg-emerald-400 cursor-not-allowed"
                                    : "bg-emerald-500 hover:bg-emerald-600 shadow-md hover:shadow-emerald-200 hover:shadow-lg"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : "Sign in →"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-400 font-medium">or continue with</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Social */}
                    <div className="grid grid-cols-4 gap-3">
                        {socialButtons.map(({ icon, bg, label }) => (
                            <button
                                key={label}
                                type="button"
                                aria-label={label}
                                className={`${bg} h-11 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>

                    {/* Terms */}
                    <p className="text-center text-xs text-gray-400 mt-6">
                        By signing in, you agree to our{" "}
                        <span className="text-emerald-600 hover:underline cursor-pointer">Terms</span>
                        {" "}and{" "}
                        <span className="text-emerald-600 hover:underline cursor-pointer">Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    );
}