import { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
    FaUserCircle, FaBars, FaTimes,
    FaSignOutAlt, FaThLarge, FaHome
} from "react-icons/fa";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    function handleLogout() {
        logout();
        navigate("/");
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        /* Fondo Azul Noche con Glassmorphism y borde sutil azul */
        <nav className="relative w-full bg-[#050814]/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center z-[200] border-b border-blue-900/40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">

            {/* LOGO - Estilo UEFA */}
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-xl flex items-center justify-center text-white text-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform">
                    ⚽
                </div>
                <div className="text-white font-black text-xl leading-5 tracking-tighter uppercase italic">
                    Ligas <br /> <span className="text-blue-500 bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Jujeñas</span>
                </div>
            </Link>

            <div className="flex items-center gap-4">
                {user && (
                    /* Badge de usuario en Azul Real */
                    <div className="hidden md:flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        <FaUserCircle className="text-blue-400" />
                        <span className="font-bold text-[10px] text-blue-200 uppercase tracking-widest">{user.sub}</span>
                    </div>
                )}
                <button
                    ref={buttonRef}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* MENÚ DESPLEGABLE - Tema Oscuro Premium */}
            {open && (
                <div
                    ref={menuRef}
                    className="absolute right-6 top-[calc(100%+10px)] bg-[#0e1630] border border-blue-800/40 shadow-[0_10px_40px_rgba(0,0,0,0.7)] rounded-2xl p-2 w-52 z-[210] animate-in fade-in zoom-in duration-200"
                >
                    <div className="flex flex-col gap-1">
                        <Link
                            to="/"
                            className="flex items-center gap-3 text-slate-300 px-4 py-3 rounded-xl hover:bg-blue-600 hover:text-white font-bold transition-all text-sm"
                            onClick={() => setOpen(false)}
                        >
                            <FaHome className="text-blue-400 group-hover:text-white" /> Home
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-3 text-slate-300 px-4 py-3 rounded-xl hover:bg-blue-600 hover:text-white font-bold transition-all text-sm"
                                    onClick={() => setOpen(false)}
                                >
                                    <FaThLarge className="text-blue-400" /> Dashboard
                                </Link>
                                <div className="h-[1px] bg-blue-900/40 my-1 mx-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 text-red-400 px-4 py-3 rounded-xl hover:bg-red-500/10 font-bold transition-all text-left w-full text-sm"
                                >
                                    <FaSignOutAlt /> Salir
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-3 text-blue-400 px-4 py-3 rounded-xl hover:bg-blue-500/10 font-bold text-sm"
                                onClick={() => setOpen(false)}
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}