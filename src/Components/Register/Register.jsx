import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../Context/AuthContext";

// ← لوجو Zivo مباشرة بدل صورة
const ZivoLogo = ({ white = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="110" height="34" viewBox="0 0 120 36" style={{ direction: "ltr" }}>
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

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function Register() {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // ← نقلناهم جوه الكومبوننت عشان يستخدموا t() ويتحدثوا مع تغيير اللغة
  const fieldConfig = [
    { name: "name", label: t("fullName"), placeholder: "Islam Ahmed", icon: FiUser, type: "text" },
    { name: "email", label: t("emailAddress"), placeholder: "islam@example.com", icon: FiMail, type: "email" },
    { name: "phone", label: t("phoneNumber"), placeholder: "01xxxxxxxxx", icon: FiPhone, type: "tel" },
    { name: "password", label: t("password"), placeholder: "••••••••", icon: FiLock, type: "password" },
    { name: "rePassword", label: t("confirmPassword"), placeholder: "••••••••", icon: FiLock, type: "password" },
  ];

  const strengthConfig = [
    { label: t("strengthWeak"), color: "bg-red-500", width: "w-1/4" },
    { label: t("strengthFair"), color: "bg-orange-400", width: "w-2/4" },
    { label: t("strengthGood"), color: "bg-blue-500", width: "w-3/4" },
    { label: t("strengthStrong"), color: "bg-green-500", width: "w-full" },
  ];

  const features = [
    { icon: "🎁", text: t("feature1") },
    { icon: "📦", text: t("feature2") },
    { icon: "💳", text: t("feature3") },
    { icon: "⭐", text: t("feature4") },
  ];

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", rePassword: "", phone: "" },
    validationSchema: Yup.object({
      name: Yup.string().matches(/^[a-zA-Z\s]+$/, t("errorLettersOnly")).required(t("errorRequired")),
      email: Yup.string().email(t("errorInvalidEmail")).required(t("errorRequired")),
      phone: Yup.string().matches(/^(20)?01[0125][0-9]{8}$/, t("errorInvalidPhone")).required(t("errorRequired")),
      password: Yup.string().min(8, t("errorMinChars")).required(t("errorRequired")),
      rePassword: Yup.string().oneOf([Yup.ref("password")], t("errorPasswordsMatch")).required(t("errorRequired")),
    }),
    onSubmit: async (values) => {
      setErrorMessage(null);
      setLoading(true);
      try {
        await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", values);
        const { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signin", {
          email: values.email, password: values.password,
        });
        login(data.token, values.email);
        setSuccessMessage(true);
        setTimeout(() => navigate("/products"), 1500);
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message === "Account already exists"
            ? t("errorEmailExists")
            : err.response?.data?.message || t("errorGeneric")
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  const strength = getStrength(formik.values.password);
  const strengthInfo = strengthConfig[strength - 1];

  const getInputClass = (field) => {
    if (!formik.touched[field]) return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800";
    return formik.errors[field]
      ? "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20 focus:bg-white dark:focus:bg-gray-800"
      : "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20 focus:bg-white dark:focus:bg-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">

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
              {t("joinZivo")}
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed mb-8">
              {t("joinZivoSubtitle")}
            </p>
            {features.map(({ icon, text }) => (
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

          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t("createAccount")}</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
            {t("alreadyHaveAccount")}{" "}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">{t("signIn")}</Link>
          </p>

          {/* Success */}
          {successMessage && (
            <div className="mb-5 flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm px-4 py-3 rounded-xl">
              <span>🎉</span>
              <span>{t("accountCreatedSuccess")}</span>
            </div>
          )}

          {/* Error */}
          {errorMessage && !successMessage && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
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
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                    <input
                      type={inputType}
                      name={name}
                      value={formik.values[name]}
                      onChange={(e) => { formik.handleChange(e); setErrorMessage(null); }}
                      onBlur={formik.handleBlur}
                      placeholder={placeholder}
                      className={`w-full pl-10 pr-${isPassword ? "11" : "4"} py-2.5 border rounded-xl text-sm dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition ${getInputClass(name)}`}
                    />

                    {/* Show/Hide password */}
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    )}

                    {/* Valid ✓ */}
                    {formik.touched[name] && !formik.errors[name] && !isPassword && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-400 text-sm">✓</span>
                    )}
                  </div>

                  {/* Password strength */}
                  {name === "password" && formik.values.password && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strengthInfo?.color || ""} ${strengthInfo?.width || "w-0"}`} />
                      </div>
                      <p className={`text-xs mt-1 font-medium ${strength <= 1 ? "text-red-500 dark:text-red-400" :
                        strength === 2 ? "text-orange-400" :
                          strength === 3 ? "text-blue-500 dark:text-blue-400" : "text-green-500 dark:text-green-400"
                        }`}>
                        {strengthInfo?.label || ""}
                      </p>
                    </div>
                  )}

                  {/* Error message */}
                  {formik.touched[name] && formik.errors[name] && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
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
                ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 shadow-md hover:shadow-emerald-200 dark:hover:shadow-emerald-900 hover:shadow-lg"
                }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("creatingAccount")}
                </>
              ) : t("createAccountBtn")}
            </button>
          </form>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-5">
            {t("termsAgreement")}{" "}
            <span>{t("terms")}</span>
            {" "}{t("and")}{" "}
            <span>{t("privacyPolicy")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
