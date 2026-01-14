import { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logoLigas from "../assets/logo.png";
import {
    FaUserCircle, FaBars, FaTimes,
    FaSignOutAlt, FaThLarge, FaHome, FaShieldAlt, FaUserEdit
} from "react-icons/fa";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [showUserDetail, setShowUserDetail] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const userDetailRef = useRef(null);

    const userRole = user?.role?.replace("ROLE_", "") || "USUARIO";

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
            if (userDetailRef.current && !userDetailRef.current.contains(e.target)) {
                setShowUserDetail(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="relative w-full bg-[#0a0c10]/95 backdrop-blur-2xl px-6 py-4 flex justify-between items-center z-[200] border-b border-slate-700/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">

            {/* Brillo metálico sutil superior */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>

            {/* CAMBIO AQUÍ: Se redujo el 'gap-4' a 'gap-2' para juntar el logo y el texto */}
            <Link to="/" className="flex items-center gap-2 group">

                {/* LOGO LIMPIO */}
                <div className="relative w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <img
                        src={logoLigas}
                        alt="Logo Ligas Jujeñas"
                        className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-500"
                    />
                </div>

                <div className="text-white font-black text-xl leading-5 tracking-tighter uppercase italic">
                    Ligas <br />
                    <span className="text-slate-300 bg-gradient-to-r from-slate-100 via-slate-400 to-slate-200 bg-clip-text text-transparent">
                        Jujeñas
                    </span>
                </div>
            </Link>

            <div className="flex items-center gap-4 md:gap-8">
                {user && (
                    <>
                        {/* Tag de usuario "Titanio" */}
                        <div className="hidden md:flex items-center gap-3 bg-gradient-to-b from-slate-800/50 to-black/50 border border-slate-700 px-6 py-2.5 rounded-full shadow-inner hover:border-slate-500 transition-colors group/user">
                            <FaShieldAlt className="text-slate-400 text-xs" />
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="text-[11px] font-black text-slate-100 uppercase tracking-widest italic border-r border-slate-700 pr-3">
                                    {userRole}
                                </span>
                                <span className="text-[13px] font-bold text-slate-400 lowercase tracking-tight">
                                    {user.sub}
                                </span>
                            </div>
                            <FaUserCircle size={22} className="text-slate-500 group-hover/user:text-slate-200 transition-colors ml-1" />
                        </div>

                        <div className="relative md:hidden" ref={userDetailRef}>
                            <button
                                onClick={() => setShowUserDetail(!showUserDetail)}
                                className="w-10 h-10 bg-slate-800/80 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 shadow-lg"
                            >
                                <FaUserCircle size={24} />
                            </button>
                            {showUserDetail && (
                                <div className="absolute right-0 top-[calc(100%+20px)] bg-[#0d1117] border border-slate-700 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] w-72 animate-in slide-in-from-top-3 duration-300 z-[250]">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Acceso</p>
                                    <p className="text-lg font-black text-white uppercase italic">
                                        <span className="bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">{userRole}</span>
                                    </p>
                                    <div className="h-[1px] bg-slate-800 my-2"></div>
                                    <p className="text-sm font-bold text-slate-400 truncate">{user.sub}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <button
                    ref={buttonRef}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-700"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <FaTimes size={28} /> : <FaBars size={28} />}
                </button>
            </div>

            {/* MENÚ DROPDOWN */}
            {open && (
                <div
                    ref={menuRef}
                    className="absolute right-6 top-[calc(100%+15px)] bg-[#0a0c10]/98 border border-slate-700 shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-4 w-72 z-[210] animate-in fade-in zoom-in-95 duration-300"
                >
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/"
                            className="flex items-center gap-5 text-slate-400 px-6 py-5 rounded-[1.5rem] hover:bg-slate-800 hover:text-white font-black uppercase tracking-widest transition-all text-xs group"
                            onClick={() => setOpen(false)}
                        >
                            <FaHome className="text-slate-600 group-hover:text-slate-200" size={20} /> Home
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-5 text-slate-400 px-6 py-5 rounded-[1.5rem] hover:bg-slate-800 hover:text-white font-black uppercase tracking-widest transition-all text-xs group"
                                    onClick={() => setOpen(false)}
                                >
                                    <FaThLarge className="text-slate-600 group-hover:text-slate-200" size={20} /> Dashboard
                                </Link>
                                <div className="h-[1px] bg-slate-800/60 my-3 mx-6"></div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-5 text-red-500/80 px-6 py-5 rounded-[1.5rem] hover:bg-red-500/10 hover:text-red-400 font-black uppercase tracking-widest transition-all text-left w-full text-xs group"
                                >
                                    <FaSignOutAlt className="group-hover:translate-x-2 transition-transform" size={20} /> Salir
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-5 bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] text-center hover:from-slate-600 hover:to-slate-800 border border-slate-600 transition-all shadow-xl"
                                onClick={() => setOpen(false)}
                            >
                                <FaUserEdit size={20} /> Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}