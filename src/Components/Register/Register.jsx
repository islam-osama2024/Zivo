import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";

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

const fieldConfig = [
  { name: "name", label: "Full Name", placeholder: "Islam Ahmed", icon: FiUser, type: "text" },
  { name: "email", label: "Email address", placeholder: "islam@example.com", icon: FiMail, type: "email" },
  { name: "phone", label: "Phone number", placeholder: "01xxxxxxxxx", icon: FiPhone, type: "tel" },
  { name: "password", label: "Password", placeholder: "••••••••", icon: FiLock, type: "password" },
  { name: "rePassword", label: "Confirm Password", placeholder: "••••••••", icon: FiLock, type: "password" },
];

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthConfig = [
  { label: "Weak", color: "bg-red-500", width: "w-1/4" },
  { label: "Fair", color: "bg-orange-400", width: "w-2/4" },
  { label: "Good", color: "bg-blue-500", width: "w-3/4" },
  { label: "Strong", color: "bg-green-500", width: "w-full" },
];

export default function Register() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", rePassword: "", phone: "" },
    validationSchema: Yup.object({
      name: Yup.string().matches(/^[a-zA-Z\s]+$/, "Letters only").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string().matches(/^(20)?01[0125][0-9]{8}$/, "Invalid phone").required("Required"),
      password: Yup.string().min(8, "Min 8 characters").required("Required"),
      rePassword: Yup.string().oneOf([Yup.ref("password")], "Passwords don't match").required("Required"),
    }),
    onSubmit: async (values) => {
      setErrorMessage(null);
      setLoading(true);
      try {
        await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", values);
        const { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signin", {
          email: values.email, password: values.password,
        });
        localStorage.setItem("userToken", data.token);
        setSuccessMessage(true);
        setTimeout(() => navigate("/products"), 1500);
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message === "Account already exists"
            ? "This email is already registered."
            : err.response?.data?.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (errorMessage) {
      const t = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [errorMessage]);

  const strength = getStrength(formik.values.password);
  const strengthInfo = strengthConfig[strength - 1];

  const getInputClass = (field) => {
    if (!formik.touched[field]) return "border-gray-200 bg-gray-50 focus:bg-white";
    return formik.errors[field]
      ? "border-red-400 bg-red-50 focus:bg-white"
      : "border-green-400 bg-green-50 focus:bg-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* ── الجانب الأيمن — ديكور ── */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 p-10 text-white relative overflow-hidden order-last">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 text-center">
            {/* ← لوجو Zivo أبيض */}
            <div className="mb-8 flex justify-center">
              <ZivoLogo white />
            </div>
            <h2 className="text-3xl font-extrabold mb-3 leading-tight">
              Join Zivo! 🎉
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed mb-8">
              Create your account and start shopping from thousands of products today.
            </p>
            {[
              { icon: "🎁", text: "Exclusive deals for members" },
              { icon: "📦", text: "Track your orders easily" },
              { icon: "💳", text: "Safe & secure checkout" },
              { icon: "⭐", text: "Earn rewards on every purchase" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 mb-3 text-left">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm flex-shrink-0">{icon}</div>
                <span className="text-sm text-emerald-100">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── الجانب الأيسر — الفورم ── */}
        <div className="flex flex-col justify-center p-8 md:p-10">

          {/* Logo mobile ← أخضر على خلفية بيضا */}
          <div className="md:hidden mb-6 flex justify-center">
            <ZivoLogo />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-1">Create account</h1>
          <p className="text-gray-400 text-sm mb-6">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 font-medium hover:underline">Sign in</Link>
          </p>

          {/* Success */}
          {successMessage && (
            <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
              <span>🎉</span>
              <span>Account created! Redirecting...</span>
            </div>
          )}

          {/* Error */}
          {errorMessage && !successMessage && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {fieldConfig.map(({ name, label, placeholder, icon: Icon, type }) => {
              const isPassword = type === "password";
              const inputType = isPassword ? (showPassword ? "text" : "password") : type;

              return (
                <div key={name}>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type={inputType}
                      name={name}
                      value={formik.values[name]}
                      onChange={(e) => { formik.handleChange(e); setErrorMessage(null); }}
                      onBlur={formik.handleBlur}
                      placeholder={placeholder}
                      className={`w-full pl-10 pr-${isPassword ? "11" : "4"} py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition ${getInputClass(name)}`}
                    />

                    {/* Show/Hide password */}
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    )}

                    {/* Valid ✓ */}
                    {formik.touched[name] && !formik.errors[name] && !isPassword && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
                    )}
                  </div>

                  {/* Password strength */}
                  {name === "password" && formik.values.password && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strengthInfo?.color || ""} ${strengthInfo?.width || "w-0"}`} />
                      </div>
                      <p className={`text-xs mt-1 font-medium ${strength <= 1 ? "text-red-500" :
                          strength === 2 ? "text-orange-400" :
                            strength === 3 ? "text-blue-500" : "text-green-500"
                        }`}>
                        {strengthInfo?.label || ""}
                      </p>
                    </div>
                  )}

                  {/* Error message */}
                  {formik.touched[name] && formik.errors[name] && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {formik.errors[name]}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || strength < 3}
              className={`w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2 ${loading || strength < 3
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600 shadow-md hover:shadow-emerald-200 hover:shadow-lg"
                }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : "Create account →"}
            </button>
          </form>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 mt-5">
            By registering, you agree to our{" "}
            <span className="text-emerald-600 hover:underline cursor-pointer">Terms</span>
            {" "}and{" "}
            <span className="text-emerald-600 hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}