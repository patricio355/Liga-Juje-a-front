import { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
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
        <nav className="relative w-full bg-[#050814]/90 backdrop-blur-2xl px-6 py-4 flex justify-between items-center z-[200] border-b border-blue-900/40 shadow-xl">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-xl flex items-center justify-center text-white text-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-105 transition-transform">
                    ⚽
                </div>
                <div className="text-white font-black text-xl leading-5 tracking-tighter uppercase italic">
                    Ligas <br /> <span className="text-blue-500 bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Jujeñas</span>
                </div>
            </Link>

            <div className="flex items-center gap-4 md:gap-8">
                {user && (
                    <>
                        {/* INFO USUARIO PC: Una sola línea elegante */}
                        <div className="hidden md:flex items-center gap-3 bg-[#0e1630] border border-blue-500/20 px-6 py-2.5 rounded-full shadow-lg hover:border-blue-400 transition-colors group/user">
                            <FaShieldAlt className="text-blue-500 text-xs" />
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest italic border-r border-blue-900/50 pr-3">
                                    {userRole}
                                </span>
                                <span className="text-[13px] font-bold text-slate-200 lowercase tracking-tight">
                                    {user.sub}
                                </span>
                            </div>
                            <FaUserCircle size={22} className="text-blue-500/80 group-hover/user:text-blue-400 transition-colors ml-1" />
                        </div>

                        {/* INFO USUARIO MÓVIL (Personita) */}
                        <div className="relative md:hidden" ref={userDetailRef}>
                            <button
                                onClick={() => setShowUserDetail(!showUserDetail)}
                                className="w-10 h-10 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center text-blue-400 shadow-lg"
                            >
                                <FaUserCircle size={24} />
                            </button>
                            {showUserDetail && (
                                <div className="absolute right-0 top-[calc(100%+20px)] bg-[#0e1630] border border-blue-500/30 p-5 rounded-3xl shadow-2xl w-72 animate-in slide-in-from-top-3 duration-300 z-[250]">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">Acceso</p>
                                    <p className="text-lg font-black text-white uppercase italic">{userRole}</p>
                                    <div className="h-[1px] bg-blue-900/60 my-2"></div>
                                    <p className="text-sm font-bold text-slate-300 truncate">{user.sub}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* HAMBURGUESA */}
                <button
                    ref={buttonRef}
                    className="p-2.5 text-blue-400 hover:bg-blue-500/10 rounded-2xl transition-all border border-transparent hover:border-blue-900/40"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <FaTimes size={28} /> : <FaBars size={28} />}
                </button>
            </div>

            {/* MENÚ DROPDOWN */}
            {open && (
                <div
                    ref={menuRef}
                    className="absolute right-6 top-[calc(100%+15px)] bg-[#0e1630] border border-blue-800/40 shadow-[0_30px_60px_rgba(0,0,0,0.9)] rounded-[2.5rem] p-4 w-72 z-[210] animate-in fade-in zoom-in-95 duration-300"
                >
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/"
                            className="flex items-center gap-5 text-slate-300 px-6 py-5 rounded-[1.5rem] hover:bg-blue-600 hover:text-white font-black uppercase tracking-widest transition-all text-xs group"
                            onClick={() => setOpen(false)}
                        >
                            <FaHome className="text-blue-500 group-hover:text-white" size={20} /> Home
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-5 text-slate-300 px-6 py-5 rounded-[1.5rem] hover:bg-blue-600 hover:text-white font-black uppercase tracking-widest transition-all text-xs group"
                                    onClick={() => setOpen(false)}
                                >
                                    <FaThLarge className="text-blue-500 group-hover:text-white" size={20} /> Dashboard
                                </Link>
                                <div className="h-[1px] bg-blue-900/40 my-3 mx-6"></div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-5 text-red-500 px-6 py-5 rounded-[1.5rem] hover:bg-red-500/10 font-black uppercase tracking-widest transition-all text-left w-full text-xs group"
                                >
                                    <FaSignOutAlt className="group-hover:translate-x-2 transition-transform" size={20} /> Salir
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-5 bg-blue-600 text-white px-6 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] text-center hover:bg-blue-500 transition-all"
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