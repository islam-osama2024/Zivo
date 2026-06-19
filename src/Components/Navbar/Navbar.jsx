import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

// ← اللوجو مباشرة كـ component بدل صورة
const ZivoLogo = ({ white = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="32" viewBox="0 0 120 36">
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

const navLinks = [
    { label: "Products", to: "/products" },
    { label: "Categories", to: "/categories" },
    { label: "Brands", to: "/brands" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("theme") === "dark"
    );

    const { token, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    function handleLogout() { logout(); navigate("/login"); }
    function handleNavLinkClick() { setMenuOpen(false); }

    return (
        <nav className="bg-emerald-500 dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <ZivoLogo white />
                    </Link>

                    {/* روابط Desktop */}
                    {token && (
                        <ul className="hidden md:flex items-center gap-1">
                            {navLinks.map(({ label, to }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                ? "bg-white/30 text-white dark:bg-emerald-500 dark:text-white"
                                                : "text-white/80 hover:bg-white/20 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                            }`
                                        }
                                    >
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* الجانب الأيمن */}
                    <div className="flex items-center gap-3">

                        {/* Dark / Light toggle */}
                        <button
                            onClick={() => setDarkMode((d) => !d)}
                            aria-label="Toggle dark/light mode"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 dark:bg-gray-700 text-white dark:text-yellow-300 hover:bg-white/30 dark:hover:bg-gray-600 hover:scale-110 transition-all duration-200"
                        >
                            {darkMode ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
                        </button>

                        {/* Cart */}
                        {token && (
                            <Link
                                to="/cart"
                                className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/20 dark:bg-gray-700 text-white hover:bg-white/30 dark:hover:bg-gray-600 hover:scale-110 transition-all duration-200"
                                aria-label="Cart"
                            >
                                <FaShoppingCart className="text-base" />
                                {cartItems?.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                        {cartItems.length > 9 ? "9+" : cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Auth Desktop */}
                        <div className="hidden md:flex items-center gap-2">
                            {!token ? (
                                <>
                                    <NavLink
                                        to="/register"
                                        className="px-4 py-1.5 text-sm font-medium text-white/90 hover:text-white dark:text-gray-300 dark:hover:text-white transition"
                                    >
                                        Register
                                    </NavLink>
                                    <NavLink
                                        to="/login"
                                        className="px-4 py-1.5 text-sm font-medium bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-600 transition"
                                    >
                                        Login
                                    </NavLink>
                                </>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-1.5 text-sm font-medium bg-white/20 text-white rounded-lg hover:bg-white/30 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                                >
                                    Logout
                                </button>
                            )}
                        </div>

                        {/* Hamburger Mobile */}
                        <button
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="Toggle menu"
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/20 dark:bg-gray-700 text-white hover:bg-white/30 transition"
                        >
                            {menuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
                    {token && (
                        <ul className="flex flex-col gap-1 pt-2">
                            {navLinks.map(({ label, to }) => (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        onClick={handleNavLinkClick}
                                        className={({ isActive }) =>
                                            `block px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? "bg-white/30 text-white dark:bg-emerald-500"
                                                : "text-white/80 hover:bg-white/20 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700"
                                            }`
                                        }
                                    >
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/20 dark:border-gray-700">
                        {!token ? (
                            <>
                                <NavLink
                                    to="/register"
                                    onClick={handleNavLinkClick}
                                    className="block px-4 py-2 text-sm text-white/90 hover:text-white dark:text-gray-300 rounded-lg hover:bg-white/20 transition"
                                >
                                    Register
                                </NavLink>
                                <NavLink
                                    to="/login"
                                    onClick={handleNavLinkClick}
                                    className="block px-4 py-2 text-sm font-medium bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 dark:bg-emerald-500 dark:text-white transition text-center"
                                >
                                    Login
                                </NavLink>
                            </>
                        ) : (
                            <button
                                onClick={() => { handleNavLinkClick(); handleLogout(); }}
                                className="w-full px-4 py-2 text-sm text-white bg-white/20 rounded-lg hover:bg-white/30 dark:bg-gray-700 dark:hover:bg-gray-600 transition text-left"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}