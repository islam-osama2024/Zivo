import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext"; 
import {
  FaFacebookF, FaLinkedinIn, FaWhatsapp, FaGoogle, FaInstagram,
  FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex, FaApplePay,
} from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";

// ── بيانات التواصل ────────────────────────────────────────────
const CONTACT = {
  whatsapp: "201021771120",
  email: "osamaeslam483@gmail.com",
};

// ── أيقونات السوشيال ──────────────────────────────────────────
const socials = [
  { label: "Facebook", icon: FaFacebookF, href: "https://web.facebook.com/eslam.osama.3532/", className: "bg-blue-600", rotate: "hover:rotate-3" },
  { label: "LinkedIn", icon: FaLinkedinIn, href: "https://www.linkedin.com/in/eslam-osama-0119242a6/", className: "bg-blue-700", rotate: "hover:-rotate-3" },
  { label: "WhatsApp", icon: FaWhatsapp, href: `https://wa.me/${CONTACT.whatsapp}`, className: "bg-green-500", rotate: "hover:rotate-3" },
  { label: "Gmail", icon: FaGoogle, href: `mailto:${CONTACT.email}`, className: "bg-red-500", rotate: "hover:-rotate-3" },
  {
    label: "Instagram", icon: FaInstagram,
    href: "https://www.instagram.com/eslam.osama.3532/",
    className: "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400",
    rotate: "hover:rotate-6",
  },
];

// ── وسائل الدفع ───────────────────────────────────────────────
const paymentMethods = [
  { label: "Visa", icon: FaCcVisa, color: "text-blue-400" },
  { label: "Mastercard", icon: FaCcMastercard, color: "text-red-400" },
  { label: "PayPal", icon: FaCcPaypal, color: "text-blue-300" },
  { label: "Amex", icon: FaCcAmex, color: "text-sky-400" },
  { label: "Apple Pay", icon: FaApplePay, color: "text-gray-100" },
];

// ── روابط الفوتر ──────────────────────────────────────────────
const navLinks = [
  { label: "Products", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Brands", to: "/brands" },
  { label: "Cart", to: "/cart" },
  { label: "Register", to: "/register" },
  { label: "Login", to: "/login" },
];

const companyLinks = [
  { label: "About", to: "/about" },
  { label: "Features", to: "/features" },
  { label: "Works", to: "/works" },
  { label: "Career", to: "/career" },
];

const helpLinks = [
  { label: "Customer Support", to: "/support" },
  { label: "Delivery Details", to: "/delivery" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
];

// ── هوك: كشف ظهور العنصر في الشاشة ──────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ── مكوّن قائمة الروابط ───────────────────────────────────────
function FooterLinkList({ title, links, visible, delay = 0 }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
      <ul className="mt-6 space-y-3">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className="hover:text-emerald-400 transition">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── المكوّن الرئيسي ───────────────────────────────────────────
export default function Footer() {
  const { userEmail } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [justSubscribed, setJustSubscribed] = useState(false);

  const [subscribedEmails, setSubscribedEmails] = useState(() => {
    try {
      const saved = localStorage.getItem("subscribed_emails");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const subscribed = userEmail
    ? subscribedEmails.has(userEmail.toLowerCase())
    : false;

  const [footerRef, footerVisible] = useInView();

  // ── Back to Top ───────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ── Newsletter ────────────────────────────────────────────────
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("من فضلك أدخل بريدك الإلكتروني."); return; }
    if (!isValidEmail(email)) { setError("البريد الإلكتروني غير صحيح."); return; }
    if (subscribedEmails.has(email.toLowerCase())) {
      setError("هذا البريد الإلكتروني مشترك بالفعل.");
      return;
    }

    const updated = new Set(subscribedEmails).add(email.toLowerCase());
    setSubscribedEmails(updated);
    try {
      localStorage.setItem("subscribed_emails", JSON.stringify([...updated]));
    } catch { /* ignore */ }

    setError("");
    setEmail("");
    setJustSubscribed(true);
    setTimeout(() => setJustSubscribed(false), 3000);
  };

  return (
    <>
      {/* زر Back to Top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:scale-110 transition-all duration-300 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
      >
        <FiArrowUp className="text-xl" />
      </button>

      <footer
        ref={footerRef}
        className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 py-12 sm:py-16 lg:py-24 text-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-12">

            {/* Logo و وصف */}
            <div
              className="col-span-1 sm:col-span-2 lg:col-span-2"
              style={{
                opacity: footerVisible ? 1 : 0,
                transform: footerVisible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.6s ease 0ms, transform 0.6s ease 0ms",
              }}
            >
              <h2 className="text-3xl font-extrabold text-white">ZIVO</h2>
              <p className="mt-4 text-gray-300 leading-relaxed">
                اكتشف عالمًا مليئًا بأفضل المنتجات والخدمات الإلكترونية، تسوق
                بسهولة، استمتع بالراحة، واحصل على كل ما تحلم به في مكان واحد.
              </p>
              <div className="flex items-center mt-6 space-x-3">
                {socials.map(({ label, icon: Icon, href, className, rotate }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${className} text-white shadow-lg hover:shadow-2xl transform hover:scale-110 ${rotate} transition-all duration-300`}
                  >
                    <Icon className="text-lg" />
                  </a>
                ))}
              </div>
            </div>

            <FooterLinkList title="Navigation" links={navLinks} visible={footerVisible} delay={100} />
            <FooterLinkList title="Company" links={companyLinks} visible={footerVisible} delay={200} />
            <FooterLinkList title="Help" links={helpLinks} visible={footerVisible} delay={300} />

            {/* النشرة البريدية */}
            <div
              className="col-span-1 sm:col-span-2 lg:col-span-2"
              style={{
                opacity: footerVisible ? 1 : 0,
                transform: footerVisible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.6s ease 400ms, transform 0.6s ease 400ms",
              }}
            >
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Subscribe to newsletter
              </h3>

              {subscribed ? (
                <div className="mt-6">
                  <p className="text-emerald-400 font-medium">✅ تم الاشتراك بنجاح! شكراً لك.</p>
                  <p className="text-gray-500 text-xs mt-1">{userEmail}</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-3" noValidate>
                  {justSubscribed && (
                    <p className="text-emerald-400 text-sm font-medium animate-pulse">
                      ✅ تم الاشتراك بنجاح! شكراً لك.
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="Enter your email"
                      className={`w-full p-3 rounded-md border ${error ? "border-red-500" : "border-gray-700"
                        } bg-gray-900 text-white focus:outline-none focus:border-emerald-400 caret-emerald-400`}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md shadow-lg transition-all transform hover:scale-105 whitespace-nowrap"
                    >
                      Subscribe
                    </button>
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                </form>
              )}
            </div>
          </div>

          {/* وسائل الدفع */}
          <div
            className="mt-12 pt-8 border-t border-gray-700"
            style={{
              opacity: footerVisible ? 1 : 0,
              transform: footerVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease 500ms, transform 0.6s ease 500ms",
            }}
          >
            <p className="text-sm text-gray-400 mb-4 text-center uppercase tracking-wider font-semibold">
              Secure Payment Methods
            </p>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              {paymentMethods.map(({ label, icon: Icon, color }) => (
                <div key={label} title={label} aria-label={label}
                  className={`${color} text-5xl hover:scale-110 transition-transform duration-200 cursor-default`}
                >
                  <Icon />
                </div>
              ))}
            </div>
          </div>

          <hr className="mt-8 border-gray-700" />
          <p className="mt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} FRESH CART. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}